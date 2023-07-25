// ComputationValidation.js
// counter check manual calculation from the user on records using backend computations
// iterate the computation from all courses and terms

const warning = require("../../../constants/warning"); //for warning prompts
const passing_grades = require("../../../constants/passing_grades"); //array of passing grades
const { v4: uuidv4 } = require("uuid");
const { Warning, Student } = require("../../../config/models");
let warnings = []; //an array containing all the possible warnings
let student_id;
const pass_grade = passing_grades.pass_grade;

function checkTotalUnits(record_data) {
  //check the total units computed
  //check if recorded total units is correct
  //A grade of 4, 5, INC, and DFG are not counted on the number of units acquired
  let failed_sub = [];
  const givenTotalUnit = record_data.total_units;
  let calculatedTotalUnit = 0;
  const term_data = record_data.term_data;
  for (var term in term_data) {
    for (var course in term_data[term].course_data) {
      let course_unit = Number(term_data[term].course_data[course].units);
      let course_code = term_data[term].course_data[course].course_code;
      let grade = term_data[term].course_data[course].grade;
      if (pass_grade.includes(grade)) {
        course_unit = isNaN(course_unit) ? 0 : course_unit;
        calculatedTotalUnit += course_unit;
      } else {
        failed_sub.push(
          //failed subjects are tagged here. Invalid grade input is also here
          `[${course_code.toUpperCase()} Grade:${grade} Unit:${course_unit}]`
        );
      } //only passing grades are computed
    }
  }
  if (givenTotalUnit != calculatedTotalUnit) {
    //counter check of unit from the record marches from the computed total unit from backend
    let message = "";
    if (failed_sub.length == 0) {
      message = `Incorrect total units. Recorded units: ${givenTotalUnit}. Computed total units: ${calculatedTotalUnit}.`;
    } else {
      message = `Incorrect total units. Recorded units: ${givenTotalUnit}. Computed total units: ${calculatedTotalUnit} Check the following failed subjects/wrong grades ${failed_sub}`;
    }
    warningCreator(
      student_id,
      {
        message: message,
      },
      uuidv4()
    );
  }
  return;
}

function checkCumulativeSumGwa(record_data) {
  //a grade of 5 is included in the computation
  let calculatedTotalUnit = 0;
  let calculatedCumulativeSum = 0;
  const term_data = record_data.term_data;
  const givenCumulativeSum = record_data.cumulative_sum;

  for (var term in term_data) {
    // If the term is 2s 19-20, do not include in computation of cumulative sum and GWA
    if (
      term_data[term].acad_year == "19/20" &&
      term_data[term].semester == "II"
    ) {
      continue;
    } else {
      for (var course in term_data[term].course_data) {
        let course_unit = Number(term_data[term].course_data[course].units);
        course_unit = isNaN(course_unit)
          ? Number(term_data[term].course_data[course].units[3])
          : course_unit;
        let grade = term_data[term].course_data[course].grade;
        if (!isNaN(grade)) {
          let weight = Number(course_unit * grade); //calculates weight
          calculatedTotalUnit += course_unit; //increments unit
          calculatedCumulativeSum += weight; //increments cumulative sum by weight
        }
      }
    }
  }

  if (calculatedCumulativeSum != givenCumulativeSum) {
    //counter check cumulative sum from the record and the backend computation
    warningCreator(
      student_id,
      {
        message: `Incorrect cumulative sum. Recorded cumulative sum: ${givenCumulativeSum}. Computed cumulative sum: ${calculatedCumulativeSum}`,
      },
      uuidv4()
    );
  }
  // Compute GWA
  let givenGWA = record_data.gwa.toFixed(4); //round to four decimal places
  let calculatedGWA = (calculatedCumulativeSum / calculatedTotalUnit).toFixed(
    4
  );
  //check if the computed and given gwa is equal
  if (givenGWA != calculatedGWA) {
    warningCreator(
      student_id,
      {
        message: `Incorrect GWA. Recorded GWA: ${givenGWA}. Computed GWA: ${calculatedGWA}`,
      },
      uuidv4()
    );
  }
  return;
}

function checkWeightCumulated(record_data) {
  //check if the computed and given values in cumulated column is correct
  let calculatedCumulativeSum = 0;
  const term_data = record_data.term_data;

  for (var term in term_data) {
    for (var course in term_data[term].course_data) {
      let course_code = term_data[term].course_data[course].course_code;
      let given_weight = term_data[term].course_data[course].weight;
      let course_unit = Number(term_data[term].course_data[course].units);
      course_unit = isNaN(course_unit)
        ? Number(term_data[term].course_data[course].units[3])
        : course_unit;
      let grade = term_data[term].course_data[course].grade;
      let cumulated = term_data[term].course_data[course].cumulated;
      let row_number = term_data[term].course_data[course].row_number;
      grade = isNaN(grade) ? 0 : grade; //if grade is NaN make it 0
      let weight = Number(course_unit * grade); //calculates weight
      if (given_weight != weight) {
        warningCreator(
          student_id,
          {
            term:
              "AY " +
              term_data[term].acad_year +
              " - Sem " +
              term_data[term].semester,
            course: course_code,
            message: `Incorrect weight value. Recorded: ${given_weight}. Calculated: ${weight}`,
            row_number: row_number,
          },
          uuidv4()
        );
      }
      let sem = term_data[term].semester;
      let acad_year = term_data[term].acad_year;
      if (sem === "II" && acad_year === "19/20") calculatedCumulativeSum += 0;
      else calculatedCumulativeSum += weight; //increments cumulative sum by weight
      if (calculatedCumulativeSum != cumulated) {
        warningCreator(
          student_id,
          {
            term:
              "AY " +
              term_data[term].acad_year +
              " - Sem " +
              term_data[term].semester,
            course: course_code,
            message: `Incorrect value in Enrolled column. Recorded: ${cumulated}, Calculated: ${calculatedCumulativeSum}`,
            row_number: row_number,
          },
          uuidv4()
        );
      }
      row_number++;
    }
  }
  return;
}

function warningCreator(student_id, warn_obj, warning_id) {
  //accepts student id, warning object, and warning id
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
exports.validateComputation = async (record_data, id) => {
  //accepts record id and student id, will call e/c function for calculation verification
  //will create warning obj for e/c record and student
  // will apeend details in the database
  warnings = [];
  student_id = id;

  checkTotalUnits(record_data);
  checkCumulativeSumGwa(record_data);
  checkWeightCumulated(record_data);

  if (warnings.length != 0) {
    // With warnings, return false
    const warning_data = warnings.map((x) => {
      return {
        warning_id: x.warning_id,
        student_id: x.student_id,
        warning_type: warning.COMPUTATION_WARNING,
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

    await Student.query() //update student
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
  await Student.query() //update warning
    .where({ student_id: student_id })
    .first()
    .update({ warning_count: 0 })
    .then(() => {
      return;
    });
  return true; // Without warning return true
};

exports.getComputationWarnings = async (student_id) => {
  //accept student id, returns the warning from that student
  return Warning.query()
    .where({ student_id, warning_type: warning.COMPUTATION_WARNING })
    .then(async (warnings) => {
      return warnings;
    });
};
