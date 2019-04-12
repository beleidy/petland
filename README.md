# Petland

Petland is a web app that allows you to create a page for your pet. Upload an image and you and others can leave comments on your pet's page.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* NodeJS with npm -- https://nodejs.org/en/
* Firebase-cli  https://github.com/firebase/firebase-tools  ```npm install -g firebase-tools```
* A firebase project to use for database an file storage, this can be a seperate project to where you host your production version. -- https://firebase.google.com/


### Installing

#### Set up your local development directory
This sets up a `petland` directory in your home directory. For other locations substitute `~` for your preferred location.
Clone the code and install the node modules.
```
cd ~
git clone https://gitlab.com/beleidy/petland.git
cd petland
npm install
```


#### Set up your firebase project
https://firebase.google.com/docs/web/setup

Once your project has been created, go to Database on the side menu and enable Realtime Database. You will need to add database rules to only allow authenticated users to write to the database. This means only users who have signed-in are able to add pets or comment on pet pages. The rules look like this:
```
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

Then go to Storage in the side menu, and enable it. You will also need to add storage rules to only allow authenticated users to upload files.
```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

#### Connect your firebase project to your facebook developer account
For users to be able to sign in using Facebook, your firebase project needs to be regesitered under your Facebook developer account. If you don't already have one, you can set up one here https://developers.facebook.com/

To connect your app, follow Firebase documentation instructions in the before you begin section here https://firebase.google.com/docs/auth/web/facebook-login#before_you_begin

#### Run the app locally
Login on the cli-tools and connect the local directory to your project. Since the app is using firebase aliases to seperate staging and production enviornments, you will need to setup at least a staging alias for local development. If you would also like to push to production, you will need to setup a production alias too. For more information about Firebase aliases see https://firebase.google.com/docs/cli/#project_aliases
```
firebase login
firebase use --add
```
Follow instructions and add the alias `staging` to the project you'd like to use for development. Once you've completed this susccessfully, you can start the app.
```
npm start
```

If this hasn't happened automatically, point your browser to ```http://localhost:3000/``` and you should see the app running.

## Deployment

To deoply to your project, first we build it, and then tell firebase to deploy. If you are running both staging and production projects, make sure you are using the correct alias before you build and deploy: ```firebase use <alias>```

```
npm run build
firebase deploy
```

## Notes on running multiple enviornments/projects
Whether you are running your app locally, or on firebase's servers, you are connecting to the same database and file storage. This is why it's important to make sure you are using the correct alias at all the times, to make sure your local code is not interfering with the database of a live or production system.

## Notes on GitlabCI

If you are using Gitlab as remote repository, the included .gitlab-ci file will cause GitlabCI to run deployment pipelines whenever you merge to staging or master branches. If you have not setup your Firebase token to authorise the GitlabCI instance, your pipeline will fail. 

To set this up, you will first need to get a non-internactive token from your local firebase-cli installation.
```
firebase login:ci
```
Once you're authenticated, you will get a login token in the terminal.

Set this token as the value of the enviornment variable ```FIREBASE_TOKEN``` and firebase will use it automatically. To do this set it with GitlabUI so that it is not stored in your git repo for others to see. https://docs.gitlab.com/ee/ci/variables/#via-the-ui

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
