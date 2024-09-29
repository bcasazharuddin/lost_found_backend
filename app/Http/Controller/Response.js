const util = require("../../util/customResponse");
const registration = require("./registration/registration");
const application = require("./application/application");
const login = require("./login/login");
const report = require("./report/report");
const post_category = require("./post_category/post_category");
const member_information = require("./member_information/member_information");
const lost_and_found_item = require("./lost_and_found_item/lost_and_found_item")
const responseData={}
/**
 * Default API for testing
 * @param {} req 
 * @param {*} res 
 */
responseData.default=function(req,res){
    util.getSuccessResponse(res,req,'200','Working',true,'Ok',0,'ref_id','type','Default');
}

// Application response
/**
 *  create Application API
 * @param {} req 
 * @param {*} res 
 */
responseData.applicationReport = async function (req, res) {
    try {
        const data=await application.createApplicationId(req,res);
        util.getSuccessResponse(res,req,data.statusCode,data.message,data.status, data.result, data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    } catch (error) {
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'APPLICATION','CREATE_APPLICATION','ERROR_IN_CREATE_APPLICATION');
    }
 }
 
// registration response
/**
 * registration API
 * @param {} req 
 * @param {*} res 
 */
responseData.registration = async function (req, res) {
   try {
       const data=await registration.registration(req,res);
       util.getSuccessResponse(res,req,data.statusCode,data.message,data.status, data.result, data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
   } catch (error) {
    util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'REGISTRATION','REGISTRATION','ERROR_IN_REGISTRATION');
   }
}

/**
 * Login Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.login=async function(req,res){
   try{
    const data = await login.login(req,res);
    util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
   }catch(e){
    //errorHandler(e,res)
    util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'LOGIN','LOGIN','ERROR_IN_LOGIN');
   }
}

/**
 * Report Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.report=async function(req,res){
    try{
     const data = await report.report(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'REPORT','REPORT','ERROR_IN_REPORT');
    }
}

/**
 *Add Post Category Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.add_post_category=async function(req,res){
    try{
     const data = await post_category.add_post_category(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'ADD_POST_CATEGORY','ADD_POST_CATEGORY','ERROR_IN_ADD_POST_CATEGORY');
    }
}
/**
 * Delete Post Category Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.delete_post_category=async function(req,res){
    try{
     const data = await post_category.delete_post_category(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'DELETE_POST_CATEGORY','DELETE_POST_CATEGORY','ERROR_IN_DELETE_POST_CATEGORY');
    }
}

/**
 * Update Post Category Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.update_post_category=async function(req,res){
    try{
     const data = await post_category.update_post_category(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'UPDATE_POST_CATEGORY','UPDATE_POST_CATEGORY','ERROR_IN_UPDATE_POST_CATEGORY');
    }
}

/**
 * fetch Post Category Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.fetch_post_category=async function(req,res){
    try{
     const data = await post_category.fetch_post_category(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'FETCH_POST_CATEGORY','FETCH_POST_CATEGORY','ERROR_IN_FETCH_POST_CATEGORY');
    }
}

/**
 * fetch Member Information Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.fetch_member_information=async function(req,res){
    try{
     const data = await member_information.fetch_member_information(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'FETCH_MEMBER_INFORMATION','FETCH_MEMBER_INFORMATION','ERROR_IN_FETCH_MEMBER_INFORMATION');
    }
}

/**
 * delete Member Information Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.delete_member_information=async function(req,res){
    try{
     const data = await member_information.delete_member_information(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'FETCH_MEMBER_INFORMATION','FETCH_MEMBER_INFORMATION','ERROR_IN_FETCH_MEMBER_INFORMATION');
    }
}

/**
 * update Member Information Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.delete_member_information=async function(req,res){
    try{
     const data = await member_information.update_member_information(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'DELETE_MEMBER_INFORMATION','DELETE_MEMBER_INFORMATION','ERROR_IN_DELETE_MEMBER_INFORMATION');
    }
}

responseData.update_member_information=async function(req,res){
    try{
     const data = await member_information.update_member_information(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'FETCH_MEMBER_INFORMATION','FETCH_MEMBER_INFORMATION','ERROR_IN_FETCH_MEMBER_INFORMATION');
    }
}

/**
 * fetch los and found item  Page 
 * @param {} req 
 * @param {*} res 
 */
responseData.fetch_lost_and_found_item=async function(req,res){
    try{
     const data = await lost_and_found_item.fetch_lost_and_found_item(req,res);
     util.getSuccessResponse(res,req,data.statusCode,data.message,data.status,data.result,data.totalCount, data.ref_id, data.type, data.action_type,data.error_key);
    }catch(e){
     //errorHandler(e,res)
     util.getSuccessResponse(res,req,200,error.message,false, null, 0, 0, 'FETCH_MEMBER_INFORMATION','FETCH_MEMBER_INFORMATION','ERROR_IN_FETCH_MEMBER_INFORMATION');
    }
}
module.exports=responseData