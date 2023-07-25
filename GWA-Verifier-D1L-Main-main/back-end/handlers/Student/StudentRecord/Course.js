// Course.js
// checks courses addded by each student and verifies validity
// of the courses based on the records

const { Course } = require("../../../config/models.js"); //imports model
const { v4: uuidv4 } = require("uuid"); //generates random id for each courses

exports.addCourses = async (course_data, term_id) => {
  //returns courses
  //add courses to the records, called on all terms using course_data
  const courses = [];
  course_data.forEach(async (course) => {
    let course_id = uuidv4();
    let newCourse = {
      course_id: course_id, //randomly generated
      term_id: term_id,
      course_code: course.course_code,
      grade: course.grade,
      units: course.units,
      weight: course.weight, // grade *unit
      cumulated: course.cumulated, //weight (n-1) + weight (n)
      row_number: course.row_number, //for front-end functionalities and display consistemcy
    };

    await Course.query() //insert courses onto the database
      .insert(newCourse)
      .then(() => {
        courses.push(newCourse);
      })
      .catch((err) => {
        throw err;
      });
  });
  return courses;
};

exports.getCourses = async (term_id) => {
  //getting e/c courses from e/c terms using term id
  return Course.query()
    .where({ term_id: term_id })
    .orderBy("row_number", "asc") //returns each courses based on order of rows for uniform display
    .then((courses) => {
      return courses;
    })
    .catch((err) => {
      throw err;
    });
};

getCourseById = async (id) => {
  //accepts id then returns specific course
  return Course.query()
    .where({ course_id: id })
    .first()
    .then((course) => {
      return course;
    })
    .catch((err) => {
      throw err;
    });
};

exports.editCourse = async (newCourse) => {
  //accepts incoming record changes for the course. returns database query
  const course = await getCourseById(newCourse.course_id);

  // Check if there are changes before proceeding
  if (
    course.course_code != newCourse.course_code ||
    course.grade != newCourse.grade ||
    course.units != newCourse.units ||
    course.weight != newCourse.weight ||
    course.cumulated != newCourse.cumulated
  ) {
    // Proceed to editing
    return Course.query()
      .where({ course_id: newCourse.course_id })
      .first()
      .update({
        //updates pre-existing records and overwrites previous data, committed
        course_code: newCourse.course_code,
        grade: newCourse.grade,
        units: newCourse.units,
        weight: Number(newCourse.weight),
        cumulated: Number(newCourse.cumulated),
      })
      .then((status) => {
        if (!status) throw ("Failed to update course:", course.course_code);
        return newCourse;
      });
  }
};
