module.exports = {
    createSchema: {
        type: "object",
        properties: {
            _id:{ type: "string", minLength: 20, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40},
            description: { type: "string", minLength: 1, maxLength: 500},
            digitalContentIdList: { type: "array", items:{ type: "string", minLength: 1, maxLength: 150 }}
        },
        required: ["name", "description","digitalContentIdList"],
        additionalProperties: false,
    },
    updateSchema: {
        type: "object",
        properties: {
            _id:{ type: "string", minLength: 20, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40},
            description: { type: "string", minLength: 1, maxLength: 500},
            digitalContentIdList: { type: "array", items:{ type: "string", minLength: 1, maxLength: 150 }}
        },
        required: ["_id"],
        additionalProperties: false,
    },
};