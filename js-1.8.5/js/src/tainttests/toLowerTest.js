load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var fun=  String.toLowerCase
var ets=  fun(ts);
assert("String toLowerCase test ","ets.tainted",true)

var ets1= fun(zerolengthtainted );
assert("String toLowerCase test ","ets1.tainted",true);

var ets2= fun(zerolengthuntainted );
assert("String toLowerCase test ","ets2.tainted",false)
