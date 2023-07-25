// Imports
const AuthHandler = require('../handlers/Auth');
const UserHandler = require('../handlers/User');
const error = require('../constants/errors');


exports.isAuthenticated = async (req, res, next) => {
  const { Authorization = '' } = req.headers;   // Get auth header
  const { refreshToken } = req.cookies;         // Get refresh token
  
  // Get auth token from header
  const [, authToken] = Authorization.match(/^Bearer (.+)$/) || [];

  try {
    // Check if auth token is valid
    AuthHandler.validateAuthToken(authToken);
  } 
  catch (err) {
    res.session = { silentRefresh: false };
    switch (err) {
      // CASE 1 & 2: Missing/expired authToken but has refreshToken
      case error.MISSING_TOKEN:
      case error.TOKEN_EXPIRED:
        if (refreshToken) {
          const username = AuthHandler.validateRefreshToken(refreshToken);
          const user = await UserHandler.getUserbyUsername(username);
          const tokens = AuthHandler.generateToken(username);

          // Set new refreshToken
          res.cookie('refreshToken', tokens.refresh[0], 
            { maxAge: tokens.refresh[1], httpOnly: true, path: '/' }
          )
          // Set new authToken
          res.session = {
            silentRefresh: true,
            user: { ...user, authToken: tokens.auth }
          }
          break;
        }

      // CASE 3 & 4: Missing/Expired authToken and no refreshToken
      // CASE 5: Invalid authToken
      case error.INVALID_TOKEN:
        return res.status(401).json({
          success: false,
          message: 'Access is denied. Login to continue.',
          session: res.session
        });
      
      default:
        return res.status(500).json({
          success: false,
          message: 'Error unknown.',
          session: res.session
        });
    }
  }

  // CASE 6: authToken is valid (no issues)
  next();
}