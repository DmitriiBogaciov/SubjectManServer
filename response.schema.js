//This is working version
//Propably will be moved somewhere else
//Used to unify schema of responses from server

response =
{
    message:String,
    response_code: Number,
    data: Object
};

exports.get_response = (message,response_code,data) =>
{
    if(!message)
        message = ""
    if(!response_code)
        response_code = 1
    if(!data)
        data = {}

    return {message, response_code, result: data};
};