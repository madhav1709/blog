//required modules to be included....
var express = require('express'); //include express js module and calling them

var app = express() //create an instance.


var cookieParser = require('cookie-parser'); //include cookie-parser module...
var bodyParser = require('body-parser'); //include body-parser module....


app.use(bodyParser.json({limit:'10mb',extended:true}));//using body-parser
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));


var mongoose = require('mongoose');//calling mongoose module...


var dbPath  = "mongodb://localhost/myblogApp"; //creating a database according to the specific config.

//Database connection
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection successfull!!!!");


}); //connection end.

//include required model file
var Blog = require('./blogSchema.js');
var blogModel = mongoose.model('blog');//to be changed

//application level middlewares
app.use(function(req,res,next){
	console.log('///////////////////////*//////////////////////////////////');
	console.log("HostName",req.hostname);//name of the host
	var x = new Date();
	console.log("Date and time Log:",x.toString());//date and time 
	console.log("Protocol Log:",req.protocol);
	console.log("Path Log:",req.path);
	console.log("Method Log:",req.method);
	console.log("Ip address Log:",req.ip);
	console.log('///////////////////////*//////////////////////////////////');
	next();
}); //end of application level middleware



//basic route(route to check whether app working or not...)
app.get('/', function (req, res) {

  res.send("This is a blog application");

});

//route to GET all blogs
app.get('/blogs',function(req, res) {

  blogModel.find(function(err,result){
    if(err){
			res.send(err)
			next(err)
		}
		else{
			res.send(result)
		}
	});

});

// end route to GET all blogs

// route to get a unique blog by id.
app.get('/blogs/:id',function(req,res,next) {

	blogModel.findOne({'_id':req.params.id},function(err,result){
		if(err){
			next(err);
		    console.log("error occurred!!")
		}
		else{
			res.send(result);
		}
	});

});
// end route to get a unique blog by id.

//route for creating a blog.make sure you have an unique blog title.
app.post('/blog/create',function(req, res) {
		
		var newBlog = new blogModel({

			blogTitle 	: req.body.blogTitle,
			subTitle 	: req.body.subTitle,
			blogBody 	: req.body.blogBody

		}); 

		//creation date
		var today = Date.now();
		newBlog.created_on = today;

		//tags
		var Tags = (req.body.Tags!=null)?req.body.Tags.split(','):''
		newBlog.tags = Tags;

		//info about author
		var authorInfo = {
			Name:req.body.authorName,
			Age:req.body.authorAge,
			email:req.body.authorEmail
		};
		    newBlog.authorInfo = authorInfo;

		newBlog.save(function(err){  //Saving the blog
			if(err){
				console.log(err, "something is not working");
				res.send(err);

			}
			else{
				res.send(newBlog);
			}

	});
});//end of creating a blog.

//route for editing a blog.
app.put('/blog/:id/edit',function(req, res, next) {

        var update = req.body; //date of updation
        var today = Date.now();
	    update.updated_on = today;
	
	    blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
			
		if(err){
		console.log("sorry blog not available or wrong blog Id");
		next(err);
		}
		else{
		console.log("Blog updated on"+today);
		res.send(result);

	}
	});
});// end route for editing a blog.

//route for commenting on a blog.
app.post('/blog/:id/comment',function(req, res, next) {

			blogModel.findOne({'_id':req.params.id},function(err , result){
		     if(err)
		{
			console.log("sorry ID not available.");
			next(err);
		}
		else
		{ 
			var y = new Date();
			timendate = y.toString();
			result.comments.push({ 
				
				Name     : req.body.commentorName,
			    comment  :req.body.commentBody,
			    commentedTime: timendate		   
			});

		
		//save
	    result.save(function(err){
			if(err){
				console.log("There is some error!!!");
				res.send(error);
			}
			else{
				res.send(result);
			}
	});
}

});

});//end of comment section 

//route for deleting a blog
app.post('/blog/:id/delete',function(req, res, next) {

	blogModel.remove({'_id':req.params.id},function(err, result){

		if(err){
			console.log("Sorry Blog not available!!!");
			
			next(err);
		}
		else{
			res.send(result)
		}


	}); 
  
});// end delete blog

//error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something looks fishy check for logs!');
  res.status(404).send('Hey! there....you are looking at the wrong place!!!!')
  next(err);
});
//404

//listening port
app.listen(3000, function () {
  console.log('myBlogApp  listening on port 3000!');
});
