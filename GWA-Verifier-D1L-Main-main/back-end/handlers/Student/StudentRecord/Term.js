// Term.js
// Check e/c term from the records of students

const { Term } = require("../../../config/models");
const CourseHandler = require("./Course");
const { v4: uuidv4 } = require("uuid");

exports.addTerms = async (term_data, record_id) => {
  //accepts term data and record id, returns database query for inserting term onto the database
  const terms = [];
  let term_gpa;

  term_data.forEach(async (term) => {
    let term_id = uuidv4();
    term_gpa = parseFloat((term.total_weights / term.no_of_units).toFixed(4)); //truncated into 4 decimal places
    if (isNaN(term_gpa)) term_gpa = 0;
    let newTerm = {
      term_id: term_id,
      record_id: record_id,
      acad_year: term.acad_year,
      semester: term.semester,
      no_of_units: term.no_of_units,
      total_weights: term.total_weights,
      gpa: term_gpa,
    };
    await Term.query() //insert term
      .insert(newTerm)
      .then(async () => {
        await CourseHandler.addCourses(term.course_data, term_id);
        terms.push(newTerm);
      })
      .catch((err) => {
        throw err;
      });
  });
  return terms;
};

exports.getTerms = async (record_id) => {
  //using record id, return term data from the database
  return Term.query()
    .where({ record_id: record_id })
    .orderBy("acad_year", "asc")
    .orderBy("semester", "asc")
    .then(async (terms) => {
      // Add a key value pair 'course_data': <courses of that term>
      for (let i = 0; i < terms.length; i++) {
        terms[i]["course_data"] = await CourseHandler.getCourses(
          terms[i].term_id
        );
      }
      return terms;
    })
    .catch((err) => {
      throw err;
    });
};

getTermById = async (id) => {
  //using term id, return terms
  return Term.query()
    .where({ term_id: id })
    .first()
    .then((term) => {
      return term;
    })
    .catch((err) => {
      throw err;
    });
};

exports.editTerm = async (newTerm) => {
  //accpets new term data containing the id, returns database query for editing the term data
  const term = await getTermById(newTerm.term_id);

  // Check if there are changes before proceeding
  if (
    term.total_weights != newTerm.total_weights ||
    term.no_of_units != newTerm.no_of_units
  ) {
    // Proceed to editing
    return Term.query()
      .where({ term_id: newTerm.term_id })
      .first()
      .update({
        total_weights: Number(newTerm.total_weights),
        no_of_units: Number(newTerm.no_of_units),
        gpa: Number(newTerm.gpa),
      })
      .then((status) => {
        if (!status)
          throw (
            ("Failed to update term:", term.semester + "/" + term.acad_year)
          );
        return newTerm;
      });
  }
};

exports.getLatestTerm = async () => {
  //getting the most recent term from the record
  return Term.query()
    .select("acad_year", "semester")
    .first()
    .orderBy("acad_year", "desc")
    .orderBy("semester", "desc")
    .then((result) => {
      if (!result) throw "No terms saved";
      return result;
    });
};
