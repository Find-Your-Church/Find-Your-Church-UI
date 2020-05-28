
const app_config = {
	FYC_API_URL: process.env.REACT_APP_API_URL,
//	FYC_API_URL: "https://api-dev.findyourchurch.org",
//	FYC_API_URL: "https://api-uat.findyourchurch.org",
//	FYC_API_URL: "http://192.168.1.5:5000",

	US_PHONE_PATTERN: "[(]?[0-9]{2,3}[)-]?[ ]?[0-9]{3}[ -]?[0-9]{4}",
	MAX_PIC_SIZE: 3072, // in kBs, = 3MB
	MAX_PIC_COUNT: 6,
	MAX_TOTAL_SIZE: 16793599, // in Bytes, < 16793600 = 16MB

	/**
	 * Public key for Stripe payment.
	 *
	 * This is a test key.
	 * Publishable key: pk_live_nPL4q6SyxeqSknHK2Hs3wHta
	 */
	STRIPE_PK: "pk_test_6qf5BlgEkll3m5hyijnz2oiq",

	GOOGLE_CLIENT_ID: "227195592965-n46c6icevure2cjo07p1fcnad10bege6.apps.googleusercontent.com",

	FACEBOOK_APP_ID: "123456789",

	GOOGLEMAP_API_KEY: "AIzaSyAHmAy2d4gujgzmbjA8_fujQq-LwFy1J2c",
};

export default app_config;
