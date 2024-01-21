//DAO class
const s_dao = require("../../dao/subject-dao");
const subject_dao = new s_dao();

const { get_response } = require("../../response.schema");

function GetListAbl(req, res) {
  //Try catch for server error...
  try {
    //calling dao method...
    subject_dao.list().then((value) => {
      res.send(value);
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

module.exports = GetListAbl;
