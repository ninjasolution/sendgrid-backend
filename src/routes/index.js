const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const fileController = require("../controllers/file.controller");
// const middlewares = require("../middleware");
// const authController = require("../controllers/auth.controller");
// const userController = require("../controllers/user.controller");

// router.post("/auth/signup", [middlewares.verifySignUp.checkRolesExisted], authController.signup)
// router.post("/auth/signin", authController.signin)
// router.post("/auth/signout", authController.signout)
// router.get("/auth/verifyEmail/:id/:token", authController.verifyEmail)
// router.get("/auth/verifyPhoneNumber/:id/:token", authController.verifyPhoneNumber)
// router.post("/auth/forgot", authController.forgot)
// router.get("/auth/requestEmailVerify", middlewares.authJwt.verifyToken, authController.requestEmailVerify)
// router.get("/auth/requestPhoneVerify", middlewares.authJwt.verifyToken, authController.requestPhoneVerify)
// router.get("/auth/rest/:token", authController.reset)
// router.put("/auth/rest", authController.changePassword)

// router.get("/user", middlewares.authJwt.verifyToken, userController.allUsers);
// router.get("/user/check-verification", middlewares.authJwt.verifyToken, userController.checkVerification);
// router.get("/user/:id([0-9]+)", [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], userController.getUser);
// router.put("/user", middlewares.authJwt.verifyToken, userController.update);
// router.delete("/user/:id([0-9]+)", [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], userController.delete);


router.get("/email/:fileName", /* [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], */ mailController.sendEmail)
router.get("/file/:fileName", /* [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], */ fileController.getFile)
router.get("/files", /* [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], */ fileController.getAllFiles)
router.post("/file", /* [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], */ fileController.upload, fileController.fileHandle)
router.delete("/file/:fileName", /* [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], */ fileController.upload, fileController.delete)

module.exports = router;
