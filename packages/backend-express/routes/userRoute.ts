import express from "express";
import multer from "multer";

import AppError from "../utils/AppError";
import { CreateUser } from "../controllers/AuthController";
import { EmailVerification } from "../controllers/AuthController";
import { ConfirmEmailVerification } from "../controllers/AuthController";
import { LoginUser } from "../controllers/AuthController";
import { protect } from "../controllers/Auth/protect";
import { RestrictTo } from "../controllers/Auth/restrictTo";
import { PasswordReset } from "../controllers/Auth/updateUser";
import { ConfirmPasswordReset } from "../controllers/Auth/confirmPassword";
import { OAuth2 } from "../controllers/AuthController";
import { getAllUsers } from "../controllers/Auth/getAllUsers";
import { DeleteUser } from "../controllers/Auth/deleteUser";
import { DeactivateAccount } from "../controllers/Auth/deactivateAccount";
import { ActivateAccount } from "../controllers/Auth/activateAccount";
import { ProfilePicture } from "../controllers/Auth/profilePicture";

const router = express.Router();

// configure multer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {fileSize: 300 * 1024}, //setting limit to 300kb
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)){
            return callback(new AppError("Only image files are allowed!", 401))
        }else{
            callback(null, true)
        }
    },
})

router.get('/records', protect, RestrictTo('admin'), getAllUsers);
router.post('/register', CreateUser);
router.patch('/deactivate', protect, DeactivateAccount);
router.patch('/activate', protect, ActivateAccount);
router.post('/auth-with-password', LoginUser);
router.post('/request-password-reset', PasswordReset);
router.post('/confirm-password-reset', ConfirmPasswordReset)

router.delete('/records/:id', protect, RestrictTo('admin'), DeleteUser);
router.patch('/request-verification/:emailToken', EmailVerification);
// router.post('/resend-verification', ResendVerification);
router.post('/auth-with-oauth2/:code', OAuth2);
router.post('/confirm-verification/:token', ConfirmEmailVerification);

router.patch('/updateProfile',protect, upload.single('file'), ProfilePicture);
export default router;