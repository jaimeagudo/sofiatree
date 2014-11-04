//		SofiaTree 0.0.8

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


// SofiaTree.getCompletions
// ------------------------
// It returns an array of the words present in the tree that start with the given prefix. It will return the whole tree when called without arguments or empty string
// * `prefix` prefix to be completed
// * `excludePrefix` OPTIONAL, defaults to false. If true it won't return the given prefix even if it's a valid word in the dictionary. 
// * `maxResults` OPTIONAL, Defaults to `Number.POSITIVE_INFINITY`, thus, returns all the matches.
// * return `matches` the array of words that start with the given prefix

SofiaTree.prototype.getCompletions= function(origPrefix, excludePrefix, maxResults){
	
	origPrefix= typeof origPrefix != 'string' ? "" : ((this._caseSensitive ? origPrefix : origPrefix.toLowerCase()));

	if(typeof excludePrefix == 'number'){
		maxResults = excludePrefix
		excludePrefix = false;
	} else if(typeof maxResults == 'number'){
		maxResults = excludePrefix ? maxResults +1 : maxResults;
	} else {
		maxResults= Number.POSITIVE_INFINITY; 
	}

	//Tree depth index
    var depth, 
	    node, 
	    prefix=origPrefix,
	    matches=[],
	    nodesStack=[],
		prefixesStack=[];

    //Find the root node of the subtree which contains all the completions
    for(depth=0, node=this; depth < prefix.length; depth++){
    	if(!node.children || !node.children[prefix[depth]])
    		return matches;

    	node = node.children[prefix[depth]];
    } 

	//Use stack to avoid recursion implementation overhead
	nodesStack.push(node);
	prefixesStack.push(prefix);

	while(nodesStack.length && matches.length < maxResults){

		prefix=prefixesStack.pop();
		node=nodesStack.pop();

		//Recursion base
		if(node.isWord && !node.cache)                      
			matches.push(prefix);

		if(this._useCache && node.cache){
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


 	//If we partially iterated the tree due the maxResults limit we shouldn't save the list as it might be incomplete
 	if(this._useCache && nodesStack.length == 0)
 		this.cache=matches;

	// We don't treat this special here to save comparisons within the while loop
	// and keep fast the common case
	if(excludePrefix)
		return matches[0] === origPrefix ? 
			   matches.slice(1,maxResults) : 
			   matches.slice(0,maxResults-1);
	else
		return matches.slice(0,maxResults);
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
    }else{
    	node.isWord=true;
    }

	return this;
}



}).call(this);