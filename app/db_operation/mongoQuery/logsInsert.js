//Logs Insert into Mongo Query 
var CrudDataOperation = {};

CrudDataOperation.FetchAllData = function (res, collectionname, query, limit = false, limitvalue = 0, offset = false, offset_from = 0,order_by='') {
    return new Promise(function (resolve, reject) {
      //console.log('Limit Equation');
      if ((limit == true) && (offset == true)) { //only Limit
       // console.log('We Are In  limit & ofset');
       if(order_by !=''){
        console.log('Order by ',order_by)
        collectionname.find(query).limit(limitvalue).skip(offset_from).sort( order_by ).exec(function (err, result) {
          resolve(result);
        });
      }else{
        collectionname.find(query).limit(limitvalue).skip(offset_from).exec(function (err, result) {
          resolve(result);
        });
    }
      
      } else if ((limit == true) && (offset == false)) {
        //console.log('We Are In  limit');
        collectionname.find(query).limit(limitvalue).exec(function (err, result) {
          resolve(result);
        });
      } else if ((limit == false) && (offset == false)) {
        //.sort( { age: -1 } )
        if(order_by !=''){
          console.log('Order by======> ',order_by)
          collectionname.find(query).sort( order_by ).exec(function (err, result) {
            resolve(result);
          });
        }else{
          collectionname.find(query).exec(function (err, result) {
            resolve(result);
        });
      }
      }
  
  
  
    });
  
}


CrudDataOperation.countQuery = function (res,collectionname,condition){
  console.log("--collectionname-- ",collectionname);
    // return new Promise(function(resolve,reject){
      // collectionname.countDocuments(condition,function(err,result){
      //   if(err){
      //     console.log(err)
      //     reject(err)
      //   }else{
      //     console.log("result========>",result)
      //     resolve(result)
      //   }
      // })
      return collectionname.countDocuments(condition)
        .then(result => {
            console.log("result========>", result);
            return result;  // Resolves the promise with the result
        })
        .catch(err => {
            console.log(err);
            throw err;  // Rejects the promise with the error
        });

    // })
}

  /**
 * Save Data Withoute MEssage
 */
  CrudDataOperation.SaveTransaction = function (collectionname) {
    return new Promise(function (resolve, reject) {
      collectionname.save().then(function(result){
        resolve(result._id);
      }).catch()
    //  console.log('Error==>'+err.message);
      });
  }
  
CrudDataOperation.updateSingleDoc = function (collection, condition,query) {
    return new Promise(function(resolve,reject){
      // collection.updateOne(condition,query,function(err,result){
      //   if(err){
      //     console.log(err)
      //     reject(err)
      //   }else{
      //     if(result){
      //       resolve(result)
      //     }else{
      //       reject(err)
      //     }
      //   }
      // })
      collection.updateOne(condition,query).then(function(result){
        resolve(result._id);
      }).catch()
    //  console.log('Error==>'+err.message);
      })
  }


  CrudDataOperation.FetchAllDataAggregate = function (res, collectionname, pipelineObj) {
    return new Promise(function (resolve, reject) {
      var pipeline = [
        {$match: pipelineObj.match},
        { $sort: pipelineObj.sort }
      ];
      collectionname.aggregate(pipeline).exec().then((data) => {
        resolve(data)
    }).catch((data_err)=>{
      console.log("error in data",data_err)
      resolve()
    })
  })
}

/**
 * Calculate only One Row
 */
CrudDataOperation.FetchSingleData = function (res, collectionname, query, limit = false, limitvalue = 0, offset = false, offset_from = 0) {
  return new Promise(function (resolve, reject) {
    //console.log('Limit Equation');
    if ((limit == true) && (offset == true)) { //only Limit
     // console.log('We Are In  limit & ofset');
      collectionname.findOne(query).limit(limitvalue).skip(offset_from).exec(function (err, result) {
        resolve(result);
      });
    } else if ((limit == true) && (offset == false)) {
      //console.log('We Are In  limit');
      collectionname.findOne(query).limit(limitvalue).exec(function (err, result) {
        resolve(result);
      });
    } else if ((limit == false) && (offset == false)) {
      // collectionname.findOne(query).exec(function (err, result) {
      //   resolve(result);
      // });
      collectionname.findOne(query).exec().then(result => {
        // Use the result
        resolve(result)
      }).catch(error => {
        // Handle the error
      });
    }
  });

}

  module.exports = CrudDataOperation;