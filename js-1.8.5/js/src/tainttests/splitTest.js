load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString\ntest","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var splitar = ts.split("\n");
assert("String split test ","splitar[0].tainted",true);
assert("String split test ","splitar[1].tainted",true);
var tssplit=String.newTainted("\n","dd").split('\n');
assert("String split test ","tssplit[0].tainted",true);
assert("String split test ","tssplit[1].tainted",true);

