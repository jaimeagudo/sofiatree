# Sofia Tree
[![Build Status](https://travis-ci.org/jaimeagudo/sofiatree.svg?branch=master)](https://travis-ci.org/jaimeagudo/sofiatree)
[![Coverage Status](https://coveralls.io/repos/jaimeagudo/sofiatree/badge.png)](https://coveralls.io/r/jaimeagudo/sofiatree)

A fast-recovery data structure to support auto-complete as you type features.
-----------------------------------------------------------------------------


A kind of [*Radix Tree*](http://en.wikipedia.org/wiki/Radix_tree) data structure baptized 'Sofia Tree' in honour to my beloved daughter. A multinode tree with a level for each letter with fast lookup operations. See [*Anottated Source*](
http://htmlpreview.github.io/?https://github.com/jaimeagudo/sofiatree/blob/master/docs/sofia-tree.html)


## Quick and simple usage example

```javascript
var SofiaTree=require('sofia-tree');

var dictionary=["f","foo","foobar","b","bar","barbar"];

var sofiaTree= new SofiaTree({useCache: true});

dictionary.forEach(function(word){
	sofiaTree.insert(word);
},server);
	
//Retrieve all the completions including the prefix
console.log(sofiaTree.getCompletions("foo"));

["foo","foobar"]

//Prints the whole dictionary	
console.log(sofiaTree.getCompletions(""));	
["f","foo","foobar","b","bar","barbar"]
```

## A real world example

Clone the whole repo and run `npm run example` to load a micro search engine, in another console run `cd example && ./test.sh` to load a 350,000 words dictionary and launch 1,500 searchs with 100 threads in parallel. See [*Anottated Source*](
http://htmlpreview.github.io/?https://github.com/jaimeagudo/sofiatree/blob/master/docs/server.html) and [shell scripts](https://github.com/jaimeagudo/sofiatree/tree/master/example)

=======================
## To be done


* ~~Define nice jasmine tests and setup Travis~~
* ~~Comment the example API usage~~
* Reduce prefixes stack memory comsuption 
* Partial cache invalidation mechanism when inserting new words (it actually resets the whole cache upon insertion of new words.)
* Return results as stream
* Case-sensitive lookups? 
* Any ideas? :)



=======================
Made with ❤ in Spain

