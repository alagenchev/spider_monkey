load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString\ntest","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"



var splitar = ts.split("\n");
var infoResult = String.getTaintInfo(splitar[0]);
var expected = "val: \"tsString\" op: \"SPLIT\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tsString\n"+
  "test\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("splitar[0]: ", result == expected, true);

infoResult = String.getTaintInfo(splitar[1]);

expected = "val: \"test\" op: \"SPLIT\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tsString\n"+
  "test\" origin: \"dd\" op: \"SOURCE\" } }\n";

result = getObjectDetails(infoResult);
assert("splitar[1]: ", result == expected, true);

var tssplit=String.newTainted("\n","dd").split('\n');
infoResult = String.getTaintInfo(tssplit[0]);

expected = "val: \"\" op: \"SPLIT\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\n"+
  "\" origin: \"dd\" op: \"SOURCE\" } }\n";
result = getObjectDetails(infoResult);
assert("tssplit[0]: ", result == expected, true);

var tssplit=String.newTainted("\n","dd").split('\n');
infoResult = String.getTaintInfo(tssplit[1]);

expected = "val: \"\" op: \"SPLIT\" \n"+
"tainters: \"{ \n"+
  "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\n"+
  "\" origin: \"dd\" op: \"SOURCE\" } }\n";
result = getObjectDetails(infoResult);
assert("tssplit[1]: ", result == expected, true);
