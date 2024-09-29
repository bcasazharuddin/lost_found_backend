const mysqlSelect = require("../../../db_operation/mysqlQuery/selectQuery");
const isValid = require("../validation/customValidation");
const timeFunction = require("../../../util/timeFunction");
let member_information_obj = {};

member_information_obj.fetch_member_information = async (req,res)=>{
    const result = {};
    result.ref_id = "";
    result.type = "MEMBER_INFORMATION";
    result.statusCode = 200;
    result.action_type = "fetch member information";
    result.value = "";
    result.status = false;
    var limit = parseInt(req.query.limit) || 10;
    var page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;
    try {
        var fetch_member_information_value = await mysqlSelect.getGenralQueryData("select lu.uid ,lu.password, lu.user_name,lui.fname ,lui.lname,lui.address,lu.mail,lu.created_by,lui.mobile from laf_users lu inner join laf_users_info lui on lu.uid = lui.uid where  lui.deleted = 'N' and lu.deleted = 'N'  and lu.is_account_active = 1 and lu.is_verified_account = 1 LIMIT ?  OFFSET  ? ",[limit,skip]);
        if (fetch_member_information_value.status == false) {
            result.error_key = "NOT_FETCH_laf_users_info_laf_users";
            result.statusCode = 500;
            result.message = "Member Information is not found . Please try Again";
            result.status = false;
            return result;
        }
        var fetch_member_information = [];
        for(let fetch_member of fetch_member_information_value.value){
            var fetch_member_obj = {};
            fetch_member_obj.uid = fetch_member.uid;
            fetch_member_obj.password = fetch_member.password ? fetch_member.password  : "" ;
            fetch_member_obj.user_name = fetch_member.user_name ?  fetch_member.user_name : "";
            fetch_member_obj.name = (fetch_member.fname ? fetch_member.fname : "") + ' '+(fetch_member.lname ? fetch_member.lname : "");
            fetch_member_obj.email =  fetch_member.mail ?  fetch_member.mail :"";
            fetch_member_obj.mobile = fetch_member.mobile ? fetch_member.mobile : "";
            fetch_member_obj.address = fetch_member.address ? fetch_member.address : "";
            var fname = '';
            var lname = '';
            var fetch_user_info = await mysqlSelect.getGenralQueryData("select fname,lname from laf_users_info where deleted = 'N' and uid = ?",[fetch_member.created_by]);
            if(fetch_user_info.status && fetch_user_info.value && fetch_user_info.value.length > 0){
                fname = fetch_user_info?.value[0]?.fname ||  "";
                lname = fetch_user_info?.value[0]?.lname ||  "";
            }
            fetch_member_obj.manage_by = fname + ' '+ lname;
            fetch_member_information.push(fetch_member_obj);
        }
        result.status = true;
        result.result = fetch_member_information;
        result.message = "Member Information  Data found."
        return result;

    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}
member_information_obj.delete_member_information = async (req,res)=>{
    // custom response
    const result = {};
    result.ref_id = "";
    result.type = "MEMBER_INFORMATION";
    result.statusCode = 200;
    result.action_type = "Delete member information";
    result.value = "";
    result.status = false;
    var inputData = req.body;
    try { 
        const requiredFields = {};
        requiredFields.id = inputData.uid;
        requiredFields.updated_by = inputData.updated_by;
        //check valid exist or not
        var checkData = await isValid.checkProperties(requiredFields);
        if(!checkData.status){
            result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
            result.message = checkData.message;
            return result;
        }
        // check validation
        var validateRegex = await isValid.UserDeleteMemberInformationValidation(req,res);
        if (validateRegex.status == false) {
            result.error_key = "INPUT_VALID_REGEX"
            result.message = validateRegex.message;
            return result;
        }
        let id = inputData.uid.trim();
        let updated_by = inputData.updated_by.trim();
        let currenttime = await timeFunction.getCurrentUnixtime();
        // update data into laf_post_category table
        var dataToSql = await mysqlSelect.getGenralQueryData("update laf_users set deleted = 'Y' ,updated = ? , updated_by = ? where uid = ? and deleted = 'N' ",[updated_by,currenttime,id]);
        if (dataToSql.status == false) {
            result.error_key = "NOT_GENERATE_laf_users";
            result.statusCode = 500;
            result.message = "Member Information successfully is not  deleted . Please try Again";
            result.status = false;
            return result;
        }
        // update data into laf_post_category table
        var dataToSql = await mysqlSelect.getGenralQueryData("update laf_users_info set deleted = 'Y' ,updated = ? , updated_by = ? where uid = ? and deleted = 'N'",[updated_by,currenttime,id]);
        if (dataToSql.status == false) {
            result.error_key = "NOT_GENERATE_laf_users_info";
            result.statusCode = 500;
            result.message = "Member Information successfully is not  deleted . Please try Again";
            result.status = false;
            return result;
        }
        result.status = true;
        result.message = "Member Information form successfully deleted."
        return result;
    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}
member_information_obj.update_member_information = async (req,res)=>{
    // custom response
    const result = {};
    result.ref_id = "";
    result.type = "MEMBER_INFORMATION";
    result.statusCode = 200;
    result.action_type = "Update member information";
    result.value = "";
    result.status = false;
    var inputData = req.body;
    try{
        const requiredFields = {};
        requiredFields.id = inputData.uid;
        requiredFields.updated_by = inputData.updated_by;
        requiredFields.address = inputData.address;
        requiredFields.mobile = inputData.mobile;
        //check valid exist or not
        var checkData = await isValid.checkProperties(requiredFields);
        if(!checkData.status){
            result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
            result.message = checkData.message;
            return result;
        }
        // check validation
        var validateRegex = await isValid.UserUpdateMemberInformationValidation(req,res);
        if (validateRegex.status == false) {
            result.error_key = "INPUT_VALID_REGEX"
            result.message = validateRegex.message;
            return result;
        }
        let id = inputData.uid.trim();
        let updated_by = inputData.updated_by.trim();
        let address = inputData.address.trim();
        let mobile = inputData.mobile.trim();
        let currenttime = await timeFunction.getCurrentUnixtime();
        // insert data into laf_post_category table
        var dataToSql = await mysqlSelect.getGenralQueryData("update laf_users_info set mobile = ?, address = ?  , updated = ? , updated_by = ? where uid = ? and deleted = 'N'",[mobile,address,updated_by,currenttime,id]);
        if (dataToSql.status == false) {
            result.error_key = "NOT_GENERATE_laf_user_info";
            result.statusCode = 500;
            result.message = "User Information successfully is not  updated . Please try Again";
            result.status = false;
            return result;
        }
        result.status = true;
        result.message = "User Information form successfully updated."
        return result;
    } catch (error) {
        result.statusCode = 500;
        result.status = false;
        result.message = "Something went wrong."
        return result;  
    }
}
module.exports = member_information_obj;