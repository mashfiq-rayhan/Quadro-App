import config from "config";
import jwt from "jsonwebtoken";
import { IJwtPayload, IJwtPrivateKey, IJwtPublicKey } from "@common/types/jwt.types";
import log from "@providers/logger.provider";
import { Websocket } from "@src/socket";
import { SOCKET_PATHS } from "@common/const/socket.const";
import SessionModels from "@modules/auth/session.models";
import { SessionDoc } from "./auth.schema";

export class AuthMongoServices {
	public getToken = (
		payload: object,
		keyName: IJwtPrivateKey,
		minutes: number | undefined = undefined,
	): string | undefined => {
		const options: jwt.SignOptions = {
			algorithm: "RS256",
		};

		if (minutes) {
			const oneMin = 60000;
			options.expiresIn = minutes * oneMin;
		}

		return jwt.sign(payload, this.getKey(keyName), options);
	};

	public verifyToken = <T>(token: string, keyName: IJwtPublicKey): T | undefined => {
		return jwt.verify(token, this.getKey(keyName)) as T;
	};

	public signAccessToken = (user, minutes: number = 20): string | undefined => {
		const payload: IJwtPayload = {
			sub: user._id.toString(),
			email: user.email,
			name: user.name,
			iat: new Date().getTime(),
			issuer: "quadro",
			audience: "quadro",
		};

		return this.getToken(payload, "access_token_private_key", minutes);
	};

	public signRefreshToken = async (user): Promise<string | undefined> => {
		const session = await this.createSession(user);

		return this.getToken(
			{ session: session._id.toString(), iat: new Date().getTime() },
			"refresh_token_private_key",
		);
	};

	public createSession = async (user): Promise<SessionDoc> => {
		return await SessionModels.create({ user: user._id });
	};

	public notifyLogin = (email: string): void => {
		log.info("[service] notifyLogin");
		log.info("[socket] Notifying login to socket");

		const io = Websocket.getInstance();
		io.of(SOCKET_PATHS.AUTH).emit("logged_in", { data: { email } });
	};

	private getKey = (keyName: IJwtPrivateKey | IJwtPublicKey): string =>
		Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

	public findSessionById = async (id: string): Promise<SessionDoc> => {
		log.info("[service] findSessionById");

		return await SessionModels.findById(id).orFail().exec();
	};
}

const authMongoService: AuthMongoServices = new AuthMongoServices();

export default authMongoService;
