var mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      config = require('../../config/config')

var CommentSchema = new Schema({
  post_id:          { type: Schema.Types.ObjectId, index: true, required: true}, //Post this comment is for
  comment_id: 			{ type: Schema.Types.ObjectId, index: true}, //If this comment is for another comment 
	created_at:  			{ type: Date, default: Date.now },
	created_by:       { type: Schema.Types.ObjectId, index: true, required: true}, //user_id of author
  updated_at:       { type: Date },
  content: 					{ type: String, required: true} // Max character?
});

// Index created_at and post_id for better search and load time
CommentSchema.index({created_at: 1, post_id: 1});

mongoose.model('Comment', CommentSchema);