import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
    return prisma.user.create({
        data: {
            name: 'Breno Cidade',
            email: 'brenocidade@example.com',
            password: await bcrypt.hash('securepassword123', 10),
            phone: '71999999999',
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