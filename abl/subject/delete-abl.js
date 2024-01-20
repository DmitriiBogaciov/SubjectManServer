const { get_response } = require("../../response.schema");

//DAO class
const s_dao = require("../../dao/subject-dao");
const subject_dao = new s_dao();

async function DeleteAbl(req, res) {
  //Try catch for server error...
  try {
    //Getting ID...
    let subject_id = req.params.id;

    //validating incoming data
    if (subject_id === undefined || typeof subject_id !== "string") {
      //sent data does not have valid schema
      //sending error message
      res.status(500).send(get_response("ID of subject is not valid.", 500, {}));
    } else {
      // Calling DAO method to get subject details
      const subject = await subject_dao.getSubjects([subject_id]);
      const subjectData = subject.result[0];

      // Checking user permissions
      const user = req.auth.payload;

      if (user.permissions.includes('admin:admin')) {
        // Admin has the permission to delete the subject
        subject_dao.deleteSubject(subject_id).then((value) => {
          res.status(value.response_code).send(value);
        });
      } else if (user.permissions.includes('delete:subject')) {
        // The user has the permission to delete the subject
        if (subjectData) {
          if (subjectData.supervisorId.includes(user.sub)) {
            subject_dao.deleteSubject(subject_id).then((value) => {
              res.status(value.response_code).send(value);
            });
          } else {
            res.status(500).send(
              get_response(
                `User ${user.sub} is not a teacher of the subject.`,
                500
              )
            );
          }
        } else {
          res.status(500).send(get_response("Subject not found", 500));
        }
      } else {
        res.status(500).send(get_response("User does not have permission to delete subject", 500));
      }
    }
  } catch (error_response) {
    //Catching error code 500
    //Is it custom error from get_response...
    if (error_response.response_code === 500) {
      res.status(500).send(error_response);
    } else
      res.status(500).send(
        get_response(
          "Could not establish communication with server.",
          500,
          error_response
        )
      );
  }
}

module.exports = DeleteAbl;
