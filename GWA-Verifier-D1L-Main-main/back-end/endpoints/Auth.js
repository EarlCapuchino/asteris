const AuthEndpoint = require('express').Router();
const AuthHandler = require('../handlers/Auth');
const UserHandler = require('../handlers/User');
const LogHandler = require('../handlers/Log');
const warning = require('../constants/warning');
const error = require('../constants/errors');
const success = require('../constants/success');
const activity = require('../constants/activities');


// Function For User Login Endpoint
const login = async(req, res) => {
  try {
    // Get details from request body
    const { username, password } = req.body;

    // Fetch user and generate tokens
    const user = await AuthHandler.login(username, password);
    const tokens = AuthHandler.generateToken(user.username);

    // Create new log
    const log_data = {
      user_id: user.user_id,
      activity_type: activity.ACCOUNT_LOGIN,
    }
    await LogHandler.addLog(log_data);
    
    // Set cookie, return user and auth token
    res.cookie('refreshToken', tokens.refresh[0], 
      { maxAge: tokens.refresh[1], httpOnly: true, path: '/' }
    )
    return res.json({ 
      success: true,
      user: { ...user, authToken: tokens.auth },
      message: success.LOGIN_SUCCESS
    });
    
  } catch (err) {
    // Catch Errors
    switch (err) {
      case error.MISSING_USERNAME:
      case error.MISSING_PASSWORD:
        return res.status(401).json({
          success: false,
          message: warning.MISSING_CREDENTIALS
        });
      case warning.INCORRECT_PASSWORD:
      case warning.USER_NOT_EXIST:
        return res.status(401).json({
          success: false,
          message: warning.INCORRECT_CREDENTIALS
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Error unknown'
        });
    }
  }
}


// Function For User Referesh Token Endpoint
const refresh = async(req, res) => {
  // Get cookies
  const { refreshToken } = req.cookies; 
  
  try {
    // Get details from request body
    const username = AuthHandler.validateRefreshToken(refreshToken);
    const user = await UserHandler.getUserbyUsername(username);
    const tokens = AuthHandler.generateToken(username);

    res.cookie('refreshToken', tokens.refresh[0], 
      { maxAge: tokens.refresh[1], httpOnly: true, path: '/' }
    )
    return res.json({ success: true, user: {...user, authToken: tokens.auth} });
  } catch(err) {
    switch(err) {
      // Check for errors
      case error.MISSING_TOKEN:
      case error.INVALID_TOKEN:
      case error.USER_NOT_FOUND:
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. Login to continue.'
        });
      default:
        return res.status(500).json({
          success: false, 
          message: 'Error unknown.'
        });
    }
  }
}

// Function for user logout endpoint
const logout = (req, res) => {
  res.clearCookie('refreshToken', { path: '/' });
  return res.json({ 
    success: true, 
    message: success.LOGOUT_SUCCESS
  })
}

// Function For Generating OTP Endpoint
const generateOTP = async (req, res) => {
  try {
    // Get details from request body
    const { email } = req.body;
    // Call Handler
    await AuthHandler.generateOTP(email);

    return res.json({
      success: true,
      message: 'One Time Password (OTP) has been sent to your email. Kindly check your spam folder in case it did not appear in your inbox.'
    })
  } catch(err) {
    // Catch Errors
    switch (err) {
      case error.MISSING_EMAIL:
      case warning.USER_NOT_EXIST:
        return res.status(400).json({
          success: false,
          message: err
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Oops! Something went wrong while we were processing your request. Kindly try again later.'
        });
    }
  }
}


AuthEndpoint.post('/', login);
AuthEndpoint.get('/', logout);
AuthEndpoint.get('/refresh', refresh);
AuthEndpoint.post('/otp', generateOTP);
module.exports = AuthEndpoint;