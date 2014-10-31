var _ = require('underscore');
var SofiaTree = require('../');

module.exports = {

	setUp: function (callback) {
		this.dictionary=["b","bar","barbar","f","foo","foobar"];
		this.sofiaTree= new SofiaTree({useCache: true});

        this.dictionary.forEach(function(word){
        	this.sofiaTree.insert(word);
        },this);

        callback();
	},

    "Retrieve all the completions starting by foo": function(test) {

        test.deepEqual(this.sofiaTree.getCompletions("foo"),["foo","foobar"]);
        test.done();
    },
    "Retrieve all the completions but the prefix itself when excluding": function(test) {

        test.deepEqual(this.sofiaTree.getCompletions("foo",true),["foobar"]);
        test.done();
    },
    "Retrieve all the completions starting by foo using recursive implementation": function(test) {

        test.deepEqual(this.sofiaTree.getCompletions("foo",false,true),["foo","foobar"]);
        test.done();
    },

    "Prints the whole dictionary when asking for empty string": function(test) {

    	test.deepEqual(_.sortBy(this.sofiaTree.getCompletions()),this.dictionary);
        test.done();
    },

    "Results are not case sensitive": function(test) {
    	test.deepEqual(_.sortBy(this.sofiaTree.getCompletions("FoO")),["foo","foobar"]);
        test.done();
    },

    "Inserting new words and retrieval works": function(test) {

    	this.sofiaTree.insert("SOFIA");
    	test.deepEqual(_.sortBy(this.sofiaTree.getCompletions("Sofia")),["sofia"]);
    	test.deepEqual(this.sofiaTree.getCompletions("foo"),["foo","foobar"]);
        test.done();
    },

    "It works well without cache also": function(test) {

	 	this.sofiaTree= new SofiaTree();

        this.dictionary.forEach(function(word){
        	test.equal(this.sofiaTree,this.sofiaTree.insert(word));
        },this);

    	this.sofiaTree.insert("SOFIA");
    	test.deepEqual(_.sortBy(this.sofiaTree.getCompletions("Sofia")),["sofia"]);
    	test.deepEqual(this.sofiaTree.getCompletions("foo"),["foo","foobar"]);
        test.done();
    },

    
};