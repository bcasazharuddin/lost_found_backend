var mongoose = require('mongoose');

var lostandfound_request_response = new mongoose.Schema({
   /*  headers: {type: Object}, */
    request_data : {type: Object},
    response_data : {type: Object},
   /*  url_endpoint:{type:String},
    request_ip:{type:String}, */
    refernce_id:{type:String},
    type:{type:String},
    action_type:{type:String},
    created:{type:Date, default: Date.now},
    response_id:{type:String}
 });

module.exports =mongoose.model('lostandfound_request_response', lostandfound_request_response);