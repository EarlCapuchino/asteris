/* Login */
exports.INCORRECT_LOGIN = "Incorrect username or password"
exports.LOGIN_FAILED = "Login failed"

/* Authentication */
exports.SESSION_EXPIRED = "Session expired"
exports.AUTHENTICATION_FAILED = "Authentication failed"
exports.MISSING_TOKEN = "Missing token"
exports.INVALID_TOKEN = "Invalid token"
exports.TOKEN_EXPIRED = "Token expired"
exports.MISSING_USERNAME = "Missing 'username'";
exports.MISSING_PASSWORD = "Missing 'password'";
exports.MISSING_EMAIL = "Missing 'email'";
exports.MISSING_OTP = "Missing 'One Time Password (OTP)'";
exports.INVALID_OTP = "Invalid 'One Time Password (OTP)'";
exports.EXPIRED_OTP = "One Time Password (OTP) has already expired";
exports.SEND_OTP_FAILED = "Failed to send One Time Password (OTP)";

/* USER */

// Getting user/s
exports.GET_USER_FAILED = "Failed to get user account"
exports.USER_NOT_FOUND = "User not found"
exports.NO_USERS_FOUND = "No user accounts found"

// Errors
exports.USER_NOT_CREATED = "Failed to create user account"

// Deleting a user
exports.USER_DELETE_FAILED = "Failed to delete user account"

// Editing a user
exports.USER_EDIT_FAILED = "Failed to edit user account"
exports.USER_CHANGE_PHOTO_FAILED = "Failed to change display picture"
exports.CHANGE_UNAME_FAILED = "Failed to change username"
exports.CHANGE_PASSWD_FAILED = "Failed to change password"
exports.CHANGE_EMAIL_FAILED = "Failed to change email"
exports.CHANGE_PHONE_NUMBER_FAILED = "Failed to change phone number"

/* Log */
exports.LOG_NOT_ADDED = "Failed to add log"
exports.NO_LOGS_FOUND = "No logs to display"
exports.NO_LOGS_OF_USER = "No logs to display for this user"
exports.NO_LOGS_OF_ACTIVITY = "No logs to display for this activity"
exports.NO_LOGS_OF_DATE = "No logs to display for given date"

/* STUDENT */

// Getting student
exports.GET_COURSES_FAILED = "Failed to get courses"
exports.GET_TERMS_FAILED = "Failed to get terms"
exports.GET_RECORD_FAILED = "Failed to get student record"
exports.GET_STUDENT_FAILED = "Failed to get student"
exports.GET_STUDENTS_FAILED = "Failed to get all students"
exports.STUDENT_NOT_FOUND = "Student not found"
exports.NO_STUDENTS_FOUND = "No students found"
exports.NO_RESULTS_FOUND = "No results found"

// Adding a student
exports.ADD_STUDENT_FAILED = "Student not added"

// Warnings
exports.STUDENT_MISSING_INFO = "Student has missing information"
exports.INCORRECT_GWA = "Computed GWA does not match given GWA"
exports.INCORRECT_TOTAL_UNITS = "Computed total units does not match given total units"
exports.INCORRECT_CUMULATIVE_SUM = "Computed cumulative sum does not match given cumulative sum"

// Deleting a student
exports.STUDENT_DELETE_FAILED = "Failed to delete student"

// Editing the student info
exports.STUDENT_EDIT_FAILED = "Failed to edit student information"
exports.RECORD_EDIT_FAILED = "Failed to edit student record"

// Summary
exports.PRODUCE_SUMMARY_FAILED = "Failed to produce summary"
exports.NO_SUMMARY = "No students to display"
exports.NO_SUMMARY_DEGREE = "No students to display from this degree program"