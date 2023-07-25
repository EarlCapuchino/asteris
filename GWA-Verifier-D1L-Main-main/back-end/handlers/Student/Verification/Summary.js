// Summary.js
// get students summary based on names, titles, and records
const { database } = require("../../../config/database");
const error = require("../../../constants/errors");
const StudentHandler = require("../StudentRecord/Student");

// Gets list of all summaries
exports.getSummary = async (orderBy) => {
  let order;
  // Check orderBy option
  if (orderBy && orderBy === "gwa") order = "gwa";
  else order = "last_name"; // Default

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
      "degree_program",
      "gwa",
      "latin_honor"
    )
    .where({ "student.isGraduating": true, isDeleted: false }) //  Only those who are qualified for graduation
    .orderBy(order, "asc")
    .orderBy("last_name")
    .orderBy("first_name")
    .then((students) => {
      // Check if list returned is empty
      if (students.length == 0) throw error.NO_SUMMARY;
      return students;
    });
};

// Gets list of all summaries from a certain degree
exports.getSummaryByDegree = async (degree, orderBy) => {
  let order;
  // Check orderBy option
  if (orderBy && orderBy === "gwa") order = "gwa";
  else order = "last_name"; // Default

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
      "degree_program",
      "gwa",
      "latin_honor"
    )
    .where({
      "student.isGraduating": true,
      "student.degree_program": degree,
      isDeleted: false,
    })
    .orderBy(order, "asc")
    .orderBy("last_name")
    .orderBy("first_name")
    .then((students) => {
      // Check if list returned is empty
      if (students.length == 0) throw error.NO_SUMMARY_DEGREE;
      return students;
    });
};

// Queries the list of summaries given a name
exports.searchSummary = async (name, orderBy) => {
  // Get list of all summaries
  let summaries = await this.getSummary(orderBy);
  let result = []; // Stores all matching results

  // Loop through all summaries
  for (const summary of summaries) {
    let fullName = summary.first_name + summary.last_name;
    fullName = fullName.toLowerCase();
    let toSearch = name.toLowerCase().split(" ");
    let valid = true;

    // Checks if every item of query can be found in full name
    for (let i = 0; i < toSearch.length; i++) {
      if (!fullName.includes(toSearch[i])) {
        valid = false;
      }
    }

    if (valid) result.push(summary);
  }
  if (result.length == 0) throw error.STUDENT_NOT_FOUND;
  return result;
};

// Queries the list of summaries given a name and degree
exports.searchSummaryByDegree = async (name, degree, orderBy) => {
  // Get list of all summaries
  let summaries = await this.getSummaryByDegree(degree, orderBy);
  let result = []; // Stores all matching results

  // Loop through all summaries
  for (const summary of summaries) {
    let fullName = summary.first_name + summary.last_name;
    fullName = fullName.toLowerCase();
    let toSearch = name.toLowerCase().split(" ");
    let valid = true;

    // Checks if every item of query can be found in full name
    for (let i = 0; i < toSearch.length; i++) {
      if (!fullName.includes(toSearch[i])) {
        valid = false;
      }
    }

    if (valid) result.push(summary);
  }
  if (result.length == 0) throw error.STUDENT_NOT_FOUND;
  return result;
};
