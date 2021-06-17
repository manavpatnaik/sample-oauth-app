const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const User = require('./models/User');

passport.use(
  'googleToken',
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          'googleUser.id': profile.id,
        });
        if (existingUser) {
          console.log('User already exists');
          return done(null, existingUser);
        }

        console.log('We are creating a new google user');

        const newUser = new User({
          method: 'google',
          googleUser: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
