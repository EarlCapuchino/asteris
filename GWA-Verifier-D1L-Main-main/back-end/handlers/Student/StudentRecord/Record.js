// Record.js
// accepts and manipulates records data for database configuration

const { Record } = require("../../../config/models.js");
const TermHandler = require("./Term.js"); //to validate e/c terms in the records
const { v4: uuidv4 } = require("uuid");

exports.addRecord = async (record_data, student_id) => {
  let rec_id = uuidv4();
  const newRecord = {
    record_id: rec_id /*UUID*/,
    student_id: student_id /*UUID*/,
    gwa: record_data.gwa, //overall GWA in the record
    total_units: record_data.total_units,
    cumulative_sum: record_data.cumulative_sum, //accumulated weights from e/c courses
  };

  return Record.query() //to insert new record onto the database
    .insert(newRecord)
    .then(async (newRecord) => {
      await TermHandler.addTerms(record_data.term_data, rec_id);
      return this.getRecord(student_id); //returns the student
    })
    .catch((err) => {
      throw err;
    });
};

exports.getRecord = async (student_id) => {
  //using student id, get existing records and return it for display and reading
  return Record.query()
    .where({ student_id: student_id })
    .first()
    .then(async (record) => {
      if (!record) throw "Record not found";
      // Add a key value pair 'term_data': <terms of that student record>
      record["term_data"] = await TermHandler.getTerms(record.record_id);
      return record;
    })
    .catch((err) => {
      throw err;
    });
};

getRecordById = async (id) => {
  //get id then return the record, different from getRecord
  //accepts the record id itself then returns the record
  return Record.query()
    .where({ record_id: id })
    .first()
    .then((record) => {
      return record;
    })
    .catch((err) => {
      throw err;
    });
};

exports.editRecord = async (newRecord) => {
  //accept newly edited record then overwrites/updates existing ones
  const record = await getRecordById(newRecord.record_id);
  // Check if there are changes before proceeding
  if (
    record.cumulative_sum != Number(newRecord.cumulative_sum) ||
    record.total_units != Number(newRecord.total_units) ||
    record.gwa != Number(newRecord.gwa)
  ) {
    // Proceed to editing
    return Record.query()
      .where({ record_id: newRecord.record_id })
      .first()
      .update({
        //updating methods - check cumulative sum, total units, then GWA of the record
        cumulative_sum: Number(newRecord.cumulative_sum),
        total_units: Number(newRecord.total_units),
        gwa: Number(newRecord.gwa),
      })
      .then((status) => {
        if (!status) throw "Failed to update record";
        return status;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return true;
};
