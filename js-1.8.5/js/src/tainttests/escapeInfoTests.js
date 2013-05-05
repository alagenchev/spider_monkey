load('./UnitTest.js');
var ts=String.newTainted("dddddddd","dd");
var zerolengthtainted=String.newTainted("","zerolength");
var zerolengthuntainted="";


var ets=escape(ts);

var infoResult = String.getTaintInfo(ets);
var expected = "val: \"dddddddd\" op: \"ESCAPE\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"dddddddd\" origin: \"dd\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("ets escape: ", result == expected, true);


var ets1= escape(zerolengthtainted );
var infoResult = String.getTaintInfo(ets1);
var expected = "val: \"\" op: \"ESCAPE\" \n"+
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("ets1 escape: ", result == expected, true);

var ets2= escape(zerolengthuntainted );

var infoResult = String.getTaintInfo(ets2);
var expected = "";

var result = getObjectDetails(infoResult);
assert("ets1 escape: ", result == expected, true);


