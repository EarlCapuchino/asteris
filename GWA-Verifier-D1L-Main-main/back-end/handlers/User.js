const bcrypt = require('bcrypt'); // For encryption of password in the database
const { v4: uuidv4 } = require('uuid');
const { User } = require('../config/models.js')
const error = require('../constants/errors')
const warning = require('../constants/warning');

// Returns list of all user accounts
exports.getAccounts = async () => {

    return User.query()
    .where({isDeleted:false})
    .where('user_role','!=','CHAIR/HEAD')
    .orderBy('last_name', 'asc')
    .orderBy('first_name')
    .then(users => {
        if (users.length == 0)  throw (error.NO_USERS_FOUND)
        return users 
    })
}

// Returns list of all user accounts, including deleted accounts
exports.getAllAccounts = async () => {

    return User.query()
    .orderBy('last_name', 'asc')
    .orderBy('first_name')
    .then(users => {
        if (users.length == 0)  throw (error.NO_USERS_FOUND)
        return users 
    })
}

// Returns user details based on the username
exports.getUserbyUsername = async (username) => {
    let user = await User.query()
    .where({ 'username': username, 'isDeleted': false })
    .then(res => { return res[0] })
    .catch(err => { throw(err) })

    if (!user) throw(error.USER_NOT_FOUND);

    // Omit unnecessary fields
    delete user.isDeleted;
    delete user.password;    

    return user;
}

// Returns list of all user accounts based on a given role
exports.getAccountsByRole = async (role) => {
    return User.query()
    .where({isDeleted:false, user_role:role})
    .orderBy('last_name', 'asc')
    .orderBy('first_name')
    .then(users => {
        if (users.length == 0)  throw (error.NO_USERS_FOUND)
        return users 
    })
}

// Check if email exists
checkExistingEmail = async(new_email) => {
    return User.query()
    .where({ email : new_email,isDeleted:false})
    .first()
    .then(user => {
        if(user) throw("Email address is already being used")
    })
}

// Check if username exists
checkExistingUsername = async(new_username) => {
    // Check if username is already being used
    return User.query()
    .where({username: new_username, isDeleted:false})
    .first()   // First user in list
    .then(user => { 
        if(user) throw(warning.USERNAME_USED)
    })
}

// Check if mobile number exists
checkExistingNumber = async(new_number) => {
    return User.query()
    .where({ phone_number : new_number,isDeleted:false})
    .first()
    .then(user => {
        if(user) throw("Phone number is already being used")
    })
}

// Create new user account
exports.createAccount = async (userDetails) => {
    // Check first if email and username already exists
    await checkExistingEmail(userDetails.email)
    await checkExistingUsername(userDetails.username)

    let dp;
    if(!userDetails.display_picture || userDetails.display_picture == "")
        dp = "dp_default.jpg"
    else dp = userDetails.display_picture
    const hash = await bcrypt.hash(userDetails.password, 10)
    const id = uuidv4()
    const new_user = {
        user_id: id,
        first_name: userDetails.first_name.toUpperCase(),
        last_name: userDetails.last_name.toUpperCase(),
        user_role: userDetails.user_role.toUpperCase(),
        username: userDetails.username,
        password: hash,
        email: userDetails.email,
        phone_number: userDetails.phone_number,
        display_picture: dp,
        isDeleted: false
    }
    
    return User.query().insert(new_user)
    .then((user) => { 
        if(!user) throw (error.USER_NOT_CREATED)
        return this.getProfileById(id);
    })
}

// Delete a user account
exports.deleteAccount = async (id) => {
    // Check if user account exists
    const user = await this.getProfileById(id);

    // Delete User
    return User.query()
    .where({ user_id: id })
    .update({isDeleted: true})
    .then(status => { 
        if(!status) throw(error.USER_DELETE_FAILED)
        return user;
    })
}

// Returns a single user profile
exports.getProfileById = async (user_id) => {
    return User.query()
    .where({'user_id': user_id})
    .first()
    .then(user => { 
      if (!user) throw(error.USER_NOT_FOUND);
      return user;
    })  
}

// Updates a user username
exports.changeUsername = async (id, password,new_username) => {
    // Check first if user exists
    await this.getProfileById(id)

    //check if existing email
    await checkExistingUsername(new_username)

    // Get old hashed password
    checkPassword = await User.query()
    .where({user_id: id, isDeleted:false})
    .first()
    .then(user => {
        if (!user) throw(error.USER_NOT_EXIST)
        return user.password
    })

    // Check if password is correct
    correctPass = await bcrypt.compare(password, checkPassword)
    if(!correctPass) throw(warning.INCORRECT_PASSWORD)

    // Proceed to editing
    return User.query()
    .where({user_id: id})
    .update( {username: new_username })
    .then( status => { 
        if(!status) throw(error.CHANGE_UNAME_FAILED)
        return true
    })
}

// Resets user password
exports.resetPassword = async (email, newPassword) => {
    const db_user = await User.query()
    .where({ email: email, isDeleted: false })
    .then(user => { return user[0] })

    if (!db_user) throw(error.USER_NOT_FOUND);

    const hash = await bcrypt.hash(newPassword, 10)

    await User.query()
    .where({ user_id: db_user.user_id })
    .update({ password: hash })
    .then( status => { 
        if(!status) throw(error.CHANGE_PASSWD_FAILED);
        return true;
    })

    return db_user;
}


// Updates user password
exports.changePassword = async (id, oldPassword, newPassword) => {
    // Check first if user exists
    await this.getProfileById(id)

    if(oldPassword===newPassword) throw(warning.SAME_PASSWORD)
    const hash = await bcrypt.hash(newPassword, 10)

    // Get old hashed password
    checkPassword = await User.query()
    .where({user_id: id, isDeleted:false})
    .first()
    .then(user => {
        if (!user) throw(error.USER_NOT_EXIST)
        return user.password
    })

    // Check if oldPassword is correct
    correctOldPass = await bcrypt.compare(oldPassword, checkPassword)
    if(!correctOldPass) throw(warning.INCORRECT_OLD_PASSWORD)

    // Proceed to editing
    return User.query()
    .where({user_id: id})
    .first()  // First user in list
    .update({password: hash})
    .then(status => { 
        if(!status) throw(error.CHANGE_PASSWD_FAILED)
        return status 
    })
}

// Updates user email
exports.changeEmail = async (id, password, new_email) => {
    // Check first if user exists
    await this.getProfileById(id)

    //check if existing email
    await checkExistingEmail(new_email)

    // Get old hashed password
    checkPassword = await User.query()
    .where({user_id: id, isDeleted:false})
    .first()
    .then(user => {
        if (!user) throw(error.USER_NOT_EXIST)
        return user.password
    })

    // Check if password is correct
    correctPass = await bcrypt.compare(password, checkPassword)
    if(!correctPass) throw(warning.INCORRECT_PASSWORD)
    // Proceed to editing
    return User.query()
    .where({user_id: id})
    .first()  // First user in list
    .update({email: new_email})
    .then(status => { 
        if(!status) throw(error.CHANGE_EMAIL_FAILED)
        return status 
    })
}

// Updates user phone number
exports.changePhoneNumber = async (id, password, new_number) => {
    // Check first if user exists
    await this.getProfileById(id)

    //check if existing email
    await checkExistingNumber(new_number)

    // Get old hashed password
    checkPassword = await User.query()
    .where({user_id: id, isDeleted:false})
    .first()
    .then(user => {
        if (!user) throw(error.USER_NOT_EXIST)
        return user.password
    })

    // Check if password is correct
    correctPass = await bcrypt.compare(password, checkPassword)
    if(!correctPass) throw(warning.INCORRECT_PASSWORD)

    // Proceed to editing
    return User.query()
    .where({user_id: id})
    .first()  // First user in list
    .update({phone_number: new_number})
    .then(status => { 
        if(!status) throw(error.CHANGE_PHONE_NUMBER_FAILED)
        return status 
    })
}

// Search for a user by name
exports.searchUser = async(name) => {
    let result = [] // Stores all matching results

    const users = await this.getAccounts()
        // Loop through all users
    for (const user of users){
        let fullName = (user.first_name + user.last_name).toLowerCase();
        let toSearch = name.toLowerCase().split(" ");
        let valid = true;

        // Checks if every item of query can be found in full name
        for (let i = 0; i < toSearch.length; i++){
            if (!fullName.includes(toSearch[i])){
            valid = false;
            }
        }

        if (valid) result.push(user)
    }
    if (result.length == 0) throw(error.USER_NOT_FOUND)
    return result;
}

// Search for a user by name in a role
exports.searchUserByRole = async(name,role) => {
    let result = [] // Stores all matching results

    const users = await this.getAccountsByRole(role)
        // Loop through all users
    for (const user of users){
        let fullName = (user.first_name + user.last_name).toLowerCase();
        let toSearch = name.toLowerCase().split(" ");
        let valid = true;

        // Checks if every item of query can be found in full name
        for (let i = 0; i < toSearch.length; i++){
            if (!fullName.includes(toSearch[i])){
            valid = false;
            }
        }
        if (valid) result.push(user)
    }
    if (result.length == 0) throw(error.USER_NOT_FOUND)
    return result;
}

// Update profile photo
exports.changePhoto = async(id,new_photo) => {
    return User.query()
    .where({user_id: id})
    .first()  // First user in list
    .update({display_picture: new_photo})
    .then(status => { 
        if(!status) throw("Failed to change display photo")
        return this.getProfileById(id);
    })
}