module.exports = {
    createSchema: {
        type: "object",
        properties: {
            id: { type: "string", minLength: 1, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            supervisorId: { type: "string", minLength: 1, maxLength: 150 },
            goal: { type: "string", minLength: 1, maxLength: 1024 },
            credits: { type: "number", minimum: 1, maximum: 15 },
            language: {type: "string", enum: ["Czech", "English"]},
            studyDegree: {type: "string", enum: ["Bachelor", "Master"]}
        },
        required: ["name", "description", "supervisorId", "goal", "credits", "language", "studyDegree"],
        additionalProperties: false,
    },
    updateSchema: {
        type: "object",
        properties: {
            id: { type: "string", minLength: 1, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            supervisorId: { type: "string", minLength: 1, maxLength: 150 },
            goal: { type: "string", minLength: 1, maxLength: 1024 },
            credits: { type: "number", minimum: 1, maximum: 15 },
            language: {type: "string", enum: ["Czech", "English"]},
            studyDegree: {type: "string", enum: ["Bachelor", "Master"]},
            students: {
                type: "array",
                items: { 
                    type: "object",
                    properties:{
                        id:{type:"string",minLength: 1, maxLength: 150},
                        userName:{type:"string",minLength: 3, maxLength: 50}
                    },
                    required: ["id","userName"],
                    additionalProperties:false
                },
            },
            topicIdList: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 150 },
            },
        },
        required: ["id"],
        additionalProperties: false,
    },
};
