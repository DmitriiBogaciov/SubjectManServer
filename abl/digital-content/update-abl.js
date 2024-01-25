const ajv = require("ajv");
const json_validator = new ajv();

const { get_response } = require("../../response.schema");

//Getting schema of digital content
const { updateSchema } = require("./schema-abl");

//DAO class
const d_c_dao = require("../../dao/digital-content-dao");
const digital_content_dao = new d_c_dao();

function UpdateAbl(req, res) {
  //Try catch for server error...
  try {
    //validating schema of incoming data
    if (!json_validator.validate(updateSchema, req.body)) {
      //sent data does not have valid schema
      //sending error message
      res.status(500).send(
        get_response("Schema of digital content is not valid.", 500, {})
      );
    } else {
      //calling dao method...
      if (req.body._id) {
        digital_content_dao
          .update(req.body._id, req.body)
          .then((value) => {
            res.send(value);
          });
      } else {
        res.send(get_response("ID of digital content is undefined", 500));
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

module.exports = UpdateAbl;
