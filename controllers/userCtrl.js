const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");

//register callback---------------------------------------------------------------
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "user already exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({ message: "Register Succesfylly", success: true });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: `Register controller 1 ${error.message}`,
    });
  }
};

//login callback---------------------------------------------------------------
const loginController = async (req, res) => {
  try {
    //verifier si l'utilisateur existe dans la bd
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    //verification et comparer si le mot de passe correspond , par
    //le decriptage de l'ancien mot de passe
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "invalide Email or password", success: false });
    }
    //login en utilisant le token ----------------------------------------------------------------
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "login success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

//Apply Doctor CTRL ====================================================================
const applyDoctorController = async (req, res) => {
  try {
    //create the doctor profile (new doctor)
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    //save the new doctor
    await newDoctor.save();
    //find the admin doctor or user
    const adminUser = await userModel.findOne({ isAdmin: true });
    //notificate the admin
    const notification = adminUser.notification;
    //push the notification into an empty array of notification in the admin userModel
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    }
    );

    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying Doctor",
    });
  }
};

//Notification CTRL ==========================================================
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notifications Are Read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

//Delete all notifications =======================================================
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "can\t Delete All Notifications",
      error,
    });
  }
};

//GET ALL DOC CONTROLLER ==============================================
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await userModel.find({isDoctor : true })
    res.status(200).send({
      success: true,
      message: "All Doctors List",
      data:doctors
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error in get All Doctors!",
      success: false,
      error,
    })
  }
}

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
};
