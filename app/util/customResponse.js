//util file data
const Crypto = require('crypto');
const lostandfoundRequestResponse = require('../Models/lostandfoundRequestResponse');
const crudOperation = require('../db_operation/mongoQuery/logsInsert');
const jwt = require('jsonwebtoken');
const utilobj = {};
utilobj.getSuccessResponse = async function (
  res,
  req,
  code = "200",
  message = "",
  value = true,
  result = "",
  totalCount = 0,
  ref_id='',
  type='',
  action_type='',
  error_key = ''
) {
  if (code == 200 && value == true) {
    value = true;
  } else {
    value = false;
  }
  
  let res_data = {};
  res_data.result = result
  res_data.message = message
  let req_data = {};
  req_data.headers = req.headers;
  req_data.url = req.originalUrl;
  req_data.body = req.body;
  const responseId=await utilobj.randomString(24)
  let logs = new lostandfoundRequestResponse({
    refernce_id: ref_id,
    request_data: req_data,
    response_data: res_data,
    type: type,
    action_type: action_type,
    response_id: responseId
  });
  // console.log('==================================>',logs);
  if(action_type){
    let saveLogs = await crudOperation.SaveTransaction(logs);
    console.log('saveLogs',saveLogs)
  }


  //save function 
  
res.status(parseInt(code)).json({
    message: message,
    error_key: error_key,
    success: value,
    result: result,
    count: totalCount,
    responseId:responseId
  });
};

// Return random number any digit 
utilobj.randomString=(size = 16)=>{  
    return Crypto
      .randomBytes(size)
      .toString('base64')
      .slice(0, size)
}

/**
 * 
 * @param {Generate jwt Token} username 
 * @param {*} time 
 * @returns 
 */
utilobj.generateAccessToken=(username,time='3600s')=>{
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: time});
}

module.exports = utilobj;