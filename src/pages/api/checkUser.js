import { PrismaClient } from '@prisma/client'
const bcrypt = require('bcryptjs');


export default async function handler(req, res) {

    const data = req.body;
    const prisma = new PrismaClient();

    const result = await prisma.users.findUnique({
        where:{
            user_name:data.username
        }
    })

    var exists;



    if (result) {
        exists=true;
    } else {
        exists=false;
    }
    
    res.status(200).send({exists:exists});
}