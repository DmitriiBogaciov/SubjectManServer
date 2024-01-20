const StudyProgrammeDao = require("../../dao/study-programme-dao");
const dao = new StudyProgrammeDao();

async function DeleteAbl(req, res) {
  const { id } = req.params;

  try {
    const result = await dao.remove(id);
    res.status(result.response_code);
    res.send(result);
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

module.exports = DeleteAbl;
