load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var result = "";
var expected = "";

var concstr1=ts+ats;
var infoResult = String.getTaintInfo(concstr1);
var expected = "val: \"tsStringatsString\" op: \"CONCAT\" \n"+ 
"tainters: \"{ \n"+ 
        "\t0: \"{ StartPosition: \"8\" EndPosition: \"17\" val: \"atsString\" origin: \"aaa\" op: \"SOURCE\" } \n\t"+ 
                "1: \"{ StartPosition: \"0\" EndPosition: \"8\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n";


var result = getObjectDetails(infoResult);
assert("concstr1: ", result == expected, true);


var concstr2=ts+ats+'dddd';
var infoResult = String.getTaintInfo(concstr2);
result = getObjectDetails(infoResult);

expected = "val: \"tsStringatsStringdddd\" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n" +
"\t0: \"{ StartPosition: \"0\" EndPosition: \"17\" val: \"tsStringatsString\" op: \"CONCAT\" \n"+
"tainters: \"{ \n"+ 
"\t0: \"{ StartPosition: \"8\" EndPosition: \"17\" val: \"atsString\" origin: \"aaa\" op: \"SOURCE\" } \n"+
"\t1: \"{ StartPosition: \"0\" EndPosition: \"8\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n} }\n";

assert("concstr2: ", result == expected, true);


var concstr3='dddd'+ts+ats;
var infoResult = String.getTaintInfo(concstr3);
result = getObjectDetails(infoResult);

expected = "val: \"ddddtsStringatsString\" op: \"CONCAT\" \n"+
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"12\" EndPosition: \"21\" val: \"atsString\" origin: \"aaa\" op: \"SOURCE\" } \n\t"+ 
"1: \"{ StartPosition: \"0\" EndPosition: \"12\" val: \"ddddtsString\" op: \"CONCATRIGHT\" \n"+ 
"tainters: \"{ \n\t" +
"0: \"{ StartPosition: \"4\" EndPosition: \"12\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n} }\n";

assert("concstr3: ", result == expected, true);

var concstr4=ts+'dddd'+ats;
var infoResult = String.getTaintInfo(concstr4);
result = getObjectDetails(infoResult);

expected = "val: \"tsStringddddatsString\" op: \"CONCAT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"12\" EndPosition: \"21\" val: \"atsString\" origin: \"aaa\" op: \"SOURCE\" } \n\t"+ 
"1: \"{ StartPosition: \"0\" EndPosition: \"12\" val: \"tsStringdddd\" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"0\" EndPosition: \"8\" val: \"tsString\" origin: \"dd\" op: \"SOURCE\" } }\n} }\n";

assert("concstr4: ", result == expected, true);

var concstr5=zerolengthtainted+''+zerolengthuntainted;
var infoResult = String.getTaintInfo(concstr5);
result = getObjectDetails(infoResult);

expected = "val: \"\" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"0\" EndPosition: \"0\" val: \"\" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"0\" EndPosition: \"0\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n} }\n";

assert("concstr5: ", result == expected, true);

var concstr6 = longTainted + zerolengthuntainted;
var infoResult = String.getTaintInfo(concstr6);
result = getObjectDetails(infoResult);

expected = "val: \"aaaaaaaaaaaaaaaaaaaaaaaa\" op: \"CONCATLEFT\" \n"+ 
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"0\" EndPosition: \"24\" val: \"aaaaaaaaaaaaaaaaaaaaaaaa\" origin: \"asdf\" op: \"SOURCE\" } }\n";

assert("concstr6: ", result == expected, true);

var concstr7 = longUntainted + zerolengthuntainted;
var infoResult = String.getTaintInfo(concstr7);
result = getObjectDetails(infoResult);
expected = "";
assert("concstr7: ", result == expected, true);

var concstr8 = longUntainted + zerolengthtainted;
var infoResult = String.getTaintInfo(concstr8);
result = getObjectDetails(infoResult);
expected = "val: \"aaaaaaaaaaaaaaaaaaaaaaaa\" op: \"CONCATRIGHT\" \n"+ 
"tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"24\" EndPosition: \"24\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";
assert("concstr8: ", result == expected, true);
