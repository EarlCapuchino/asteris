const { Log } = require('../config/models.js')
const UserHandler = require('../handlers/User')
const { v4: uuidv4 } = require('uuid');
const error = require('../constants/errors')

// Helper function for date formatting
function padTo2Digits(num) { 
    return num.toString().padStart(2, '0');
  }
// Function for date formatting
function formatDate(date) { 
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

// Getting all logs in the database
exports.getLogs  = async () => { 
  return Log.query()
  .orderBy('time_stamp', 'desc')
  .then(logs => { 
  if(logs.length == 0) throw(error.NO_LOGS_FOUND) 
  for (let i = 0; i < logs.length; i++) {
    logs[i].time_stamp = formatDate(logs[i].time_stamp) // Format date for each log
  }
  return logs 
  })
} 

// Get a log by id
getLogById = async(id) => {
  return Log.query()
  .where({'log_id':id})
  .first()
  .then(log => {
    log.time_stamp = formatDate(log.time_stamp) // Format date
    return log
    
  })
}

// Adding a log
exports.addLog  = async (logData) => {
    /* Check first if user exists */
    await UserHandler.getProfileById(logData.user_id)
    let id = uuidv4()
    const log = {
        log_id: id, 
        user_id: logData.user_id,
        subject_id: logData.subject_id,
        subject_entity: logData.subject_entity,
        time_stamp: formatDate(new Date()),
        activity_type : logData.activity_type,
        details: logData.details,
    }
    return Log.query().insert(log)
    .then(log => {
      if (!log) throw(error.LOG_NOT_ADDED)
      return getLogById(id);
    })
    
} 

// Get logs of a user
exports.getLogsByUser  = async (userID) => {
    // Check first if user exists
    await UserHandler.getProfileById(userID)
    return Log.query() 
   .where({'user_id':  userID})
   .orderBy('time_stamp', 'desc')
   .then(logs=>{
      if(logs.length == 0) throw(error.NO_LOGS_OF_USER)
      for (let i = 0; i < logs.length; i++) {
        logs[i].time_stamp = formatDate(logs[i].time_stamp) // Format date for each log
      }
      return logs
    }) 
}

// Get logs of a date
exports.getLogsByDate  = async (date) => {
    return Log.query() 
    .where('time_stamp', 'like', `${date}%`)
    .orderBy('time_stamp', 'desc')
    .then(logs=>{
      if(logs.length == 0) throw(error.NO_LOGS_OF_DATE)
      for (let i = 0; i < logs.length; i++) {
        logs[i].time_stamp = formatDate(logs[i].time_stamp) // Format date for each log
      }
      return logs
    })    
} 

// Get logs of a given activity
exports.getLogsByActivity  = async (activity) => {
    return Log.query() 
    .where('activity_type',  activity)
    .orderBy('time_stamp', 'desc')
    .then(logs=>{
      if(logs.length == 0) throw(error.NO_LOGS_OF_ACTIVITY) // No logs fetched
      for (let i = 0; i < logs.length; i++) {
        logs[i].time_stamp = formatDate(logs[i].time_stamp) // Format date for each log
      }
      return logs
    }) 
}