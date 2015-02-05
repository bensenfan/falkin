var user = require('../app/controllers/user');
var post = require('../app/controllers/post');

module.exports = function(app, passport, auth){
	app.get('/', user.index);

	app.get('/signin', user.sign_in);
	app.get('/signout', user.sign_out);
	app.get('/signup', user.sign_up);

	app.post('/contact_us', user.contact_us); // send emails
	app.post('/users/signin', 
			passport.authenticate('local', 
			{successRedirect: '/',
       failureRedirect: '/signin'})
	);

	// For now, this is for Luke only
	/*app.get('/post/new', auth.requiresLogin, post.create); //load template for new post
	app.post('/post/create', auth.requiresLogin, post.create); //create post
	app.get('/post/:id', auth.requiresLogin, post.edit); //load existing post for edit
	app.put('/post/update/:id', auth.requiresLogin, post.edit); //save edit
	app.delete('post/delete/:id', auth.requiresLogin, post.delete);
*/

	app.get('/admin', auth.requiresLogin, user.admin);
	// This is the URL for loading an actual episode
	app.get('/episode/:url', post.fetch); //public url for posts
}
