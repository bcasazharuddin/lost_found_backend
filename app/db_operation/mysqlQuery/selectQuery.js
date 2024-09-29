//Select Query Data
const dbConfig = require("../../../config/database");
const db1 = dbConfig.sql;
const db2 = dbConfig.db2;
queryfile = {};
/**
 *
 * @param {general Query } Query
 * @param {*} input
 * @returns
 */
queryfile.getGenralQueryData = (Query, input, db="") => {
    var objectRespponse = {};
    return new Promise(function (resolve, reject) {
      try {
        var dbConnection = (db == 'db2') ? db2 : db1;
        dbConnection.query(Query, input, function (err, result) {
          console.log(this.sql);
          if (err) {
            objectRespponse.status = false;
            objectRespponse.value = err.message;
            resolve(objectRespponse);
          } else {
            objectRespponse.status = true;
            objectRespponse.value = result;
            resolve(objectRespponse);
          }
        });
      } catch (err) {
        objectRespponse.status = false;
        objectRespponse.value = err.message;
        resolve(objectRespponse);
      }
    });
};

/**
 * Procedure Query
 */
queryfile.getgeneralprocedure = (Query, db="") => {
    var objectRespponse = {};
    //console.log("Procedure", Query);
    return new Promise(function (resolve, reject) {
      try {
        var dbConnection = (db == 'db2') ? db2 : db1;
        dbConnection.query(`call ${Query}`, function (err, results) {
          if (err) {
            objectRespponse.status = false;
            objectRespponse.value = err.message;
            resolve(objectRespponse);
          } else {
            objectRespponse.status = true;
            objectRespponse.value = results;
            resolve(objectRespponse);
          }
        });
      } catch (err) {
        objectRespponse.status = false;
        objectRespponse.value = err.message;
        resolve(objectRespponse);
      }
    });
};
/**
 * Insert General Query
 */
queryfile.insertgeneralQuery = (table, fields, data, db="") => {
    var objectRespponse = {};
    return new Promise(function (resolve, reject) {
      try{
        var dbConnection = (db == 'db2') ? db2 : db1;
        dbConnection.query(
        `Insert Into ${table}(${fields}) VALUES(${data})`,
        function (err, result) {
          console.log("this.sql====>", this.sql);
          if (err) {
            objectRespponse.status = false;
            objectRespponse.value = err.message;
            resolve(objectRespponse);
          } else {
            objectRespponse.status = true;
            objectRespponse.value = result;
            resolve(objectRespponse);
          }
        }
      );
      }catch(err){
        objectRespponse.status = false;
        objectRespponse.value = err.message;
        resolve(objectRespponse);
      }
    });
};
/**
 * Update General Query
 */  
queryfile.updateKeysfun=async (tableName, updatefields, whereCond) =>{
    return new Promise(function (resolve, reject) {
      queryfile.getGenralQueryData(`update ${tableName} set ${updatefields} where ${whereCond}`, function (err, result) {
        console.log("this.sql", this.sql);
        if (err) {
          //    console.log(err.message)
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
}
module.exports = queryfile;
  