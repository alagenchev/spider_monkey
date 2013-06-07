load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

nsts=new String(ts);

var ets=  nsts[1];
var infoResult = String.getTaintInfo(ets);
var expected = "val: \"s\" op: \"NONE\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
//print(result);
assert("ets: ", result == expected, true);



var sub_ts =  ts[1];
var infoResult = String.getTaintInfo(sub_ts);
var expected = "val: \"s\" op: \"NONE\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n";


var result = getObjectDetails(infoResult);
assert("sub_ts", result == expected, true);

