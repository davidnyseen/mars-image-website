const userHendler = require('../myModels/user-model.js');
var express = require('express');
const { redirect } = require('express/lib/response');
const Cookies = require("cookies");
const {json} = require("express");
var router = express.Router();
const marsController = require('../controllers/access-marsController.js');


router.put('/save-image', marsController.checkAllows);
router.put('/save-image', marsController.saveImages);
router.delete('/deleteAll', marsController.checkAllows);
router.delete('/deleteAll', marsController.deleteAll);
router.delete('/:catid', marsController.checkAllows);
router.delete('/:catid', marsController.deleteSome);
router.get('/search/rovers/:rover/photos', marsController.checkAllows);
router.get('/search/rovers/:rover/photos', marsController.search);
router.get('/search/rovers/user-information', marsController.checkAllows);
router.get('/search/rovers/user-information', marsController.sendUserInformation);
router.get('/log-out', marsController.logOut);
/*
router.get('/get-manifest', marsController.checkAllows);
router.get('/get-manifest', marsController.getManifest);
*/





module.exports = router;
