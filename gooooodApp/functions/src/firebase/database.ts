import * as admin from 'firebase-admin'
import * as client_secret from '../xxx'

admin.initializeApp(client_secret.default.database)
const db = admin.firestore()

export function writeTokenData(
    type: String,
    openid: string,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    option?: string
): Promise<any>  {
    console.info(`writeTokenData. ${type}-${openid}`)
    return db.collection('tokens').doc(openid).set({
        type: type,
        accessToken: accessToken,
        refreshToken: refreshToken,
        idToken: idToken,
        option: option
    })
}

export function readTokenData(key?: string, value?: string): Promise<any>  {
    console.info(`readTokenData. ${key} = ${value}`)
    if (!key) {
        return db.collection('tokens').get()
    } else {
        return db.collection('tokens').where(key, '==', value).get()
    }
}