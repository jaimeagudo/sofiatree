# Sofia Tree
[![NPM](https://nodei.co/npm/sofia-tree.png?downloads=true)](https://nodei.co/npm/sofia-tree/)
[![Build Status](https://travis-ci.org/jaimeagudo/sofiatree.svg?branch=master)](https://travis-ci.org/jaimeagudo/sofiatree)
[![Coverage Status](https://coveralls.io/repos/jaimeagudo/sofiatree/badge.png)](https://coveralls.io/r/jaimeagudo/sofiatree)

A fast-recovery data structure to support auto-complete as you type features.
-----------------------------------------------------------------------------


A kind of [*Radix Tree*](http://en.wikipedia.org/wiki/Radix_tree) or *Trie* data structure baptized 'Sofia Tree' in honour to my beloved daughter. A multinode tree with a level for each letter with fast lookup operations. See [*Anottated Source*](
http://htmlpreview.github.io/?https://github.com/jaimeagudo/sofiatree/blob/master/docs/sofia-tree.html)

## Features
* Non-recursive tree traverse implementation to keep memory usage low and speed up on lookup operations.
* Efficient in-memory data structure, no redis, no dependencies
* Optional built-in cache for even faster lookups.
* Optionally case sensitive
* Optionally limit number of results to get matches even faster
* Optionally exclude the given prefix if it's a valid word
* Batteries included example to benchmark its performance

## Install

		npm install sofia-tree


## Quick and simple usage example

```javascript
var SofiaTree=require('sofia-tree');

var dictionary=["f","foo","foobar","b","bar","barbar"];

var sofiaTree= new SofiaTree({
	useCache: true,
	caseSensitive: false
});

dictionary.forEach(function(word){
	sofiaTree.insert(word);
});
	
//Retrieve all the completions including the prefix
console.log(sofiaTree.getCompletions("foo"));

["foo","foobar"]

//Retrieve all the completions without the prefix itself
console.log(sofiaTree.getCompletions("foo",true));

["foobar"]

//Limit the number of results without excluding the prefix (defaults to false)
console.log(sofiaTree.getCompletions("f",2)))
["f","foobar"]

//Prints the whole dictionary	
console.log(sofiaTree.getCompletions(""));	
["f","foo","foobar","b","bar","barbar"]
```

See [tests](https://github.com/jaimeagudo/sofiatree/blob/master/test/test.js) for more complete use cases

## A real world example

Clone the whole repo and run `npm run example` to load a micro search engine, in another console run `cd example && ./test.sh` to load a 350,000 words dictionary and launch 1,500 searchs with 100 threads in parallel. See [*Anottated Source*](
http://htmlpreview.github.io/?https://github.com/jaimeagudo/sofiatree/blob/master/docs/server.html) and [shell scripts](https://github.com/jaimeagudo/sofiatree/tree/master/example)

## Known limitations

Actually when limiting the maximum number or matches to be retorned it won't necessarely return the first ones in alphabetical order. When returning all the results they won't be alphabetically sorted either. This is due the nature of javascript objects properties which are unordered by definition. Perhaps I'll switch properties for an array in the future.

## To be done


* ~~Define nice jasmine tests and setup Travis~~
* ~~Comment the example API usage~~
* Reduce prefixes stack memory comsuption 
* ~~Partial cache invalidation mechanism when inserting new words (it actually resets the whole cache upon insertion of new words.)~~
* Implement remove method
* Return results as stream
* ~~Case-sensitive lookups? Not sure if it's a valuable adition~~
* Add weight on nodes to enable sort based on some business logic 
* Any ideas? :)




Made with ❤ in Spain

