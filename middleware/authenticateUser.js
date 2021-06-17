const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(400).send({
      Error: 'Token Missing',
    });
  const token = req.headers.authorization.split(' ')[1];
  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401).send({ Error: 'Access Denied - Invalid Token' });
  }

  req.user = user;
  next();
};
