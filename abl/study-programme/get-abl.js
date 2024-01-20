const StudyProgrammeDao = require("../../dao/study-programme-dao");
const dao = new StudyProgrammeDao();

async function GetAbl(req, res) {
  const studyProgrammeId = req.params.id;

  try {
    const studyProgramme_response = await dao.getById(studyProgrammeId);
    res.status(studyProgramme_response.response_code);
    res.send(studyProgramme_response);
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

module.exports = GetAbl;
