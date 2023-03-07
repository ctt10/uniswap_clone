import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
	console.log("prisma", prisma);
}

main()
.catch(e=> {
	console.log(e.message)
})
.finally(async() => {
	await prisma.$disconnect();
})