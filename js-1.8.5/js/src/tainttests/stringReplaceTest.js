load('./UnitTest.js');
var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("tsString","dd");
var ats=String.newTainted("atsString","aaa");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"

var nsts=new String(String.newTainted("aaa|bb|cc|dd","sss"));
var res=nsts.replace(/([^|]+)/g,"xX");
assert("String replace test","res.tainted",true);

var res=nsts.replace(/gg/g,"xX");
assert("String replace test","res.tainted",true);

var res=nsts.replace(/.*/g,"");   
assert("String replace test","res.tainted",true);

var res=nsts.replace(/.*/g, String.newTainted("","sss"));   
assert("String replace test","res.tainted",true);

var res=nsts.replace(/.*/g, String.newTainted("d","sss"));   
assert("String replace test","res.tainted",true);

var res=nsts.replace(/.*/, String.newTainted("d","sss"));   
assert("String replace test","res.tainted",true);

var res="aaabc".replace(/aa/,String.newTainted("fa","ddd")); 
assert("String replace test","res.tainted",true);

var res=nsts.replace("a", "d");  
assert("String replace test","res.tainted",true);

res=nsts.replace("a", function(a,b,c){return "d"});
assert("String replace test","res.tainted",true);

// This case was not covered by DOMinator 3.6
 res=nsts.replace(/a/, function(a,b,c){return "d"});
 assert("String replace test","res.tainted",true);

// This case was not covered by DOMinator 3.6
 res=nsts.replace(/a/, function(a,b,c){var cc=String.newTainted("d","test");return cc});
 assert("String replace test","res.tainted",true);

{
    m=["b"];
    b=String.newTainted("<b>ff","cfcc");
    c=b.replace(/<\/?(.+?)\/?>/gi,function (a, f) {return m.indexOf(f)!=-1 ? a : ""; })
    assert("String replace test c","c.tainted",true);
} 

(function(){
    function dd(c){ return function(a,b,c){var ob={"a":"d"}; return c+' '+ob[a]}
    }
    res=nsts.replace(/a/g, dd('v'));
    assert("String replace test Closure","res.tainted",true);
})()
