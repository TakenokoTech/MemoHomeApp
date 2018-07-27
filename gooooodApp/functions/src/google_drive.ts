import { google } from 'googleapis'
import * as credentials from './xxx'
import * as INTERFACE from './interface'

export function getList(token: INTERFACE.Token): Promise<any> {
    const { client_secret, client_id, redirect_uris } = credentials.default.web
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    oAuth2Client.setCredentials({
        refresh_token: token.refresh_token,
        expiry_date: 3600,
        access_token: token.access_token,
        token_type: "Bearer",
        id_token: token.id_token
    })
    return new Promise<String>((resolve, reject) => {
        google.drive({ version: 'v3', auth: oAuth2Client }).files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
            console.info(res)
            if (err) {
                console.error('The API returned an error >> ' + err)
                reject(err)
                return
            }
            const files = res.data.files
            if (files.length) {
                console.info('Files:')
                files.map((file) => {
                    console.info(`${file.name} (${file.id})`)
                })
            } else {
                console.info('No files found.')
            }
            resolve(files)
            return
        })
    })
}
