const { get_response } = require("../../response.schema");

//DAO class
const d_c_dao = require("../../dao/digital-content-dao");
const digital_content_dao = new d_c_dao();

function GetAbl(req, res) {
  //Try catch for server error...
  try {
    let digital_content_ids = [];

    // Check if digitalContentIds are sent in the query parameters
    if (req.query.digitalContentIds) {
      digital_content_ids = req.query.digitalContentIds.split(",");
    }
    // Check if digitalContentIds are sent in the body (for POST requests)
    else if (req.body.digitalContentIds) {
      digital_content_ids = req.body.digitalContentIds;
    }
    else if(req.params.id)
    {
      digital_content_ids.push(req.params.id) 
    }

    //validating incoming data
    if (
      !digital_content_ids ||
      (Array.isArray(digital_content_ids) && digital_content_ids.length === 0)
    ) {
      //sent data does not have valid schema
      //sending error message
      res.send(get_response("ID of digital content is not valid.", 500, {}));
      return;
    }
    //TODO: Should obtain response from DAO
    //calling dao method...
    digital_content_dao.get(digital_content_ids).then((value) => {
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

module.exports = GetAbl;
