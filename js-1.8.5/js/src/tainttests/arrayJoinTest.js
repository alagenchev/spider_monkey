load('./UnitTest.js');
// Array join
var ts=String.newTainted("original","dd")   
c='prepend|'+ts
cv=[c,ts,'|append']
arrayOfStrings=cv.join(' ')
assert("Array join ","arrayOfStrings.tainted",true);

let testArray = ["1","2","3"];
var taintedSeparator = String.newTainted(",", "source");
let newArray = testArray.join(taintedSeparator);
assert("tainted separator", "newArray.tainted", true);
