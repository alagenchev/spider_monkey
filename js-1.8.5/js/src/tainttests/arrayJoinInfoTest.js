load('./UnitTest.js');

var ts=String.newTainted("original","dd")   
c='prepend|'+ts
cv=[c,ts,'|append']
arrayOfStrings=cv.join(' ')

var infoResult = String.getTaintInfo(arrayOfStrings);
var expected = "val: \"prepend|original original |append\" op: \"JOIN\" \n"+ 
"tainters: \"{ \n\t"+ 
    "0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"original\" origin: \"dd\" op: \"SOURCE\" } \n\t"+ 
"1: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \"prepend|original\" op: \"CONCATRIGHT\" \n"+ 
        "tainters: \"{ \n\t"+ 
"0: \"{ StartPosition: \"8\" EndPosition: \"16\" val: \"original\" origin: \"dd\" op: \"SOURCE\" } }\n"+"} }\n";

var result = getObjectDetails(infoResult);
assert("tainted array elements", result == expected, true);

let testArray = ["1","2","3"];
var taintedSeparator = String.newTainted(",", "source");
let newArray = testArray.join(taintedSeparator);

var infoResult = String.getTaintInfo(newArray);
var expected = "val: \"1,2,3\" op: \"JOIN\" \n"+ 
"tainters: \"{ \n\t"+
"0: \"{ StartPosition: \"-1\" EndPosition: \"-1\" val: \",\" origin: \"source\" op: \"SOURCE\" } }\n";

var result = getObjectDetails(infoResult);
assert("tainted separator", result == expected, true);
