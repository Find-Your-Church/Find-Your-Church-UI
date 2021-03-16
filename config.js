module.exports = {
	TRIAL_PERIOD: 1, // free trial period
	PENDING_EXPIRATION: 172800000, // 48 hours in milliseconds
	VERIFY_EXPIRATION: 172800000, // 48 hours in milliseconds
	PASSWORD_LENGTH: 20, // length of generated password

	/**
	 * MongoDB URL from system environment variable "MONGO_URL".
	 */
	MONGO_URL: process.env.MONGO_URL, //mongodb+srv://fyc_dev:xv6oMNPIVhyRMc6v@find-your-church-dev-x66hs.mongodb.net/test?retryWrites=true&w=majority

	/**
	 * Secret key for JWT
	 */
	SECRET_KEY: process.env.JWT_KEY, //Yw6#ew*7$&fgbFu

	/**
	 * This setting is used only for the content of the mails with link to ... (in forgot-password)
	 */
	FRONT_URL: process.env.FRONT_URL, //https://develop-app.everydaybelievers.com

	/**
	 * TODO: must be replaced for production
	 * everydaybelievers Mailer
	 */
	MAIL_SG_API: process.env.SEND_GRID_API_KEY, //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
	MAIL_SENDER: process.env.MAIL_SENDER_ADDRESS, //do-not-reply@everydaybelievers.com

	/**
	 * TODO: must be replaced for production
	 * Secret key for Stripe payment.
	 * This key must be only here securely.
	 *
	 * DO NOT SHARE THIS KEY EXTERNALLY.
	 */
	STRIPE_SK: process.env.STRIPE_SK, //sk_test_TfCg96voiaBUAmLg9odvjT7y
	SUBSCRIBER_MONTHLY_PLAN: process.env.STRIPE_MONTHLY_PLAN, //plan_HDYf9XONMdKES8

	/**
	 * Secret key for AWS
	 */
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID, //AKIAU2BXXVEJ3ERNIW5E
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY, //cvz2/o8ToBC8o4OgjlNr+0cDBRkLs2xbCUMp/Wg1
	AWS_STORAGE_BUCKET_NAME: process.env.AWS_STORAGE_BUCKET_NAME, //community-files-dev
};