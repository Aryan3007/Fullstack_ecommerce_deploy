import  express  from "express";
import {registerController, loginController, updateProfileController} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//router object

const router=express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/test',requireSignIn,isAdmin)
router.get('/user-auth',requireSignIn, (req, res)=>{
    res.status(200).send({ok:true})
})

router.get('/admin-auth',requireSignIn,isAdmin, (req, res)=>{
    res.status(200).send({ok:true})
})

router.put("/profile", requireSignIn, updateProfileController)

export default router