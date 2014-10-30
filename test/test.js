var chai = require('chai');
var assert = chai.assert;

var _ = require('underscore');
// var SofiaTree = require('../sofia-tree');
var SofiaTree = require('../');


var testCase  = require('nodeunit').testCase;


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

    "Prints the whole dictionary when asking for empty string": function(test) {

    	test.deepEqual(_.sortBy(this.sofiaTree.getCompletions()),this.dictionary);
        test.done();
    }
};


