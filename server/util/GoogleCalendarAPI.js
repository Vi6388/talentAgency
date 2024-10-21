const { google } = require('googleapis');
const key = require("../public/talentagency-9763b37d6a39.json");

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = key.private_key;
const GOOGLE_CLIENT_EMAIL = key.client_email;
const GOOGLE_PROJECT_NUMBER = key.project_id;
const GOOGLE_CALENDAR_ID = "talentagency";

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient
});

const googleCalendarAPI = async () => {
  var event = {
    'summary': 'My first event!',
    'location': 'Hyderabad,India',
    'description': 'First event with nodeJS!',
    'start': {
      'dateTime': '2022-01-12T09:00:00-07:00',
      'timeZone': 'Asia/Dhaka',
    },
    'end': {
      'dateTime': '2022-01-14T17:00:00-07:00',
      'timeZone': 'Asia/Dhaka',
    },
    'attendees': [],
    'reminders': {
      'useDefault': false,
      'overrides': [
        { 'method': 'email', 'minutes': 24 * 60 },
        { 'method': 'popup', 'minutes': 10 },
      ],
    },
  };

  const auth = new google.auth.GoogleAuth({
    keyFile: './public/talentagency-9763b37d6a39.json',
    scopes: 'https://www.googleapis.com/auth/calendar', //full access to edit calendar
  });
  auth.getClient().then(a => {
    calendar.events.insert({
      auth: a,
      calendarId: GOOGLE_CALENDAR_ID,
      resource: event,
    }, function (err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.data);
      res.jsonp("Event successfully created!");
    });
  })
}

module.exports = { googleCalendarAPI }; // Export the function
