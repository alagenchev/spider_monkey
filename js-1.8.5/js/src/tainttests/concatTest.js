load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("ddddd\nddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var concstr1=ts+ats;
assert( "String Concat test ","concstr1.tainted",true)

var concstr2=ts+ats+'dddd';
assert( "String Concat test ","concstr2.tainted",true)

var concstr3='dddd'+ts+ats;
assert("String Concat test ","concstr3.tainted",true)

var concstr4=ts+'dddd'+ats;
assert("String Concat test ","concstr4.tainted",true)
assert("testing values ","concstr4","ddddd\ndddddddaaagggg");

var concstr5zl=zerolengthtainted+''+zerolengthuntainted;
assert("String Concat test ","concstr5zl.tainted",true)
assert("testing values ","concstr5zl","");

var test7string = longUntainted + zerolengthuntainted;
assert("Long String concat test7", "test7string.tainted", false);
assert("testing values ","test7string","aaaaaaaaaaaaaaaaaaaaaaaa");

var test6string = longTainted + zerolengthuntainted;
assert("Long String concat test1", "test6string.tainted", true);
assert("testing values ","test6string","aaaaaaaaaaaaaaaaaaaaaaaa");

var test8string = longUntainted + zerolengthtainted;
assert("Long String concat test8", "test8string.tainted", true);
assert("testing values ","test8string","aaaaaaaaaaaaaaaaaaaaaaaa");

var info = String.getTaintInfo(test8string);
var description = getObjectDetails(info);
