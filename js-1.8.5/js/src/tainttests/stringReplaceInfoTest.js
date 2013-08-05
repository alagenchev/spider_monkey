load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var nsts=new String(String.newTainted("aaa|bb|cc|dd","sss"));

var res=nsts.replace(/([^|]+)/g,"xX");

var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);

var expected = "val: \"xX|xX|xX|xX\" op: \"REPLACE\" \n" + 
"tainters: \"{ \n\t"+ 
    "0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"xX\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
assert("res1: ", result == expected, true);


var res=nsts.replace(/gg/g,"xX");

var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"aaa|bb|cc|dd\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"xX\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
assert("res2: ", result == expected, true);

var res=nsts.replace(/.*/g,"");   
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";

assert("res3: ", result == expected, true);

var res=nsts.replace(/.*/g, String.newTainted("","sss"));   
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"\" pattern: \"{ } } val: \"\" origin: \"sss\" op: \"SOURCE\" } \n\t"+ 
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";

assert("res4: ", result == expected, true);
var res=nsts.replace(/.*/g, String.newTainted("d","sss"));   
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"dd\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"d\" pattern: \"{ } } val: \"d\" origin: \"sss\" op: \"SOURCE\" } \n\t"+
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"d\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";

assert("res5: ", result == expected, true);

var res=nsts.replace(/.*/, String.newTainted("d","sss"));   
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"d\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"d\" pattern: \"{ } } val: \"d\" origin: \"sss\" op: \"SOURCE\" } \n\t"+ 
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"d\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";

assert("res6: ", result == expected, true);


var res="aaabc".replace(/aa/,String.newTainted("fa","ddd")); 

var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"faabc\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"fa\" pattern: \"{ } } val: \"fa\" origin: \"ddd\" op: \"SOURCE\" } }\n";
assert("res7: ", result == expected, true);

var res=nsts.replace("a", "d");  
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"daa|bb|cc|dd\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"d\" pattern: \"a\" } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
assert("res8: ", result == expected, true);


res=nsts.replace("a", function(a,b,c){return "d"});
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"daa|bb|cc|dd\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, b, c) {\n"+
"    return \"d\";\n"+
"}\" pattern: \"a\" } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
assert("res9: ", result == expected, true);

// This case was not covered by DOMinator 3.6
res=nsts.replace(/a/, function(a,b,c){return "d"});
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"daa|bb|cc|dd\" op: \"REPLACE\" \n"+
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, b, c) {\n"+
"    return \"d\";\n"+
"}\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
assert("res10: ", result == expected, true);
// This case was not covered by DOMinator 3.6
res=nsts.replace(/a/, function(a,b,c){var cc=String.newTainted("d","test");return cc});
var infoResult = String.getTaintInfo(res);
var result = getObjectDetails(infoResult);
var expected = "val: \"daa|bb|cc|dd\" op: \"REPLACE\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, b, c) {\n"+
"    var cc = String.newTainted(\"d\", \"test\");\n"+
"    return cc;\n"+
"}\" pattern: \"{ } } val: \"d\" origin: \"test\" op: \"SOURCE\" } \n\t"+ 
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, b, c) {\n"+
"    var cc = String.newTainted(\"d\", \"test\");\n"+
"    return cc;\n"+
"}\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
assert("res11: ", result == expected, true);

{
    m=["b"];
    b=String.newTainted("<b>ff","cfcc");
    c=b.replace(/<\/?(.+?)\/?>/gi,function (a, f) {return m.indexOf(f)!=-1 ? a : ""; })

        var infoResult = String.getTaintInfo(c);
    var result = getObjectDetails(infoResult);
    var expected = "val: \"<b>ff\" op: \"REPLACE\" \n"+ 
    "tainters: \"{ \n\t"+ 
  "0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, f) {\n"+
  "    return m.indexOf(f) != -1 ? a : \"\";\n"+
"}\" pattern: \"{ } } val: \"<b>\" op: \"REGEXP\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"<b>ff\" origin: \"cfcc\" op: \"SOURCE\" } }\n"+
"} \n\t"+ 
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, f) {\n"+
"    return m.indexOf(f) != -1 ? a : \"\";\n"+
        "}\" pattern: \"{ } } val: \"<b>ff\" origin: \"cfcc\" op: \"SOURCE\" } }\n";
    assert("res12: ", result == expected, true);
} 
(function(){
    function dd(c){ return function(a,b,c){var ob={"a":"d"}; return c+' '+ob[a]}
    }
    res=nsts.replace(/a/g, dd('v'));
    var infoResult = String.getTaintInfo(res);
    var result = getObjectDetails(infoResult);
    var expected = "val: \"aaa|bb|cc|dd daaa|bb|cc|dd daaa|bb|cc|dd d|bb|cc|dd\" op: \"REPLACE\" \n"+ 
    "tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, b, c) {\n"+
"    var ob = {a: \"d\"};\n"+
"    return c + \" \" + ob[a];\n"+
"}\" pattern: \"{ } } val: \"aaa|bb|cc|dd d\" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"0\" EndPosition: \"13\" val: \"aaa|bb|cc|dd \" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"0\" EndPosition: \"12\" val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n"+
"} }\n"+
"} \n\t"+ 
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" Description: \"{ replace: \"function (a, b, c) {\n"+
"    var ob = {a: \"d\"};\n"+
"    return c + \" \" + ob[a];\n"+
"}\" pattern: \"{ } } val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";
    assert("res13: ", result == expected, true);
  })()
