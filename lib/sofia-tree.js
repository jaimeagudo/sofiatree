//		SofiaTree 0.0.6

//	A kind of *Radix tree* data structure baptized **Sofia Tree** in honour to my 
//	beloved daughter.
//
//	A multinode tree with a level for each letter with fast lookup operations.
//	@see http://en.wikipedia.org/wiki/Radix_tree

//	Author: Jaime Agudo <jaime.agudo.lopez@gmail.com>
//
//	Github: https://github.com/jaimeagudo/sofiatree/
//
//	License: MIT


'use strict'; 
// SofiaTree
// ---------


(function() {
	var root = this;
	var previous_SofiaTree = root.SofiaTree;

	if( typeof exports !== 'undefined' ) {
		if( typeof module !== 'undefined' && module.exports ) {
			exports = module.exports = SofiaTree;
		}
		exports.SofiaTree = SofiaTree;
	} 
	else {
		root.SofiaTree = SofiaTree;
	}


	SofiaTree.noConflict = function() {
		root.SofiaTree = previous_SofiaTree;
		return SofiaTree;
	}


//Constructor with an optional config object as parameter. It may contain this properties:
// Tree constructor takes @param `options`. Actually 
// * `useCache`, a `boolean` to indicate wether caches whole words list of the subtree 
// below the  current node from its root. That way subsequent visits on that node won't need to traverse its subtree. 
// This cache config value is  established just on the root node of the tree to avoid redundancy. Defaults to `false` 
// * `caseSensitive` a `boolean` to indicate if the stored words and so the prefix matches are case sensitive, thus Foo != foo. Defaults to `false`
	function SofiaTree (options) {
		options = options || {};

		this._useCache=!!options.useCache;
		this._caseSensitive=!!options.caseSensitive;
	};

// Getter function for convenience

SofiaTree.prototype.isCaseSensitive=function (){
	return !!this._caseSensitive;
}

// Iterative tree traverse, friendlier with memory compsuntion.
// Passing an empty string as prefix it will return all the words present in the
// whole tree

// * `p` prefix above the current node
// * `useCache` configuration value passed along from the root node one
// * @return the `matches` words list 

SofiaTree.prototype.__buildWordsArray=function (p, useCache){

	var matches=[],
	nodesStack=[],
	prefixesStack=[],
	node,
	prefix;

	//Use stack to avoid recursion implementation overhead
	nodesStack.push(this);
	prefixesStack.push(p);

	while(nodesStack.length){

		prefix=prefixesStack.pop();
		node=nodesStack.pop();

		//Recursion base
		if(node.isWord && !node.cache)                      
			matches.push(prefix);

		if(useCache && node.cache){
			//Shallow copies doesn't work
			node.cache.forEach(function(word){	   			
				matches.push(word);
			});
		}else if(node.children){	   	                    
	   	    //Iterate whole subtree building words array and return it
	   	    for (var letter in node.children){
	   	    	nodesStack.push(node.children[letter]);
	   			//A bit redundant, could be optimised
	   			prefixesStack.push(prefix + letter);
	   		};
	   	}
	   }
	   if(useCache)
	   	this.cache=matches;

	   return matches;
}


// Recursive implementation, to be deprecated
// Passing an empty string as prefix it will return all the words present in the
// whole tree

// * `p` prefix above the current node
// * `useCache` configuration value passed along from the root node one
// * `matches` out parameter to return the matches. It reduces stack 
// grow on recursive calls
// * @returns `matches` the same matches word list

SofiaTree.prototype.__buildWordsArrayRec=function (p, useCache, matches){

	if(this.isWord && !this.cache)
		matches.push(p);

   	// Iterate whole subtree building words array and return it
   	if(useCache && this.cache){
		//Shallow copies doesn't work
   		this.cache.forEach(function(word){	   			
   			matches.push(word);
   		});
   	} else if(this.children){
   		for (var letter in this.children){
   			this.children[letter].__buildWordsArrayRec(p + letter, useCache, matches);
   		}
   	}
	if(useCache)
		this.cache=matches;

	return matches;
}


// SofiaTree.getCompletions
// ------------------------
// It returns an array of the words present in the tree that start with the given prefix. It will return the whole tree when called without arguments or empty string
// * `prefix` prefix to be completed
// * `excludePrefix` OPTIONAL, defaults to false. If true it won't return the given prefix even if it's a valid word in the dictionary. 
// * `recursive` OPTIONAL, defaults to false. To use recursive implementation to traverse the tree and build the result array. 
// * return `matches` the array of words that start with the given prefix

SofiaTree.prototype.getCompletions= function(prefix, excludePrefix, recursive){
	
	prefix= typeof prefix != 'string' ? "" : ((this._caseSensitive ? prefix : prefix.toLowerCase()));

	//Tree depth index
    var depth, node;

    //Find the root node of the subtree which contains all the completions
    for(depth=0, node=this; depth < prefix.length; depth++){
    	if(!node.children || !node.children[prefix[depth]])
    		return [];

    	node = node.children[prefix[depth]];
    } 
		
	return (recursive ? node.__buildWordsArrayRec(prefix, this._useCache, []) : 
					    node.__buildWordsArray(prefix, this._useCache)).slice(!!excludePrefix);
	
}


// SofiaTree.insert
// ----------------
// Insert the composing letters of the given word along the tree marking its 
// last node as word. It will insert a lower case version of the given word and
// it won't duplicate words
// 
// * param `word` to be inserted
// * return `this` for chaining convenience
// 
SofiaTree.prototype.insert= function(word){
    var depth;
	var node = this;
	var toInvalidate=[];

    // This eliminate empty strings
    if(typeof word != 'string' || !word.length)
    	return;

    word=this._caseSensitive ? word : word.toLowerCase();

	//Find the last letter of the new word already present in the tree
    for(depth=0; depth < word.length && node.children && node.children[word[depth]]; depth++ ){ 
		//Save the nodes that contain cache to be invalidated if the word isn't duplicated 
    	if(node.cache)
    		toInvalidate.push(node);
    	node = node.children[word[depth]]
    }
 
    //Append new nodes for each remaining letter, if necessary. This eliminate duplicates
    if (depth < word.length){
    	//Invalidate cache in all nodes above it. We could do it on the previous loop 
    	//but it would be innecessary if the word was already present on the tree
    	for(var n in toInvalidate){
    		delete n.cache;
    	}
    	while(true){
			// Create a new children property 
			if(! node.children)
				node.children={};

			node.children[word[depth]]=new SofiaTree();

			//We already inserted the last word letter, make the node as a word
	        if(depth +1 === word.length){
	        	node.children[word[depth]].isWord=true;
	        	break;
	        }
	        node = node.children[word[depth]];
	        depth++;
	    }
    }
	return this;
}



}).call(this);