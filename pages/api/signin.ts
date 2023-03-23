import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { db } from '../../lib/db';

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

 
  if (user && await bcrypt.compareSync(password, user.password)) {
   
    const token = jwt.sign(
      { id: user.id, email: user.email, time: Date.now() },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    );

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    );

    res.status(200).json({ message: 'User logged in' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
}
