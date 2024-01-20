const StudyProgrammeDao = require("../../dao/study-programme-dao");
const Ajv = require("ajv");
const { get_response } = require("../../response.schema");
const dao = new StudyProgrammeDao();

const ajv = new Ajv();

const schema = require("./schema");

async function UpdateAbl(req, res) {

  const { id } = req.params;
  const updatedData = req.body;

  //Schema validation
  const validationResult = ajv.validate(schema, updatedData);

  if (!validationResult) {
    return res
      .status(400)
      .send(get_response("Invalid data format", 400, ajv.errors));
  }

  try {
    const subjectsExist_response = await dao.checkSubjectsExist(
      updatedData.subjects
    );
    if (!subjectsExist_response) {
      res.status(subjectsExist_response.response_code);
      return res.send(subjectsExist_response);
    }

    const update_response = await dao.update(id, updatedData);
    res.status(update_response.response_code);
    res.send(update_response);
  } catch (error_response) {
    //Catching error code 500
    //Is it custom error from get_response...
    if (error_response.response_code === 500) res.status(500).send(error_response);
    else
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
