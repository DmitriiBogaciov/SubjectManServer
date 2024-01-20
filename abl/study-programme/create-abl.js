const Ajv = require("ajv");
const StudyProgrammeDao = require("../../dao/study-programme-dao");
const { get_response } = require("../../response.schema");
const dao = new StudyProgrammeDao();

const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 40 },
    description: { type: "string", minLength: 1, maxLength: 500 },
    language: { type: "string", enum: ["Czech", "English"] },
    degree: { type: "string", enum: ["Bachelor", "Master"] },
<<<<<<< HEAD
     subjects: {
=======
    subjects: {
>>>>>>> 6846a09c7e89e39e13fc58359a0261353adc387c
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
<<<<<<< HEAD
    },
=======
    }
>>>>>>> 6846a09c7e89e39e13fc58359a0261353adc387c
  },
  required: ["name", "description", "language", "degree"],
  additionalProperties: true,
};

async function CreateAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.body);

    if (!valid) {
      res.send(
        get_response("Schema of study programme is not valid", 500, req.body)
      );
    } else {
      let studyProgramme = req.body;
      const savedProgramme_response = await dao.create(studyProgramme);
      res.status(savedProgramme_response.response_code);
      res.send(savedProgramme_response); // 201 Created
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
