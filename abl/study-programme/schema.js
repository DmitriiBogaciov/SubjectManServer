module.exports = {
        type: "object",
        properties: {
            _id: { type: "string", minLength: 1, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40 },
            description: { type: "string", minLength: 1, maxLength: 500 },
            language: { type: "string", enum: ["Czech", "English"] },
            studyDegree: { type: "string", enum: ["Bachelor", "Master"] },
            subjects: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        _id: { type: "string", minLength: 1 },
                        year: { type: "number", minimum: 1, maximum: 4 },
                        semester: { type: "string", enum: ["winter", "summer"] },
                        type: {
                            type: "string",
                            enum: ["mandatory", "optional", "mandatory_optional"],
                        },
                    },
                    required: ["_id", "year", "semester"],
                    additionalProperties: false,
                },
            }
        },
        required: ["name", "description", "language", "studyDegree"],
        additionalProperties: false,
};
