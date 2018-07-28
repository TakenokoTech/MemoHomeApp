import * as express from 'express'
import * as DATABASE from '../firebase/database'
import * as GOOGLE_DRIVE from '../google/google_drive'
import * as INTERFACE from '../interface'

const router = express.Router();

/**
 * sing in.
 */
router.get('/signin', (req, res) => {
    console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
    console.log("query: ", req.query)
    if ( !req.query || !req.query.uid ) {
        res.send("not query param. <uid>")
    }
    res.redirect(`https://${req.hostname}/api/google/auth`)
})

/**
 * sing in callback.
 */
router.get('/signin/success', (req, res) => {
    console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
    console.log("query: ", req.query)

    return DATABASE.readTokenData("accessToken", req.query.token)
    .then((response: any) => new Promise((resolve, reject) => {
        response.forEach( doc => {
            console.info(doc.id, '=>', doc.data())
            resolve(doc.data())
        })
        reject("data error.")
    }))
    .then((data: any) => {
        return GOOGLE_DRIVE.getList({
            sub: "",
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            id_token: data.idToken,
            email: ""
        })
    })
    .then((response: any) => {
        console.info(`response = ${response}`)
        res.json(response)
    })
    .catch(err => {
        console.error(`error = ${err}`);
        res.json({ error: err })
    })
    res.json(req.query)
})

router.get('/login', (req, res) => {
    console.info("REQUEST ---> ", `${req.protocol + '://' + req.headers.host + req.url}`)
})

export default router
