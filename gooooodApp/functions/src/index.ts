import * as functions from 'firebase-functions'
import * as express from 'express'
import * as bodyParser from 'body-parser'

import * as google_oauth from './google/google_oauth'
import * as user from './api/user'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/sample', (req, res) => {
  const users = [
    { "id": 1, "name": "xxx" },
    { "id": 2, "name": "yyy" },
    { "id": 3, "name": "zzz" }
  ]
  res.send(JSON.stringify(users))
})

app.post('/webhook', (req, res) => {
  console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
  console.info("query: ", req.query)
  console.info("body: ", req.body)
  const response = {
    fulfillmentText: "",
    fulfillmentMessages: [{
      card: {
        title: "card title",
        subtitle: "card text",
        imageUri: "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
        buttons: [{
          text: "button text",
          postback: "https://assistant.google.com/"
        }]
      }
    }],
    source: "example.com",
    payload: {},
    outputContexts: [],
    followupEventInput: {}
  }
  res.json(response)
})

app.use("/google", google_oauth.default)
app.use("/user", user.default)

console.info("===============================================")
export const api = functions.https.onRequest(app)
