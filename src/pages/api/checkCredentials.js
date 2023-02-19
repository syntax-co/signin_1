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

    var correct_credentials;



    if (result) {

        const check = await bcrypt.compare(data.password, result.password);

        if (check) {
            correct_credentials=true;
        } else {
            correct_credentials=false;
        }

    } else {
        correct_credentials=false;
    }
    
    res.status(200).send({correct:correct_credentials});
}