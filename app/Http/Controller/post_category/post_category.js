const isValid = require("../validation/customValidation");
const timeFunction = require("../../../util/timeFunction");
const mysqlSelect = require("../../../db_operation/mysqlQuery/selectQuery");
let post_category_obj = {};

post_category_obj.add_post_category = async (req,res)=>{
    // custom response
    const result = {};
    result.ref_id = "";
    result.type = "POST_CATEGORY";
    result.statusCode = 200;
    result.action_type = "Add Post category";
    result.value = "";
    result.status = false;
    var inputData = req.body;
    try {
        const requiredFields = {};
        requiredFields.category_name = inputData.category_name;
        requiredFields.description = inputData.description;
        requiredFields.created_by = inputData.created_by;
        //check valid exist or not
        var checkData = await isValid.checkProperties(requiredFields);
        if(!checkData.status){
            result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
            result.message = checkData.message;
            return result;
        }
        // check validation
        var validateRegex = await isValid.UserAddPostCategoryValidation(req,res);
        if (validateRegex.status == false) {
            result.error_key = "INPUT_VALID_REGEX"
            result.message = validateRegex.message;
            return result;
        }
        let category_name = inputData.category_name.trim();
        let description = inputData.description.trim();
        let created_by = inputData.created_by.trim();
        let currenttime = await timeFunction.getCurrentUnixtime();
        let check_already_category = await mysqlSelect.getGenralQueryData("select * from laf_post_category where post_category = ? and deleted  = 'N'",[category_name]);
        if(check_already_category.status == true && check_already_category.value && check_already_category.value.length > 0 ){
          result.error_key = "ALREADY_EXIST_IN_SYSTEM";
          result.statusCode = 200;
          result.message = "This Post category already insert in our system.";
          result.status = false;
          return result;
        }
        // insert data into laf_post_category table
        let reqField = ["post_category","description","created","created_by"];
        let reqData = [`'${category_name}'`,`'${description}'`,`'${currenttime}'`,`${created_by}`];
        var dataToSql = await mysqlSelect.insertgeneralQuery("laf_post_category", reqField, reqData);
        if (dataToSql.status == false) {
            result.error_key = "NOT_GENERATE_laf_post_category";
            result.statusCode = 500;
            result.message = "Post Category successfully is not created . Please try Again";
            result.status = false;
            return result;
        }
        result.status = true;
        result.message = "Post Category form successfully Created."
        return result;
        
    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}

// post_category_obj.delete_post_category = async (req,res)=>{
//     // custom response
//     const result = {};
//     result.ref_id = "";
//     result.type = "POST_CATEGORY";
//     result.statusCode = 200;
//     result.action_type = "Delete Post category";
//     result.value = "";
//     result.status = false;
//     var inputData = req.body;
//     try{
//         const requiredFields = {};
//         requiredFields.id = inputData.id;
//         //check valid exist or not
//         var checkData = await isValid.checkProperties(requiredFields);
//         if(!checkData.status){
//             result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
//             result.message = checkData.message;
//             return result;
//         }
//         // check validation
//         var validateRegex = await isValid.UserDeletePostCategoryValidation(req,res);
//         if (validateRegex.status == false) {
//             result.error_key = "INPUT_VALID_REGEX"
//             result.message = validateRegex.message;
//             return result;
//         }
//         let id = inputData.id.trim();
//         let updated_by = inputData.updated_by.trim();
//         let currenttime = await timeFunction.getCurrentUnixtime();
//         // insert data into laf_post_category table
//         var dataToSql = await mysqlSelect.getGenralQueryData("update laf_post_category set deleted = 'Y' ,updated = ? , updated_by = ? where id = ?",[updated_by,currenttime,id]);
//         if (dataToSql.status == false) {
//             result.error_key = "NOT_GENERATE_laf_post_category";
//             result.statusCode = 500;
//             result.message = "Post Category successfully is not  deleted . Please try Again";
//             result.status = false;
//             return result;
//         }
//         result.status = true;
//         result.message = "Post Category form successfully deleted."
//         return result;
        
//     } catch (error) {
//         result.statusCode = 500;
//         result.status = false;
//         result.message = "Something went wrong."
//         return result;  
//     }
// }

post_category_obj.delete_post_category = async (req,res)=>{
    // custom response
    const result = {};
    result.ref_id = "";
    result.type = "POST_CATEGORY";
    result.statusCode = 200;
    result.action_type = "Delete Post category";
    result.value = "";
    result.status = false;
    var inputData = req.body;
    try{
        const requiredFields = {};
        requiredFields.id = inputData.id;
        requiredFields.updated_by = inputData.updated_by;
        //check valid exist or not
        var checkData = await isValid.checkProperties(requiredFields);
        if(!checkData.status){
            result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
            result.message = checkData.message;
            return result;
        }
        // check validation
        var validateRegex = await isValid.UserDeletePostCategoryValidation(req,res);
        if (validateRegex.status == false) {
            result.error_key = "INPUT_VALID_REGEX"
            result.message = validateRegex.message;
            return result;
        }
        let id = inputData.id.trim();
        let updated_by = inputData.updated_by.trim();
        let currenttime = await timeFunction.getCurrentUnixtime();
        // insert data into laf_post_category table
        var dataToSql = await mysqlSelect.getGenralQueryData("update laf_post_category set deleted = 'Y' ,updated = ? , updated_by = ? where id = ?",[updated_by,currenttime,id]);
        if (dataToSql.status == false) {
            result.error_key = "NOT_GENERATE_laf_post_category";
            result.statusCode = 500;
            result.message = "Post Category successfully is not  deleted . Please try Again";
            result.status = false;
            return result;
        }
        result.status = true;
        result.message = "Post Category form successfully deleted."
        return result;
        
    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}

post_category_obj.update_post_category = async (req,res)=>{
    // custom response
    const result = {};
    result.ref_id = "";
    result.type = "POST_CATEGORY";
    result.statusCode = 200;
    result.action_type = "Update Post category";
    result.value = "";
    result.status = false;
    var inputData = req.body;
    try{
        const requiredFields = {};
        requiredFields.id = inputData.id;
        requiredFields.updated_by = inputData.updated_by;
        requiredFields.description = inputData.description;
        //check valid exist or not
        var checkData = await isValid.checkProperties(requiredFields);
        if(!checkData.status){
            result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
            result.message = checkData.message;
            return result;
        }
        // check validation
        var validateRegex = await isValid.UserUpdatePostCategoryValidation(req,res);
        if (validateRegex.status == false) {
            result.error_key = "INPUT_VALID_REGEX"
            result.message = validateRegex.message;
            return result;
        }
        let id = inputData.id.trim();
        let updated_by = inputData.updated_by.trim();
        let description = inputData.description.trim();
        let currenttime = await timeFunction.getCurrentUnixtime();
        // insert data into laf_post_category table
        var dataToSql = await mysqlSelect.getGenralQueryData("update laf_post_category set description = ? , updated = ? , updated_by = ? where id = ? and deleted = 'N'",[description,updated_by,currenttime,id]);
        if (dataToSql.status == false) {
            result.error_key = "NOT_GENERATE_laf_post_category";
            result.statusCode = 500;
            result.message = "Post Category successfully is not  updated . Please try Again";
            result.status = false;
            return result;
        }
        result.status = true;
        result.message = "Post Category form successfully updated."
        return result;
    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}

post_category_obj.fetch_post_category = async (req,res)=>{
    // custom response
    const result = {};
    result.ref_id = "";
    result.type = "POST_CATEGORY";
    result.statusCode = 200;
    result.action_type = "fetch Post category";
    result.value = "";
    result.status = false;
    var limit = parseInt(req.query.limit) || 10;
    var page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;
    try {
        var fetch_post_category_value = await mysqlSelect.getGenralQueryData("select * from laf_post_category where deleted = 'N'   LIMIT ?  OFFSET  ? ",[limit,skip]);
        if (fetch_post_category_value.status == false) {
            result.error_key = "NOT_FETCH_laf_post_category";
            result.statusCode = 500;
            result.message = "Post Category Data is not found . Please try Again";
            result.status = false;
            return result;
        }
        var fetch_post_category_data = [];
        for(let fetch_post of fetch_post_category_value.value){
            var fetch_post_obj = {};
            fetch_post_obj.id = fetch_post.id;
            fetch_post_obj.post_category = fetch_post.post_category;
            fetch_post_obj.description = fetch_post.description;
            var fname = '';
            var lname = '';
            var fetch_user_info = await mysqlSelect.getGenralQueryData("select fname,lname from laf_users_info where deleted = 'N' and uid = ?",[fetch_post.created_by]);
            if(fetch_user_info.status && fetch_user_info.value && fetch_user_info.value.length > 0){
                fname = fetch_user_info?.value[0]?.fname ||  "";
                lname = fetch_user_info?.value[0]?.lname ||  "";
            }
            fetch_post_obj.manage_by = fname + ' '+ lname;
            fetch_post_category_data.push(fetch_post_obj);
        }
        result.status = true;
        result.result = fetch_post_category_data;
        result.message = "Post Category Data found."
        return result;
    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}


module.exports = post_category_obj;