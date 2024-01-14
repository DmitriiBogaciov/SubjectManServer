const express = require("express");
const { auth } = require('express-oauth2-jwt-bearer');
const CreateAbl = require("../abl/digital-content/create-abl");
const ListAbl = require("../abl/digital-content/list-abl");
const GetAbl = require("../abl/digital-content/get-abl");
const DeleteAbl = require("../abl/digital-content/delete-abl");
const UpdateAbl = require("../abl/digital-content/update-abl");

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


router.get("/list", (req, res) => {
    ListAbl(req, res);
})

router.get("/get", (req, res) => {
    GetAbl(req, res);
});

router.post("/get", (req, res) => {
    console.log(`Id of user`, req.auth.payload.sub)
    GetAbl(req, res);
});

router.post("/create", checkJwt, checkScope('create:digitalContent'), (req, res) => {
    CreateAbl(req, res);
});

router.delete("/delete/:id", checkJwt, checkScope('delete:digitalContent'), (req, res) => {
    DeleteAbl(req, res);
});

router.put("/update", checkJwt, checkScope('update:digitalContent'), (req, res) => {
    UpdateAbl(req, res);
});

module.exports = router;