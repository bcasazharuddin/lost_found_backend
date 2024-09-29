var mysql = require('mysql'); //mysql package
const redis = require("redis")
module.exports = {
    mongodb: {
        //uri: 'mongodb://' + process.env.MONGO_DB_HOST + ':' + process.env.MONGO_DB_PORT + '/' + process.env.MONGO_DB_DATABASE ,
        uri:process.env.MONGO_DB_PARAMETERS,
    },  
    'sql': mysqlPoolConnect(process.env.MYSQl_DB_HOST,process.env.MYSQl_DB_USERNAME,process.env.MYSQl_DB_PASSWORD,process.env.MYSQL_DB_DATABASE),
    //'db2': mysqlPoolConnect(process.env.MYSQl_DB2_HOST,process.env.MYSQl_DB2_USERNAME,process.env.MYSQl_DB2_PASSWORD,process.env.MYSQL_DB2_DATABASE),
    redisV:redisConnection(),
}

function mysqlPoolConnect(HOST, USERNAME, PASSWORD, DATABASE){
    var conPool = mysql.createPool({
        connectionLimit : 50,
        connectTimeout  : 60 * 60 * 1000,
        acquireTimeout  : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000,
        host: HOST,
        user: USERNAME,
        password: PASSWORD, //root
        database:DATABASE
    });
    conPool.getConnection((err, conn) => {
      if(err){
        console.log("Error in mysql connection")
        throw err;
      }else{
        console.log(`MySql Pool Connected ${DATABASE}`)
      }
    });
    return conPool;
  }

function redisConnection(){
    const client = redis.createClient({
        socket: {
            host: process.env.redisHost,
            port: process.env.redisPort
        },
        password: ''
    });

    return client;
}