const express = require("express");
const { auth } = require('express-oauth2-jwt-bearer');
const CreateAbl = require("../abl/topic/create-abl");
const ListAbl = require("../abl/topic/list-abl");
const GetAbl = require("../abl/topic/get-abl");
const DeleteAbl = require("../abl/topic/delete-abl");
const UpdateAbl = require("../abl/topic/update-abl");

const router = express.Router();

const checkJwt = auth({
    audience: 'https://subject-man.cz',
    issuerBaseURL: 'https://dev-3bvkk0hsrquz68yn.us.auth0.com/',
    tokenSigningAlg: 'RS256',
});

const checkScope = (requiredScopes) => (req, res, next) => {
    const userScopes = req.auth && req.auth.payload.permissions;

    if (userScopes && Array.isArray(requiredScopes) && requiredScopes.some(scope => userScopes.includes(scope))) {
        next();
    } else {
        res.status(403).json({ error: "Insufficient Scope" });
    }
};

router.get("/list", async (req, res) => {
    try {
        await ListAbl(req, res);
    } catch (error) {
        console.error("Error in list route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/get/:id", checkJwt, checkScope(['read:topic', 'read:topicStudent', 'read:topicTeacher']), async (req, res) => {
    const user = req.auth.payload
    // console.log(`User payload`, user)
    try {
        await GetAbl(req, res, user);
    } catch (error) {
        console.error("Error in get route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/create", checkJwt, checkScope(['create:topic']), async (req, res) => {
    try {
        await CreateAbl(req, res);
    } catch (error) {
        console.error("Error in create route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:id", checkJwt, checkScope(['delete:topic']), async (req, res) => {
    try {
        await DeleteAbl(req, res);
    } catch (error) {
        console.error("Error in delete route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update", checkJwt, checkScope(['update:topic']), async (req, res) => {
    try {
        await UpdateAbl(req, res);
    } catch (error) {
        console.error("Error in update route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
