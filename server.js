const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuidv4 = require('uuid/v4');

let blogArray=[
				{
					id: uuidv4(),
					title:"Blog 1",
					content:"Content 1",
					author: "Author1",
					publishDate: "12-12-2012"
				},
				{
					id: uuidv4(),
					title:"Blog 2",
					content:"Content 2",
					author: "Author2",
					publishDate: "13-12-2013"
				},
				{
					id: uuidv4(),
					title:"Blog 3",
					content:"Content 3",
					author: "Author1",
					publishDate: "14-12-2014"
				}];

app.get('/blog-posts', (req,res) => {
	res.status(200).json({
		message : "Successfully sent all the blogs",
		status : 200,
		post : blogArray
	});
});

app.get('/blog-posts/:author', (req,res) => {

	if(!('author' in req.params)){
		res.status(406).json({
			message: "Missing parameter",
			status : 406
		}).send("");
	}

	let blogAuthor = req.params.author;
	let authorPosts = [];

	blogArray.forEach(item =>{
		if (item.author == blogAuthor){
			authorPosts.push(item);
		}
	});

	if (authorPosts.length == 0)
	{
		res.status(404).json({
			message : `There are no posts from ${blogAuthor}`,
			status : 404
		}).send("");
	}
	else
	{
		res.status(200).json({
			message : `Successfully found the post of ${blogAuthor}`,
			status : 200,
			post : authorPosts
		}).send("");
	}
});

app.post('/blog-posts', jsonParser, (req,res) => {
	let requiredFields = ['title','content','author','publishDate'];

	for(let i = 0; i < requiredFields.length; i++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			}).send("");
		}
	}

	let newPost = {
		id : uuidv4(),
		title : req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	};
	blogArray.push(newPost);
	res.status(201).json({
		message: "Successfully added the post",
		status: 201,
		post : newPost
	});
});

app.delete('/blog-posts/:id', jsonParser, (req,res) => {

	if (!('id' in req.params))
	{
		res.status(406).json({
			message : "Missing parameter",
			status : 406
		}).send("");
	}

	if (!('id' in req.body))
	{
		res.status(406).json({
			message : "Missing id in body",
			status : 406
		}).send("");
	}

	if (req.params.id != req.body.id)
	{
		res.status(404).json({
			message : "Both id's must match",
			status : 404
		}).send("");
	}

	delID = req.body.id;

	blogArray.forEach(function(item,index){
		if(item.id == delID)
		{
			blogArray.splice(index, 1);
			res.status(204).json({
				message : "Post successfully deleted",
				status : 204
			}).send("");
		}
	});

	res.status(404).json({
			message : "The selected id is not associated to any post",
			status : 404
	}).send("");
});

app.put('/blog-posts/:id', jsonParser, (req,res) => {

	if (!('id' in req.params))
	{
		res.status(406).json({
			message : "Missing parameter",
			status : 406
		}).send("");
	}

	let putID = req.params.id;
	let bodyFields = 0;

	blogArray.forEach(item => {
		if(item.id == putID)
		{
			if('title' in req.body)
			{
				bodyFields = 1;
				item.title = req.body.title;
			}
			if('author' in req.body)
			{
				bodyFields = 1;
				item.author = req.body.author;
			}
			if('content' in req.body)
			{
				bodyFields = 1;
				item.content = req.body.content;
			}
			if('publishDate' in req.body)
			{
				bodyFields = 1;
				item.publishDate = req.body.publishDate;
			}
		
			if(bodyFields)
			{
				res.status(200).json({
					message : "Post modified successfully",
					status : 200,
					post : item
				}).send("");
			}else
			{
				res.status(404).json({
					message : "No parameters in the body",
					status : 404
				}).send("");
			}
		}
	});
	res.status(404).json({
		message : "The selected id is not associated to any post",
		status : 404
	}).send("");


});

app.listen(8080, () => {
	console.log("App is running in port 8080");
})