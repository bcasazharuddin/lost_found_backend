const BaseJoi = require('joi');
const Extension = require('@joi/date');
const Joi = BaseJoi.extend(Extension);
var custmFunction = {};
/**
 *
 * @param {Check key Value Pair Exist or not} obj
 */
custmFunction.checkProperties = async function (obj) {
    var ValidObj = {}
    return new Promise(function (resolve, reject) {
      //console.log(obj.docImage)
      if(obj.doc){
        obj.doc = 'exist'
      }
      for (var key in obj) {
        // console.log(obj);
        if (obj[key] !== null && obj[key] != '' && typeof obj[key] != 'undefined') {
            // console.log(obj[key]);
        } else {
            ValidObj.status = false
            ValidObj.message = key + ' value Required'
            return resolve(ValidObj)
        }
      }
      ValidObj.status = true
      resolve(ValidObj)
    })
}
/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserRegistrationValidation  = async function(req,res){
  var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var mobileReg = /^[6-9]{1}[0-9]{9}$/
  var password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
  var address_regex = /^\d+\s[A-Za-z]+\s[A-Za-z]+,\s[A-Za-z]+\s\d{6}$/
  var url_regex = /^(https?:\/\/)?[\w\-]+\.[\w\-]+(\.[\w\-]+)*([\/\w\-]*)?$/i;
  const schema = Joi.object().keys({
    fname:Joi.string().min(1).regex(/^[a-zA-Z ]+$/).required().messages({"string.pattern.base":"First Name should be correct","string.empty" : "First Name should not be empty. Please Provide First Name.","any.required":"First Name is required. Please provide a First Name."}),
    lname:Joi.string().min(1).regex(/^[a-zA-Z ]+$/).required().messages({"string.pattern.base":"Last Name should be correct","string.empty" : "Last Name should not be empty. Please Provide Last Name.","any.required":"Last Name is required. Please provide a Last Name."}),
    email:Joi.string().email().regex(reg).required().messages({"string.pattern.base":"Email ID should be correct","string.empty" : "Email ID should not be empty. Please Provide Email ID.","any.required":"Email ID is required. Please provide a Email ID."}),
    password:Joi.string().regex(password_regex).required().messages({"string.pattern.base":"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.","string.empty" : "Password should not be empty. Please Provide Password.","any.required":"Password is required. Please provide a Password."}),
    mobile: Joi.string().regex(mobileReg).min(10).max(10).required().messages({"string.pattern.base":"Please Insert Valid Mobile Number.","string.empty" : "Mobile should not be empty. Please Provide Mobile No.","any.required":"Mobile is required. Please provide a Mobile No."}),
    address: Joi.string().min(3).required(address_regex).messages({"string.pattern.base":"Please Insert Valid address.","string.empty" : "Address should not be empty. Please Provide Address.","any.required":"Address is required. Please provide a Address."}),
    // profile_url: Joi.string().min(3).required(url_regex).messages({"string.pattern.base":"Please Insert valid url.","string.empty" : "Url should not be empty. Please Provide Url.","any.required":"Url is required. Please provide a Url."})
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}
/**
 *
 * @param {check validation} req,res
 */
custmFunction.ApplicationValidation  = async function(req,res){
  const schema = Joi.object().keys({
    name:Joi.string().min(1).required().messages({"string.pattern.base":"Name should be correct","string.empty" : "Name should not be empty. Please Provide Name.","any.required":"Name is required. Please provide a Name."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}

/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserReportValidation  = async function(req,res){
  var address_regex = /^\d+\s[A-Za-z]+\s[A-Za-z]+,\s[A-Za-z]+\s\d{6}$/
  var url_regex = /^(https?:\/\/)?[\w\-]+\.[\w\-]+(\.[\w\-]+)*([\/\w\-]*)?$/i;
  const schema = Joi.object().keys({
    uid:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"Uid should be correct","string.empty" : "Uid should not be empty. Please Provide Uid.","any.required":"Uid is required. Please provide a Uid."}),
    post_category:Joi.string().min(1).regex(/^[a-zA-Z ]+$/).required().messages({"string.pattern.base":"Post Category should be correct","string.empty" : "Post Category should not be empty. Please Provide Post Category.","any.required":"Post Category is required. Please provide a Post Category."}),
    title:Joi.string().min(1).regex(/^[a-zA-Z ]+$/).required().messages({"string.pattern.base":"title should be correct","string.empty" : "title should not be empty. Please Provide title","any.required":"title is required. Please provide a title."}),
    report_time:Joi.string().min(1).required().messages({"string.pattern.base":"Report time should be correct","string.empty" : "Report time should not be empty. Please Provide Report time","any.required":"Report time is required. Please provide a Report time."}),
    description:Joi.string().min(1).required().messages({"string.pattern.base":"description should be correct","string.empty" : "description should not be empty. Please Provide description","any.required":"description is required. Please provide a description."}),
    location: Joi.string().min(3).required(address_regex).messages({"string.pattern.base":"Please Insert Valid location.","string.empty" : "location should not be empty. Please Provide location.","any.required":"location is required. Please provide a location."}),
    post_type : Joi.string().min(1).message('The Post type field must have a min1imum length of 1').max(1).message('The Post type field must have a maximum length of 1').required().messages({"string.pattern.base":"Please provide valid Post type.","string.empty":" Post type value should not be empty","any.required":"Post type is required. Please provide a Post type."}),
    // image_url: Joi.string().min(3).required(url_regex).messages({"string.pattern.base":"Please Insert valid url.","string.empty" : "Url should not be empty. Please Provide Url.","any.required":"Url is required. Please provide a Url."}),
    remarks:Joi.string().min(1).required().messages({"string.pattern.base":"Remarks should be correct","string.empty" : "Remarks should not be empty. Please Provide remarks","any.required":"Remarks is required. Please provide a Remarks."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}
/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserAddPostCategoryValidation  = async function(req,res){
  const schema = Joi.object().keys({
    category_name:Joi.string().min(1).regex(/^[a-zA-Z ]+$/).required().messages({"string.pattern.base":"Post Category should be correct","string.empty" : "Post Category should not be empty. Please Provide Post Category.","any.required":"Post Category is required. Please provide a Post Category."}),
    description:Joi.string().min(1).required().messages({"string.pattern.base":"description should be correct","string.empty" : "description should not be empty. Please Provide description","any.required":"description is required. Please provide a description."}),
    created_by:Joi.string().min(1).regex(/^\d+$/).required().messages({"string.pattern.base":"created_by should be correct","string.empty" : "Created by should not be empty. Please Provide Created by.","any.required":"Created by is required. Please provide a Created By."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}
/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserDeletePostCategoryValidation  = async function(req,res){
  const schema = Joi.object().keys({
    id:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"Id should be correct","string.empty" : "Id should not be empty. Please Provide Id.","any.required":"Id is required. Please provide a Id."}),
    updated_by:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"updated_by should be correct","string.empty" : "updated_by should not be empty. Please Provide updated_by.","any.required":"updated_by is required. Please provide a updated_by."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}
/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserUpdatePostCategoryValidation  = async function(req,res){
  const schema = Joi.object().keys({
    id:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"Id should be correct","string.empty" : "Id should not be empty. Please Provide Id.","any.required":"Id is required. Please provide a Id."}),
    updated_by:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"updated_by should be correct","string.empty" : "updated_by should not be empty. Please Provide updated_by.","any.required":"updated_by is required. Please provide a updated_by."}),
    description:Joi.string().min(1).required().messages({"string.pattern.base":"description should be correct","string.empty" : "description should not be empty. Please Provide description","any.required":"description is required. Please provide a description."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}

/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserDeleteMemberInformationValidation  = async function(req,res){
  const schema = Joi.object().keys({
    uid:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"Id should be correct","string.empty" : "Id should not be empty. Please Provide Id.","any.required":"Id is required. Please provide a Id."}),
    updated_by:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"updated_by should be correct","string.empty" : "updated_by should not be empty. Please Provide updated_by.","any.required":"updated_by is required. Please provide a updated_by."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}

/**
 *
 * @param {check validation} req,res
 */
custmFunction.UserUpdateMemberInformationValidation  = async function(req,res){
  var address_regex = /^\d+\s[A-Za-z]+\s[A-Za-z]+,\s[A-Za-z]+\s\d{6}$/
  var mobileReg = /^[6-9]{1}[0-9]{9}$/
  const schema = Joi.object().keys({
    uid:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"Id should be correct","string.empty" : "Id should not be empty. Please Provide Id.","any.required":"Id is required. Please provide a Id."}),
    updated_by:Joi.string().min(1).regex(/^[0-9]+$/).required().messages({"string.pattern.base":"updated_by should be correct","string.empty" : "updated_by should not be empty. Please Provide updated_by.","any.required":"updated_by is required. Please provide a updated_by."}),
    mobile: Joi.string().regex(mobileReg).min(10).max(10).required().messages({"string.pattern.base":"Please Insert Valid Mobile Number.","string.empty" : "Mobile should not be empty. Please Provide Mobile No.","any.required":"Mobile is required. Please provide a Mobile No."}),
    address: Joi.string().min(3).required(address_regex).messages({"string.pattern.base":"Please Insert Valid address.","string.empty" : "Address should not be empty. Please Provide Address.","any.required":"Address is required. Please provide a Address."}),
  }).unknown()
  const { error, value } = schema.validate(req.body);
  var obj = {};
  if (error) {
      obj.status = false;
      obj.message = error.details[0].message;
  } else {
      obj.status = true;
      obj.message = "Ok";
  }
  return obj;
}

module.exports = custmFunction;  