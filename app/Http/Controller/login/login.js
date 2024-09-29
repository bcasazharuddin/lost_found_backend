const isValid = require("../validation/customValidation");
const customFunction = require('../../../util/customFunction');
const mysqlSelect = require("../../../db_operation/mysqlQuery/selectQuery");
const tokenFunctions = require("../../../util/userTokenFunction");
const timeFormat = require("../../../util/timeFunction");
const util = require("../../../util/customResponse");
const crudOperation=require('../../../db_operation/mongoQuery/logsInsert');
const userTokenData = require('../../../Models/userTokenData');
const image_upload_model = require("../../../Models/imageUploadModel");
let login_obj = {};
login_obj.login = async (req, res) => {
   // custom response
  const result = {};
  result.ref_id = "";
  result.type = "User";
  result.statusCode = 200;
  result.action_type = "Login";
  result.value = "";
  result.status = false;
  var inputData = req.body;
  try {
    const requiredFields = {};
    requiredFields.user_name = inputData.user_name;
    requiredFields.password = inputData.password;
    requiredFields.app_name = req.headers['x-application-name'];
    //check valid exist or not
    var checkData = await isValid.checkProperties(requiredFields);
    if(!checkData.status){
        result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
        result.message = checkData.message;
        return result;
    }
    let user_name = inputData.user_name.trim();
    let password = inputData.password.trim();
    let app_name = requiredFields.app_name;
    var check_user_exist = await mysqlSelect.getGenralQueryData("select lu.uid ,lu.password, lu.user_name,lur.rid from laf_users lu inner join laf_users_roles lur on lu.uid = lur.uid where lu.mail = ?  and lur.deleted = 'N' and lu.deleted = 'N'  and lu.is_account_active = 1;",[user_name]);
    if(check_user_exist.status &&check_user_exist.value && check_user_exist.value.length > 0){
        var check_active_user = await mysqlSelect.getGenralQueryData("select * from laf_users lu where lu.uid = ? and lu.deleted = 'N' and is_verified_account = 1;",[check_user_exist.value[0].uid]);
        if(check_active_user.status && check_active_user.value && check_active_user.value.length>0){
           let matchPassword =  await customFunction.validateHashPassword(password,check_user_exist.value[0].password);
           if(!matchPassword){
            result.error_key = "PASSWORD_NOT_MATCH"
            result.message = "Please enter  a valid password.";
            return result;
           }
            var check_user_type = await mysqlSelect.getGenralQueryData("select name from laf_role where rid = ? and deleted = 'N'",[check_user_exist.value[0].rid]);
            var user_type  = '';
            if(check_user_type.status && check_user_type.value && check_user_type.value.length > 0){
                user_type = check_user_type.value[0].name ? check_user_type.value[0].name : '';
            }
            let uid = check_user_exist.value[0].uid;
            var user_info_result = await mysqlSelect.getGenralQueryData("select * from laf_users_info where uid = ? and deleted = 'N'",[uid]);
            let profile_url = '';
            if(user_info_result && user_info_result.status && user_info_result.value && user_info_result.value.length > 0){
                if(user_info_result.value[0].profile_url){
                    var condition = { 'reference_id':uid,'flag_type':'PROFILE','_id':user_info_result.value[0].profile_url }
                    var ImageDoc = await crudOperation.FetchSingleData('res',image_upload_model,condition);
                    if(ImageDoc && ImageDoc.image_data){
                       profile_url = ImageDoc.image_data;
                    }
                    
                }
            }
		    const exp_time = process.env.EXPIRE_TIME;
            result.message = "User login successfully";
            result.status = true;
            /* TOKEN CREATION USING AUTH_ID AND INVESTMENT ID */
            const tokenv = await util.generateAccessToken({ uid: uid},exp_time); 
            result.result = {
              uid: uid,
              after_expired: exp_time,
              token: tokenv,
              profile_image : profile_url,
              userName : check_user_exist.value[0].user_name,
              type:user_type
            };
            let userTokenInput = {
                uid: uid,
                source:app_name,
                expiry: timeFormat.getCurrentUnixtime()+parseInt(process.env.MONGO_EXPIRY_TIME),
                token:tokenv
            }
            var checkHeaderValidation = await crudOperation.countQuery("res", userTokenData, { ref_id: uid.toString(), source: app_name });
            if (checkHeaderValidation > 1) {
                await tokenFunctions.updateUserToken(userTokenInput);
            }else{
                await tokenFunctions.insertUserToken(userTokenInput)
            }
            return result;
            
        }else{
            result.error_key = "ACCOUNT_NOT_VERIFIED"
            result.message = "Your account is not verified by admin.";
            return result;
        }
    }
    var check_user_exist = await mysqlSelect.getGenralQueryData("select lu.uid ,lu.password, lu.user_name,lur.rid from laf_users lu inner join laf_users_roles lur on lu.uid = lur.uid where lu.user_name = ?  and lur.deleted = 'N' and lu.deleted = 'N'  and lu.is_account_active = 1;",[user_name]);
    if(check_user_exist.status &&check_user_exist.value && check_user_exist.value.length > 0){
        var check_active_user = await mysqlSelect.getGenralQueryData("select * from laf_users lu where lu.uid = ? and lu.deleted = 'N' and is_verified_account = 1;",[check_user_exist.value[0].uid]);
        if(check_active_user.status && check_active_user.value && check_active_user.value.length>0){
           let matchPassword =  await customFunction.validateHashPassword(password,check_user_exist.value[0].password);
           if(!matchPassword){
            result.error_key = "PASSWORD_NOT_MATCH"
            result.message = "Please enter  a valid password.";
            return result;
           }
            var check_user_type = await mysqlSelect.getGenralQueryData("select name from laf_role where rid = ? and deleted = 'N'",[check_user_exist.value[0].rid]);
            var user_type  = '';
            if(check_user_type.status && check_user_type.value && check_user_type.value.length > 0){
                user_type = check_user_type.value[0].name ? check_user_type.value[0].name : '';
            }
            let uid = check_user_exist.value[0].uid;
		    const exp_time = process.env.EXPIRE_TIME;
            result.message = "User login successfully";
            result.status = true;
            /* TOKEN CREATION USING AUTH_ID AND INVESTMENT ID */
            const tokenv = await util.generateAccessToken({ uid: uid},exp_time); 
            result.result = {
              uid: uid,
              after_expired: exp_time,
              token: tokenv,
              userName : check_user_exist.value[0].user_name,
              type:user_type
            };
            let userTokenInput = {
                uid: uid,
                source:app_name,
                expiry: timeFormat.getCurrentUnixtime()+parseInt(process.env.MONGO_EXPIRY_TIME),
                token:tokenv
            }
            var checkHeaderValidation = await crudOperation.countQuery("res", userTokenData, { ref_id: uid.toString(), source: app_name });
            if (checkHeaderValidation > 1) {
                await tokenFunctions.updateUserToken(userTokenInput);
            }else{
                await tokenFunctions.insertUserToken(userTokenInput)
            }
            return result;
            
        }else{
            result.error_key = "ACCOUNT_NOT_VERIFIED"
            result.message = "Your account is not verified by admin.";
            return result;
        }
    }
    result.error_key = "USER_NOT_REGISTER"
    result.message = "You are not register in our System.Please register in our System";
    return result;
    
  } catch (error) {
    result.statusCode = 500;
    result.status = false;
    result.message = "Something went wrong."
    return result;  
  }
}

module.exports = login_obj;