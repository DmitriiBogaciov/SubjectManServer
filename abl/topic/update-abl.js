const ajv = require("ajv");
const json_validator = new ajv();

const { get_response } = require("../../response.schema");

//Getting schema of topic
const { updateSchema } = require("./schema-abl");

//DAO class
const t_dao = require("../../dao/topic-dao");
const s_dao = require("../../dao/subject-dao");
const topic_dao = new t_dao();
const subject_dao = new s_dao();

async function UpdateAbl(req, res) {
  const user = req.auth.payload
  //Try catch for server error...
  try {
    //validating schema of incoming data
    if (!json_validator.validate(updateSchema, req.body)) {
      //sent data does not have valid schema
      //sending error message
      res.send(get_response("Schema of topic is not valid.", 500, {}));
    } else {
      //calling dao method...
      if (req.body.id) {

        //Getting subjects for supervisor information
        const subjects = await subject_dao.getAllSubjects();
        const subjectWithTopics = subjects.result.find(subject => {
          return subject.topicIdList.some(topicId => req.body.id.includes(topicId));
        });

        if (user.permissions.includes('admin:admin')) {
          topic_dao.updateTopic(req.body.id, req.body).then((value) => {
            res.send(value);
          });
        }else if (user.permissions.includes('update:topic')) {
          if (subjectWithTopics) {
            if (subjectWithTopics.supervisor.id.includes(user.sub)) {
              topic_dao.updateTopic(req.body.id, req.body).then((value) => {
                res.send(value);
              });
            } else {
              console.log(`User ${user.id} is not a teacher the subject.`);
            }
          } else {
            console.log("No subject found with the specified topicsIds.");
          }
        }


      } else {
        res.send(get_response("ID of topic is undefined", 500));
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


