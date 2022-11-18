import LocalStrategy from "passport-local";
import usersService from "@modules/users/user.services";
import log from "@providers/logger.provider";

const localStrategy = new LocalStrategy.Strategy({ usernameField: "email" }, async (email, password, done) => {
	log.info("[passport] local strategy", email);

	try {
		// Find user by email
		const user = await usersService.findUserByEmail(email);

		if (!user) {
			return done(null, false, { message: `email ${email} not found.` });
		}

		// Verify password
		const isValid = await usersService.verifyUserPassword(user.password, password);

		if (!isValid) {
			return done(null, false, { message: "Invalid credentials." });
		}

		// Return user
		return done(null, user, { message: "Logged in Successfully" });
	} catch (error) {
		log.error(error, "Could not login user");
		done(error);
	}
});

export default localStrategy;
