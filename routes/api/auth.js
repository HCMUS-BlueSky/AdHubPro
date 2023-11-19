const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (
      !username ||
      !password ||
      !email ||
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof email !== 'string'
    )
      throw new Error('Invalid username, email or password!');
    const exists = await User.exists({ email });
    if (exists) throw new Error('Email already in used');
    if (password.length < 8) throw new Error('Password too short');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const user = await newUser.save();
    if (!user) throw new Error('Something went wrong!');
    return res.send('User registered!');
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      !password ||
      !email ||
      typeof password !== 'string' ||
      typeof email !== 'string'
    )
      throw new Error('Invalid email or password!');

    const user = await User.findOne({ email }).exec();

    if (!user) throw new Error('Email or password is incorrect!');

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) throw new Error('Email or password is incorrect!');

    const accessToken = jwt.sign(
      {
        id: user.id
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '3000s'
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '2d'
      }
    );
    user.refresh_token = refreshToken;
    await user.save();

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000
    });
    res.json({ access_token: accessToken });
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.post('/logout', async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refresh_token;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (user) {
    user.refresh_token = null;
    await user.save();
  }
  res.clearCookie('refresh_token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true
  });
  res.sendStatus(204);
});

router.post('/logout', async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refresh_token;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (user) {
    user.refresh_token = null;
    await user.save();
  }
  res.clearCookie('refresh_token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true
  });
  res.sendStatus(204);
});

// Use refresh token to generate new access token if it expires
router.post('/refresh', async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refresh_token;
  if (!refreshToken) return res.sendStatus(403);

  const user = await User.findOne({ refresh_token: refreshToken }).exec();
  if (!user) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || decoded.id !== user.id) return sendStatus(403);

      const accessToken = jwt.sign(
        {
          id: user.id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '3000s'
        }
      );

      return res.json({ access_token: accessToken });
    }
  );
});

module.exports = router;