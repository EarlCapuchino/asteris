// Verification/index.js
// controller of the verification processes for every records/students appended onto the database
const { Warning } = require("../../../config/models");
const FormatHandler = require("./FormatValidation");
const ComputationHandler = require("./ComputationValidation");
const GraduationHandler = require("./GraduationVerification");
const HonorHandler = require("./LatinHonor");

exports.verifyStudentRecord = async (record, student_id) => {
  //calls format, computation, and graduation validation methods
  //prompts warnings
  // Reset student warnings
  await Warning.query()
    .where({ student_id })
    .del()
    .then((status) => {
      return status;
    });
  const format_status = await FormatHandler.validateFormat(record, student_id);
  if (format_status) {
    const computation_status = await ComputationHandler.validateComputation(
      record,
      student_id
    );
    if (computation_status) {
      const graduation_status = await GraduationHandler.verifyGraduation(
        record,
        student_id
      );
      if (graduation_status) {
        await HonorHandler.verifyLatinHonor(record, student_id);
      }
    }
  }
};

exports.getStudentWarnings = async (student_id) => {
  //get student warnings from the database
  return Warning.query()
    .where({ student_id: student_id })
    .orderBy("row_number", "asc")
    .then((warnings) => {
      return warnings;
    });
};
