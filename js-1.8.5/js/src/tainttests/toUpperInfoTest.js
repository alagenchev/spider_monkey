load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var result = "";
var expected = "";

var fun=  String.toUpperCase
var ets=  fun(ts);

var infoResult = String.getTaintInfo(ets);
var expected = "val: \"TSSTRING\" op: \"UPPERCASE\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
//print(expected);
assert("ets: ", result == expected, true);


var ets1= fun(zerolengthtainted );

var infoResult = String.getTaintInfo(ets1);
var expected = "val: \"\" op: \"UPPERCASE\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);


assert("ets1: ", result == expected, true);

var ets2= fun(zerolengthuntainted );

var infoResult = String.getTaintInfo(ets2);
var expected = "";

var result = getObjectDetails(infoResult);
assert("ets2: ", result == expected, true);

