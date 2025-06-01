# Applied Project I - [![](https://img.shields.io/badge/4vidas-red?style=for-the-badge)](https://github.com/hamzamohdzubair/redant)

Repository for the Applied Project I. A web application developed using Spring Boot and Angular called 4vidas (four lives).

## Description

**Quatro Vidas** is a web platform focused on promoting blood donation, connecting donors, blood banks, and partners. The system allows the registration of different user profiles, enables the monitoring of donation history, blood levels in regional banks, and facilitates scheduling future donations through a personal calendar.

The application features an interactive dashboard, an achievement-based reward system, campaign publications, and a map to locate nearby blood banks. Developed with usability and accessibility in mind, the system uses Angular for the frontend, Java with Spring Boot for the backend, and MongoDB as the database.

## Dependencies

* [Node.js](https://nodejs.org/en/download)
* Angular 19+ `npm install -g @angular/cli@latest`
* [Java 21](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html)
* [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) (optional)

## How to Use

**Step 1:**

Download or clone this repository using the link:

```
https://github.com/RenatoWlk/projeto-aplicado
```

**Step 2:**

Open a command prompt, navigate to the `projeto-aplicado/backend` folder, and run the following commands:

```
gradlew build
gradlew bootRun
```

**Step 3:**

Open another command prompt, navigate to the `projeto-aplicado/frontend` folder, and run the following commands:

```
yarn install
yarn run build
yarn run start
```

If you're not using Yarn, use:

```
npm install
ng build
ng serve --proxy-config proxy.conf.json
```

## Features

🔐 **Authentication and Registration**

* Donor registration and login
* Blood bank registration and login
* Partner registration and login

🩸 **Donor Features**

* Donation eligibility questionnaire
* View blood levels in regional banks
* Track remaining time until the next allowed donation
* Personal calendar for scheduling donations
* View personal donation appointments
* Map showing nearby blood banks
* Profile screen with user data and achievements
* Reward system based on achievements and participation
* Personal donation history

🏥 **Blood Bank Features**

* Register on the platform
* Publish blood donation campaigns
* Publish specific blood needs

🤝 **Partner Features**

* Register on the platform
* Publish promotional offers for donors
* Share available rewards

🌐 **Interface and Access**

* Responsive and user-friendly UI
* Fully online system (requires internet connection)
* REST API communication between frontend and backend
* Map integration showing blood bank locations

🛡️ **Other Technical Features**

* Secure data storage using MongoDB
* Scalable and high-performance architecture
* Asynchronous communication between Angular frontend and Spring Boot backend
* JSON-based data exchange

### Folder Structure

Main folder structure:

```
4vidas/
|- backend
|- frontend
```

## Credits

* [Renato Wilker de Paula Silva](https://github.com/RenatoWlk)
* [Pedro Barboza Valente](https://github.com/PedroBarboz4)
* [Vinicius Ferreira Paiola](https://github.com/vifp)
* [Gabriel Trindade](https://github.com/trindadegabriel)
* [Enzo Fischer](https://github.com/efsantoss)
