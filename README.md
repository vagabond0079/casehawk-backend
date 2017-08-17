# CASEHAWK

## Application Summary

'CaseHawk' is a calendar application built specifically for use at legal offices. Users can create, update, view, and delete events on the calendar. The front end is developed in ReactJS and JavaScript and the back end is developed in Node.js and JavaScript. The front end repository is available here. [CaseHawk repository](https://github.com/vagabond0079/casehawk-frontend).

## Website
Fully deployed site: `https://casehawk-frontend.herokuapp.com`

## Overview
### Minimum Viable Product
This RESTful API was created for the CaseHawk. It provides the necessary back-end infrastructure and functionality to sign up and sign in. As well as create, read, update and delete calendar events. 

## Run examples locally

* Clone this repository
* Retrieve dependencies: `yarn install`
* Start databases: `yarn start-db`
* Start server: `yarn start`
* Clone the frontend repository at https://github.com/vagabond0079/casehawk-frontend


### Create Account/Sign-in
Users will have the option to create a new account or sign-in on the initial page. Account creations requires a valid e-mail, a username, and a password. Sign-in requires username and password.

###  Create Event
To create an event, the user enters a start and end date and time. There is also an option to mark the event as "all day" The name of the event is entered into the tex box, and the event type is selected from the dropdown menu (options are Appointment, Court Date, Deadline, Task). When the add event button is clicked, the event will populate to the calendar view.

### Update Event
To update an event, the user clicks on the event in the calendar view and makes the necessary changes in the available fields. The event is updated when the update event button is clicked.

### Delete Event
To delete an event, the user clicks on the event in the calendar view and then clicks on the delete event button.
