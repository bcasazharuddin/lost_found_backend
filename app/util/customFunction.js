const mysqlSelect=require('../db_operation/mysqlQuery/selectQuery')
const bcrypt = require('bcrypt');
const util = require("./customResponse");
const tokenFunctions = require("./userTokenFunction");
const timeFormat = require("./timeFunction");
const crudOperation=require('../db_operation/mongoQuery/logsInsert');
const userTokenData = require('../Models/userTokenData');
const upladMongo = require("../Models/imageUploadModel");
const customFunction={}
customFunction.createUsername = async function (email,mobile,fname='abc') {
	return new Promise(async function (resolve, reject) {
	  try {
		var emailParts = email.split("@");
		var email_part1 = emailParts[0];
		var email_part2 = '@'+emailParts[1];
		mobile.toString();
		let username1=email_part1;
		let mobile1 = mobile.substring(mobile.length - 4);
		let username2=username1+mobile1;
		fname = fname.replace(/\s/g, '');
		var fnameSubstring = fname.substring(0, 4);
		var username3 = username1 + fnameSubstring;
		var mobileSubstring = mobile.substring(0, 4);
		var username4 = username1 + mobileSubstring;
  
		let check_username1=await mysqlSelect.getGenralQueryData("select count(*) cnt from laf_users where user_name=?",[username1+email_part2]);
		if(check_username1.status ==true && check_username1.value[0].cnt==0){
		  return resolve(username1+email_part2);
		}else{
		  let check_username2=await mysqlSelect.getGenralQueryData("select count(*) cnt from laf_users where user_name=?",[username2+email_part2]);
		  if(check_username2.status == true && check_username2.value[0].cnt==0){
			return resolve(username2+email_part2);
		  }else{
			let check_username3=await mysqlSelect.getGenralQueryData("select count(*) cnt from laf_users where user_name=?",[username3+email_part2]);
			if(check_username3.status == true && check_username3.value[0].cnt==0){
			  return resolve(username3+email_part2);
			}else{
			  let check_username4=await mysqlSelect.getGenralQueryData("select count(*) cnt from laf_users where user_name=?",[username4+email_part2]);
			  if(check_username4.status == true && check_username4.value[0].cnt== 0){
				return resolve(username4+email_part2);
			  }else{
				
				let username_new = await randomUsername(username1,email_part2);
				return resolve(username_new);
			  }
			  
			}
		  }
		}
  
	  } catch (e) {
		console.log(e)
		return resolve(email);
	  }
	});
}

async function randomUsername(part1,part2){
	var rand = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  var random_username = part1 + rand;
  let check_randomUsername=await mysqlSelect.getGenralQueryData("select count(*) cnt from laf_users where user_name=?",[random_username+part2]);
	if(check_randomUsername.status == true && check_randomUsername.value[0].cnt == 0){
		return random_username+part2;
	}else{
		randomUsername(part1,part2);
	}

}
customFunction.createHashPassword = async function (plaintext){
	const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 12;
    const salt = await bcrypt.genSalt(saltRounds);
	try {
		const hashpassword = await bcrypt.hash(plaintext, salt);
        // console.log('Hashed password:', hashpassword);
        return hashpassword;
    } catch (err) {
        console.log('Error hashing password:', err);
		return '';
    }
}

customFunction.checkExistingUser = async function(email,mobile,source){
	let result = {
	  status:false,
	  value:''
	}
	let check_user_data = await mysqlSelect.getGenralQueryData("select lu.uid,lu.user_name from laf_users lu inner join laf_users_info lui on lu.uid = lui.uid where lu.mail = ? and lui.mobile = ? and lu.deleted = 'N' and lui.deleted = 'N'",[email,mobile]);
	if(check_user_data.status == true && check_user_data.value.length > 0){
	    let uid = check_user_data.value[0].uid;
		const exp_time = process.env.EXPIRE_TIME;
		const tokenv = await util.generateAccessToken({uid: uid,},exp_time);
		let obj = {
			uid: uid,
			after_expired: exp_time,
			user_name : check_user_data.value[0].user_name,
			token: tokenv,
			type:"Existing"
		};
		let userTokenInput = {
			uid: uid,
			source:source,
			expiry: timeFormat.getCurrentUnixtime()+parseInt(process.env.MONGO_EXPIRY_TIME),
			token:tokenv
		}
		var checkHeaderValidation = await crudOperation.countQuery("res", userTokenData, { ref_id: uid.toString(), source: source });
		if (checkHeaderValidation > 1) {
			await tokenFunctions.updateUserToken(userTokenInput);
		}else{
			await tokenFunctions.insertUserToken(userTokenInput)
		}
		result.value = obj;
		result.status = true;
	}
	return result;
}

customFunction.validateHashPassword = async function(plainPassword, hashedPassword) {
    try {
        // Use bcrypt to compare the plain password with the hashed password
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
}

customFunction.saveImageInMongo = async function(data){
	let result = {
		status:false,
		value:''
	}
	try{
		let imageUploadInput = {
			reference_id: data.reference_id,
			flag_type:data.flag_type,
			image_data: data.image_data
		}
		let logs = new upladMongo(imageUploadInput);
		let saveLogs = await crudOperation.SaveTransaction(logs);
		result.status = true;
		result.value = saveLogs;
		return result;

	}catch (err) {
       result.status = false;
	   result.value = '';
	   return result;
    }
	return result;
}
module.exports=customFunction;