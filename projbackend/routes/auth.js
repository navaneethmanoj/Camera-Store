const { Router } = require("express");
var express = require("express")
var router = express.Router()
const {signout,signup,signin, isSignedIn} = require("../controllers/auth.js")
const {check, validationResult} = require("express-validator")

router.post("/signup", [
    check("name").isLength({min: 3}).withMessage("name must be at least 3 chars long"),
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({min: 3}).withMessage("passw must be atleast 3 chars long")
] ,signup)

router.post("/signin", [
    check("email").isEmail().withMessage("Invalid email"),
    check("password").isLength({min: 1}).withMessage("password field must not be empty")
], signin)

router.get("/signout", signout)

router.get("/testroute", isSignedIn, (req,res) => {
    res.json(req.auth)
})
module.exports = router;