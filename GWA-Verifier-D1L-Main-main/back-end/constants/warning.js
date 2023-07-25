/* POST and PATCH method warnings */

/* Adding a student and creating a user */
exports.INCOMPLETE_FIELDS = "Please complete all fields";
exports.NULL_FNAME = "First name cannot be null";
exports.NULL_LNAME = "Last name cannot be null";
exports.NULL_UNAME = "Username cannot be null";
exports.NULL_PASSWD = "Password cannot be null";
exports.NULL_EMAIL = "Email cannot be null";
exports.NULL_DEGREE = "Degree program cannot be null";
exports.NULL_GWA = "GWA cannot be null";
exports.NULL_TOTAL_UNITS = "Total_units cannot be null";
exports.NULL_SUM = "Cumulative sum cannot be null";
exports.INVALID_USERNAME =
  "Invalid username: must start with a letter and without spaces";
exports.INVALID_PASSWORD =
  "Invalid password. It should be atleast 8 characters long containing atleast one uppercase letter, lowercase letter, and a number.";

/* Login */
exports.INCORRECT_PASSWORD = "Incorrect password";
exports.USER_NOT_EXIST = "User account does not exist";
exports.INCORRECT_CREDENTIALS = "The username or password is incorrect";
exports.MISSING_CREDENTIALS = "The username or password is missing";

/* Updating user details */
exports.INCORRECT_OLD_PASSWORD = "Incorrect old password";
exports.SAME_PASSWORD = "New password should differ from old password";
exports.PASSWORDS_NOT_MATCH = "Passwords do not match";
exports.USERNAME_EXISTS = "Username already exists";
exports.USERNAME_USED = "Username is already being used";
exports.USER_EXISTS = "User account already exists";

/* Warning types */
exports.FORMAT_WARNING = "Format";
exports.COMPUTATION_WARNING = "Computation";
exports.GRADUATION_WARNING = "Requirement";

/* Student */
exports.INCOMPLETE_STUDENT_DETAILS = "Please complete all student details";

/* Student record : format*/
exports.INCORRECT_GRADE_199_COURSE =
  "Incorrect recorded grade of 199 course: must only be S or U.";
exports.INCORRECT_UNIT_199_COURSE =
  "Incorrect recorded units of 199 course: must be 1.";
exports.INCORRECT_PE_UNITS = "Incorect PE/HK units: must be 0.";
exports.INCORRECT_PE_UNITS = "Incorect NSTP units: must be 0.";
exports.INCORRECT_GRADE = "There is an incorrect grade value recorded"; // 1.35 or neg values or below 1 or above 5
exports.INCORRECT_GRADE_P =
  "The grade of P is only applicable in the term II/19/20";
exports.MISSING_COURSE_CODE = "There is a missing value in Course No. column.";
exports.MISSING_GRADE = "There is a missing value in Grade column.";
exports.MISSING_UNITS = "There is a missing value in Units column.";
exports.MISSING_ENROLLED = "There is a missing value in Enrolled column."; // weight attribute in course entity
exports.MISSING_TERM = "There is a missing value in Term column."; // cumulated attribute in course entity
exports.MISSING_TERM_DETAILS = "Incomplete term details"; // Missing no_of_units or semester or acad_year

/*Graduation validation warnings*/
exports.LACK_OF_UNITS = "The acquired units is less than the required unit"; // acquired units < required units
exports.LACK_OF_PE_UNITS = "Student has lacking/failed units of PE/HK courses"; // has taken Hk but is lacking
exports.LACK_OF_NSTP_UNITS = "Student has lacking/failed units of NSTP courses"; //has taken NSTP but is lacking/fail

/*Computation validation warnings*/

exports.MISCALCULATED_TOTAL_UNIT =
  "The total units from the record does not match the computation";
exports.MISCALCULATED_CUMULATIVE_SUM =
  "The total cumulative sum does not match the computation";
exports.MISCALCULATED_GWA = "The total GWA does not match the calculation";
exports.MISCALCULATED_CUMULATED =
  "The cumulated from a course does not match the computation";
exports.MISCALCULATED_WEIGHT =
  "The recorded weight from a course does not match the computation";
