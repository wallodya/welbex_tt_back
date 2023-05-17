import { randomInt, randomUUID } from "crypto";
import { prisma } from "./prisma";
import * as bcrypt from "bcrypt"


const generateUsers = async (amount: number) => {

    const fakeUsers = 
        Array<{login: string; password: string; email: string}>(amount)
            .fill({login: "", password: "1234", email: "" })

    fakeUsers.forEach(async (user, index) => {
        const uuid = randomUUID()
        const hashedPassword = await bcrypt.hash(user.password, 5)
        
        await prisma.person.create({
            data: {
                login: `FakeUser${index}`,
                email: `FakeUser${index}@test.com`,
                uuid,
                password: hashedPassword,
                createdAt: Date.now()
            }
        })
        console.log(`FakeUser${index} created`)
    })
}

const generatePosts = async (amount: number) => {
    for await (let i of Array(amount).fill(0).map((_, index) => index)) {
        const postId = randomUUID()
        await prisma.message.create({
            data: {
                author: {
                    connect: {
                        user_id: randomInt(1, 23)
                    },
                },
                uniqueMessageId: postId,
                text: `Fake post ${i}`,
                mediaURL: null,
                createdAt: Date.now() - randomInt(0, 7 * 24 * 60 * 60 * 1000)
            }
        })
    }
}

const main = async () => {
    try {        
        await generatePosts(100)
        console.log(">>>Randow posts generated")
        return
    } catch (error) {
        console.log("Error: ", error)
    }
}

main()
    .catch((err) => console.log("Err: ", err))
    .finally( async () => {
        await prisma.$disconnect()
    })