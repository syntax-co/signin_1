import { PrismaClient } from '@prisma/client'
const bcrypt = require('bcryptjs');


export default async function handler(req, res) {

    const data = req.body;
    const prisma = new PrismaClient();

    // maybe precheck if account exists
    // currently testing
    // add at the end
    
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(data.password, salt);
    
    const result = await prisma.users.create({
        data:{
            user_name:data.username,
            password:hash
        }
    });


    if (result) {   
        res.status(200).send({'success':true});
    } else {
        res.status(404).send({'success':false});
    }

}