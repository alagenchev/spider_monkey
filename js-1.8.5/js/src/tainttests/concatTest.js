load('./UnitTest.js');
//var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("ddddd\nddd","dd");
var ats=String.newTainted("aaagggg","ddd");
//var zerolengthuntainted="";

var concstr1=ts+ats;

assert( "String Concat test ","concstr1.tainted",true)

/*
var concstr2=ts+ats+'dddd';
assert( "String Concat test ","concstr2.tainted",true)

var concstr3='dddd'+ts+ats;
assert("String Concat test ","concstr3.tainted",true)

var concstr4=ts+'dddd'+ats;
assert("String Concat test ","concstr4.tainted",true)

var concstr5zl=zerolengthtainted+''+zerolengthuntainted;
assert("String Concat test ","concstr5zl.tainted",true)

*/
