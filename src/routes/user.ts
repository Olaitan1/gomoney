
import express from 'express' 
import { RegisterUser, userLogin } from '../controller/user'



 const router = express.Router()

router.post('/register', RegisterUser);
router.post('/login', userLogin)

export default router