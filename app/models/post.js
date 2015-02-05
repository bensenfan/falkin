var mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      config = require('../../config/config')

var PostSchema = new Schema({
  name: 						{ type: String, index: true, required: true},
  url:							{ type: String, index: true, required: true}, //name in url, for serarching
	number_visited:   { type: Number, default: 0 }, 
	created_at:  			{ type: Date, default: Date.now },
  updated_at:       { type: Date },
  content: 					{ type: String, required: true}
});

// Use from + to to figure out which messages to pull in reverse alphabet order
PostSchema.index({from: 1, to: 1});

mongoose.model('Post', PostSchema);