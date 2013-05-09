load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("ddddd\nddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"


var fun= decodeURI
var ets=  fun(ts);
assert("String decodeURI test ","ets.tainted",true)

var ets1= fun(zerolengthtainted );
assert("String decodeURI test ","ets1.tainted",true);

var ets2= fun(zerolengthuntainted );
assert("String decodeURI test ","ets2.tainted",false)

