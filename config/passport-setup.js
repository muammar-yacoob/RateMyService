const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
},
async (accessToken, refreshToken, profile, cb) => {
    const dummyUser = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
    };
    cb(null, dummyUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = { id: id, name: "Dummy User" };
    done(null, user);
});
