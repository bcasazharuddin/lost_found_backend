const moment = require('moment');
const timeData={}
/**
 * Return Cureent Unix time 
 */
timeData.getCurrentUnixtime=()=>{
    var result = moment().unix();
    return result;
}
//Convert Date into formats 
timeData.convertDateFormat = function (dateVal, dateFormat) {
    var inputDate = moment(dateVal, 'DD-MM-YYYY');
    const d = new Date(inputDate);
    var dateString = moment(d).format(dateFormat);
    return dateString;
}
//convert formast date to unix time stamp 
timeData.getDateUnixTime = function (date) {
    var dateValue = moment(date).unix()
    return dateValue
}

// convert unix time to date
timeData.getUnixTimeToDate = function (unixTime, dateFormat) {
    var dateValue = moment.unix(unixTime).format(dateFormat);
    return dateValue
}
  
timeData.getFullDateAndTimeFromUNIX = function (unixTime) {
    var dateValue = moment.unix(unixTime);
    return dateValue.format("Do MMM YYYY, h:mm A")
}

timeData.getAgeInYears = function (dateString,dateFormat) { //("DD-MM-YYYY",'years')
    const parsedDate = moment(dateString, dateFormat);
    var getYears = moment().diff(parsedDate,'years')
    return getYears;
}

timeData.convertDateIntoUnix = function(date,format) {
    var dateValue = moment(date, format).unix();
    return dateValue;
}

timeData.isLessThanCurrentTime = function (date,format) {
    const currentTime = timeData.getCurrentUnixtime();
    const inputDateInUnix = timeData.convertDateIntoUnix(date,format);
    console.log("inputDateInUnix",inputDateInUnix)
    console.log("currentTime",currentTime)
    if(inputDateInUnix > currentTime) {
        return false;
    }
    return true;
}

timeData.convertNegativeUnixDOB = function(negativeUnixTimestamp) {
    // Convert negative Unix timestamp to milliseconds by multiplying by 1000
    var timestampMilliseconds = negativeUnixTimestamp * 1000;
    
    // Create a new Date object using the timestamp
    var dobDate = new Date(timestampMilliseconds);
    
    // Extract day, month, and year from the date object
    var day = dobDate.getDate();
    var month = dobDate.getMonth() + 1; // Month is zero-indexed, so add 1
    var year = dobDate.getFullYear();
    
    // Format day and month to have leading zeros if necessary
    var formattedDay = (day < 10) ? '0' + day : day;
    var formattedMonth = (month < 10) ? '0' + month : month;
    
    // Format the date as DD-MM-YYYY
    var formattedDOB = formattedDay + '-' + formattedMonth + '-' + year;
    
    return formattedDOB;
}

timeData.dateFormatsMname = function (startday = '') {
  var given = moment(startday).format('DD-MMM-YYYY')
  return given
}
module.exports=timeData