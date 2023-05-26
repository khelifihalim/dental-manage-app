const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDoctorInfoController, updateProfileController, getDoctorByIdController } = require("../controllers/doctorCtrl");
const router = express.Router();

//POST SINGLE DOCTOR INFO from back to front
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST UPDATE PROFILE FORM FRONT TO END
router.post("/updateProfile", authMiddleware, updateProfileController);


//GET SINGLE DOC INFO
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)


module.exports = router;