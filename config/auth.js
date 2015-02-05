var  mongoose = require('mongoose'),
         User = mongoose.model('User');

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        // return res.send(401, 'User is not authorized');
        return res.redirect('/signin');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

/**
 * API authentication routing middleware
*/
exports.api = {
  authenticated: function(req, res, next) {
    var clientApiKey = req.get('client-api-key');
    if ( !clientApiKey ) {
      return res.send(401, 'api authentication failed');
    } else {
      User.findOne({ api_key: clientApiKey }).exec(function(err, user) {
        if (!user) {
          return res.send(401, 'api authentication failed');
        } else {
          req.profile = user;
          next();
        }
      });
    }
  }
};
