#include "jsstr.h"
#ifndef TAINT_H_
#define TAINT_H_

#ifdef TAINT_ON_


#ifndef TAINTSTRUCTS
#define TAINTSTRUCTS
//remember this is duplicated in jscntxt.h
//// any change here must be replicated there
//// also OpNames must be added in taint.cpp
typedef enum taintop {NONEOP,GET,SET,SOURCE,SINK,CHARAT,SUBSTRING,LOWERCASE,UPPERCASE,JOIN,SPLIT,SLICE,REPLACE,REGEXP,CONCAT,CONCATLEFT,CONCATRIGHT,ESCAPE,UNESCAPE,ENCODEURI,UNENCODEURI,ENCODEURICOMPONENT,UNENCODEURICOMPONENT,TRIM,TAGIFY,QUOTE,DEPEND,ATOB,BTOA} TaintOp;


typedef struct InfoTaintEntry
{
    JSString *taintedString;
    jsuint refCount;
    TaintOp  op;
    JSString *origin;
    struct InfoTaintDep *dep;
    struct InfoTaintEntry *nextEntry;
} InfoTaintEntry;


typedef struct InfoTaintDep
{
    InfoTaintEntry *entry;
    int spos;
    int epos;
    JSObject *desc;
    struct InfoTaintDep *next;
} InfoTaintDep;

#endif

//macros to hook up javascript to cpp
//it's used in jsstr.cpp
#define HOOK_JS_TAINT_METHODS()\
        JS_FN("newTainted", str_newTainted, 2, 0),
#endif //endif for TAINTED_ON


extern JSBool taint_newTainted(JSContext *cx, uintN argc, jsval *vp);
extern JSBool InitTaintEntries(JSRuntime *rt);
#endif
