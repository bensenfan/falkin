
/**
 * Preload all the models.
 */

var mongoose = require('mongoose');
var config = require('../../config/config');

// Bootstrap db connection
exports.db = mongoose.connect(config.db);

// only preload the files with mongoose models
// until this folder is cleaned up
require('./user');
require('./comment');
require('./post');

