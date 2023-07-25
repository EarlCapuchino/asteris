const { User, OTP }= require('../config/models');
const warning = require('./../constants/warning');
const error = require('./../constants/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/mailer');
const otpGenerator = require('otp-generator');
const knex = require('knex');

/*
  User data is assumed to have username and password
*/
/* Knex Cheatsheet: https://devhints.io/knex */


// Constants for the expiration of jwt token
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'TnbMby4y8QcJWk34UY7z';
const AUTH_EXPIRY = 60000; // 1 min
const REFRESH_EXPIRY = 1000 * 60 * 60; // 1000 = 1sec; 60 = 1min; 60 = 1hr


exports.login  = async (username, password) => {
  if (!username) throw(error.MISSING_USERNAME);
  if (!password) throw(error.MISSING_PASSWORD);

  db_user =  await User.query()
  .where({ 'username': username, 'isDeleted': false })
  .then(user => { return user[0] })
  .catch(err => { throw(err) })

  // Check if username exists
  if (!db_user) throw(warning.USER_NOT_EXIST);

  // Check if password is correct
  const validPass = await bcrypt.compare(password, db_user.password);
  if (!validPass) throw(warning.INCORRECT_PASSWORD);

  // Omit unnecessary fields
  delete db_user.isDeleted;
  delete db_user.password;    
  return db_user;
} 

exports.generateToken = (username) => {
  const payload = {
    user: { username },
    iat: Date.now(),
  };

  // Create auth and refresh tokens
  auth = jwt.sign(payload, TOKEN_SECRET);
  refresh = [jwt.sign({ username }, TOKEN_SECRET), REFRESH_EXPIRY];
  
  return ({
    auth,
    refresh
  });
};


exports.validateAuthToken = (token) => {
  // check if there is a refresh token
  if (!token) throw(error.MISSING_TOKEN);
  
  const isValid = jwt.verify(token, TOKEN_SECRET);

  //check if token is issued by same entity
  if (!isValid) throw(error.INVALID_TOKEN);

  const iat = isValid.iat;
  const now = Date.now();

  // check if token is expired
  if (now > (iat + AUTH_EXPIRY)) {
    throw(error.TOKEN_EXPIRED);
  }
}

exports.validateRefreshToken = (token) => {
  // check if there is a refresh token
  if (!token) throw(error.MISSING_TOKEN);

  // check if token is issued by same entity
  const isValid = jwt.verify(token, TOKEN_SECRET);
  if (!isValid) throw(error.INVALID_TOKEN);

  return isValid.username;
}

exports.generateOTP = async (email) => {
  if (!email) throw(error.MISSING_EMAIL);

  // Check if user exists
  db_user =  await User.query()
  .where({ 'email': email, 'isDeleted': false })
  .then(user => { return user[0] })
  .catch(err => { throw(err) })

  if (!db_user) throw(warning.USER_NOT_EXIST);
  
  // Create OTP
  const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
  const expiration = Date.now();

  await OTP.query().insert({ 
    otp_code: otp, 
    expiration,
    is_used: false
  }).then((code) => {
    if (!code) throw(error.OTP_GENERATION_FAILED);
  })

  // Send OTP to user's email
  const first_name = db_user.first_name[0] + db_user.first_name.substring(1).toLowerCase();
  const last_name = db_user.first_name[0] + db_user.last_name.substring(1).toLowerCase();

  sendOTP(first_name, last_name, email, otp)
  .catch(err => {
    throw(error.SEND_OTP_FAILED);
  })

  return;
}

exports.verifyOTP = async (otp) => {
  if (!otp) throw(error.MISSING_OTP);
  
  // Check if otp code exists and has not been used
  const otp_code = await OTP.query()
  .where({ 'otp_code': otp, 'is_used': false })
  .then(code => { return code[0] })
  .catch(err => { throw(err) })

  if (!otp_code) throw(error.INVALID_OTP);
  
  // Check if otp code has expired
  const now = Date.now();
  if (now > (otp_code.expiration + AUTH_EXPIRY)) {
    throw(error.EXPIRED_OTP);
  }

  // Update the is_used field
  await OTP.query()
  .where({ 'otp_code': otp })
  .update({ 'is_used': true })
  .then(() => { return; })

  return true;
}