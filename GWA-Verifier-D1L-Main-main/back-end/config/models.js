const { Model } = require("objection");
const { database } = require("./database");

Model.knex(database);

/*Knex model for students*/
exports.Student = class extends Model {
  static get tableName() {
    return "student";
  }

  static get idColumn() {  /*primary key student_id*/
    return "student_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        student_id: { type: "string" } /*UUID*/,
        last_name: { type: "string" },
        first_name: { type: "string" },
        middle_name: { type: "string" },
        suffix: { type: "string" },
        student_number: { type: "string" },
        degree_program: { type: "string" },
        isGraduating: { type: "boolean" },
        latin_honor: { type: "string" },
        isDeleted: { type: "boolean" },
        warning_count: { type: "number"}
      },
    };
  }
};

/*Knex model for student records*/
exports.Record = class extends Model {
  static get tableName() {
    return "student_record";
  }

  static get idColumn() {  /*primary key record_id*/
    return "record_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        record_id: { type: "string" } /*UUID*/,
        student_id: { type: "string" } /*UUID*/,
        gwa: { type: "number" },
        total_units: { type: "number" },
        cumulative_sum: { type: "number" },
      },
    };
  }
};

/*Knex model for terms*/
exports.Term = class extends Model {
  static get tableName() {
    return "term";
  }

  static get idColumn() { /*primary key term_id*/
    return "term_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        term_id: { type: "string" }, /*UUID*/
        record_id: { type: "string" }, /*UUID*/
        acad_year: { type: "string" },
        semester: { type: "string" },
        no_of_units: { type: "number" },
        total_weights: { type: "number" },
        gpa: { type: "number" }
      },
    };
  }
};

/*Knex model for courses*/
exports.Course = class extends Model {
  static get tableName() {
    return "course";
  }

  static get idColumn() { /*primary key course_id*/
    return "course_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        course_id: { type: "string" }, /*UUID*/
        term_id: { type: "string" }, /*UUID*/
        course_code: { type: "string" },
        grade: { type: "string" },
        units: { type: "string" },
        weight: { type: "number" },
        cumulated: { type: "number" },
        row_number: {type: "number"},
      },
    };
  }
};

/*Knex model for users*/
exports.User = class extends Model {
  static get tableName() {
    return "user";
  }

  static get idColumn() {
    return "user_id";
  }


  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        user_id: { type: "string" } /* UUID */,
        user_role: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
        phone_number: { type: "string" },
        display_picture: { type: "string" },
        isDeleted: { type: "boolean" },
      },
    };
  }
};

/*Knex model for logs*/
exports.Log = class extends Model {
  static get tableName() {
    return "log";
  }

  static get idColumn() {
    return "log_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        log_id: { type: "string" } /* UUID */,
        user_id: { type: "string" } /* UUID */,
        subject_id: { type: "string" },
        subject_entity: { type: "string" } /* user or student */,
        time_stamp: { type: "string" },
        activity_type: { type: "string" },
        details: { type: "string" },
      },
    };
  }
};

/*Knex model for record warnings*/
exports.Warning = class extends Model {
  static get tableName() {
    return "student_warning";
  }

  static get idColumn() { /*primary key warning_id*/
    return "warning_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        warning_id: { type: "string" }, /*UUID*/
        student_id: { type: "string" }, /*UUID*/
        warning_type: { type: "string" },
        description: { type: "string" },
        details: { type: "string" },
        row_number: {type: "number"},
      },
    };
  }
};

/*Knex model for otps generated*/
exports.OTP = class extends Model {
  static get tableName() {
    return "otp_list";
  }

  static get idColumn() { /*primary key otp_code*/
    return "otp_code";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        otp_code: { type: "string" }, /*UUID*/
        expiration: { type: "number" },
        is_used: { type: "boolean"}
      }
    }
  }
}