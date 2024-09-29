var mongoose = require('mongoose');

var image_upload = new mongoose.Schema({
    reference_id:{type:String},
    flag_type:{type:String},
    image_data:{type:String},
    created:{type:Date, default: Date.now}
 });

module.exports =mongoose.model('image_upload', image_upload);