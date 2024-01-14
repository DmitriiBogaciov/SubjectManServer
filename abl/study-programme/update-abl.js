const StudyProgrammeDao = require("../../dao/study-programme-dao");
const Ajv = require("ajv");
const { get_response } = require("../../response.schema");
const dao = new StudyProgrammeDao();

const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 15, maxLength: 50 },
    name: { type: "string", minLength: 1, maxLength: 40 },
    description: { type: "string", minLength: 1, maxLength: 500 },
    language: { type: "string", enum: ["Czech", "English"] },
    degree: { type: "string", enum: ["Bachelor", "Master"] },
    subjects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string", minLength: 1 },
          year: { type: "number", minimum: 1, maximum: 4 },
          semester: { type: "string", enum: ["winter", "summer"] },
          type: {
            type: "string",
            enum: ["mandatory", "optional", "mandatory_optional"],
          },
        },
        required: ["_id", "year", "semester"],
        additionalProperties: false,
      },
    },
  },
  required: [],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  console.log(updatedData);

  // Валидация данных перед обновлением
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
    if (error_response.response_code === 500) res.send(error_response);
    else
      res.send(
        get_response(
          "Could not establish communication with server.",
          500,
          error_response
        )
      );
  }
}

module.exports = UpdateAbl;
