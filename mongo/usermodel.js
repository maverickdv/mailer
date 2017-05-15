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
		sent_time: Date,
		open_time: Date
	}
);
var mailerSchema = new Schema(
	{
		unique_mailer_id : String,
		mailer_type : String,
		mailer_id : String,
		links: [linkSchema],
		open_status: [openStatusSchema],
		user_platform: String,
		user_browser: String,
		user_location: String
	}
);

var UserSchema = new Schema (
	{
		user_id: Number,
		email: String,
		mailers: [mailerSchema]
	}
);
module.exports=mongoose.model('User',UserSchema);
