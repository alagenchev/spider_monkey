load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var ets=  ts.substring(1,3);

assert("String substring test ","ets.tainted",true)

var ets1= zerolengthtainted.substring(1,3) ;
assert("String substring test ","ets1.tainted",true);

var ets2=  zerolengthuntainted.substring(1,3) ;
assert("String substring test ","ets2.tainted",false)
