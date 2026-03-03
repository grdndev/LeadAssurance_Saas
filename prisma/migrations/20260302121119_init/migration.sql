-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BROKER', 'PROVIDER', 'ADMIN');

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
