load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var ets=  ts.slice(1);
assert("String slice test ","ets.tainted",true)

var ets1= zerolengthtainted.slice(1) ;
assert("String slice test ","ets1.tainted",true);

var ets2=  zerolengthuntainted.slice(1)  ;
assert("String slice test ","ets2.tainted",false)
