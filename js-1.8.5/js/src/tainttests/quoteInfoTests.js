load('./UnitTest.js');

var zerolengthtainted=String.newTainted("","zerolength");
var zerolengthuntainted="";
var ts = String.newTainted("tainted string", "tainted source");
var ats=String.newTainted("aaa"+"gggg","ddd");
var concstr4=ts+'dddd'+ats;
var concstr5zl=zerolengthtainted+''+zerolengthuntainted;


var tsq = ts.quote();
var infoResult = String.getTaintInfo(tsq);
var expected = "val: \"\"tainted string\"\" op: \"QUOTE\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tainted string\" origin: \"tainted source\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("tsq ", result == expected, true);


var tsq2= concstr4.quote();
var infoResult = String.getTaintInfo(tsq2);
var expected = "val: \"\"tainted stringddddaaagggg\"\" op: \"QUOTE\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"tainted stringddddaaagggg\" op: \"CONCAT\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"18\" EndPosition: \"25\" val: \"aaagggg\" origin: \"ddd\" op: \"SOURCE\" } \n\t"+
"1: \"{ StartPosition: \"0\" EndPosition: \"18\" val: \"tainted stringdddd\" op: \"CONCATLEFT\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"0\" EndPosition: \"14\" val: \"tainted string\" origin: \"tainted source\" op: \"SOURCE\" } }\n} }\n} }\n";

var result = getObjectDetails(infoResult);
assert("tsq2 ", result == expected, true);


var tsq3= concstr5zl.quote();

var infoResult = String.getTaintInfo(tsq3);
var expected = "val: \"\"\"\" op: \"QUOTE\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" op: \"CONCATLEFT\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"0\" EndPosition: \"0\" val: \"\" op: \"CONCATLEFT\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"0\" EndPosition: \"0\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n} }\n} }\n";

var result = getObjectDetails(infoResult);
assert("tsq3 ", result == expected, true);


