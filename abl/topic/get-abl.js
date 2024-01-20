const { get_response } = require("../../response.schema");

// DAO class
const t_dao = require("../../dao/topic-dao");
const s_dao = require("../../dao/subject-dao");
const topic_dao = new t_dao();
const subject_dao = new s_dao();


async function GetAbl(req, res) {
  const user = req.auth.payload
  try {
    let topicsIds;

    // Check if subjectIds are sent in the query parameters
    // console.log(`Topic ids from request`, req.query.topicsIds);
    if (req.query.topicsIds) {
      topicsIds = req.query.topicsIds.split(",");

      // Check if topicsIds is not an empty array
      if (!topicsIds.length) {
        res.send(get_response("ID of topics is not valid.", 400, {}));
        return;
      }
    } else if (req.body.topicsIds) {
      topicsIds = req.body.topicsIds;

      // Check if topicsIds is not null
      if (topicsIds === null) {
        res.send(get_response("ID of topics is not valid.", 400, {}));
        return;
      }
    } else {
      res.send(get_response("ID of topics is not provided.", 400, {}));
      return;
    }

    const subjects = await subject_dao.getAllSubjects();

    const subjectWithTopics = subjects.result.find(subject => {
      return subject.topicIdList.some(topicId => topicsIds.includes(topicId));
    });

    if (user.permissions.includes('admin:admin')) {
      const topics = await topic_dao.getTopic(topicsIds);
      res.send(topics);
    }else if (user.permissions.includes('read:topicStudent')) {
      if (subjectWithTopics) {
        if (subjectWithTopics.students.includes(user.sub)) {
          const topics = await topic_dao.getTopic(topicsIds);
          res.send(topics);
        } else {
          console.log(`User ${user.id} is not a student in the subject.`);
        }
      } else {
        console.log("No subject found with the specified topicsIds.");
      }
    } else if (user.permissions.includes('read:topicTeacher')) {
      if (subjectWithTopics) {
        if (subjectWithTopics.supervisor.id.includes(user.sub)) {
          const topics = await topic_dao.getTopic(topicsIds);
          res.send(topics);
        } else {
          console.log(`User ${user.id} is not a teacher of the subject.`);
        }
      } else {
        console.log("No subject found with the specified topicsIds.");
      }
    }

  } catch (error_response) {
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

module.exports = GetAbl;
