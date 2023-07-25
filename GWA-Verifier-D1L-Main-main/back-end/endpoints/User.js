const UserEndpoint = require('express').Router();
const UserHandler = require('../handlers/User');
const AuthHandler = require('../handlers/Auth');
const LogHandler = require('../handlers/Log');
const error = require('../constants/errors')
const success = require('../constants/success')
const activity = require('../constants/activities')
const { isAuthenticated } = require('../middlewares/Auth')
const { upload} = require('../middlewares/ImgUpload')
const user_entity = "User";
const admin = "CHAIR/HEAD"

// Function To Check If User Is Admin
const isAdmin = async(user_id) => {
    // Call Handler
    const user = await UserHandler.getProfileById(user_id)
    if(user.user_role !== admin){
        throw ("Access denied. Must be an admin to continue")
    }
}

// Function For Get Accounts Endpoint
const getAccounts = async (req, res) => {
    try {
        // Call Handler
        const allUsers = await UserHandler.getAccounts();
        return res.json({result:{ 
            // Return Results
            success: true, 
            output: allUsers,
            session: res.session }});
    } catch (error) {
        // Catch Errors
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

// Function For Get All Accounts Endpoint
const getAllAccounts = async (req, res) => {
    try {
        // Call Handler
        const allUsers = await UserHandler.getAllAccounts();
        return res.json({result:{ 
            // Return Results
            success: true, 
            output: allUsers,
            session: res.session }});
    } catch (error) {
        // Catch Errors
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}


// Function For Get Accounts by Role Endpoint
const getAccountsByRole = async (req, res) => {
    try {
        // Get Details From Request Params
        const { role } = req.params
        // Call handler
        const Users = await UserHandler.getAccountsByRole(role);

        return res.json({result:{ 
            success: true, 
            output: Users,
            session: res.session }});
    } catch (error) {
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

const createAccount = async (req, res) => {
    try {
        const {username, user_id} = req.body;
        if (!user_id) { throw("Missing user_id") }

        await isAdmin(user_id)
        const user = await UserHandler.createAccount(req.body);
        
        // Manage Log
        const log_data = {
            user_id: user_id,
            subject_id: user.user_id,
            subject_entity: user_entity,
            activity_type: activity.CREATED_USER,
            details: `Created user with username: ${username}`,
        }
    
        await LogHandler.addLog(log_data)

        return res.json({result:{ 
            success: true, 
            message:success.USER_CREATED, output: user,
            session: res.session}});
    } catch (error) {
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { id,user_id } = req.params;
        const { details } = req.body;
        if (!user_id) { throw("Missing 'user_id'.") }
        if (!details) { throw("Missing details.") }
        await isAdmin(user_id)
        const user = await UserHandler.deleteAccount(id);

            // Manage Log
            const log_data = {
                user_id: user_id,
                subject_id: user.user_id,
                subject_entity: user_entity,
                activity_type: activity.DELETED_USER,
                details: details,
            }

            await LogHandler.addLog(log_data)

            return res.json({result:{ 
                success: true, 
                message: success.USER_DELETE_SUCCESS,
                session: res.session }})
        
    } catch (error) {
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

const getProfileById = async (req, res) => {
    // Get id parameter from request
    const { id } = req.params;
    try {
        const user = await UserHandler.getProfileById(id);
        return res.json({result:{ 
            success: true, 
            output: user,
            session: res.session }})
    } catch (error) {
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }

}
const changeUsername = async (req, res) => {
    try {
        const { id }= req.params;
        const {password,new_username }= req.body;

        await UserHandler.changeUsername(id, password ,new_username);

        // Manage Log
        const log_data = {
            user_id: id,
            activity_type: activity.CHANGED_USERNAME,
        }

        await LogHandler.addLog(log_data)
        return res.json({result:{ 
            success: true, 
            message: success.CHANGE_USERNAME_SUCCESS,
            session: res.session }});
       
    } catch (error) {
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}
const changePassword = async (req, res) =>{
    try {
        const { id } = req.params
        const oldPassword = req.body.oldPassword 
        const modifiedPassword = req.body.modifiedPassword
       
        await UserHandler.changePassword(id, oldPassword, modifiedPassword);

        // Manage Log
        const log_data = {
            user_id: id,
            activity_type: activity.CHANGED_PASSWORD,
        }
        await LogHandler.addLog(log_data)
        
        return res.json({result:{
            success: true, 
            message:success.CHANGE_PASSWORD_SUCCESS,
            session: res.session}});
        
    }catch(error){
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

const resetPassword = async (req, res) => {
    try {
        // Reset Password
        const { email, new_password, otp } = req.body;
        const is_valid = await AuthHandler.verifyOTP(otp);
        let user = null;

        if (is_valid) {
            user = await UserHandler.resetPassword(email, new_password);
        }

        // Manage Log
        const log_data = {
            user_id: user.user_id,
            activity_type: activity.CHANGED_PASSWORD,
        }
        await LogHandler.addLog(log_data)

        return res.json({
            success: true, 
            message:success.CHANGE_PASSWORD_SUCCESS
        });
    } catch (err) {
        switch (err) {
            case error.MISSING_OTP:
            case error.INVALID_OTP:
            case error.EXPIRED_OTP:
            case error.USER_NOT_FOUND:
            case error.CHANGE_PASSWD_FAILED:
                return res.status(404).json({
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

const changeEmail = async (req, res) =>{
    try {
        const { id } = req.params
        const {password, new_email} = req.body

        await UserHandler.changeEmail(id, password, new_email);

        // Manage Log
        const log_data = {
            user_id: id,
            activity_type: activity.CHANGED_EMAIL,
        }
        await LogHandler.addLog(log_data)
            
        return res.json({result:{
            success: true, 
            message:success.CHANGE_EMAIL_SUCCESS,
            session: res.session}});
    }catch(error){
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

const changePhoneNumber = async (req, res) =>{
    try {
        const { id } = req.params
        const {password, new_number} = req.body

        await UserHandler.changePhoneNumber(id, password, new_number);

        // Manage Log
        const log_data = {
            user_id: id,
            activity_type: activity.CHANGED_PHONE_NUMBER,
        }
        await LogHandler.addLog(log_data)
            
        return res.json({result:{
            // Return Results
            success: true, 
            message:success.CHANGE_PHONE_NUMBER_SUCCESS,
            session: res.session}});
    }catch(error){
        // Catch Errors
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }
}

// Function For Get User Endpoint
const searchUser = async (req, res) =>{
    try{
        // Get Details From Request Query
        const {name} = req.query;
        // Call Handler
        const result = await UserHandler.searchUser(name);
        return res.json({result:{ 
            // Return Results
            success: true, 
            output: result,
            session: res.session}})
        
    }catch(error){
        // Catch Errors
        return res.status(404).json({result:{
            success:false, 
            message: error, 
            session: res.session}});
    }

}

// Function For Search Users By Role Endpoint
const searchUserByRole = async (req, res) =>{
    try{
        // Get Details From Request Params and Query
        const { role } = req.params;
        const {name} = req.query;
        // Call Handler
        const result = await UserHandler.searchUserByRole(name,role);
        return res.json({result:{ success: true, output: result }})
        
    }catch(error){
        // Catch Errors
        return res.status(404).json({result:{success:false, message: error}});
    }

}

// Function For Change Photo Endpoint
const changePhoto = async (req, res) =>{
    try{
        // Get Details From Request Params and Body
        const { id } = req.params;
        const {new_photo} = req.body;
        // Call Handler
        const result = await UserHandler.changePhoto(id, new_photo);
        return res.json({result:{ success: true, output: result, message: "Successfully changed display picture", session: res.session}})
        
    }catch(error){
        // Catch Errors
        return res.status(404).json({result:{success:false, message: error,session: res.session}});
    }
}

UserEndpoint.post('/password/reset', resetPassword);
UserEndpoint.get('/', isAuthenticated, getAccounts);
UserEndpoint.post('/', [isAuthenticated,upload.single("image")], createAccount);
UserEndpoint.get('/all', isAuthenticated, getAllAccounts);
UserEndpoint.get('/search', isAuthenticated, searchUser);
UserEndpoint.get('/role/:role', isAuthenticated, getAccountsByRole);
UserEndpoint.get('/role/:role/search', searchUserByRole);
UserEndpoint.get('/:id', isAuthenticated, getProfileById);
UserEndpoint.patch('/:id/username', isAuthenticated, changeUsername);
UserEndpoint.patch('/:id/password', isAuthenticated, changePassword);
UserEndpoint.patch('/:id/email', isAuthenticated, changeEmail);
UserEndpoint.patch('/:id/number', isAuthenticated, changePhoneNumber);
UserEndpoint.patch('/:id/photo/', [isAuthenticated,upload.single("image")], changePhoto);
UserEndpoint.delete('/:id/:user_id', isAuthenticated, deleteAccount);

module.exports = UserEndpoint;