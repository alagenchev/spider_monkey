#ifdef TAINT_ON_
#include "jsapi.h"
#include "jsstr.h"
#include "jscntxt.h"
#include "taint.h"
#include "jsscope.h" 
#include "jsobj.h" 
#include "jsobjinlines.h"
#include "jsarray.h"
#include "jsvalue.h"
#include "jsgc.h"


JSBool traverseInfoTaintEntry(JSContext *cx, TaintInfoEntry *taintEntry, JSObject *result);

// An array of string operation strings. Each TaintEntry contains an index into this
// array that is used to lookup the operation that resulted in tainting the string
// referenced by the taint entry.
const char *const OpNames[] = {
    "NONE","GET","SET","SOURCE","SINK","CHARAT","SUBSTRING","LOWERCASE","UPPERCASE",
    "JOIN","SPLIT","SLICE","REPLACE","REGEXP","CONCAT","CONCATLEFT","CONCATRIGHT",
    "ESCAPE","UNESCAPE","ENCODEURI","DECODEURI","ENCODEURICOMPONENT","DECODEURICOMPONENT",
    "TRIM","TAGIFY","QUOTE","DEPEND","ATOB","BTOA"};
                               
const int OpSize=sizeof(OpNames)/sizeof(OpNames[0]);


/*******************
 *  XXXStefano Note:
 *   GC Callback solution is used
 *   in order to prevent GC to free
 *   tainted strings.
 *   We need them alive in order to trace back
 *   Taint operations.
 * *********************/

static struct GCManagerInfo
{
    JSGCCallback _oldCallback;
} GCMI;

/*
 * Goes through the taint entry table looking for a taint entry
 * for the specified string. If the entry exists in the table
 * it returns the entry, otherwise it will return NULL
 */
TaintInfoEntry *findTaintEntry(JSContext *cx,JSString *stringToFind)
{
    TaintInfoEntry *currentEntry = cx->runtime->rootTaintEntry;

    if(!currentEntry)
    {
        return NULL;
    }

    do
    {
        if(currentEntry->taintedString == stringToFind)
        {
            return currentEntry;
        }
        else
        {
            currentEntry = currentEntry->nextEntry;
        }
    }while(currentEntry);

    return NULL;
}

// Adds a new string to the tainted strings table
// Inputs:
//      str: the tainted string
//      source: I believe this is passed on by the add-on
//              and indicates where the string came from in the dom.
//      taintOp: the taint operation that resulted in tainting this string.        
TaintInfoEntry *addToTaintTable(JSContext *cx,JSString *str,JSString *source,
        TaintOp taintOp)
{
    TaintInfoEntry *newTaintEntry;
    TaintInfoEntry *tempTaintEntry = findTaintEntry(cx, str);
    
    if(tempTaintEntry != NULL && tempTaintEntry->op == taintOp)
    {
        //an entry already exists, we found it and we are returning it
        return tempTaintEntry;
    }

    //we should have a runtime and the rootTaintEntry
    //should have been initialized in jsapi.cpp in JSRuntime::init()

    if(!cx->runtime || !cx->runtime->rootTaintEntry)
    {
        return NULL;
    }

    //nothing has been tainted so far, make the new taint
    //entry be the root entry that has been initialized
    //when the runtime was initialized
    if(cx->runtime->rootTaintEntry->taintedString == NULL)
    {
        //since this has already been initialized, we don't need
        //to call alloc again

        newTaintEntry = cx->runtime->rootTaintEntry;
        newTaintEntry->taintedString = str;
        newTaintEntry->origin = source;
        newTaintEntry->op = taintOp;
        newTaintEntry->myTaintDependencies = NULL;
    }
    else
    {
        //this is a whole new entry and we already have at least one entry in the taint list
        newTaintEntry = (TaintInfoEntry *) JS_malloc(cx, (size_t) sizeof(TaintInfoEntry));

        if(!newTaintEntry)
        {
            return NULL;//allocation failed
        }
        
        newTaintEntry->taintedString = str;
        newTaintEntry->origin=source;
        newTaintEntry->op=taintOp;
        newTaintEntry->myTaintDependencies=NULL;
        
        //make the new entry the root and the 
        //current root the new entry's next entry
        tempTaintEntry = cx->runtime->rootTaintEntry;
        newTaintEntry->nextEntry = tempTaintEntry;
        cx->runtime->rootTaintEntry = newTaintEntry;

    }
    
    //no one is referring to this entry yet, 
    //since it's newly added - set the refCount to 0.
    newTaintEntry->refCount = 0; 
    return newTaintEntry;
}


/*
 * Allocate a new taint dependency entry that points to the original tainted entry
 * and assign default values.
 */
TaintDependencyEntry *buildTaintDependencyEntry(JSContext *cx, TaintInfoEntry *originalEntry)
{
    TaintDependencyEntry *newDependency = (TaintDependencyEntry *) JS_malloc(cx,
            (size_t) sizeof(TaintDependencyEntry));

    if(!newDependency)
    {
        return NULL;
    }

    newDependency->nextDependencyEntry = NULL;
    if(originalEntry)
    {
        newDependency->tainter = originalEntry;
        originalEntry->refCount++;
    }
    else
    {
        newDependency->tainter = NULL;
    }

    newDependency->startPosition = -1;
    newDependency->endPosition = -1;
    newDependency->description = NULL;

    return newDependency;
}

/*
 * Used ot create a taint dependency relationship between a tainter and a taintee
 */
TaintDependencyEntry *createDependencyRelationship(JSContext *cx, TaintInfoEntry *originalEntry, TaintInfoEntry *dependentTaintInfoEntry)
{
    TaintDependencyEntry *newDependency = 
        buildTaintDependencyEntry(cx, originalEntry);
    if(!newDependency)
    {
        return NULL;
    }
    if(dependentTaintInfoEntry -> myTaintDependencies)
    {
        newDependency -> nextDependencyEntry = 
            dependentTaintInfoEntry -> myTaintDependencies;
    }
    else
    {
        newDependency->nextDependencyEntry = NULL;
    }

    return newDependency;
}

/* 
 * Adds a new taint entry to the global taint table, creates a dependency
 * relationship between the original tainter and the newly created taint entry
 * and appends the newly created dependency relationship to the list of dependenceis
 * of the newly created taint entry
 * This method modifies both the dependency table and the taint table
 */
TaintDependencyEntry *addDependentEntry(JSContext *cx, JSString *tainter, JSString *taintee, 
        JSString *source, TaintOp op)
{
    TaintInfoEntry *originalEntry = findTaintEntry(cx, tainter);

    if(!originalEntry)
    {
        return NULL;
    }

    
    TaintInfoEntry *newTaintEntry = addToTaintTable(cx, taintee, source, op);

    if(!newTaintEntry)
    {
        return NULL;
    }

    TaintDependencyEntry *newDependency = createDependencyRelationship(cx, originalEntry, newTaintEntry);

    if(!newDependency)
    {
        return NULL;
    }

    if(newTaintEntry->myTaintDependencies)
    {
        //add new dependency to head
        newDependency->nextDependencyEntry = newTaintEntry->myTaintDependencies;
    }

    newTaintEntry->myTaintDependencies = newDependency;

    return newDependency;

}

/*
 * Creates a new taint entry and associated dependency for a new tainted string.
 * This is primarily used for string operations where the resulting string is comprised
 * by concatenating with a tainted string.
 * Input: 
 *      tainter: The string that tainted this string.
 *      taintee: The string that gets tainted as a result of this operation.
 *      op:      The operation that resulted in the taint.
 *      start:   The beginning index of the newly tainted string that originated from
 *               the tainter.
 *      end:     The end of the portion of the taintee that originated in the tainter.
 */
JSBool addTaintInfo(JSContext *cx, JSString *tainter, JSString *taintee, TaintOp op, int start, int end)
{
    //source of taint is set as NULL here. I wonder if we can be a 
    //bit more precise
    TaintDependencyEntry *newDependencyEntry = addDependentEntry(cx, tainter, taintee, NULL, op);

    if(!newDependencyEntry)
    {
        return JS_FALSE;
    }

    newDependencyEntry->startPosition = start;
    newDependencyEntry->endPosition = end;
    newDependencyEntry->description = NULL;


    return JS_TRUE;

}

JSBool addTaintInfo(JSContext *cx, JSString *tainter, JSString *taintee, 
        JSObject *desc, TaintOp op)
{
    //source of taint is set as NULL here. I wonder if we can be a 
    //bit more precise
    TaintDependencyEntry *newDependencyEntry = addDependentEntry(cx, tainter, taintee, NULL, op);

    if(!newDependencyEntry)
    {
        return JS_FALSE;
    }

    newDependencyEntry->description = desc;

    return JS_TRUE;
}

/*
 * Takes as input a TaintInfoEntry which we will traverse and extracts an 
 * array of all tainters related to the tainted entry
 *
 * Input:
 *      taintedEntryToTraverse: the head of the TaintInfoEntry chain that
 *      will be traversed to extract the array of tainters
 *
 *      extractedTainters: this object will contain the array of tainters
 *                         after the function finishes execution.
 */
JSBool extractTainters(JSContext *cx,
        TaintInfoEntry* taintedEntryToTraverse, JSObject *extractedTainters)
{
    TaintDependencyEntry *currentTaintDependency = taintedEntryToTraverse->myTaintDependencies; 
    jsval jsValue;

    int index = 0;

    while(currentTaintDependency != NULL && currentTaintDependency->tainter != NULL)
    {
        JSObject *description = JS_NewObject(cx, NULL, NULL, NULL);
        jsValue = INT_TO_JSVAL(currentTaintDependency->startPosition);

        JSBool setResult = JS_SetProperty(cx, description, "StartPosition", &jsValue);

        if(!setResult)
        {
            return JS_FALSE;
        }

        jsValue = INT_TO_JSVAL(currentTaintDependency->endPosition);

        setResult = JS_SetProperty(cx, description, "EndPosition", &jsValue);

        if(!setResult)
        {
            return JS_FALSE;
        }

        if(currentTaintDependency->description != NULL)
        {
            jsValue = OBJECT_TO_JSVAL(currentTaintDependency->description);

            setResult = JS_SetProperty(cx, description, "Description", &jsValue);

            if(!setResult)
            {
                return JS_FALSE;
            }
        }

        //traverse the tainter and add its properties to description object
        setResult = traverseInfoTaintEntry(cx, currentTaintDependency->tainter, description);

        if(!setResult)
        {
            return JS_FALSE;
        }

        jsValue = OBJECT_TO_JSVAL(description);

        setResult = JS_SetElement(cx, extractedTainters, index, &jsValue);

        if(!setResult)
        {
            return JS_FALSE;
        }

        index ++;
        currentTaintDependency = currentTaintDependency->nextDependencyEntry;
    }

    return JS_TRUE;
}


//traverses through the taintEntry and sets the appropriate properties in the javascript
//result object
JSBool traverseInfoTaintEntry(JSContext *cx, TaintInfoEntry *taintEntry, JSObject *result)
{
    if(!taintEntry->taintedString)
    {
        return JS_FALSE;
    }

    jsval stringVal = STRING_TO_JSVAL(taintEntry->taintedString);

    bool setProperty = JS_SetProperty(cx, result, "val", &stringVal);

    if(!setProperty)
    {
        return JS_FALSE;
    }

    if(taintEntry->origin)
    {
        jsval originVal = STRING_TO_JSVAL(taintEntry->origin);
        JS_SetProperty(cx, result, "origin", &originVal);
    }

    int opIndex = (int)taintEntry->op;
    JSString *operationString = JS_NewStringCopyZ(cx, OpNames[opIndex]);
    jsval operationVal = STRING_TO_JSVAL(operationString);

    setProperty = JS_SetProperty(cx, result, "op", &operationVal);
    if(!setProperty)
    {
        return JS_FALSE;
    }

    if(taintEntry->myTaintDependencies && taintEntry->op <=OpSize)
    {
        JSObject *tainters = JS_NewArrayObject(cx, 0, NULL);


        //corresponds to traverseInfoTaintDep
        bool traversedSuccessfully = extractTainters(cx, taintEntry, tainters);

        if(!traversedSuccessfully)
        {
            return JS_FALSE;
        }


        jsval taintersVal = OBJECT_TO_JSVAL(tainters);

        setProperty = JS_SetProperty(cx, result, "tainters", &taintersVal);
        if(!setProperty)
        {
            return JS_FALSE;
        }
    }

    return JS_TRUE;
}

JSObject *getInfoFromTaintTable(JSContext *cx, JSString *str, JSBool &result)
{
    TaintInfoEntry *entry = findTaintEntry(cx, str);
    JSObject *info;
    result = JS_FALSE;

    if(entry == NULL)
    {
        //entry doesn't exist in the table;
        result = JS_TRUE;
        return NULL;
    }

    if(entry != NULL)
    {
        info = JS_NewObject(cx, NULL, NULL, NULL);
        if(!info)
        {
            //failed at constructing the object
            result = JS_FALSE;
            return NULL;
        }

        //traverse the info entry and assign the appropriate properties
        //in the java script result object
        bool traversed = traverseInfoTaintEntry(cx, entry, info);
        if(!traversed)
        {
            return NULL;
        }
        else
        {
            result = JS_TRUE;
            return info;
        }
    }

    return info;
}

JSBool taint_getTaintInfo(JSContext *cx, uintN argc, jsval *vp)
{
    jsval *argv = vp + 2;
    JSBool result;

    if(JSVAL_IS_STRING(argv[0]))
    {
        JSString *str = JSVAL_TO_STRING(argv[0]);
        JSObject *infoObject = getInfoFromTaintTable(cx, str, result);

        if(result == JS_FALSE)
        {
            *vp = JSVAL_VOID; //failed retrieving info
            return JS_FALSE;
        }
        
        //return the result if everything came back fine
        *vp = OBJECT_TO_JSVAL(infoObject);
        return JS_TRUE;
    }

    return JS_FALSE;
}

JSBool removeTaintDependencyEntry( TaintInfoEntry *entryToRemoveFrom)
{
    TaintDependencyEntry *currentDep;
    TaintDependencyEntry *nextDep;

    if(entryToRemoveFrom)
    {
        currentDep = entryToRemoveFrom->myTaintDependencies;

        while(currentDep)
        {
            if(currentDep->tainter)
            {
                JS_ASSERT(currentDep->tainter->refCount > 0);
                currentDep->tainter->refCount--;
            }
           
            nextDep = currentDep->nextDependencyEntry;
            free(currentDep);
            currentDep = nextDep;
        }

        entryToRemoveFrom->myTaintDependencies=NULL;
        return JS_TRUE;

    }
    else
    {
        //not sure why this is true. I think it should be false, but DOMinator
        //has it as true, so leaving it as it is for now
        //or at least there shouldn't be a need for the branching, since both
        //branches return true ATM
        return JS_TRUE;
    }

}



/*
 *Ivan Note: the following appears to be Stefano's callback that
 deals with the problem he's described above(his note about the callback). I'm not sure about the
 historical reasoning behind it, why it's needed, or how it works
 therefore I'm copying it as it is with just a little cleanup.
 * */
static JSBool markLiveObjects(JSContext *cx, JSGCStatus theStatus)
{
    TaintInfoEntry *tmpTaintEntry ,*prevTaintEntry;
    jsuint isFirst=1;
    if (JSGC_MARK_END!=theStatus)
    {
        return GCMI._oldCallback?GCMI._oldCallback(cx,theStatus):JS_TRUE;
    }
    if(cx)
    {
        js::GCMarker trc(cx);
#ifdef DEBUG
       // printf("GCCalled\n");
#endif
        tmpTaintEntry = cx->runtime->rootTaintEntry;
        prevTaintEntry = cx->runtime->rootTaintEntry;

        while(tmpTaintEntry) 
        {
#ifdef DEBUG
#endif
            int refCount=-1;
            if (tmpTaintEntry->origin && JS_IsAboutToBeFinalized(cx, tmpTaintEntry->origin)) 
            {
#ifdef DEBUGVERBOSE
                printf("Source: \n");
                js_DumpString(tmpTaintEntry->origin);
#endif
                JS_ASSERT(tmpTaintEntry->refCount>=0);
                if(!tmpTaintEntry->refCount){
                    refCount=0;
#ifdef DEBUGVERBOSE
                    printf("String: DONT keep: \n");
#endif
                } else {
#ifdef DEBUGVERBOSE
                    printf("SourcE: KEEP, refCount: %d\n", tmpTaintEntry->refCount);
#endif
                    js::gc::MarkGCThing(&trc, (tmpTaintEntry->origin), "Taint Info");
                }
            }

            if ( tmpTaintEntry->taintedString && JS_IsAboutToBeFinalized(cx, tmpTaintEntry->taintedString) ) 
            {
#ifdef DEBUGVERBOSE
                printf("str: \n");
                js_DumpString(tmpTaintEntry->taintedString);
#endif

                if(!tmpTaintEntry->refCount)
                {
                    refCount=0; 

#ifdef DEBUGVERBOSE
                    printf("String: DONT keep: \n");
#endif
                } 
                else 
                {

#ifdef DEBUGVERBOSE
                    printf("String: KEEP, refCount: %d\n",tmpTaintEntry->refCount);
#endif
                    js::gc::MarkGCThing(&trc,  tmpTaintEntry->taintedString, "Taint Info" );
                }
            }
            if(!refCount)
            {
                TaintInfoEntry *_tmpTaintEntry=tmpTaintEntry;
#ifdef DEBUGVERBOSE
                printf("Ok, refCount: %d\n",refCount);
#endif
                removeTaintDependencyEntry(tmpTaintEntry);
                
                if(isFirst)
                {
                    if(!tmpTaintEntry->nextEntry)
                    { //it's the last one. We don't want to free it but only null its attrs
                        cx->runtime->rootTaintEntry->taintedString = NULL;
                        cx->runtime->rootTaintEntry->origin = NULL;
                        cx->runtime->rootTaintEntry->refCount = 0;
                        cx->runtime->rootTaintEntry->myTaintDependencies = NULL;
                        cx->runtime->rootTaintEntry->nextEntry = NULL;
                        
                        tmpTaintEntry = prevTaintEntry = cx->runtime->rootTaintEntry;
                        continue;            
                    }
                    
                    cx->runtime->rootTaintEntry = tmpTaintEntry->nextEntry;
                    tmpTaintEntry = prevTaintEntry = cx->runtime->rootTaintEntry;
                }
                else
                {
                    isFirst=0;
                    prevTaintEntry->nextEntry = tmpTaintEntry->nextEntry;
                    tmpTaintEntry = tmpTaintEntry->nextEntry;
                }

                free(_tmpTaintEntry);
            }
            else
            {
                isFirst=0;
                prevTaintEntry = tmpTaintEntry;
                tmpTaintEntry = tmpTaintEntry->nextEntry;
            }
        }
#ifdef DEBUG
       // printf("GCCalled end\n");
#endif
    }
    return GCMI._oldCallback?GCMI._oldCallback(cx,theStatus):JS_TRUE;

}


JSBool InitTaintEntries(JSRuntime *runtime)
{
    //register a new garbage collector callback and save the old one in the garbage
    //collector manager
    GCMI._oldCallback=  JS_SetGCCallbackRT(runtime, &markLiveObjects);
    TaintInfoEntry *newTaintEntry = (TaintInfoEntry *)malloc((size_t)sizeof(TaintInfoEntry));

    if(!newTaintEntry)
    {
        return JS_FALSE;
    }

    newTaintEntry->taintedString = NULL;
    newTaintEntry->origin = NULL;
    newTaintEntry->refCount = 0;
    newTaintEntry->op = NONEOP;
    newTaintEntry->nextEntry = NULL;
    newTaintEntry->myTaintDependencies = NULL;
    runtime->rootTaintEntry=newTaintEntry;

    return JS_TRUE;

}

JSString* taint_newTaintedString(JSContext *cx, JSString* originalString)
{
    int length = originalString->length();
    const jschar *chars = originalString->getChars(cx);
    JSString* copy = js_NewStringCopyN(cx, chars, length);


    if(!copy)
    {
        return JS_FALSE;
    }

    copy->setTainted();
    return copy;


}

JSBool taint_newTainted(JSContext *cx, uintN argc, jsval *vp)
{
    jsval *argv = vp + 2;
    JS_ASSERT(argc <= JS_ARGS_LENGTH_MAX);
    JSString *stringCopy;
    JSString *theString;

    if(JSVAL_IS_STRING(argv[0]))
    {
        theString = JSVAL_TO_STRING(argv[0]);

        bool isTainted = theString->isTainted();

        if(!isTainted)
        {
            const jschar *chars = theString->getChars(cx);
            size_t string_length = theString->length();

            stringCopy = js_NewStringCopyN(cx, chars, string_length);

            if(!stringCopy)
            {
                return JS_FALSE;//wasn't able to make a copy
            }

            stringCopy->setTainted();
        }
        else//it's already been tainted
        {
            stringCopy = theString;
        }

        JSString *source = cx->runtime->emptyString;
        if(!JSVAL_IS_NULL(argv[1]) && JSVAL_IS_STRING(argv[1]))
        {
            source = JSVAL_TO_STRING(argv[1]);
        }

        addToTaintTable(cx, stringCopy, source, SOURCE);
        JS_SET_RVAL(cx, vp, STRING_TO_JSVAL(stringCopy));

        return JS_TRUE;

    }

    //not a string
    return JS_FALSE;

}


JSBool taint_getTainted(JSContext *cx, JSString *str, jsval *val)
{
    bool isTainted = str->isTainted();
    
    *val = BOOLEAN_TO_JSVAL(isTainted);

    return JS_TRUE;
}

// Takes a tainted string and returns an untainted string
JSBool taint_untaint(JSContext *cx, uintN argc, jsval *vp)
{
    jsval *argv = vp + 2;
    JSObject result;
    JSBool returnVal;

    if(JSVAL_IS_STRING(argv[0]))
    {
        JSString *passedString = JSVAL_TO_STRING(argv[0]);

        if(passedString->isTainted())
        {
            const jschar *stringChars = passedString->getChars(cx);
            size_t stringLength = passedString->length();

            JSString *untaintedString = js_NewStringCopyN(cx, stringChars, stringLength);

            if(!untaintedString)
            {
                return JS_FALSE;
            }

            *vp = STRING_TO_JSVAL(untaintedString);
            return JS_TRUE;
        }
        else//the passed in string wasn't tainted to begin with
        {
            *vp = argv[0];
            return JS_TRUE;
        }
    }
    
    // We didn't pass a string to untaint
    // Shouldn't we throw an exception or return some 
    // sort of error here?
    *vp = argv[0];
    return JS_TRUE;
}

#endif
