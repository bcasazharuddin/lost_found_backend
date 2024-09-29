const crudOperation=require('../db_operation/mongoQuery/logsInsert')
const userTokenData = require('../Models/userTokenData');
var tokenFunctions = {};

tokenFunctions.insertUserToken = async(data)=>{
    let result = {};
    result.status = false;
    try{
        let insert_data = new userTokenData({
            ref_id: data.uid,
            source: data.source,
            token: data.token,
            // auth:data.auth,
            expiry: data.expiry
        
        });
        let saveLogs = await crudOperation.SaveTransaction(insert_data);
        result.status = true;
        
    }catch(e){
        console.log(e)
        return false;
    }

    return result;
}

tokenFunctions.updateUserToken = async(data)=>{
    let result = {};
    result.status = false;
    try{
        await crudOperation.updateSingleDoc(userTokenData,{"ref_id": data.uid.toString()},{"expiry": data.expiry, "token": data.token});
        result.status = true;
        
    }catch(e){
        console.log(e)
        return false;
    }

    return result;
}


module.exports = tokenFunctions;