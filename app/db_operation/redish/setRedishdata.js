//Select Query Data
const dbConfig = require("../../../config/database");
const redisConnection = dbConfig.redisV;
// console.log(redisConnection.connect())
/**
 * Fetch Data 
 */
const redisObjectData={}
redisObjectData.getIdValue=async (idValue,dbValue=1)=>{
    await redisConnection.connect() 
    await redisConnection.select(dbValue);
    const cacheResults = await redisConnection.get(idValue); //Get Id Value Data 
    await redisConnection.disconnect()
    return cacheResults

}
/**
 * 
 * @param {Set Data} idValue 
 * @param {*} dataValue 
 * @param {*} expTime 
 * @returns 
 */
redisObjectData.SetDatavalue=async (idValue,dataValue,expTime=86400,dbValue=1)=>{
    await redisConnection.connect() 
    await redisConnection.select(dbValue); //Setting db 1
    await redisConnection.setEx(idValue,expTime, dataValue, function(err, result) {
  });
    await redisConnection.disconnect()
    return ''
}



module.exports=redisObjectData