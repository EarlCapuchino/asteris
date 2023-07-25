// Student.js
// add, read, delete, and update student entitiesfrom the database

const { Student } = require("../../../config/models");
const { database } = require("../../../config/database");
const { v4: uuidv4 } = require("uuid");
const error = require("../../../constants/errors");
const RecordHandler = require("./Record");
const TermHandler = require("./Term");
const CourseHandler = require("./Course");
const VerificationHandler = require("../Verification/index");

// Gets list of all students
exports.getAllStudents = async () => {
  return Student.query()
    .orderBy("last_name")
    .orderBy("first_name")
    .orderBy("middle_name")
    .orderBy("suffix")
    .then((students) => {
      // Check if list returned is empty
      if (students == 0) throw error.NO_STUDENTS_FOUND;
      return students;
    });
};

//different from getALlStudents, return all UNDELETED tudents from the database
exports.getStudents = async () => {
  return Student.query()
    .where({ isDeleted: false })
    .then(async (students) => {
      // Check if list returned is empty
      if (students == 0) throw error.NO_STUDENTS_FOUND;
      students.forEach(async (student) => {
        let warnings = await VerificationHandler.getStudentWarnings(
          student.student_id
        );
        await Student.query()
          .where({ student_id: student.student_id })
          .first()
          .update({ warning_count: warnings.length })
          .then((status) => {
            return status;
          });
      });
      return Student.query()
        .where({ isDeleted: false })
        .orderBy("last_name")
        .orderBy("first_name")
        .orderBy("middle_name")
        .orderBy("suffix")
        .then((students) => {
          return students;
        });
    });
};

exports.getStudentById = async (id) => {
  //accepts student id and return the student itself
  return Student.query()
    .where({ student_id: id })
    .first()
    .then(async (record) => {
      // Check if the student exists
      if (!record) throw error.STUDENT_NOT_FOUND;
      record["record_data"] = await RecordHandler.getRecord(id);
      return {
        record,
        warnings: await VerificationHandler.getStudentWarnings(id), //returns warning accumulated
      };
    });
};

const checkDuplicate = async (student_data) => {
  //check duplicate student records to avoid double entry of same information
  return Student.query()
    .where({
      first_name: student_data.first_name.toUpperCase(),
      middle_name: student_data.middle_name.toUpperCase(),
      last_name: student_data.last_name.toUpperCase(),
      suffix: student_data.suffix.toUpperCase(),
      degree_program: student_data.degree_program,
      student_number: student_data.student_number,
      isDeleted: false,
    })
    .first()
    .then((student) => {
      if (student) throw "Failed to add student. Student already exists."; //returns prompt for duplicate entry warnings
      return true;
    });
};

exports.addStudent = async (student_data, record_data) => {
  //accepts student data and record data, returns the student itself
  await checkDuplicate(student_data); //checks duplicate entry
  let student_id = uuidv4();
  const new_student = {
    student_id,
    last_name: student_data.last_name.toUpperCase(),
    first_name: student_data.first_name.toUpperCase(),
    middle_name: student_data.middle_name.toUpperCase(),
    suffix: student_data.suffix.toUpperCase(),
    student_number: student_data.student_number,
    degree_program: student_data.degree_program,
    isGraduating: false,
    latin_honor: "", //no value by default, to be verified by the system
    isDeleted: false,
    warning_count: 0,
  };

  return Student.query() //inserting student onto the database
    .insert(new_student)
    .then(async (student) => {
      if (!student) throw error.ADD_STUDENT_FAILED;
      let record = await RecordHandler.addRecord(record_data, student_id);
      await VerificationHandler.verifyStudentRecord(record, student_id);
      return this.getStudentById(student_id);
    });
};

editCredential = async (new_details, student_id) => {
  //accepts new details and student id, then returns databasw query if successful
  return Student.query()
    .where({ student_id: student_id })
    .first()
    .update({
      //updating the student
      first_name: new_details.first_name.toUpperCase(),
      middle_name: new_details.middle_name.toUpperCase(),
      last_name: new_details.last_name.toUpperCase(),
      suffix: new_details.suffix.toUpperCase(),
      degree_program: new_details.degree_program,
      student_number: new_details.student_number,
    })
    .then((status) => {
      if (!status) throw "Failed to update student info";
      return new_details;
    });
};

exports.editStudent = async (updatedStudent, student_id) => {
  //updates the student records
  //accepts new student record and student id
  // contains new course, terms, record, and details
  const new_courses = updatedStudent.new_courses;
  const new_terms = updatedStudent.new_terms;
  const new_record = updatedStudent.new_record;
  const new_details = updatedStudent.new_details;
  // Edit student info
  try {
    await editCredential(new_details, student_id);
  } catch (err) {
    console.log(err);
    throw err;
  }
  // Edit courses
  try {
    new_courses.forEach(async (course) => {
      await CourseHandler.editCourse(course);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  // Edit Terms
  try {
    new_terms.forEach(async (term) => {
      await TermHandler.editTerm(term);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  // Edit Record
  try {
    await RecordHandler.editRecord(new_record);
  } catch (err) {
    console.log(err);
    throw err;
  }
  // Update warnings
  let record = await RecordHandler.getRecord(student_id);
  await VerificationHandler.verifyStudentRecord(record, student_id);
  return this.getStudentById(student_id);
};

exports.deleteStudent = async (student_id) => {
  // delete a student using id
  // Check if student exists
  await this.getStudentById(student_id);

  return Student.query()
    .where({ student_id: student_id })
    .update({ isDeleted: true })
    .then((status) => {
      if (!status) throw error.STUDENT_DELETE_FAILED;

      return Student.query().first().where({ student_id }); // return deleted student
    });
};

exports.deleteStudentMany = async (students_to_delete) => {
  //multiple deletion of students
  let deleted_students = [];
  for (let i = 0; i < students_to_delete.length; i++) {
    deleted_students.push(await this.deleteStudent(students_to_delete[i])); //array of students
  }
  return deleted_students; //return for prompt
};

exports.searchStudent = async (query) => {
  // Search by name
  if (query.type === "name") {
    let students = await this.getStudents();
    let result = []; // Stores all matching results

    // Loop through all students
    for (const student of students) {
      let fullName =
        student.first_name +
        student.middle_name +
        student.last_name +
        student.suffix;
      fullName = fullName.toLowerCase();
      let toSearch = query.name.toLowerCase().split(" ");
      let valid = true;

      // Checks if every item of query can be found in full name
      for (let i = 0; i < toSearch.length; i++) {
        if (!fullName.includes(toSearch[i])) {
          valid = false;
        }
      }

      if (valid) result.push(student);
    }
    if (result.length == 0) throw error.STUDENT_NOT_FOUND;
    return result;
  }

  // Search by student number (exact)
  else {
    return Student.query()
      .where({ student_number: query.student_number })
      .where({ isDeleted: false })
      .first()
      .then((student) => {
        // Check if the student exists
        if (!student) throw error.STUDENT_NOT_FOUND;
        return student;
      });
  }
};

exports.getStudentsByDegree = async (degree) => {
  //get student using degree
  return database("student")
    .join("student_record", {
      "student.student_id": "student_record.student_id",
    })
    .select(
      "student.student_id",
      "last_name",
      "first_name",
      "middle_name",
      "suffix",
      "student_number",
      "degree_program",
      "gwa",
      "latin_honor"
    )
    .where({ "student.degree_program": degree, "student.isDeleted": false })
    .orderBy("last_name")
    .orderBy("first_name")
    .then((students) => {
      // Check if list returned is empty
      if (students == 0) throw error.NO_STUDENTS_FOUND;
      return students;
    });
};

exports.searchStudentsByDegree = async (query, degree) => {
  // Search by name
  if (query.type === "name") {
    let students = await this.getStudentsByDegree(degree);
    let result = []; // Stores all matching results

    // Loop through all students
    for (const student of students) {
      let fullName =
        student.first_name +
        student.middle_name +
        student.last_name +
        student.suffix;
      fullName = fullName.toLowerCase();
      let toSearch = query.name.toLowerCase().split(" ");
      let valid = true;

      // Checks if every item of query can be found in full name
      for (let i = 0; i < toSearch.length; i++) {
        if (!fullName.includes(toSearch[i])) {
          valid = false;
        }
      }

      if (valid) result.push(student);
    }
    if (result.length == 0) throw error.STUDENT_NOT_FOUND;
    return result;
  }

  // Search by student number (exact)
  else {
    return Student.query()
      .where({ student_number: query.student_number })
      .where({ isDeleted: false })
      .first()
      .then((student) => {
        // Check if the student exists
        if (!student) throw error.STUDENT_NOT_FOUND;
        return student;
      });
  }
};
