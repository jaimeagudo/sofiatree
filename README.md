

# Sofia Tree
==================
A fast-recovery data structure to support auto-complete as you type features.
-------------------------------


A kind of [*Radix Tree*](http://en.wikipedia.org/wiki/Radix_tree) data structure baptized 'Sofia Tree' in honour to my beloved daughter. A multinode tree with a level for each letter with fast lookup operations. See [*Anottated Source*](https://github.com/jaimeagudo/sofiatree/docs/sofia-tree.html)


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

Clone the whole repo and run `npm test` to load a micro search engine, in another console run `tests.sh` to load a 350,000 words dictionary and launch 1,500 searchs with 100 threads in parallel.

=======================
## To be done


* Define nice jasmine tests and setup Travis
* Comment the example API usage
* Reduce prefixes stack memory comsuption 
* Partial cache invalidation mechanism when inserting new words (it actually resets the whole cache upon insertion of new words.)
* Return results as stream
* Case-sensitive lookups? 
* Any ideas? :)