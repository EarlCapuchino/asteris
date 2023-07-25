const StudentEndpoint = require("express").Router();
const StudentHandler = require("../handlers/Student/StudentRecord/Student");
const TermHandler = require("../handlers/Student/StudentRecord/Term");
const SummaryHandler = require("../handlers/Student/Verification/Summary");
const LogHandler = require("../handlers/Log");
const success = require("../constants/success");
const activity = require("../constants/activities");
const { isAuthenticated } = require("../middlewares/Auth");
const student_entity = "Student";


// Function For Get All Students Endpoint
const getAllStudents = async (req, res) => {
  try {
    // Call Handler
    const students = await StudentHandler.getAllStudents();
    return res.json({
      result: {
        success: true,
        output: students,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};


// Function For Get Students Endpoint
const getStudents = async (req, res) => {
  try {
    // Call Handler
    const students = await StudentHandler.getStudents();
    return res.json({
      result: {
        success: true,
        output: students,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};

// Function For Get Students By ID Endpoint
const getStudentById = async (req, res) => {
  try {
    // Get id parameter from request
    const { id } = req.params;

    // Call Handler
    const student = await StudentHandler.getStudentById(id);
    return res.json({
      result: {
        success: true,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      success: false,
      message: error,
      session: res.session,
    });
  }
};

const addStudent = async (req, res) => {
  try {
    // Get Details From Request Body
    const { student_data, record_data, user_id } = req.body;

    const student = await StudentHandler.addStudent(student_data, record_data);

    // Manage Log
    const log_data = {
      user_id: user_id,
      subject_id: student.record.student_id,
      subject_entity: student_entity,
      activity_type: activity.ADDED_RECORD,
    };
    await LogHandler.addLog(log_data);

    // Return Results
    return res.json({
      result: {
        success: true,
        message: success.ADD_STUDENT_SUCCESS,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};


// Function For Delete Student Endpoint
const deleteStudent = async (req, res) => {
  try {
    // Get Details From Request Body and Params
    const { id, user_id } = req.params;
    const {details} = req.body
    
    // Call Handler
    await StudentHandler.deleteStudent(id);

    // Manage Log
    const log_data = {
      user_id: user_id,
      subject_id: id,
      subject_entity: student_entity,
      activity_type: activity.DELETED_RECORD,
      details: details
    };
    await LogHandler.addLog(log_data);

    // Return Results
    return res.json({
      result: {
        success: true,
        message: success.STUDENT_DELETE_SUCESS,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(400).json({
      result: { success: false, message: error, session: res.session },
    });
  }
};


// Function For Delete Many Students Endpoint
const deleteStudentMany = async (req, res) => {
  try {
    // Get Details From Request Body and Params
    const { user_id } = req.params;
    const {students_to_delete,details} = req.body;

    const deleted_students = await StudentHandler.deleteStudentMany(students_to_delete);

    // Manage Log For Each Student
    students_to_delete.forEach(async student => {
      let log_data = {
        user_id: user_id,
        subject_id: student,
        subject_entity: student_entity,
        activity_type: activity.DELETED_RECORD,
        details: details
      };
      await LogHandler.addLog(log_data);
    });

    return res.json({
      result: {
        success: true,
        message: success.MULTIPLE_STUDENT_DELETE_SUCESS,
        output: deleted_students,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(400).json({
      result: { success: false, message: error, session: res.session },
    });
  }
};

// Function For Edit Student Endpoint
const editStudent = async (req, res) => {
  try {
    // Get Details From Request Body and Params
    const { id } = req.params;
    const { user_id, updatedStudent, details } = req.body;

    // Handle Null Values
    if (!user_id) {
      throw "Missing user_id.";
    }
    if (!updatedStudent) {
      throw "Missing updated student.";
    }
    if (!details) {
      throw "Missing 'edit details'.";
    }

    const student = await StudentHandler.editStudent(updatedStudent, id);

    // Manage Log
    const log_data = {
      user_id: user_id,
      subject_id: id,
      subject_entity: student_entity,
      activity_type: activity.EDITED_RECORD,
      details: details,
      //prev_version: versions.previous.student_id,
    };

    await LogHandler.addLog(log_data);

    return res.json({
      result: {
        success: true,
        message: success.STUDENT_EDIT_SUCCESS,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(400).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};


// Function For Search Student endpoint
const searchStudent = async (req, res) => {
  try {

    // Get Details From Request Query
    const { name, student_number } = req.query;
    // Set query type and value
    const query =
      name && name.length > 0
        ? { type: "name", name }
        : { type: "student_number", student_number };

    // Call Handler
    const student = await StudentHandler.searchStudent(query);

    return res.json({
      // Return Results
      result: {
        success: true,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};

// Function For Get Summary endpoint
const getSummary = async (req, res) => {
  try {
    // Get Details From Request Query
    const orderBy = req.query.orderby ? req.query.orderby : false;
    // Call Handler
    const summary = await SummaryHandler.getSummary(orderBy);

    return res.json({
      // Return Results
      result: {
        success: true,
        output: summary,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};


// Function For Get Summary By Degree Endpoint
const getSummaryByDegree = async (req, res) => {
  try {
    // Get Details From Request Query and Params
    const orderBy = req.query.orderby ? req.query.orderby : false;
    const { degree } = req.params;
    // Call Handler
    const summary = await SummaryHandler.getSummaryByDegree(degree, orderBy);

    return res.json({
      // Return Results
      result: {
        success: true,
        output: summary,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};


// Function For Get Student By Degree Endpoint
const getStudentsByDegree = async (req, res) => {
  try {
    // Get Details From Request Params
    const { degree } = req.params;
    // Call Handler
    const students = await StudentHandler.getStudentsByDegree(degree);

    return res.json({
      // Return Results
      result: {
        success: true,
        output: students,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};

// Function For Search Summary Endpoint
const searchSummary = async (req, res) => {
  try {
    // Get Details From Request Query
    const { name } = req.query;
    const orderBy = req.query.orderby ? req.query.orderby : false;
    // Call Handler
    const student = await SummaryHandler.searchSummary(name, orderBy);

    return res.json({
      // Return Results
      result: {
        success: true,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};

// Function For Search Summary By Degree Endpoint
const searchSummaryByDegree = async (req, res) => {
  try {
    // Get Details From Request Query and Params
    const { name } = req.query;
    const { degree } = req.params;
    const orderBy = req.query.orderby ? req.query.orderby : false;

    // Call Handler
    const student = await SummaryHandler.searchSummaryByDegree(
      name,
      degree,
      orderBy
    );

    return res.json({
      // Return Results
      result: {
        success: true,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};

// Function For Search Students By Degree Endpoint
const searchStudentsByDegree = async (req, res) => {
  try {
    // Get Details From Request Query and Params
    const { name, student_number } = req.query;
    const { degree } = req.params;
    // Set query type and value
    const query =
      name && name.length > 0
        ? { type: "name", name }
        : { type: "student_number", student_number };
    // Call Handler
    const student = await StudentHandler.searchStudentsByDegree(query,degree);

    return res.json({
      // Return Results
      result: {
        success: true,
        output: student,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
};

// Function For Get Latest Term Endpoint
const getLatestTerm = async (req, res) => {
  try {
    // Call Handler
    const latest_term = await TermHandler.getLatestTerm();
    return res.json({
      // Return Results
      result: {
        success: true,
        output: latest_term,
        session: res.session,
      },
    });
  } catch (error) {
    // Catch Errors
    return res.status(404).json({
      result: {
        success: false,
        message: error,
        session: res.session,
      },
    });
  }
  
};


StudentEndpoint.get("/", isAuthenticated, getStudents);
StudentEndpoint.get("/all", isAuthenticated, getAllStudents);
StudentEndpoint.get("/term",isAuthenticated,getLatestTerm)
StudentEndpoint.post("/", isAuthenticated, addStudent);
StudentEndpoint.get("/search", isAuthenticated, searchStudent);
StudentEndpoint.get("/degree/:degree", isAuthenticated, getStudentsByDegree);
StudentEndpoint.get("/degree/:degree/search", isAuthenticated, searchStudentsByDegree);
StudentEndpoint.get("/summary", isAuthenticated, getSummary);
StudentEndpoint.get("/summary/search", isAuthenticated, searchSummary);
StudentEndpoint.get("/summary/degree/:degree", isAuthenticated, getSummaryByDegree);
StudentEndpoint.get("/summary/degree/:degree/search", isAuthenticated, searchSummaryByDegree);
StudentEndpoint.get("/:id", isAuthenticated, getStudentById);
StudentEndpoint.patch("/:id", isAuthenticated, editStudent);
StudentEndpoint.delete("/delete/:user_id", isAuthenticated, deleteStudentMany);
StudentEndpoint.delete("/:id/:user_id", isAuthenticated, deleteStudent);


module.exports = StudentEndpoint;
