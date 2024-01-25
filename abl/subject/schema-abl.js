module.exports = {
    createSchema: {
        type: "object",
        properties: {
            _id: { type: "string", minLength: 1, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            supervisor: { 
                type: "object",
                properties:{
                    _id:{type:"string",minLength: 1, maxLength: 150},
                    userName:{type:"string",minLength: 3, maxLength: 50}
                },
                required: ["_id","userName"],
                additionalProperties:false
            },
            goal: { type: "string", minLength: 1, maxLength: 1024 },
            credits: { type: "number", minimum: 1, maximum: 15 },
            language: {type: "string", enum: ["Czech", "English"]},
            studyDegree: {type: "string", enum: ["Bachelor", "Master"]},
            students: {
                type: "array",
                items: { 
                    type: "object",
                    properties:{
                        _id:{type:"string",minLength: 1, maxLength: 150},
                        userName:{type:"string",minLength: 3, maxLength: 50}
                    },
                    required: ["_id","userName"],
                    additionalProperties:false
                },
            },
            topicIdList: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 150 },
            },
            digitalContentIdList: { type: "array", items:{ type: "string", minLength: 1, maxLength: 150 }}
        },
        required: ["name", "description", "supervisor", "goal", "credits", "language", "studyDegree"],
        additionalProperties: false,
    },
    updateSchema: {
        type: "object",
        properties: {
            _id: { type: "string", minLength: 1, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            supervisor: { 
                type: "object",
                properties:{
                    _id:{type:"string",minLength: 1, maxLength: 150},
                    userName:{type:"string",minLength: 3, maxLength: 50}
                },
                required: ["_id","userName"],
                additionalProperties:false
            },
            goal: { type: "string", minLength: 1, maxLength: 1024 },
            credits: { type: "number", minimum: 1, maximum: 15 },
            language: {type: "string", enum: ["Czech", "English"]},
            studyDegree: {type: "string", enum: ["Bachelor", "Master"]},
            students: {
                type: "array",
                items: { 
                    type: "object",
                    properties:{
                        _id:{type:"string",minLength: 1, maxLength: 150},
                        userName:{type:"string",minLength: 3, maxLength: 50}
                    },
                    required: ["_id","userName"],
                    additionalProperties:false
                },
            },
            topicIdList: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 150 },
            },
            digitalContentIdList: { type: "array", items:{ type: "string", minLength: 1, maxLength: 150 }}
        },
        required: ["_id"],
        additionalProperties: false,
    },
};
