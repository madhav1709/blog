//declaring the module 'mongoose'
var mongoose = require('mongoose');
//declaring the module 'mongoose-unique-validator'(plugin).
var uniqueValidator = require('mongoose-unique-validator');
//creating an instance.
var Schema = mongoose.Schema;
//defining schema for blogApp.
var blogSchema = new Schema({

	blogTitle           : {type:String,default:'',required:true,unique:true},
	subTitle            : {type:String,default:''},
	blogBody            : {type:String,default:''},
	tags		        : [],
	created_on		    : {type:Date},
	updated_on          : {type:Date},
	comments            : [],
	authorInfo          : {}
    
});//end of defining schema.

mongoose.model('blog',blogSchema);
blogSchema.plugin(uniqueValidator);
