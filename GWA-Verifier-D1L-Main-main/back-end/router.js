/* Import endpoints */
const StudentEndpoint = require('./endpoints/Student');
const AuthEndpoint = require('./endpoints/Auth');
const LogEndpoint = require('./endpoints/Log');
const UserEndpoint = require('./endpoints/User');
// Create router object
const router = require('express').Router();

/* Base Routes */
router.use('/Auth', AuthEndpoint);
router.use('/User', UserEndpoint);
router.use('/Log', LogEndpoint);
router.use('/Student', StudentEndpoint);

/* Export Router */
module.exports = router;
