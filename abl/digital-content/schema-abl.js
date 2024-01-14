module.exports = {
    createSchema: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 40},
            description: { type: "string", minLength: 1, maxLength: 500},
            externalLink: { type: "string", minLength: 1, maxLength: 1000},
        },
        required: ["name", "description", "externalLink"],
        additionalProperties: false,
    },
    updateSchema: {
        type: "object",
        properties: {
            id:{ type: "string", minLength: 20, maxLength: 150 },
            name: { type: "string", minLength: 1, maxLength: 40},
            description: { type: "string", minLength: 1, maxLength: 500},
            externalLink: { type: "string", minLength: 1, maxLength: 1000},
        },
        required: ["id"],
        additionalProperties: false,
    },
};