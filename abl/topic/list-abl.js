//DAO class
const t_dao = require("../../dao/topic-dao");
const topic_dao = new t_dao();

const { get_response } = require("../../response.schema");

function GetListAbl(req, res) {
  //Try catch for server error...
  try {
    //calling dao method...
    topic_dao.getAllTopics().then((value) => {
      res.send(value);
    });
  } catch (error_response) {
    //Catching error code 500
    //Is it custom error from get_response...
    if (error_response.response_code === 500) {
      res.send(error_response);
    } else
      res.send(
        get_response(
          "Could not establish communication with server.",
          500,
          error_response
        )
      );
  }
}

module.exports = GetListAbl;
