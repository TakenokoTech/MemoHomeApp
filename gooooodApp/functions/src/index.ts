import * as functions from 'firebase-functions'
import * as express from 'express'

import * as google_oauth from './google/google_oauth'
import * as user from './api/user'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const app = express()

app.get('/sample', (req, res) => {
  const users = [
    { "id": 1, "name": "xxx" },
    { "id": 2, "name": "yyy" },
    { "id": 3, "name": "zzz" }
  ]
  res.send(JSON.stringify(users))
})

app.use("/google", google_oauth.default)
app.use("/user", user.default)

console.info("===============================================")
export const api = functions.https.onRequest(app)
