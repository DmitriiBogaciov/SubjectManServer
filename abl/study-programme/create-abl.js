const Ajv = require("ajv");
const StudyProgrammeDao = require("../../dao/study-programme-dao");
const { get_response } = require("../../response.schema");
const dao = new StudyProgrammeDao();

const ajv = new Ajv();

const schema = require("./schema");

//Other DAOs
const subject_dao = new (require("../../dao/subject-dao"))();


async function CreateAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.body);

    if (!valid) {
      res.status(500).send(
        get_response("Schema of study programme is not valid", 500, req.body)
      );
    } else {
      let studyProgramme = req.body;
      //Checking if given subject IDs exist in DB
      if (req.body.subjects) {
        let subject_ids = req.body.subjects.map((s) => {
          return s._id;
        })
        console.log(subject_ids)
        const subjects_exist_response = await subject_dao.IDsExistsInDB(subject_ids);
        if (subjects_exist_response.response_code >= 400)
          return res.status(subjects_exist_response.response_code).send(subjects_exist_response);
      }

      const savedProgramme_response = await dao.create(studyProgramme);
      res.status(savedProgramme_response.response_code);
      res.send(savedProgramme_response); // 201 Created
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
