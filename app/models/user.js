var mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      config = require('../../config/config'),
      crypto = require('crypto'),
      authTypes = ['facebook', 'google'];

var UserSchema = new Schema({
	name: { 
		first: { type: String }, 
		last:  { type: String } 
	},
	username:    			{ type: String, required: true, unique: true },
	email:       			{ type: String, required: true, unique: true },
	active:      			{ type: Boolean, default: true },
	created_at:  			{ type: Date, default: Date.now },
	updated_at:  			{ type: Date },
	type: 		   			{ type: String, default: 'user' }, // user, admin, superadmin, etc.
	hashed_password: 	{ type: String, required: true },
  salt: 						{ type: String }
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
  if (password !== '') {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  }
}).get(function() {
  return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function(email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function(email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  var emailRegex = /^[\w\-\.]+@(?:[\w\-]+\.)+[\w\-]{2,4}$/i;
  return emailRegex.test(email);
}, 'Invalid email address');

UserSchema.path('username').validate(function(username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashed_password.length;
}, 'Password cannot be blank');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
console.log('pre-save: ', this);
  if (!this.isNew) { console.log('not new'); return next();}

  this.setApiKey();
  this.setPublicId()

  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
  	console.log(this.password); console.log(this.provider);
    next(new Error('Invalid password'));
  }
  else {
  	next();
  }
});


var instanceMethods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  setApiKey: function() {
    this.api_key = crypto.createHash('sha1').update(this.makeSalt()).digest('hex');
  }, 

  setPublicId: function() {
  	// using makeSalt to generate a randome number for public_id
  	this.public_id = this.makeSalt();
  }
};

UserSchema.methods = instanceMethods;

mongoose.model('User', UserSchema);