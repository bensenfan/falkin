var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');

exports.fetch = function(req, res){

	Post.find(req.params.url, function(err, post){
		if (err) {
			res.send(400, 'error fetching post', err);
		} else {
			// add to number visited
			post.update({number_visited: post.number_visited++});
			
			var comments = Comment.find({post_id: post._id}, function(err, comments){
				if (err) {res.send(400, 'error fetching comments', err)}
				post.comments = comments;
				res.send(200, {post: post})
			})
		}
	})
}

