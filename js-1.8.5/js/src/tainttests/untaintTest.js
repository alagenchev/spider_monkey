load('./UnitTest.js');
nsts=String.newTainted("abcdefghilmnopqrstuvz","testSource");
nsts2=String.newTainted("1234567890","testSource1");
unt = "AAAAAAAAAAA"

var arrayOfStrings=[unt,nsts,nsts2];
var arrayOfExpectedResults=[false,true,true]

// Array for each
var j=0;
for each(var i in arrayOfStrings){
 assert("Array for each "+String.untaint(i)+".tainted ",i.tainted,arrayOfExpectedResults[j++]);
}

// Array map
j=0;
var newAr=arrayOfStrings.map(function(a){return "A string "+a})
for each(var i in  newAr){
 assert("Array map new Array "+String.untaint(i)+".tainted ",i.tainted,arrayOfExpectedResults[j++]);
}
