load('./UnitTest.js');
var taintedString = String.newTainted("myTaintedStringValue", "myTaintedSource");
var untainted = "";
var taintInfo = String.getTaintInfo(taintedString);
result = getObjectDetails(taintInfo);

var expected = "val: \"myTaintedStringValue\" origin: \"myTaintedSource\" op: \"SOURCE\" ";
assert("infoTest: ", result == expected, true);
