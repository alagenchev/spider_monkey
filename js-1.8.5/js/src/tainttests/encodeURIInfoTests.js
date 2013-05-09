load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("dddddddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"


var fun= encodeURI
var ets=  fun(ts);

var infoResult = String.getTaintInfo(ets);
var expected = "val: \"dddddddd\" op: \"ENCODEURI\" \n"+
"tainters: \"{ \n\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"dddddddd\""+ " origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("ets: ", result == expected, true);

expected = "val: \"\" op: \"ENCODEURI\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";


var ets1 = fun(zerolengthtainted);

infoResult = String.getTaintInfo(ets1);
result = getObjectDetails(infoResult);
assert("ets1 : ", result == expected, true);

var ets2= fun(zerolengthuntainted );

expected = "";

infoResult = String.getTaintInfo(ets2);
result = getObjectDetails(infoResult);

assert("ets2 : ", result == expected, true);


