load('./UnitTest.js');
var ts=String.newTainted("ddddd\nddd","dd");
var zerolengthtainted=String.newTainted("","zerolength");
var zerolengthuntainted="";
var ets=escape(ts);

assert("String escape test ","ets.tainted",true)

var ets1= escape(zerolengthtainted );
assert("String escape test ","ets1.tainted",true);

var ets2= escape(zerolengthuntainted );
assert("String escape test ","ets2.tainted",false)

