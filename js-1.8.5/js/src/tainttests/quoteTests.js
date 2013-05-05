load('./UnitTest.js');

var zerolengthtainted=String.newTainted("","zerolength");
var zerolengthuntainted="";
var ts = String.newTainted("tainted string", "tainted source");
var ats=String.newTainted("aaa"+"gggg","ddd");
var concstr4=ts+'dddd'+ats;
var concstr5zl=zerolengthtainted+''+zerolengthuntainted;

var tsq = ts.quote();
assert("String quote test 1 :", "tsq.tainted",true);


var tsq2= concstr4.quote();
assert("String Quote test 2 :","tsq2.tainted",true)

var tsq3= concstr5zl.quote();
assert("String Quote test 3 :","tsq3.tainted",true)

