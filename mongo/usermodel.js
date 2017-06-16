var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var linkSchema = new Schema(
	{
		sent: [],
		opened: [{
			link: String,
			click_time: Date
		}]
	}
);
var openStatusSchema = new Schema (
	{
		opened : Boolean,
		sent_time: {type: Date, default: Date.now},
		open_time: Date
	}
);

var UserSchema = new Schema (
	{
		user_id: {type:Number, index:true, unique:true},
		email: {type:String, index:true, unique:true},
		unique_mailer_id : String,
		mailer_type : String,
		mailer_id : String,
		links: [linkSchema],
		open_status: openStatusSchema,
		user_platform: String,
		user_browser: String,
		user_location: String
	}
);
module.exports=UserSchema;
