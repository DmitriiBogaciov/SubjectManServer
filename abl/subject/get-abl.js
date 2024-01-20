const { get_response } = require("../../response.schema");

//DAO class
const s_dao = require("../../dao/subject-dao");
const subject_dao = new s_dao();

function GetAbl(req, res) {
  // Try catch for server error...
  try {
    let subjectIds;

    // Check if subjectIds are sent in the query parameters

    console.log(req.query.subjectIds);
    if (req.query.subjectIds) {
      subjectIds = req.query.subjectIds.split(",");
    }
    // Check if subjectIds are sent in the body (for POST requests)
    else if (req.body.subjectIds) {
      subjectIds = req.body.subjectIds;
    }

    console.log(subjectIds);
    // Validating incoming data
    if (!subjectIds || !Array.isArray(subjectIds)) {
      // Sent data does not have a valid schema
      // Sending error message
      return res.send(get_response("IDs of subjects are not valid.", 500, {}));
    }

    // Calling dao method...
    subject_dao.getSubjects(subjectIds).then((value) => {
      return res.send(value);
    });
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

module.exports = GetAbl;
