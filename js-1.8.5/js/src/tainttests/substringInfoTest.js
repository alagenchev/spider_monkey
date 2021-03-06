load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var ets=  ts.substring(1,3);
var infoResult = String.getTaintInfo(ets);
var expected = "val: \"sS\" op: \"SUBSTRING\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("ets: ", result == expected, true);

var ets1= zerolengthtainted.substring(1,3) ;

var infoResult = String.getTaintInfo(ets1);
var expected = "val: \"\" op: \"SUBSTRING\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
//print(result);
assert("ets1: ", result == expected, true);


var ets2=  zerolengthuntainted.substring(1,3) ;

var infoResult = String.getTaintInfo(ets2);
var expected = "";

var result = getObjectDetails(infoResult);
//print(result);
assert("ets2: ", result == expected, true);


