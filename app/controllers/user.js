var mongoose = require('mongoose');
var User = mongoose.model('User');
var Gyde = mongoose.model('Post');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: '', // email address
	 	pass: '' // password
	}
});
/*
	The home page uses the default "homepage" unless specified to a new theme
*/
exports.index = function(req, res){
	console.log(req.session);
	/*if (req.user) {
		//res.send(200, req.user)
		res.render('users/profile')
	} else {
		res.render('index', {title: 'index'});
	}*/
	var user = req.user || false;
	res.render('index', {user: user, isLanding: true});
}

/*
	Render sign in page
*/
exports.sign_in = function(req, res){
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('users/signin', {
			title: "Sign In"
		});
	}
}

/*
	Render sign up page
*/
exports.sign_up = function(req, res){
	if (req.user) {
		res.redirect('/');
	} else {
		res.render('users/signup', {
			title: "Sign Up"
		});
	}
}

exports.sign_out = function(req, res){
	req.logout();
	res.redirect('/');
}

// @TODO: Build "admin" page to add/edit post, change theme, etc
exports.admin = function(req, res){
	if (req.user){
		res.render('/user/admin');
	} else {
		res.render('user/signin', {
			title: "Sign In"
		});
	}
}

/*
	Send 2 emails: 1st a thank you to who signed up, 2nd to myself
*/
exports.contact_us = function(req, res){
	console.log('inside contact_us()');
	console.log(req.body);
	transporter.sendMail({
		to: req.body.email,
		subject: "Thank You for Signing Up!",
		text: 'message from ' + req.body.name
	}, function(err, info){
		if (err) {
			res.send(400, {message: 'error sending email to user', error: err});
		} else {
			console.log('thank you mail sent to who signed up');
			// respond as soon as the thank you email is sent
			res.send(200, info);

			// send another message to myself with the actual message
			transporter.sendMail({
				to: 'bensenfan88@gmail.com',
				subject: req.body.name + ' has signed up!',
				text: "name: " + req.body.name + ', phone: ' + req.body.phone + ', message: ' + req.body.message
			}, function(err, info){
				if (err) {
					console.log('error sending mail to myself: ', err);
				} else {
					console.log('send email to myself with input message: ', info);
				}
			})
		}
	})
}

