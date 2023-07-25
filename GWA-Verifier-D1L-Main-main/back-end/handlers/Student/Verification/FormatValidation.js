// FormatValidation.js
// check erroneous data from the record involving
// grade value and incorrect formatting

const warning = require("../../../constants/warning");
const { v4: uuidv4 } = require("uuid");
const { Warning, Student } = require("../../../config/models");
let warnings = []; //an array containing all the possible warnings
let student_id;

//checks if 199 courses have S or U rating, any numeric value will return false
function check199grade(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let row_number = term.course_data[course].row_number;
    if (course_code.includes("199")) {
      if (
        term.course_data[course].grade != "S" &&
        term.course_data[course].grade != "U"
      ) {
        warningCreator(
          student_id,
          {
            term: "AY " + term.acad_year + " - Sem " + term.semester,
            course: course_code,
            message: "Should only take S or U as grade value.",
            row_number: row_number,
          },
          uuidv4()
        );
      }
    }
    row_number++;
  }

  return { valid: true };
}

//incorrect 199 unit, all should be of unit 1
function check199unit(term) {
  //199 units should only be 1
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_unit = term.course_data[course].units;
    let row_number = term.course_data[course].row_number;
    if (course_code.includes("199")) {
      if (course_unit != 1) {
        warningCreator(
          student_id,
          {
            term: "AY " + term.acad_year + " - Sem " + term.semester,
            course: course_code,
            message: `Should only have 1 unit.`,
            row_number: row_number,
          },
          uuidv4()
        );
      }
    }
    row_number++;
  }
  return;
}

//incorrect PE/HK unit, should all be zero
function check_PE_unit(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_unit = term.course_data[course].units;
    let row_number = term.course_data[course].row_number;

    if (/^(HK)/.test(course_code) || /^(PE)/.test(course_code)) {
      if (course_unit != 0) {
        warningCreator(
          student_id,
          {
            term: "AY " + term.acad_year + " - Sem " + term.semester,
            course: course_code,
            message: `Should only have 0 unit`,
            row_number: row_number,
          },
          uuidv4()
        );
      }
    }
    row_number++;
  }
  return;
}

//incorrect NSTP unit, should all be zero
function check_NSTP_unit(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_unit = term.course_data[course].units;
    let row_number = term.course_data[course].row_number;
    if (course_code.includes("NSTP")) {
      if (course_unit != 0) {
        warningCreator(
          student_id,
          {
            term: "AY " + term.acad_year + " - Sem " + term.semester,
            course: course_code,
            message: `Should only have 0 unit.`,
            row_number: row_number,
          },
          uuidv4()
        );
      }
    }
    row_number++;
  }
  return;
}

//incorrect grade value 1.35 or negative values or  below 1 or above 5
function checkGradeValue(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_grade = term.course_data[course].grade;
    let row_number = term.course_data[course].row_number;
    // list of acceptable non-numeric grades
    if (
      course_grade === "S" ||
      course_grade === "U" ||
      course_grade === "DRP" ||
      course_grade === "DFG" ||
      course_grade === "INC" ||
      course_grade === "P"
    ) {
      return;
    }
    course_grade = Number(course_grade);
    if (
      //checks non  multiples of .25, greater than 3, and 4 or 5
      course_grade % 0.25 != 0 ||
      course_grade == 0 ||
      (course_grade < 1 && course_grade != 0) ||
      (course_grade > 3 && course_grade != 4 && course_grade != 5)
    ) {
      warningCreator(
        student_id,
        {
          term: "AY " + term.acad_year + " - Sem " + term.semester,
          course: course_code,
          message: `Invalid grade value`,
          row_number: row_number,
        },
        uuidv4()
      );
    }
    row_number++;
  }
  return;
}

//incorrect P grade, must only be on II/19/20
function checkPGrade(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_grade = term.course_data[course].grade;
    let row_number = term.course_data[course].row_number;
    if (course_grade == "P") {
      if (term.acad_year == "19/20") {
        if (term.semester == "I") {
          return false;
        }
      } else {
        warningCreator(
          student_id,
          {
            term: "AY " + term.acad_year + " - Sem " + term.semester,
            course: course_code,
            message: `Invalid grade. P grade is only valid for Sem II AY 19/20 `,
            row_number: row_number,
          },
          uuidv4()
        );
      }
    }
    row_number++;
  }
  return;
}

//missing course no. column
function checkCourseCode(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let row_number = term.course_data[course].row_number;
    if (course_code === "" || course_code == null) {
      warningCreator(
        student_id,
        {
          term: "AY " + term.acad_year + " - Sem " + term.semester,
          course: null,
          message: `Missing course code`,
          row_number: row_number,
        },
        uuidv4()
      );
    }
    row_number++;
  }
  return;
}

//missing grade column
function checkCourseGrade(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_grade = term.course_data[course].grade;
    let row_number = term.course_data[course].row_number;
    if (course_grade === "" || course_grade == null) {
      warningCreator(
        student_id,
        {
          term: "AY " + term.acad_year + " - Sem " + term.semester,
          course: course_code,
          message: `Missing grade value`,
          row_number: row_number,
        },
        uuidv4()
      );
    }
    row_number++;
  }
  return;
}

//missing units column
function checkCourseUnit(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let course_unit = term.course_data[course].units;
    let row_number = term.course_data[course].row_number;
    let valid_units = ["1", "2", "3", "4", "5", "6", "7"];

    if (course_unit === "" || course_unit == null) {
      // Case of null units
      warningCreator(
        student_id,
        {
          term: "AY " + term.acad_year + " - Sem " + term.semester,
          course: course_code,
          message: `Missing value for units`,
          row_number: row_number,
        },
        uuidv4()
      );
    } else {
      if (
        !course_code.includes("HK") &&
        !course_code.includes("PE") &&
        !course_code.includes("NSTP")
      ) {
        // HK, PE, and NSTP subjects
        if (!valid_units.includes(course_unit)) {
          warningCreator(
            student_id,
            {
              term: "AY " + term.acad_year + " - Sem " + term.semester,
              course: course_code,
              message: `Invalid number of units: cannot be ${course_unit}`,
              row_number: row_number,
            },
            uuidv4()
          );
        }
      }
    }
    row_number++;
  }
  return;
}

//missing value in enrolled column
//missing value in term column
function checkTerm(term) {
  if (term.acad_year == null || term.acad_year === "") {
    warningCreator(
      student_id,
      {
        term: null,
        course: null,
        message: `Term has missing acad year`,
      },
      uuidv4()
    );
  } else if (term.semester == null || term.semester === "") {
    warningCreator(
      student_id,
      {
        term: "AY " + term.acad_year,
        course: null,
        message: `Term has missing semester value`,
      },
      uuidv4()
    );
  } else if (term.no_of_units == null || term.no_of_units === "") {
    warningCreator(
      student_id,
      {
        term: "AY " + term.acad_year + " - Sem " + term.semester,
        course: null,
        message: `Term has missing value in total units.`,
      },
      uuidv4()
    );
  }
  return;
}

//checks if S or U is only for those subjects that are in 199 and 200 series
function checkSandUgrade(term) {
  for (var course in term.course_data) {
    let course_code = term.course_data[course].course_code;
    let grade = term.course_data[course].grade;
    let row_number = term.course_data[course].row_number;
    if (!course_code.includes("199") && !course_code.includes("200")) {
      //subjects that are not 199 or 200 series
      if (grade == "S" || grade == "U") {
        warningCreator(
          student_id,
          {
            term: "AY " + term.acad_year + " - Sem " + term.semester,
            course: course_code,
            message: `S or U grade value. S or U should only be taken by 199 and 200 series`,
            row_number: row_number,
          },
          uuidv4()
        );
      }
    }
    row_number++;
  }

  return;
}

function warningCreator(student_id, warn_obj, warning_id) {
  //creates warning obj
  const alert = {
    warning_id,
    student_id,
    term: warn_obj.term,
    course: warn_obj.course,
    details: warn_obj.message,
    row_number: warn_obj.row_number,
  };
  warnings.push(alert); //pushing each alert onto the warnings
}

exports.validateFormat = async (record, id) => {
  //performs validation format of the record, iterated through all the method and returns warnings if any is detected
  warnings = [];
  student_id = id;
  const terms = record.term_data;
  terms.forEach((term) => {
    checkTerm(term);
    checkCourseUnit(term);
    checkCourseGrade(term);
    checkCourseCode(term);
    checkPGrade(term);
    checkGradeValue(term);
    check_NSTP_unit(term);
    check_PE_unit(term);
    check199unit(term);
    check199grade(term);
    checkSandUgrade(term);
  });

  if (warnings.length != 0) {
    // With warnings, return false
    const warning_data = warnings.map((x) => {
      return {
        warning_id: x.warning_id,
        student_id: x.student_id,
        warning_type: warning.FORMAT_WARNING,
        term: x.term,
        course: x.course,
        details: x.details,
        row_number: x.row_number,
      };
    });
    await Warning.query() //insert warning
      .insertGraph(warning_data)
      .then((warning_data) => {
        return warning_data;
      });

    await Student.query() //update student status
      .where({ student_id: student_id })
      .first()
      .update({
        isGraduating: false,
        latin_honor: "",
        warning_count: warnings.length,
      })
      .then(() => {
        return;
      });

    return false;
  }
  await Student.query() //update student warning
    .where({ student_id: student_id })
    .first()
    .update({ warning_count: 0 })
    .then(() => {
      return;
    });
  return true; // Without warning return true
};

exports.getFormatWarnings = async (student_id) => {
  //returns format warning from each student
  return Warning.query()
    .where({ student_id, warning_type: warning.FORMAT_WARNING })
    .then(async (warnings) => {
      return warnings;
    });
};
