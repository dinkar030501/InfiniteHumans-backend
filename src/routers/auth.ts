import { Router } from "express"

import { authController } from "@/controllers/auth"
import { authenticateUser } from "@/middlewares/auth"
import { userController } from "@/controllers/user"

const router = Router()

router.post("/login", authController.login)

router.post("/signup", userController.addUser)

router.put("/logout", authenticateUser(), authController.logout)

router.get("/logged-in-user", authController.getLoggedInUser)

router.put(
    "/reset-password",
    authenticateUser(),
    authController.resetMyPassword
)

export default router
