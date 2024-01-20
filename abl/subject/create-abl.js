const ajv = require("ajv");
const json_validator = new ajv();
const { get_response } = require("../../response.schema");
const { createSchema } = require("./schema-abl");
const s_dao = require("../../dao/subject-dao");
const subject_dao = new s_dao();

function CreateAbl(req, res) {
  try {
    console.log(req.body)
    if (!json_validator.validate(createSchema, req.body)) {
      res.status(500).send(get_response("Schema of subject is not valid.", 500));
    } else {

      subject_dao.createSubject(subjectData).then((value) => {
        res.status(value.response_code).send(value);
      });
    }
  } catch (error_response) {
    if (error_response.response_code === 500) {
      res.status(500).send(error_response);
    } else {
      res.status(500).send(
        get_response(
          "Could not establish communication with the server.",
          500,
          error_response
        )
      );
    }
  }
}

module.exports = CreateAbl;
