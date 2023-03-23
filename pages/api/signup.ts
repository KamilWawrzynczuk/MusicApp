import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { db } from '../../lib/db';

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const salt = await bcrypt.genSalt(10);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  let user;

  try {
    user = await db.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'User already exists' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      time: Date.now(),
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
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

  return res.status(201).json({ message: 'User created' });
}
