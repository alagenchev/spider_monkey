load('./UnitTest.js');

var zerolengthuntainted="";
var elName='aaaaaaaaaaaddddddd'

var obj={anElement123456:zerolengthuntainted};

var taintedKey=String.newTainted( elName,"aTaintedKey");
obj[taintedKey]="someValue"


assert("String in Object test Object.keys(obj)[1].tainted ","Object.keys(obj)[1].tainted",true);

