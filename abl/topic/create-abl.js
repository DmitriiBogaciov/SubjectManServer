const ajv = require("ajv");
const json_validator = new ajv();

const { get_response } = require("../../response.schema");

//Getting schema
const { createSchema } = require("./schema-abl");

//DAO class
const t_dao = require("../../dao/topic-dao");
const topic_dao = new t_dao();
//Other DAO's
const digital_content_dao = new (require("../../dao/digital-content-dao"))();

async function  CreateAbl(req, res) {
  //Try catch for server error...
  try {
    //validating schema of incoming data
    if (!json_validator.validate(createSchema, req.body)) {
      //sent data does not have valid schema
      //sending error message
      res.status(500).send(get_response("Schema of topic is not valid.", 500));
    } else {
      //Checking if given digital content IDs exits in DB
      const dc_exist_response = await digital_content_dao.IDsExistsInDB(req.body.digitalContentIdList);
      if (dc_exist_response.response_code >= 400)
        return res.status(dc_exist_response.response_code).send(dc_exist_response);

      //calling dao method...
      topic_dao.create(req.body).then((value) => {
        res.status(value.response_code).send(value);
      });
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

module.exports = CreateAbl;
