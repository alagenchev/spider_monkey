load('./UnitTest.js');
var taintedString = String.newTainted("myTaintedString", "myTaintedSource");
var untainted = "";
assert("\ntainted assert:", taintedString.tainted, true);
assert("\nuntainted assert:", untainted.tainted, false);
