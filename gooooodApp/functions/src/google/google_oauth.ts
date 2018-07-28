import * as express from 'express'
import * as base64 from 'urlsafe-base64';
import * as client_secret from '../xxx'
import * as DATABASE from '../firebase/database'
import * as API from '../util/api'
import * as INTERFACE from '../interface'

const router = express.Router();

const SCOPE: Array<string> = [
    "openid",
    "email",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.metadata.readonly"
]

router.get('/auth', (req, res) => {
    console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
    res.redirect(
        `${client_secret.default.web.auth_uri}?`
        + `client_id=${client_secret.default.web.client_id}`
        + `&redirect_uri=${client_secret.default.web.redirect_uris}`
        + `&scope=${encodeURIComponent(SCOPE.join(' '))}`
        + `&response_type=code`
        + `&approval_prompt=${"force"}`
        + `&access_type=offline`
    )
})

router.get('/auth_callback', (req, res) => {
    console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
    const { code } = req.query
    let data: INTERFACE.Token
    API.form(`${client_secret.default.web.token_uri}`, {
        grant_type: `authorization_code`,
        code: `${code}`,
        client_id: `${client_secret.default.web.client_id}`,
        client_secret: `${client_secret.default.web.client_secret}`,
        redirect_uri: `${client_secret.default.web.redirect_uris}`,
    }).then((response: any) => {
        console.log(response.text)
        data = JSON.parse(response.text)
        const jwt = JSON.parse(base64.decode(data["id_token"].split(".")[1] || "").toString())
        return DATABASE.writeTokenData(
            "google",
            jwt.sub,
            data.access_token,
            data.refresh_token,
            data.id_token,
            jwt.email
        )
    }).then((response: any) => {
        console.log(`https://${req.hostname}/api/user/signin/success?token=${data.access_token}`)
        res.redirect(`https://${req.hostname}/api/user/signin/success?token=${data.access_token}`)
    }).catch(err => {
        console.error(`error = ${err}`);
        res.json({ error: err })
    })
})

router.get('/refresh', (req, res) => {
    console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
    console.log("params: ", req.params)
    console.log("query: ", req.query)
    API.form(`${client_secret.default.web.token_uri}`, {
        grant_type: `refresh_token`,
        client_id: `${client_secret.default.web.client_id}`,
        client_secret: `${client_secret.default.web.client_secret}`,
        refresh_token: ``
    }).then((response: any) => {
        console.log(res);
        res.json({
            res: response,
            text: JSON.parse(response.text)
        })
    }).catch(err => {
        console.error(err);
        res.send(JSON.stringify({ err: err }))
    })
})

export default router