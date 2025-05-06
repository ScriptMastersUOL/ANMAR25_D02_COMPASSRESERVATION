import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
    const name = process.env.SEED_USER_NAME;
    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;
    const phone = process.env.SEED_USER_PHONE || '71999999999';

    return prisma.user.create({
        data: {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            phone,
        },
    });
}

seed()
    .then(async () => {
        await prisma.$disconnect();
    }).catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    }).finally(() => {
        console.log("Seed Finish!!");
    });