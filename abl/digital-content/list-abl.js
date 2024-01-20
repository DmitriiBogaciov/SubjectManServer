//DAO class
const d_c_dao = require("../../dao/digital-content-dao");
const digital_content_dao = new d_c_dao();

const { get_response } = require("../../response.schema");

function GetListAbl(req, res) {
  //Try catch for server error...
  try {
    //TODO: Should obtain response from DAO
    //calling dao method...
    digital_content_dao.getAllDigitalContent().then((value) => {
      console.log(value);
      res.send(value);
    });
  } catch (error_response) {
    //Catching error code 500
    //Is it custom error from get_response...
    if (error_response.response_code === 500) {
      res.send(error_response);
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
