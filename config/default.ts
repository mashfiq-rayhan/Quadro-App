export default {
	port: process.env.PORT || 3050,
	log_level: process.env.LOG_LEVEL || "info",
	mongo_url: process.env.MONGO_URL,
	jwt_secret: process.env.JWT_SECRET,
	access_token_public_key: process.env.ACCESS_TOKEN_PUBLIC_KEY,
	access_token_private_key: process.env.ACCESS_TOKEN_PRIVATE_KEY,
	refresh_token_public_key: process.env.REFRESH_TOKEN_PUBLIC_KEY,
	refresh_token_private_key: process.env.REFRESH_TOKEN_PRIVATE_KEY,
	google_client_id: process.env.GOOGLE_CLIENT_ID,
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.GOOGLE_CALLBACK_URL,
};
