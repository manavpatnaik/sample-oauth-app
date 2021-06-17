const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ 'local.email': email });
  if (user) return res.status(400).send({ Error: 'User already registered' });

  const newUser = new User({
    email,
    password,
  });
  await newUser.save();
  res.status(201).send({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ 'local.email': email });
  if (!user) return res.status(400).send({ Error: 'User not registered' });

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    return res.status(400).send({
      Error: 'Invalid password',
    });
  }

  const token = signToken(user);
  res.status(200).send({ token });
});

module.exports = router;
