#include "jsstr.h"
#ifndef TAINT_H_
#define TAINT_H_

#ifdef TAINT_ON_
//macros to hook up javascript to cpp
//it's used in jsstr.cpp
#define ADD_JS_TAINT_METHODS()\
        JS_FN("newTainted", str_newTainted, 2, 0),
#endif //endif for TAINTED_ON
#endif
