load('./UnitTest.js');

var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("dddddddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var res = ts.charAt(2);

var infoResult = String.getTaintInfo(res);
var expected = "val: \"d\" op: \"CHARAT\" \n"+ 
"tainters: \"{ \n\t"+ 
    "0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"dddddddd\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("charat 2: ", result == expected, true);

var res= ts.charAt(122);
infoResult = String.getTaintInfo(res);
expected = "val: \"\" op: \"CHARAT\" \n"+ 
"tainters: \"{ \n\t"+ 
    "0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"dddddddd\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("charat 122: ", result == expected, true);
