var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Add Application Id for Authentication
*/
var user_token_details = new mongoose.Schema({
    ref_id: { type: String },
    source: { type: String },
    // auth: { type: String },
    token: { type: String},
    expiry: { type: String},
    created: { type: Date, default: Date.now },

});

module.exports =mongoose.model('user_token_details', user_token_details);
