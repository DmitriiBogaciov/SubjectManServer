const ajv = require("ajv");
const json_validator = new ajv();
const { get_response } = require("../../response.schema");
const { createSchema } = require("./schema-abl");
const s_dao = require("../../dao/subject-dao");
const subject_dao = new s_dao();

//Other DAO's
const digital_content_dao = new (require("../../dao/digital-content-dao"))();
const topic_dao = new (require("../../dao/topic-dao"))();

async function CreateAbl(req, res) {
  try {
    const subjectData = req.body
    if (!json_validator.validate(createSchema, req.body)) {
      res.status(500).send(get_response("Schema of subject is not valid.", 500));
    } else {

      //Checking if given digital content IDs exits in DB
      if (req.body.digitalContentIdList) {
        const dc_exist_response = await digital_content_dao.IDsExistsInDB(req.body.digitalContentIdList);
        if (dc_exist_response.response_code >= 400)
          return res.status(dc_exist_response.response_code).send(dc_exist_response);
      }

      //Checking if given topic IDs exits in DB
      if (req.body.topicIdList) {
        const topic_exist_response = await topic_dao.IDsExistsInDB(req.body.topicIdList);
        if (topic_exist_response.response_code >= 400)
          return res.status(topic_exist_response.response_code).send(topic_exist_response);
      }


      subject_dao.create(subjectData).then((value) => {
        res.status(value.response_code).send(value);
      });
    }
  } catch (error_response) {
    if (error_response.response_code === 500) {
      res.status(500).send(error_response);
    } else {
      console.log(error_response)
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
