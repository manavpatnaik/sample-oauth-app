const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateUser = require('../middleware/authenticateUser');

const signToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ Error: 'Missing fields' });
  const user = await User.findOne({ 'localUser.email': email });
  if (user) return res.status(400).send({ Error: 'User already registered' });

  const newUser = new User({
    method: 'local',
    localUser: {
      email,
      password,
    },
  });
  await newUser.save();
  res.status(201).send({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ 'localUser.email': email });
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

router.get('/secretResource', authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send({ msg: 'You did it', user });
});

module.exports = router;
