load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("dddddddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var fun= String.trim
var ets=  fun(ts);

var infoResult = String.getTaintInfo(ets);
var expected = "val: \"dddddddd\" op: \"TRIM\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"dddddddd\" origin: \"dd\" op: \"SOURCE\" } }\n";


var result = getObjectDetails(infoResult);
assert("trim ets: ", result == expected, true);

var ets1= fun(zerolengthtainted );

var infoResult = String.getTaintInfo(ets1);
var expected = "val: \"\" op: \"TRIM\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";
var result = getObjectDetails(infoResult);

assert("trim ets1: ", result == expected, true);

var ets2= fun(zerolengthuntainted );
var infoResult = String.getTaintInfo(ets2);
var expected = "";
var result = getObjectDetails(infoResult);

assert("trim ets2: ", result == expected, true);



