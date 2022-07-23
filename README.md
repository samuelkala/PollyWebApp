# PollyWebApp

This Web application has been developed for the university course "Multidisciplinary Project" taught in Politecnico di Milano (Italy).
This project aims to build a Web-app exploiting text-to-speech (TTS) to automatically generate spoken lessons from PowerPoint presentations, with a docu-style format.
In particular the app uses two text-to-speech services: Microsoft Azure text-to-speech and Amazon Aws Polly, taking advantage of these services to customize the voices and the settings (voice speed, timbre, pitch, speaking style) used to produce the final spoken lesson.
The project has not been created from scratch, but the original core available here (https://github.com/virginianegri/PollyApp), has been modified to make it a Web Appplication. These changes brought a significant advantage in terms of usability since, prior to them, the app could be only used via terminal, making it difficult to use for people who don't have advanced computer skills. Futhermore the app has been extended adding much more modularity and settings. In particular the Microsoft Azure text-to-speech service has been added and also the possibility to change voice parameters (speed, timbre, pitch, speaking style) through a nice and user friendly UI.


## Technologies Used
The back-end has been written in JavaScript (NodeJs run-time enviroment) using the Express framework. This choice has been done considering the fact that also the previous app used NodeJs.
As for the front-end it has been written using the classical client-side languages: Html, Css, JavaScript. No particular front-end framework (Angular, React...) has been used.

## Things to know before running Polly

#### Cloud Services Authentication

The .env file should contain the credentials for the TTS services (Microsoft Azure and Amazon Polly). In order for the app to work you should add those credentials 
to the .env file. You can easily get them creating an account for the Cloud Services of both Microsoft and Amazon. The creation of Amazon Aws' credentials is slightly trickier. In particular you should look for the creation of a IAM user role (after creating the main Aws account), putting Aws Polly as the only service in this IAM user role because in the PollyWebApp we only need Amazon Polly out of all Aws Cloud services.

#### Notes on the App settings

Microsoft Azure voices are all Neural (which means more natural and less robotic), while Aws voices can be also standard. Some Azure voices can have the "speaking style" option, which means that the chosen voice can express emotions (cheerful, sad, excited...). 
As for Aws voices the neural ones cannot support the change of the timbre and pitch settings, because they have not been implemented yet by Amazon.
Nevertheless you can change timbre and pitch for Aws neural voices, but this change will not be reflected in the final lesson which will be created.
The last thing to add is that this app has cookies. Their purpose is to save the settings used by the user during the last time he used the website assuming that those settings are his favorite ones. So the next time he uses the Website he has by default his last used settings.

## How to run the project locally (using VSCode)
1- After cloning the project repo in a folder run the following command to install all the needed dependendencies and modules:
```
npm install
```
2- To run the application type the following command:
```
npm run devStart
```

If all went good the following statement should appear: 'App is listening on port 3000'.

3-The next step is to open your Browser and type in the searchbar the following: http://localhost:3000/.
The Homepage of the Polly website should open at this point. 
From now on the UI itself should be pretty self-explanatory about the website usage.

## Comments on the Save Branch
The save branch is a snapshot of the project before the last modifications made to it.
In particular in the project hosted in this branch there is the possibility to change voices and settings for each slide (e.g. for slide 1 i can choose voice Jenny from Azure and for slide 2 voice Brian from Aws). In this version there is also a play button in the UI. The idea was to make the user able to test the voices and the settings before the subsequent production of the final lesson, but the functionality has not been implemented. Another difference is that the files are organized in a different way (less clear) and don't have appropriate names. Cookies are also missing. So in conclusion the advice is to look at this version of the project only if you are interested in the feature "change settings for each slide".



## Credits
Last but not least this project was made possible thanks to the work of the two authors:\
Samuel Kala samuel.kala@mail.polimi.it\
Marina Russo marina.russo@mail.polimi.it





