spider_monkey - Taint Support
=============
This project has the goal to port DOMinator: https://github.com/wisec/DOMinator from Minded Security: mindedsecurity.com to 
the latest Spider Monkey and extend it with additional taint features

The corresponding bugzilla ticket can be found here: https://bugzilla.mozilla.org/show_bug.cgi?id=811877

First, make sure you have the build prerequisites as described here: 
https://developer.mozilla.org/en-US/docs/SpiderMonkey/Build_Documentation

The build instructions largely overlap with the spider monkey build instructions, but here is a detailed step by step 
process just in case:

1. Clone the repository git clone git@github.com:alagenchev/spider_monkey.git
2. Navigate to the source folder: cd spider_monkey/js-1.8.5/js/src/
3. Run autoconf2.13 on linux, or autoconf-2.13 on mac
3. Create a folder where binaries will be built. mkdir bin-debug
4. navigate to that folder cd bin-debug
5. configure spider monkey:
```CXXFLAGS="-g3 -DTAINT_ON_=1" ../configure --enable-debug --disable-optimize``` on linux
```CC=clang CXX=clang++ CXXFLAGS="-g3 -DTAINT_ON_=1" ../configure --enable-debug --disable-optimize``` on mac
6. Now you can build by running make

You can verify that everything went well by running the unit tests. To do so, go to the tainttests folder: 
cd ../tainttests
and run ../bin-debug/js unit_tests.js 
If everything went well, all tests should pass. The above tests are testing just the basic taint mechanism. 
There are additional tests in the same directory that test the taint history tracking feature.

