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

These instructions set up a `petland` directory in your home directory. For other locations substitute `~` for your preferred location.

```
cd ~
git clone https://gitlab.com/beleidy/petland.git
cd petland
npm install
```


#### Set up your firebase project
https://firebase.google.com/docs/web/setup

Once you have a firebase project setup, you will need to login on the cli-tools and connect the local directory to your project. Since the app is using firebase aliases to seperate staging and production enviornments, you will need to setup at least a staging alias for local development. If you would also like to push to production, you will need to setup a production alias too. For more information about Firebase aliases see https://firebase.google.com/docs/cli/#project_aliases

```
firebase login
firebase use --add
```
Follow instructions and add the alias `staging` to the project you'd like to use for development. Once you've completed this susccessfully, you can start the app.
```
npm start
```

If this hasn't happened automatically, point your browser to ```http://localhost:3000/``` and you should see the app running.


## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

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
