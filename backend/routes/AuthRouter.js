let passport = require("../config/passport");
const express = require("express");
const router = express.Router();
const address = process.env.REDIRECT;

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${address}/login`,
    successRedirect: `${address}/dashboard`,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).send("User has logged out...");
});

router.get("/user", (req, res) => {
  res.status(200).send(req.user);
});

module.exports = router;
