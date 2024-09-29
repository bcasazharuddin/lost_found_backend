const isValid = require("../validation/customValidation");
const timeFunction = require("../../../util/timeFunction");
const mysqlSelect = require("../../../db_operation/mysqlQuery/selectQuery");
const customFunction = require("../../../util/customFunction");
const fs = require('fs');
let report_obj = {};
report_obj.report = async (req,res)=>{
   // custom response
  const result = {};
  result.ref_id = "";
  result.type = "User";
  result.statusCode = 200;
  result.action_type = "Report";
  result.value = "";
  result.status = false;
  var inputData = req.body;
  try{ 
    const requiredFields = {};
    requiredFields.uid = inputData.uid;
    requiredFields.post_category = inputData.post_category;
    requiredFields.title = inputData.title;
    requiredFields.report_time = inputData.report_time;
    requiredFields.description = inputData.description;
    requiredFields.location = inputData.location;
    requiredFields.post_type = inputData.post_type;
    requiredFields.image_url = req.files[0].path;
    requiredFields.remarks = inputData.remarks;
    //check valid exist or not
    var checkData = await isValid.checkProperties(requiredFields);
    if(!checkData.status){
        result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
        result.message = checkData.message;
        return result;
    }
    // check validation
    var validateRegex = await isValid.UserReportValidation(req,res);
    if (validateRegex.status == false) {
      result.error_key = "INPUT_VALID_REGEX"
      result.message = validateRegex.message;
      return result;
    }
    let uid = inputData.uid.trim();
    let post_category = inputData.post_category.trim();
    let title = inputData.title.trim();
    let report_time = inputData.report_time.trim();
    let description = inputData.description.trim();
    let location = inputData.location.trim();
    let post_type = inputData.post_type.trim();
    const fileContent = fs.readFileSync(requiredFields.image_url);
    const base64Image = fileContent.toString('base64');
    // let image_url = base64Image;
    fs.unlink(requiredFields.image_url , (err)=>{
      if (err) {
        console.log("--- Error deleting file ---", err.message);  // Log error message if file deletion fails
      } else {
        console.log("--- File deleted successfully ---");  // Log success message
      }
    })
    let remarks = inputData.remarks.trim();
    let currenttime = await timeFunction.getCurrentUnixtime()
    let imageDataObj = {};
    imageDataObj.reference_id = uid;
    imageDataObj.flag_type  = post_type == 1 ? "LOST_IMAGE" : (post_type == 2 ? "FOUND" : '');
    imageDataObj.image_data = base64Image;
    let profile_url_mongo_id = await customFunction.saveImageInMongo(imageDataObj);
    if(profile_url_mongo_id.status == false){
      result.error_key = "IMAGE_NOT_UPLOAD_IN_MONGO";
      result.statusCode = 400;
      result.message = "Image not upload in  mongo";
      result.status = false;
      return result;
    }
    // insert data into laf_report_form table
    let reqField = ["uid", "post_category","title","report_time","description","location","post_type","report_image_url","remarks","created","created_by"];
    let reqData = [`${uid}`,`'${post_category}'`,`'${title}'`,`'${report_time}'`,`'${description}'`,`'${location}'`,`'${post_type}'`,`'${profile_url_mongo_id.value.toString()}'`,`'${remarks}'`,`'${currenttime}'`,`${uid}`];
    var dataToSql = await mysqlSelect.insertgeneralQuery("laf_report_form", reqField, reqData);
    if (dataToSql.status == false) {
        result.error_key = "NOT_GENERATE_UID_laf_users";
        result.statusCode = 500;
        result.message = "Report form successfully is not applied . Please try Again";
        result.status = false;
        return result;
    }
    result.status = true;
    result.message = "Report form successfully Applied."
    return result;
  }catch (error) {
    result.statusCode = 500;
    result.status = false;
    result.message = "Something went wrong."
    return result;  
  }
}

module.exports = report_obj;