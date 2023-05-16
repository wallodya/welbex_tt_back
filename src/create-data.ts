import { randomUUID } from "crypto";
import { prisma } from "./prisma";
import * as bcrypt from "bcrypt"

const main = async () => {
    try {        
        const password = "1234"
        const hashedPassword = await bcrypt.hash(password, 5)
        const uuid = randomUUID()
    
        const newUser = await prisma.person.create({
            data: {
                login: "User1",
                password: hashedPassword,
                email: "User1@test.com",
                uuid: uuid,
                createdAt: Date.now()
            }
        })
        console.log("User created: ", newUser)
    } catch (error) {
        console.log("Error: ", error)
    }
}

main()
    .catch((err) => console.log("Err: ", err))
    .finally( async () => {
        await prisma.$disconnect()
    })