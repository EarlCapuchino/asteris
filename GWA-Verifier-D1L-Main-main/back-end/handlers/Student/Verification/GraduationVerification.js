const warning = require("../../../constants/warning");
const { v4: uuidv4 } = require("uuid");
const { Warning, Student } = require("../../../config/models");
const { program } = require("../../../constants/degree_units");
// function calls for verification
let warnings = []; //an array containing all the possible warnings
//check if all required units are met

async function checkUnits(record, student_id) {
  //check if required units is met
  let degree = await Student.query()
    .where({ student_id })
    .first()
    .select("degree_program");
  degree = degree.degree_program;
  const required_unit = program[degree];
  const total_unit = record.total_units;
  if (total_unit >= required_unit) {
    return { valid: true };
  } else {
    return {
      valid: false,
      message: `Total units taken is ${total_unit} while the required unit is ${required_unit}`,
    };
  }
}

//checks if PE units are all satisfied (total of 4 PE/HK subjects per student)
function completePEunits(record) {
  const term_data = record.term_data;
  let PE_HK_count1 = 0; // HK11 or PE1
  let PE_HK_count2 = 0; // HK12/13 or PE2
  for (var term in term_data) {
    for (var course in term_data[term].course_data) {
      let course_code = term_data[term].course_data[course].course_code;
      let course_grade = term_data[term].course_data[course].grade;
      if (course_code.match(/^(HK)/) || course_code.match(/^(PE)/)) {
        if (course_grade <= 3 || course_grade === "P") {
          if (course_code.match(/(2)/) || course_code.match(/(3)/))
            // HK 12/ HK 13/ PE 2/
            PE_HK_count2++;
          else PE_HK_count1++;
        }
      }
    }
  }
  if (PE_HK_count2 >= 3 && PE_HK_count1 >= 1) {
    return { valid: true };
  } else {
    if (PE_HK_count1 == 0) {
      return { valid: false, message: `Student still needs to take HK11/PE1` };
    } else if (PE_HK_count2 < 3) {
      return {
        valid: false,
        message: `Student still needs to take ${
          3 - PE_HK_count2
        } HK12/HK13/PE2`,
      };
    }
  }
}

//check if all NSTP units are fulfilled (total of 2 for e/c student)
function completeNSTPunits(record) {
  const term_data = record.term_data;
  let NSTP_count = 0;
  for (var term in term_data) {
    for (var course in term_data[term].course_data) {
      let course_code = term_data[term].course_data[course].course_code;
      let course_grade = term_data[term].course_data[course].grade;
      if (course_code.includes("NSTP")) {
        if (course_grade <= 3 || course_grade === "P") {
          NSTP_count++;
        }
      }
    }
  }
  if (NSTP_count >= 2) {
    return { valid: true };
  } else if (NSTP_count == 1) {
    return {
      valid: false,
      message: "Student hasn't taken/passed NSTP 1/NSTP 2",
    };
  } else {
    return {
      valid: false,
      message: "Student hasn't taken/passed both NSTP 1 and 2",
    };
  }
}

function warningCreator(student_id, method, warning_id) {
  //creates warning array
  if (method.valid == false) {
    const alert = {
      warning_id,
      student_id,
      details: method.message,
    };
    warnings.push(alert); //pushing each alert onto the warnings
  }
}

exports.verifyGraduation = async (record, student_id) => {
  warnings = [];
  const verified_unit = await checkUnits(record, student_id),
    complete_PE_units = completePEunits(record),
    complete_NSTP_units = completeNSTPunits(record);

  const methods = [verified_unit, complete_PE_units, complete_NSTP_units];

  for (var method in methods) {
    warningCreator(student_id, methods[method], uuidv4());
  }
  if (warnings.length != 0) {
    // With warnings = Not graduating
    await Student.query()
      .where({ student_id: student_id })
      .first()
      .update({ isGraduating: false })
      .then(() => {
        return;
      });

    const warning_data = warnings.map((x) => {
      return {
        warning_id: x.warning_id,
        student_id: x.student_id,
        warning_type: warning.GRADUATION_WARNING,
        details: x.details,
      };
    });

    await Warning.query() //insert warning for the student
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
  } else {
    // No warnings = Graduating
    await Student.query()
      .where({ student_id: student_id })
      .first()
      .update({ isGraduating: true, warning_count: 0 })
      .then(() => {
        return;
      });
    return true;
  }
};

exports.getGraduationWarnings = async (student_id) => {
  //get graduation warnings of the student, to be displayed
  return Warning.query()
    .where({ student_id, warning_type: warning.GRADUATION_WARNING })
    .then(async (warnings) => {
      return warnings;
    });
};
