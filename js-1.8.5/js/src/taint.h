#include "jsstr.h"
#ifndef TAINT_H_
#define TAINT_H_

#ifdef TAINT_ON_


#ifndef TAINTSTRUCTS
#define TAINTSTRUCTS
//remember this is duplicated in jscntxt.h
//// any change here must be replicated there
//// also OpNames must be added in taint.cpp
typedef enum taintop {NONEOP,GET,SET,SOURCE,SINK,CHARAT,SUBSTRING,LOWERCASE,UPPERCASE,JOIN,SPLIT,SLICE,REPLACE,REGEXP,CONCAT,CONCATLEFT,CONCATRIGHT,ESCAPE,UNESCAPE,ENCODEURI,DECODEURI,ENCODEURICOMPONENT,DECODEURICOMPONENT,TRIM,TAGIFY,QUOTE,DEPEND,ATOB,BTOA} TaintOp;

#define  TAINT_CONDITION(str) \
    JSBool tainted = JS_FALSE;\
    if(str && str->isTainted()){\
        tainted = JS_TRUE;\
        original = str; \
    }

//I'm not sure why Stefano does the < 10 check. I think it has to do 
//with dealing with Atomization. I'm sure there is a good reason for it
//so i'm carrying it over
#define  TAINT_CONDITIONAL_SET(stringAfterOps,originalString,description,op) \
    if(tainted){\
        if(stringAfterOps -> length() < 10){\
            stringAfterOps = taint_newTaintedString(cx,stringAfterOps);\
         }\
        else{\
            stringAfterOps -> setTainted();\
        }\
        addTaintInfo(cx, originalString, stringAfterOps, description, op);\
    }

#define  TAINT_CONDITIONAL_SET_NEW(stringAfterOps,originalString,description,op) \
    if(tainted){\
        stringAfterOps = taint_newTaintedString(cx, stringAfterOps);\
        stringAfterOps -> setTainted();\
        addTaintInfo(cx, originalString, stringAfterOps, description, op);\
    }



/*
 * TaintInfoEntry contains
 * taint information about a JSString
 * that has been tainted.
 */
typedef struct TaintInfoEntry
{
    // The tainted string.
    JSString *taintedString;

    // refCount is used for cleanup purposes.
    jsuint refCount;

    // The operation that tainted the string.
    TaintOp  op;
    
    // Used by the taint operation to track where the
    // tainted string came from.
    JSString *origin;

    // A list of all taint dependency entries that
    // were involved in tainting this string
    struct TaintDependencyEntry *myTaintDependencies;

    // Pointer to next entry in the global taint list
    struct TaintInfoEntry *nextEntry;
} TaintInfoEntry;


/*
 * TaintDependencyEntry contains the chain of
 * entries that tainted a particular string.
 */
typedef struct TaintDependencyEntry
{
    // The taint entry of the string
    // that tainted this entry.
    TaintInfoEntry *tainter;

    // startPosition and endPostion
    // are used primarily for tracking
    // concat operations.
    int startPosition;
    int endPosition;
    JSObject *description;

    // Pointer to the next dependency entry in the
    // list of dependencies for this entry.
    struct TaintDependencyEntry *nextDependencyEntry;
} TaintDependencyEntry;

#endif

//macros to hook up javascript to cpp
//it's used in jsstr.cpp
#define HOOK_JS_TAINT_METHODS()\
    JS_FN("getTaintInfo", str_getTaintInfo, 1, 0),\
JS_FN("newTainted", str_newTainted, 2, 0),
#endif //endif for TAINTED_ON

extern TaintInfoEntry *addToTaintTable(JSContext *cx,JSString *str,JSString *source,
        TaintOp taintOp);
extern TaintDependencyEntry *buildTaintDependencyEntry(JSContext *cx, TaintInfoEntry *originalEntry);

extern TaintInfoEntry *findTaintEntry(JSContext *cx,JSString *stringToFind);
extern JSBool taint_getTaintInfo(JSContext *cx, uintN argc, jsval *vp);
extern JSBool taint_newTainted(JSContext *cx, uintN argc, jsval *vp);
extern JSBool InitTaintEntries(JSRuntime *rt);
extern JSBool taint_getTainted(JSContext *cx, JSString *str, jsval *vp);
extern JSString* taint_newTaintedString(JSContext *cx, JSString *str);
extern JSBool addTaintInfo(JSContext *cx, JSString *tainter, JSString *taintee, TaintOp op, int start, int end);
extern JSBool addTaintInfo(JSContext *cx, JSString *tainter, JSString *taintee, JSObject *desc, TaintOp op);
extern TaintDependencyEntry *createDependencyRelationship(JSContext *cx, TaintInfoEntry *originalEntry, TaintInfoEntry *dependentTaintInfoEntry);
#endif
