import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@leadsassurance.com';
  const plain = 'admin123';

  const hashed = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      firstname: 'Administrateur',
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashed,
      firstname: 'Administrateur',
      role: 'ADMIN',
      credits: 0,
    },
  });

  console.log('✅ Admin upserted:', user.email);
  console.log('   credentials: admin@leadsassurance.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
