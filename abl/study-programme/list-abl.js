const StudyProgrammeDao = require("../../dao/study-programme-dao");
const dao = new StudyProgrammeDao();

async function ListAbl(req, res) {
  try {
    const studyProgrammes_response = await dao.getAll();
    res.send(studyProgrammes_response);
  } catch (error_response) {
    //Catching error code 500
    //Is it custom error from get_response...
    if (error_response.response_code === 500) {
      res.send(error_response);
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

module.exports = ListAbl;
