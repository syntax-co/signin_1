import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {

    const data = req.body;
    const prisma = new PrismaClient();
    const delim = ';**;';
    var didVote = false;

    const results = await prisma.picks.findUnique({
        where:{
            pick_key:data.betkey
        }
    })

    if (results) {
        
        const foundUsers = results.users_voted;
        const userList = foundUsers.split(delim);
        
        if (userList.includes(data.username)) {
            didVote=true;
        }
        res.status(200).send({
            didVote:didVote,
            okay:true
        });
    } else {
        res.status(404).send({okay:false});
    }


    
    
}