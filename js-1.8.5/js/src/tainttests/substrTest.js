load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var ets=  ts.substr(1,3);
assert("String substr test ","ets.tainted",true)

var ets1= zerolengthtainted.substr(1,3) ;
assert("String substr test ","ets1.tainted",true);

var ets2=  zerolengthuntainted.substr(1,3) ;
assert("String substr test ","ets2.tainted",false)
