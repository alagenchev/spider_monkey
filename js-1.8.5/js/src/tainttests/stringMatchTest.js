load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("ddddd\nddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"


var nsts=new String(String.newTainted("aaa|bb|cc|dd","sss"));
var res=nsts.match(/([^|]+)/g);
for(var i=0,l=res.length;i<l;i++)
{
  assert("String match test","res["+i+"].tainted",true);
}

var res=nsts.match("bb")

for(var i=0,l=res.length;i<l;i++)
{
  assert("String match test","res["+i+"].tainted",true);
}

nsts=zerolengthtainted
var res=nsts.match("")
for(var i=0,l=res.length;i<l;i++)
{
  assert("String match test","res["+i+"].tainted",true);
}
