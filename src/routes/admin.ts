
import express from 'express' 
import { RegisterAdmin, AdminLogin } from '../controller/admin'



 const router = express.Router()

router.post('/register', RegisterAdmin);
router.post('/login', AdminLogin)

export default router