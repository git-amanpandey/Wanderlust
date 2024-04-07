const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const searchController = require('../controllers/search');

router.get("/find",wrapAsync(searchController.search));
router.get("/:id",wrapAsync(searchController.searchId));

module.exports = router;