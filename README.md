# NDB2 Web Dashboard

This web dashboard allows Discord users to browse their NDB2 predictions through a web portal for a better experience.

## Getting Started

1. Clone this repository
2. `npm install`
3. Install the Tailwind CSS VSCode settings for better developer experience
4. Ensure you have a Discord account
5. Set up a development Discord Server
6. Set up a Discord Application for development
7. Set up a local copy of the NDB2 API.
8. Set up your environment variables (see below) using the example file `.env.example`
9. Launch dev server `npm run dev`

### Discord Account

You will require a discord account for this development. Visit [discord.com](https://www.discord.com) to set one up.

Your account will need to be in "Developer Mode". Go your User Settings > App Settings > Advanced and ensure "Developer Mode" is toggled on.

### Development Discord Server

To make things easy to test against, it's best to have a local development Discord server which the application will check for authentication of roles. We recommend a private server that you can use as a playground rather than using something live. The development server should have the following characteristics:

1. At least one role that you can use as an authenticated role (The application is limited to users who are in a specific discord with a specific role)
2. Your Discord account should be a member of it
3. Your Discord account should have an authenticated role

### Discord Application Setup

In order to use the authentication service of this application, you'll need a Discord developer application for use in development.

1. Visit the Developer Portal for Discord [here](https://discord.com/developers/docs/intro) to learn how it all works
2. Create an application [here](https://discord.com/developers/applications) with a name like `NDB2_dev` or something similar
3. Copy your Client ID and Client Secret to somewhere safe (you may need to go the OAuth section to find them). Set these in your local environment variables under the variable names `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`.
4. Add a Redirect URI to your application under the OAuth section. It should be your `VERCEL_URL` from your .env file with the path of "/api/auth/oauth" and the correct protocol (http for local dev), for example (`http://localhost:3000/api/auth/oauth`)

### NDB2 API Setup

To get data for the site, the Web Portal will require access to an API. You can set up a local copy of this API by following the instructions in the API repository [here](https://github.com/mendahu/ndb2).

Remember to copy over your API Key that you choose for the API as you'll need it for this application as well.

### Environment Variables

All the Environment variables in the example file will need to be set up.

1. Copy `.env.example` to `.env` so that it is picked up by `.gitignore`
2. Ensure you have the `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` from your Discord application (previous step) copied in.
3. Copy your Development Discord Server Guild ID into the `OFFNOMDISCORD_GUILD_ID` variable. You can get this by going into your server, right-clicking on the server name at the top left, and selecting `Copy Server ID`. You will need to be in developer mode to do this (see the step about your Discord Account)
4. Create a `JWT_Secret`. This can literally be any string.
5. Copy the `NDB2_API_KEY` variable you made when setting up your NDB2 API to this file
6. Add at least one authenticated role into any of the `ROLE_ID_` variables. You can get the role id from your Development Server by visiting Server Settings > Roles, right clicking on the authenticated role, and selecting `Copy Role ID`. You need to be in the developer mode to do this (See previous step about your Discord Account.)
