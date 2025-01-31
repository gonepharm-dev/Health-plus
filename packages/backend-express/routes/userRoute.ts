import express from "express";
import multer from "multer";

import { ConfirmEmailVerification, ConfirmPasswordReset, CreateUser, EmailVerification, LoginUser, OAuth2, PasswordReset, protect, RestrictTo } from "../controllers/AuthController";
import { ActivateAccount, DeactivateAccount, DeleteUser, getAllUsers, ProfilePicture } from "../controllers/userController";
import AppError from "../utils/AppError";

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
router.post('/request-verification', EmailVerification);
router.post('/request-password-reset', PasswordReset);
router.post('/confirm-password-reset', ConfirmPasswordReset)

router.delete('/records/:id', protect, RestrictTo('admin'), DeleteUser)
router.post('/auth-with-oauth2/:code', OAuth2);
router.post('/confirm-verification/:token', ConfirmEmailVerification);

router.patch('/updateProfile',protect, upload.single('file'), ProfilePicture);
export default router;