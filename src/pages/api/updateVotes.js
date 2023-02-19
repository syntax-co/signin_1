import { PrismaClient } from '@prisma/client'

const toBytes = (string) => Array.from(Buffer.from(string, 'utf8'));
const fromBytes = (byteArray) => String.fromCharCode(...byteArray);


export default async function handler(req, res) {

    const data = req.body;
    const prisma = new PrismaClient();
    const pick_title =  data.bet;
    const currentPick = data['pick']
    
    
    const delim = ';**;';

    const result = await prisma.picks.findUnique({
        where:{
            pick_key:data.betkey
        }
    })
    

    
    
    if (result) {
        const finalData = {}
        var votedUsers = result.users_voted;
        
        votedUsers = votedUsers + `${data.user}${delim}`;
        
        finalData[data.pick]=result[data.pick]+1;
        finalData['users_voted']=votedUsers;


        await prisma.picks.update({
            where:{
                pick_key:data.betkey
            },
            data:finalData
        });

    } else {
        const finalData = {}
        finalData[data.pick]=1;

        const votedString = `${data.user}${delim}`;
        
        // creates model in base
        await prisma.picks.create({
            data:{
                pick_key:data.betkey,
                pick_1:0,
                pick_2:0,
                pick_3:0,
                pick_4:0,
                users_voted:votedString
            }
        })

        // udpates new model
        await prisma.picks.update({
            where:{
                pick_key:data.betkey
            },
            data:finalData
        });
    }




    
    res.status(200).send({'success':true});
}