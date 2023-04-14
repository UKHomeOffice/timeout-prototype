const express = require('express')
const router = express.Router()

// Radio button redirect

const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

// ROUTES for V3 //

router.post("/v3/auk2/router/umd/ask-type", function (req, res) {
  if (req.session.data["ask-type"] == "photos") {
    if (req.session.data["with-request"] == "false") {
      res.redirect("/ucda-310/v3/umd/no-request");
    }
    else  {
      res.redirect("/ucda-310/v3/umd/what-need");
    }
  }
  else  {
    res.redirect("/ucda-310/v3/sadu/ask-type");
  }
});

router.post("/v3/umd/router/umd/what-need", function (req, res) {
  if (req.session.data["request"] == "identity") {
      res.redirect("/ucda-310/v3/gidv/prepare-photo-passport");
  }
  else  {
    res.redirect("/ucda-310/v3/gidv/prepare-photo");
  }
});

router.post("/v3/gidv/router/gidv/check-details-selfie", function (req, res) {
  if (req.session.data["request"] == "both") {
      res.redirect("/ucda-310/v3/gidv/prepare-photo-passport");
  }
  else if (req.session.data["request"] == "identity") {
      res.redirect("/ucda-310/v3/gidv/prepare-photo-passport");
  }
  else  {
    res.redirect("/ucda-310/v3/umd/confirmation");
  }
});

router.post("/v3/umd/router/submission-error", function (req, res) {
  if (req.session.data["error"] == "selfie") {
      res.redirect("/ucda-310/v3/gidv/prepare-photo");
  }
  else  {
    res.redirect("/ucda-310/v3/gidv/prepare-photo-passport");
  }
});


// ROUTES for V2 //

router.post("/v2/auk2/router/umd/ask-type", function (req, res) {
  if (req.session.data["ask-type"] == "photos") {
    if (req.session.data["with-request"] == "false") {
      res.redirect("/ucda-310/v3/umd/no-request");
    }
    else  {
      res.redirect("/ucda-310/v2/umd/before-continue-v2-short");
    }
  }
  else  {
    res.redirect("/ucda-310/v2/sadu/ask-type");
  }
});

router.post("/v2/gidv/router/gidv/upload-photo", function (req, res) {
  if (req.session.data["timeout"] == "false") {
    res.redirect("/ucda-310/v2/gidv/check-photo")
  }
  else  {
    res.redirect("/ucda-310/v2/gidv/session-timeout");
  }
});

module.exports = router
