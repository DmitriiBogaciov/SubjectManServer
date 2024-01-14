const ajv = require("ajv");
const json_validator = new ajv();

const { get_response } = require("../../response.schema");

//Getting schema
const { updateSchema } = require("./schema-abl");

//DAO class
const s_dao = require("../../dao/subject-dao");
const subject_dao = new s_dao();

async function UpdateAbl(req, res) {
  const user = req.auth.payload;

  // Try catch for server error...
  try {
    // Validating schema of incoming data
    if (!json_validator.validate(updateSchema, req.body)) {
      // Sent data does not have a valid schema
      // Sending error message
      res.send(get_response("Schema of subject is not valid.", 500, {}));
    } else {
      // Calling dao method...
      if (req.body.id) {
        const subject = await subject_dao.getSubjects([req.body.id]);
        const subjectData = subject.result[0];

        if (user.permissions.includes('admin:admin')) {
          // Admin has the permission to update the subject
          subject_dao.updateSubject(req.body.id, req.body).then((value) => {
            res.send(value);
          });
        } else if (user.permissions.includes('update:subject')) {
          // The user has the permission to update the subject
          if (subjectData) {
            if (subjectData.supervisorId.includes(user.sub)) {
              subject_dao.updateSubject(req.body.id, req.body).then((value) => {
                res.send(value);
              });
            } else {
              res.send(
                get_response(
                  "User ${user.sub} is not a teacher of the subject.",
                  500
                )
              );
            }
          }
        } else {
          res.send(get_response("ID of subject is undefined", 500));
        }
      }
    }
  } catch (error_response) {
    // Catching error code 500
    // Is it a custom error from get_response...
    if (error_response.response_code === 500) {
      res.send(error_response);
    } else {
      res.send(
        get_response(
          "Could not establish communication with the server.",
          500,
          error_response
        )
      );
    }
  }
}

module.exports = UpdateAbl;
