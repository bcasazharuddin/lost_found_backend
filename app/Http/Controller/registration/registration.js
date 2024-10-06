const isValid = require("../validation/customValidation");
const customFunction = require('../../../util/customFunction');
const timeFunction = require("../../../util/timeFunction");
const mysqlSelect = require("../../../db_operation/mysqlQuery/selectQuery");
const util = require("../../../util/customResponse");
const tokenFunctions = require("../../../util/userTokenFunction");
const fs = require('fs');
let registration_obj = {};
// registration function 
registration_obj.registration=async (req,res)=>{
  // custom response
  const result = {};
  result.ref_id = "";
  result.type = "User";
  result.statusCode = 200;
  result.action_type = "Registration";
  result.value = "";
  result.status = false;
  var inputData = req.body;
  try {
    const requiredFields = {};
    requiredFields.fname = inputData.fname;
    requiredFields.lname = inputData.lname;
    requiredFields.email = inputData.email;
    requiredFields.password = inputData.password;
    requiredFields.mobile = inputData.mobile;
    requiredFields.address = inputData.address;
    if(req.files && req.files[0]){
      requiredFields.profile_url = req.files[0].path;
    }
    requiredFields.app_name = req.headers['x-application-name'];
    //check valid exist or not
    var checkData = await isValid.checkProperties(requiredFields);
    if(!checkData.status){
      result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
      result.message = checkData.message;
      return result;
    }
    var validateRegex = await isValid.UserRegistrationValidation(req,res);
    if (validateRegex.status == false) {
      result.error_key = "INPUT_VALID_REGEX"
      result.message = validateRegex.message;
      return result;
    }
    // last add already registration
    let email = inputData.email.trim();
    let mobile = inputData.mobile.trim();
    let fname = inputData.fname.trim();
    let lname = inputData.lname.trim();
    let address = inputData.address.trim();
    let plainPassword = inputData.password.trim();
    let app_name = requiredFields.app_name;
    if(req.files && req.files[0]){
      const fileContent = fs.readFileSync(requiredFields.profile_url);
      var base64Image = fileContent.toString('base64');
      fs.unlink(requiredFields.profile_url , (err)=>{
        if (err) {
          console.log("--- Error deleting file ---", err.message);  // Log error message if file deletion fails
        } else {
          console.log("--- File deleted successfully ---");  // Log success message
        }
      })
    }
    let check_user_exist = await customFunction.checkExistingUser(email,mobile,app_name);
    if(check_user_exist.status == true){
      result.message = "Executed Sucessfully";
      result.status = true;
      result.result = check_user_exist.value
      return result;
    }
    let check_already_email = await mysqlSelect.getGenralQueryData("select * from laf_users where mail = ? and deleted = 'N'",[email]);
    if(check_already_email.status == true && check_already_email.value && check_already_email.value.length > 0 ){
      result.error_key = "ALREADY_EXIST_IN_SYSTEM";
      result.statusCode = 200;
      result.message = "This Email Id is linked with another Account";
      result.status = false;
      return result;
    }
    let check_already_mobile = await mysqlSelect.getGenralQueryData("select * from laf_users_info where mobile = ? and deleted = 'N'",[mobile]);
    if(check_already_mobile.status == true && check_already_mobile.value && check_already_mobile.value.length > 0 ){
      result.error_key = "ALREADY_EXIST_IN_SYSTEM";
      result.statusCode = 200;
      result.message = "This mobile is linked with another Account";
      result.status = false;
      return result;
    }
    let userName = await customFunction.createUsername(email,mobile,fname);  

    let passwordHash = await customFunction.createHashPassword(plainPassword);

    let currenttime = await timeFunction.getCurrentUnixtime()
    if(!passwordHash){
      result.error_key = "NOT_GENERATE_PASSWORD"
      result.message = "Password Hash value not generated.";
      return result;
    }
    // insert data into laf_users table
    let reqField = ["user_name", "password","mail","created"];
    let reqData = [`'${userName}'`,`'${passwordHash}'`,`'${email}'`,`'${currenttime}'`];
    var dataToSql = await mysqlSelect.insertgeneralQuery("laf_users", reqField, reqData);
    if (dataToSql.status == false) {
      result.error_key = "NOT_GENERATE_UID_laf_users";
      result.statusCode = 500;
      result.message = dataToSql.value;
      result.status = false;
      return result;
    }
    let uid = 0;
    if(dataToSql.value.insertId){
      uid = dataToSql.value.insertId; 
    }
    let profile_url_mongo_id = {};
    if(req.files && req.files[0]){
      let imageDataObj = {};
      imageDataObj.reference_id = uid;
      imageDataObj.flag_type  = "PROFILE";
      imageDataObj.image_data = base64Image;
      profile_url_mongo_id = await customFunction.saveImageInMongo(imageDataObj);
      if(profile_url_mongo_id.status == false){
        result.error_key = "IMAGE_NOT_UPLOAD_IN_MONGO";
        result.statusCode = 400;
        result.message = "Image not upload in  mongo";
        result.status = false;
        return result;
      }
    }
    // insert data into laf_users_info table
    let reqInfoField = ["uid","fname", "lname","mobile","address","profile_url","created"];
    let reqInfoData = [uid,`'${fname}'`,`'${lname}'`,`'${mobile}'`,`'${address}'`,`'${profile_url_mongo_id && profile_url_mongo_id?.value  ? profile_url_mongo_id.value.toString() : 0}'`,`'${currenttime}'`];
    var dataToSqlInfo = await mysqlSelect.insertgeneralQuery("laf_users_info", reqInfoField, reqInfoData);
    if (dataToSqlInfo.status == false) {
      result.error_key = "NOT_GENERATE_UID_laf_users_info";
      result.statusCode = 500;
      result.message = dataToSqlInfo.value;
      result.status = false;
      return result;
    }
    // insert data into laf_users_info table
    let reqRoleField = ["uid","rid","created"];
    let reqRoleData = [uid,3,`'${currenttime}'`];
    var dataToSqlRole = await mysqlSelect.insertgeneralQuery("laf_users_roles", reqRoleField, reqRoleData);
    if (dataToSqlRole.status == false) {
      result.error_key = "NOT_GENERATE__laf_users_role";
      result.statusCode = 500;
      result.message = dataToSqlRole.value;
      result.status = false;
      return result;
    }

    /* AFTER laf_users_info INSERTION SUCCESSFULL */
    if (dataToSqlInfo.status == true && dataToSqlInfo.value && dataToSqlInfo.value.affectedRows > 0) {
      const exp_time = process.env.EXPIRE_TIME;
      // const auth = await util.randomString(28);
      result.message = "Executed Sucessfully";
      result.status = true;
      /* TOKEN CREATION USING AUTH_ID AND INVESTMENT ID */
      const tokenv = await util.generateAccessToken({ uid: uid},exp_time); 
      result.result = {
        uid: uid,
        after_expired: exp_time,
        token: tokenv,
        userName : userName,
        type:"New"
      };
      let userTokenInput = {
        uid:uid,
        source:app_name,
        // auth_id: auth,
        expiry: timeFunction.getCurrentUnixtime()+parseInt(process.env.MONGO_EXPIRY_TIME),
        token:tokenv
      }

      await tokenFunctions.insertUserToken(userTokenInput);
      return result;
    }else {
      result.error_key = "NOT_GENERATE_USER_TOKEN";
      result.statusCode = 500;
      result.message = "Some data is missing please connect to our support team";
      result.status = false;
      return result;
    }
  } catch (error) {
    result.statusCode = 500;
    result.status = false;
    result.message = "Something went wrong."
    return result;  
  }

}

module.exports = registration_obj;