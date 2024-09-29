// var mongoose = require('mongoose');

// var application_details = new mongoose.Schema({
//     application_id: { type: String },//Application ID
//     application_name: { type: String },//Application Name Like Propelled oxigen etc
//     is_active: { type: String, default: 'N' },//Is Appilcation Active
//     created: { type: Date, default: Date.now }, //When Application has created
// });

// module.exports = mongoose.model('application_details', application_details);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var authReport = {};

/**
 * Add Application Id for Authentication
*/
var application_details = new mongoose.Schema({
    application_id: { type: String },//Application ID
    application_name: { type: String },//Application Name Like Propelled oxigen etc
    is_active: { type: String, default: 'N' },//Is Appilcation Active
    created: { type: Date, default: Date.now }, //When Application has created

});
//pool Investment Details
authReport.application_details = mongoose.model('application_details', application_details);

module.exports = authReport
