const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const date=new Date();



const customerRole=[
  {role_name:"operator",
  created_at_date:date,
  updated_at_date:date},
  {role_name:"driver",
    created_at_date:date,
    updated_at_date:date},
    {role_name:"owner",
      created_at_date:date,
      updated_at_date:date}

]

const empLevel = [
  {
   name:"LEVEL_ONE"
  },
  {
    name:"LEVEL_TWO"
   },
   {
    name:"ADMIN"
   }
  
]






async function main() {
  const hashedPass = await bcrypt.hash("0987654321", 10);
  const admin=[
    {
     name:"superAdmin",
     phone_number:"0987654321",
     email:"superasmin@gmail.com",
     user: {
       create: {
         user_email:"superadmin@gmail.com",
         user_password: hashedPass,
         statusId:2
       },
     },
     level: {
       connect: {
         id: 3,
       },
     },
   }
 ]
  console.log(`Start seeding ...`)
  for (const u of empLevel) {
    const Employee_levels = await prisma.employee_levels.create({
     data: u,
    })
  }
 // for (const u of customerRole) {
   // const customerRole = await prisma.customer_roles.create({
    //  data: u,
   // })
 // }
  for (const u of admin) {
    const Employee_levels = await prisma.employees.create({
      data: u,
    })
  }
  console.log(`ADMIN Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })