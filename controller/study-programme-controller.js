const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const CreateAbl = require("../abl/study-programme/create-abl");
const ListAbl = require("../abl/study-programme/list-abl");
const GetAbl = require("../abl/study-programme/get-abl");
const DeleteAbl = require("../abl/study-programme/delete-abl");
const UpdateAbl = require("../abl/study-programme/update-abl");

const router = express.Router();

const checkJwt = auth({
    audience: 'https://subject-man.cz',
    issuerBaseURL: 'https://dev-3bvkk0hsrquz68yn.us.auth0.com/',
    tokenSigningAlg: 'RS256',
});

const checkScope = (requiredScope) => (req, res, next) => {
    if (req.auth && req.auth.payload.permissions.includes(requiredScope)) {
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

router.get("/get/:id", async (req, res) => {
    try {
        await GetAbl(req, res);
    } catch (error) {
        console.error("Error in get route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/create", checkJwt, checkScope('create:programmes'), async (req, res) => {
    try {
        await CreateAbl(req, res);
    } catch (error) {
        console.error("Error in create route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:id", checkJwt, checkScope('delete:programmes'), async (req, res) => {
    try {
        await DeleteAbl(req, res);
    } catch (error) {
        console.error("Error in delete route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update", checkJwt, checkScope('update:programme'), async (req, res) => {
    try {
        await UpdateAbl(req, res);
    } catch (error) {
        console.error("Error in update route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
