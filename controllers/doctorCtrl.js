const doctorModel = require("../models/doctorModel");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor Data Fetch Succcess",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Fetching Doctor Details",
    });
  }
};

//UPDATE DOCTOR PROFILE CTRL
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated Succesfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Updating doctor Profile failed",
      error,
    });
  }
};

//GET SINGLE DOCOTOR INFO CTRL
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({_id: req.body.doctorId})
    res.status(200).send({
      success: true,
      message:"single doc info",
      data: doctor,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error Fetching Doctor Info",
      error,
    })
  }
}

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController };
