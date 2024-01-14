const { get_response } = require("../../response.schema");

//DAO method
const t_dao = require("../../dao/topic-dao");
const s_dao = require("../../dao/subject-dao");
const topic_dao = new t_dao();
const subject_dao = new s_dao();

async function DeleteAbl(req, res) {
  const user = req.auth.payload
  //Try catch for server error...
  try {
    //Getting ID...
    let topic_id = req.params.id;

    //validating incoming data
    if (topic_id === undefined || typeof topic_id !== "string") {
      //sended data does not have valid schema
      //sending error message
      res.send(get_response("ID of topic is not valid.", 500, {}));
    } else {
      const subjects = await subject_dao.getAllSubjects();

      const subjectWithTopics = subjects.result.find(subject => {
        return subject.topicIdList.some(topicId => topic_id.includes(topicId));
      });

      if (user.permissions.includes('admin:admin')) {
        topic_dao.deleteTopic(topic_id).then((value) => {
          res.send(value);
        });
      }else if (user.permissions.includes('delete:topic')) {
        if (subjectWithTopics) {
          if (subjectWithTopics.supervisorId.includes(user.sub)) {
            topic_dao.deleteTopic(topic_id).then((value) => {
              res.send(value);
            });
          } else {
            console.log(`User ${user.id} is not a teacher the subject.`);
          }
        } else {
          console.log("No subject found with the specified topicsIds.");
        }
      }
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

module.exports = DeleteAbl;
