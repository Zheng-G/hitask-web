# .env config file

Use hidden `.env` file to store sensitive config data for production build & deploy. You actually will not need this file for development. For correct work `.env` file must contain:

|Variable name|Description|Required in|
|---|---|---|
|PUBLISH | Boolean global param to allow deployment. Set `PUBLISH=true` to enable | Webapp, desktop, extensions |
|GAUTH_CLIENT_SECRET_TESTASK | Google OAuth2 secret for testask env | Desktop |
|GAUTH_CLIENT_SECRET_PRODUCTION | Google OAuth2 secret for production env | Desktop |
|CHROME_STORE_SECRET | Google Chrome store secret key for extension uploads| Extensions |
|SENTRY_PRIVATE_DSN  | Sentry private API key for sentry bug reporting | Desktop |
|SENTRY_API_TOKEN | Sentry access token, used for sourcemaps uploading | Desktop |
