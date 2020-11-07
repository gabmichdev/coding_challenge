# Coding challenge!

## TLDR
A registration system via SMS or console for new Continuous Improvement Managers to start reviewing Revs!

### Instructions to test it out
First of all, the installations of all the dependencies is required, run:
```cmd
npm install
```
in the console of your preference.

Starting the server depends on your OS. If you are using Windows, run `npm start`, this will spin up the server in production mode, otherwise, if you are using a Linux system, run `npm run start:linuxProductive`, note that the port is defined inside the files in the `config` folder. The production file will override any matching fields in the default file. 
If you would like to make any changes to the code and have it live reload, feel free to run `npm run start:dev`.
##### Note: 
Credentials for production mode are not set and could be set by copying the contents of `default.json` into `production.json` (or by running the server in development mode). However, the phone number to send SMS to must be previously verified and this could mean that the SMS functionality may not be available. Due to this situation, provided within the repository will be a folder called `validation_images` containing proof images of how the messages would look if they were sent through SMS.


### What's inside?
This server exposes three endpoints:

<ol>
    <li> POST /user-stories/verification/send: Main entry point to register a CIM. Requires a body with the `email` and a `phoneNumber` fields.
    <li> POST /user-stories/verification/:code/validate: This endpoint takes the code received in the URL params and the same email and phone number used to register previously.
    <li> POST /user-stories/verification/resend/:phoneNumber: This endpoint will take a phone number URL parameter only, and will return the corresponding code to the user.
</ol>

### Where to start
For starters, users should start by sending their email and phoneNumber information on endpoint <strong>1</strong>, this will yield either an SMS or an error and the code through the console.

If a code was successfully received, users should proceed to endpoint <strong>2</strong> by re-entering the data previously entered into the system. Users will then receive a confirmation message saying they have now been verified.

As an optional step, in case users forget or did not get a verification code, they should step onto endpoint <strong>3</strong> for the system to re-send the generated code, if there is any.

### Project description
This project uses Node.js as the base runtime. The server itself is managed using Express.js. Additionally, it is written using Typescript and compiled into Javascript for better typing support.
As another advantage of using Typescript is the use of Routing-Controllers, which is a class-based router with support for Express.js with very intuitive controller building, allowing for seemless dependency injection support.

### Improvements to be done
Main improvement to do is the possibility for the user to verify its account by just entering the verification code into the system. Currently codes are saved in-memory along side the phone number and the email. The reason it is the way that it is right now is because the system has no way to return a personalized error message in case the code entered does not match with the correct one.

Other improvements are clearly the implementation of a better persistance layer, namely a cache-based database such as redis, since the application does not rely on keeping up with huge, complex and long-time persistant data.

### How to test this?
Provided in this repository there is a JSON file called `postman-collection.json`. It contains the three previously explained endpoints with the field names already set. In any case, the system will inform the user if it finds any issue with the entered data. The user should upload this file into Postman or any other REST client of their choice. Afterwards, the corresponding fields should be filled with valid data. Keep in mind that the JSON file will have the development port by default.

If you are short in time and would like to check that everything is working as expected, it is as easy as running:
```cmd
npm test
```
to run all the unit tests.