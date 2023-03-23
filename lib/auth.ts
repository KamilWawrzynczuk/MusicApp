import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from './db';

export const validateRoute = (handler) => {
    return async (req: NextApiRequest, res: NextApiResponse)=> {

        const { TRAX_ACCESS_TOKEN: token} = req.cookies

        if(token) {
            let user;
            try {
                const {id} = jwt.verify(token, process.env.JWT_SECRET);
             
                user = await db.user.findUnique({
                    where: {
                        id
                    }
                })

                if(!user) {
                    throw new Error('Not real user');
                }
            } catch (error) {
              return res.status(401).json({error: 'Error while getting user'});
            }

            return handler(req,res,user)
        }

        return res.status(401).json({error: 'Unauthorized'});
    }
}