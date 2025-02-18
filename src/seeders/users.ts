import bcrypt from "bcrypt"

import { UserModel } from "@/models/user"

const testUser = {
    name: "Test User",
    email: "test@test.com",
    mobile_number: "9999999999",
    password: "test",
}

export const seedUser = async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10)

    testUser.password = hashedPassword

    await UserModel.findOneAndUpdate({ email: testUser.email }, testUser, {
        upsert: true,
    })
}
