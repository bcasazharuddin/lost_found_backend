const isValid = require("../validation/customValidation");
const md5 = require('md5');
const timeFunction = require("../../../util/timeFunction");
const variableMapping = require("../../../util/variableMapping");
const application_report = require("../../../Models/applicationModel");
const mysqlSelect = require("../../../db_operation/mysqlQuery/selectQuery");
const crudOperation = require("../../../db_operation/mongoQuery/logsInsert")
let application_obj = {};

application_obj.createApplicationId = async(req,res)=>{
    // custom response
  const result = {};
  result.ref_id = "";
  result.type = "APPLICATION";
  result.statusCode = 200;
  result.action_type = "Registration";
  result.value = "";
  result.status = false;
  var inputData = req.body;
  try {
    const requiredFields = {};
    requiredFields.name = inputData.name;
    //check valid exist or not
    var checkData = await isValid.checkProperties(requiredFields);
    if(!checkData.status){
        result.error_key = "MANDATORY_PARAMETERS_MISSING_IN_BODY"
        result.message = checkData.message;
        return result;
    }
    var validateRegex = await isValid.ApplicationValidation(req,res);
    if (validateRegex.status == false) {
      result.error_key = "INPUT_VALID_REGEX"
      result.message = validateRegex.message;
      return result;
    }
    var name = requiredFields.name.toUpperCase()
    var applicationId = md5(variableMapping.LOANG_STRING+timeFunction.getCurrentUnixtime());
    var condition = { 'application_name':name,'is_active':'Y' }
    var countDoc = await crudOperation.FetchSingleData('res',application_report,condition);
    // console.log("---countDoc-- ",countDoc);
    if(countDoc && countDoc.application_name){
        var getApplicationDetails = await mysqlSelect.getGenralQueryData("Select app_name,app_id from laf_api_authenticate Where deleted='N' AND  app_name=?",[countDoc.application_name]);
        if(getApplicationDetails && getApplicationDetails.status && getApplicationDetails.value.length>0){
            result.message = "Application Already Exist in our system";
            result.status = true;
            result.result = {
                application_name : getApplicationDetails.value[0].app_name,
                application_id : getApplicationDetails.value[0].app_id,
            }
            return result;
        }else{
            let columnName = ['app_name', 'app_id','created']
            let columnValues = [`'${countDoc.application_name}'`,`'${countDoc.application_id}'`,`'${timeFunction.getCurrentUnixtime()}'`]
            var insertrefData =  await mysqlSelect.insertgeneralQuery('laf_api_authenticate', columnName, columnValues);
            // console.log("-- insertrefData--",insertrefData);
            result.message = "Application Name & Application ID Created Successfully.";
            result.status = true;
            result.result = {
                application_name : countDoc.application_name,
                application_id :countDoc.application_id,
            }
            return result;
        }
    }else{
        let AuthData = new application_report({
            application_id:applicationId,
            application_name:name,
            is_active:'Y'
        })
        let saveLogs =  await crudOperation.SaveTransaction(AuthData);
        let columnName = ['app_name', 'app_id','created']
        let columnValues = [`'${name}'`,`'${applicationId}'`,`'${timeFunction.getCurrentUnixtime()}'`]
        var insertrefData =  await mysqlSelect.insertgeneralQuery('laf_api_authenticate', columnName, columnValues);
        console.log("--- insertrefData--",insertrefData);
        result.message = "Application Name & Application ID Created Successfully.";
        result.status = true;
        result.result = {
            application_name : name,
            application_id :applicationId,
        }
        return result;

    }  
  } catch (error) {
    result.status = false;
    result.message = "Something went wrong."
    return result;  
  }

}  

module.exports = application_obj;