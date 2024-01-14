const ajv = require("ajv");
const json_validator = new ajv();

const { get_response } = require("../../response.schema");

//Getting schema
const { createSchema } = require("./schema-abl");

//DAO class
const t_dao = require("../../dao/topic-dao");
const topic_dao = new t_dao();

function CreateAbl(req, res) {
  //Try catch for server error...
  try {
    //validating schema of incoming data
    if (!json_validator.validate(createSchema, req.body)) {
      //sent data does not have valid schema
      //sending error message
      res.send(get_response("Schema of topic is not valid.", 500));
    } else {
      //calling dao method...
      topic_dao.createTopic(req.body).then((value) => {
        res.send(value);
      });
    }
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

module.exports = CreateAbl;