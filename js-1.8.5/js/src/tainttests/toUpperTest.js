load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var fun=  String.toUpperCase
var ets=  fun(ts);
assert("String toUpperCase test ","ets.tainted",true)

var ets1= fun(zerolengthtainted );
assert("String toUpperCase test ","ets1.tainted",true);

var ets2= fun(zerolengthuntainted );
assert("String toUpperCase test ","ets2.tainted",false)
