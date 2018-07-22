import * as functions from 'firebase-functions'
import * as express from 'express'
import * as API from './api'
import * as  client_secret from './xxx'

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

app.get('/auth', (req, res) => {
  res.redirect(
    `${client_secret.default.web.auth_uri}?`
    + `client_id=${client_secret.default.web.client_id}`
    + `&redirect_uri=${client_secret.default.web.redirect_uris}`
    + `&scope=https://www.googleapis.com/auth/drive`
    + `&response_type=code`
    + `&approval_prompt=${"auto"/*"force"*/}`
    + `&access_type=offline`
  )
})

app.get('/auth_callback', (req, res) => {
  console.log("params: ", req.params)
  console.log("query: ", req.query)
  const { code } = req.query
  API.form(`${client_secret.default.web.token_uri}`, {
      grant_type: `authorization_code`,
      code: `${code}`,
      client_id: `${client_secret.default.web.client_id}`,
      client_secret: `${client_secret.default.web.client_secret}`,
      redirect_uri: `${client_secret.default.web.redirect_uris}`,
  }).then((response: any) => {
    console.log(res);
    res.json(response)
  }).catch(err => {
    console.error(err);
    res.send(JSON.stringify({err: err}))
  })
})

export const api = functions.https.onRequest(app)
