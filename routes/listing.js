const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const {isValid ,isOwner,validateSchema} = require('../middleware.js');
const listingController = require('../controllers/listing.js');

//All-List
router.get("/",  wrapAsync(listingController.index));

//New-Form--->Create-List
router.get("/new",isValid,listingController.newForm);
router.post("/create",isValid,validateSchema,wrapAsync(listingController.createList));

//Show-List---->Edit-List----->Delete-List
router.route("/:id")
.get(wrapAsync(listingController.showList))
.put(isValid,isOwner,validateSchema,wrapAsync(listingController.editList))
.delete(isValid,isOwner,wrapAsync(listingController.deleteList));

//Update-Form--->Edit-List
router.get("/:id/edit",isValid,isOwner,wrapAsync(listingController.editListForm));

module.exports = router;