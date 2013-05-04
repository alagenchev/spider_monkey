load('./UnitTest.js');
var taintedString = String.newTainted("myTaintedStringValue", "myTaintedSource");
var untainted = "";
//assert("\ntainted assert:", taintedString.tainted, true);
//assert("\nuntainted assert:", untainted.tainted, false);
var taintInfo = String.getTaintInfo(taintedString);
print(getObjectDetails(taintInfo, 1));;
