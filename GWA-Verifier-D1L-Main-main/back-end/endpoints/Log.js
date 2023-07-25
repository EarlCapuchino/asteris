/* Create StudentEndpoint */
const LogEndpoint = require("express").Router();
const activity = require("../constants/activities.js");
const LogHandler = require("../handlers/Log.js");
const { isAuthenticated } = require('../middlewares/Auth')

// Function For Get Logs Endpoint
const getLogs = async (req, res) => {
  try {
    // Call Handler
    const logs = await LogHandler.getLogs();
    // Return Result
    return res.json({ result: { 
      success: true, 
      output: logs,
      session: res.session } });
  } catch (error) {
    // Catch Error
    return res.status(404).json({ result: { 
      success: false, 
      message: error,
      session: res.session } });
  }
};


// Function For Add Print Log Endpoint
const addPrintLog = async (req, res) => {
  try {
    // Get details from request body
    const  {user_id } = req.body
    if(!user_id) throw("Missing user_id")
      // Create new log
    const log_data = {
      user_id: user_id,
      activity_type: activity.PRINTED_SUMMARY,
    }
    // Call Handler
    const log = await LogHandler.addLog(log_data);
    return res.json({ result: { 
      success: true, 
      output: log,
      session: res.session } });
    
  } catch (error) {
    // Catch Errors
    return res.status(404).json({ result: { 
      success: false, 
      message: error,
      session: res.session } });
  }
};


// Function For Get Logs By User Endpoint
const getLogsByUser = async (req, res) => {
  try {
    // Call Handler
    const logs = await LogHandler.getLogsByUser(req.params.userID);
    return res.json({ result: { 
      success: true, 
      output: logs,
      session: res.session } });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({ result: { 
      success: false, 
      message: error,
      session: res.session } });
  }
};

// Function For Get Logs By Activity Endpoint
const getLogsByActivity = async (req, res) => {
  try {
    // Call Handler
    const logs = await LogHandler.getLogsByActivity(req.params.activity);
    return res.json({ result: { 
      success: true, 
      output: logs,
      session: res.session } });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({ result: { 
      success: false, 
      message: error,
      session: res.session } });
  }
};

// Function For Get Logs By Date Endpoint
const getLogsByDate = async (req, res) => {
  try {
    // Call Handler
    const logs = await LogHandler.getLogsByDate(req.params.date);
    return res.json({ result: { 
      success: true, 
      output: logs,
      session: res.session } });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({ result: { 
      success: false, 
      message: error,
      session: res.session } });
  }
};

LogEndpoint.get("/", isAuthenticated, getLogs);
LogEndpoint.post("/print", isAuthenticated, addPrintLog);
LogEndpoint.get("/user/:userID", isAuthenticated, getLogsByUser); //note of query params /user?:userID
LogEndpoint.get("/activity/:activity", isAuthenticated, getLogsByActivity);
LogEndpoint.get("/date/:date", isAuthenticated, getLogsByDate);

module.exports = LogEndpoint;
