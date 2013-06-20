load('./UnitTest.js');

var zerolengthtainted=String.newTainted("","zerolength");
var ts=String.newTainted("ddddd\nddd","dd");
var ats=String.newTainted("aaagggg","ddd");
var zerolengthuntainted="";
var longTainted = String.newTainted("aaaaaaaaaaaaaaaaaaaaaaaa", "asdf");
var longUntainted = "aaaaaaaaaaaaaaaaaaaaaaaa"


var parm = String.newTainted("aaa|bb|cc|dd","sss");
var nsts=new String(parm);
var res=nsts.match(/([^|]+)/g);
var i = 0;



for(var i=0,l=res.length;i<l;i++)
{
    var infoResult = String.getTaintInfo(res[i]);
    var expected = "val: \""+res[i]+"\" op: \"REGEXP\" \n"+
    "tainters: \"{ \n"+ 
        "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";

    var result = getObjectDetails(infoResult);
    assert("first res[" + i + "]", result == expected, true);

}

var res=nsts.match("bb")

for(var i=0,l=res.length;i<l;i++)
{
  var infoResult = String.getTaintInfo(res[i]);
    var expected = "val: \""+res[i]+"\" op: \"REGEXP\" \n"+
    "tainters: \"{ \n"+ 
        "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"aaa|bb|cc|dd\" origin: \"sss\" op: \"SOURCE\" } }\n";

    var result = getObjectDetails(infoResult);
    //print(result);
    assert("bb: res[" + i + "]", result == expected, true);
}

nsts=zerolengthtainted
var res=nsts.match("")
for(var i=0,l=res.length;i<l;i++)
{
 var infoResult = String.getTaintInfo(res[i]);
    var expected = "val: \"\" op: \"REGEXP\" \n"+
    "tainters: \"{ \n"+ 
        "\t0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"\" origin: \"zerolength\" op: \"SOURCE\" } }\n";

    var result = getObjectDetails(infoResult);
   // print(expected);
    assert("empty: res[" + i + "]", result == expected, true);
}

