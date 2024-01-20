const { get_response } = require("../../response.schema");

// DAO method
const d_c_dao = require("../../dao/digital-content-dao");
const digital_content_dao = new d_c_dao();

function DeleteAbl(req, res) {
  // Try catch for server error...
  try {
    // Getting ID...
    let digital_content_id = req.params.id;
    console.log(`blabla`);

    // Validating incoming data
    if (
      digital_content_id === undefined ||
      typeof digital_content_id !== "string"
    ) {
      // Sent data does not have a valid schema
      // Sending error message
      res.send(get_response("ID of digital content is not valid.", 500, {}));
    } else {
      // Calling delete dao method...
      digital_content_dao
        .deleteDigitalContent(digital_content_id)
        .then((value) => {
          // Отправка ответа после успешного удаления
          res.send(value);
        })
        .catch((error) => {
          // Обработка ошибки при удалении
          res.send(get_response("Error deleting digital content.", 500, error));
        });
    }
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

module.exports = DeleteAbl;
