import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { auth0Id: "demo-auth0-admin" },
        update: {},
        create: { auth0Id: "demo-auth0-admin", email: "admin@example.com" },
    });

    await prisma.demoAuth.upsert({
        where: { username: "admin" },
        update: { password: "admin123" },
        create: {
            userId: user.id,
            username: "admin",
            password: "admin123",
        },
    });

    await prisma.demoAuth.upsert({
        where: { username: "alice" },
        update: { password: "alicepw" },
        create: { username: "alice", password: "alicepw", userId: user.id },
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
