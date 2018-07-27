import * as functions from 'firebase-functions'
import * as express from 'express'
import * as base64 from 'urlsafe-base64';
import * as client_secret from './xxx'
import * as API from './api'
import * as DATABASE from './database'

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
    + `&scope=${encodeURIComponent("openid email https://www.googleapis.com/auth/drive")}`
    + `&response_type=code`
    + `&approval_prompt=${"force"}`
    + `&access_type=offline`
  )
})

app.get('/auth_callback', (req, res) => {
  console.log("params: ", req.params)
  console.log("query: ", req.query)
  let resJson = {}
  const { code } = req.query
  API.form(`${client_secret.default.web.token_uri}`, {
      grant_type: `authorization_code`,
      code: `${code}`,
      client_id: `${client_secret.default.web.client_id}`,
      client_secret: `${client_secret.default.web.client_secret}`,
      redirect_uri: `${client_secret.default.web.redirect_uris}`,
  }).then((response: any) => {
    console.log(res);
    const data = JSON.parse(response.text)
    const jwt = JSON.parse(base64.decode(data["id_token"].split(".")[1] || "").toString())
    resJson = {
      res: response,
      text: data,
      jwt: jwt
    }
    return DATABASE.writeTokenData("google", jwt.sub, data.access_token, data.refresh_token, jwt.email)
  }).then((response: any) => {
    console.info(`response = ${response}`);
    res.json(resJson)
  }).catch(err => {
    console.error(`error = ${err}`);
    res.json(err)
  })
})

// app.get('/refresh', (req, res) => {
//   console.log("params: ", req.params)
//   console.log("query: ", req.query)
//   const { code } = req.query
//   API.form(`${client_secret.default.web.token_uri}`, {
//       grant_type: `refresh_token`,
//       client_id: `${client_secret.default.web.client_id}`,
//       client_secret: `${client_secret.default.web.client_secret}`,
//       refresh_token: ``
//   }).then((response: any) => {
//     console.log(res);
//     res.json({
//       res: response,
//       text: JSON.parse(response.text)
//     })
//   }).catch(err => {
//     console.error(err);
//     res.send(JSON.stringify({err: err}))
//   })
// })

export const api = functions.https.onRequest(app)
