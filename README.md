This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project structure

In the project directory, you can see:
```
+<project_root>
|-api - simple api server for authentication & data store
|-public - public html assets
+-src - main source tree root
  |-actions - redux actions
  |-components - react ui components
  |-img - images
  |-pages - react ui pages that include components
  |-reducers - redux reducers
  |-store - redux storage of states
  |-utils
    +-setAuthToken.js - auth token manager
  |-App.css - main app component's style sheet
  |-App.js - main app componenet with url routes
  |-auth-config.js - social auth IDs
  |-index.js - project start point
  +-logo.svg - site logo image
```

## Front-end framework

<<<<<<< HEAD
### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
=======
### `npm install`
This command must be run once when building the project the 1st.
### `set port=8000`
### `npm start`

And go to `http://localhost:8000`
>>>>>>> forgot-password

## Back-end API

### 1st of all, get changed a file:
``In a file: <project folder>/package.json``
```
...
"proxy": "http://127.0.0.1:5000",
...
```
This configuration is just for the running of back-end.
### Install mongodb on the server.

### Run the back-end api application:
```
> cd api
> npm install
> npm start
```

## Social authentication

For social (Google and Facebook) authentications, see a file: `<project folde>/src/auth-config.json`
```
{
  "GOOGLE_CLIENT_ID": "123456789",
  "FACEBOOK_APP_ID": "123456789"
}
```
Before testing, got to write valid IDs here.
