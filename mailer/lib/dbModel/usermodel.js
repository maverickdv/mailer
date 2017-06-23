var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
var linksObj = [
				{
					link: String,
					click_time: Date
				}
			];

var UserSchema = new Schema (
	{
		user_id: {type:Number,index:true},
		email: {type:String, index:true},
		unique_mailer_id : {type:String, index:true, unique:true},
		mailer_type : String,
		mailer_id : String,
		links: linksObj,
		open_status: {
			opened : Boolean,
			sent_time: Date,
			open_time: Date
		},
		user_browser: {
			name: String,
			version: String,
			major_version: String
		},
		user_os:{
			name: String,
			version: String
		},
		user_device:{
			model: String,
			vendor: String,
			device_type: String
		},
		user_location: String
	}
);
module.exports=UserSchema;
