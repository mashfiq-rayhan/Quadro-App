import config from "config";
import GoogleStrategy from "passport-google-oauth2";
import usersService from "@modules/users/user.services";

const options = {
	clientID: config.get<string>("google_client_id"),
	clientSecret: config.get<string>("google_client_secret"),
	callbackURL: config.get<string>("google_callback_url"),
	passReqToCallback: true,
};

const googleStrategy = new GoogleStrategy(options, async (request, accessToken, refreshToken, profile, done) => {
	const existingUser = await usersService.findOne({ googleId: profile.id });
	// if user exists return the user
	if (existingUser) {
		return done(null, existingUser);
	}

	try {
		// if user does not exist create a new user
		const newUser = await usersService.createUserGoogle({
			name: profile.displayName,
			email: profile.emails[0].value,
			method: "google",
			googleId: profile.id,
			profilePicture: profile.photos[0].value,
		});
		return done(null, newUser);
	} catch (error) {
		return done(error, false, { message: "Google login failed." });
	}
});

export default googleStrategy;
