import { Router } from "express";
import passport from "passport";
import authController, { AuthController } from "./auth.controllers";
import requireUserHandler from "@middlewares/requireUserHandler";

class AuthRouter {
	public router: Router;
	private authController: AuthController = authController;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(200).send("Auth router OK"));

		this.router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

		this.router.get(
			"/google/callback",
			passport.authenticate("google", { session: false }),
			this.authController.authenticateGoogleUser,
		);

		this.router.get(
			"/protected",
			[passport.authenticate("jwt", { session: false })],
			this.authController.protectedRoute,
		);

		this.router.post("/login", this.authController.authenticateUser);

		this.router.get("/me", [requireUserHandler], this.authController.getCurrentUser);

		this.router.put("/me", [requireUserHandler], this.authController.updateCurrentUser);

		this.router.post("/refresh", [requireUserHandler], this.authController.refreshAccessToken);
	};
}

const authRouter = new AuthRouter();

export default authRouter.router;
