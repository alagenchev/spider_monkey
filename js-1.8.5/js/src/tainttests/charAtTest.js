load('./UnitTest.js');

var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("ddddd\nddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var res = ts.charAt(2);
assert("String match test","res.tainted",true);
var res= ts.charAt(122);
assert("String match test","res.tainted",true);
