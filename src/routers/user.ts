import { Router } from "express"

import { authenticateUser } from "@/middlewares/auth"
import { userController } from "@/controllers/user"

const router = Router()

router.put(
    "/user/profile",
    authenticateUser(),
    userController.updateUserProfile
)

export default router
