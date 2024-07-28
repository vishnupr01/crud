import express from'express'
import { AdminProtect } from '../middleware/adminMiddleware.js';
import { authAdmin, loadUsers,adminProfileUpdate,adminUpdate,deleteUser,AdminLogOut } from '../controller.js/adminController.js'
const router = express.Router();
router.post('/adminlogin',authAdmin)
router.get('/loadUsers',AdminProtect,loadUsers)
router.get('/adminProfileUpdate',AdminProtect,adminProfileUpdate)
router.put('/adminUpdate',AdminProtect,adminUpdate)
router.delete('/deleteUser',AdminProtect,deleteUser)
router.post('/adminLogOut',AdminLogOut)
export default router