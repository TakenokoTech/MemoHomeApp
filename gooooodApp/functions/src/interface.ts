/**
 * Token
 */
export interface Token {
    sub: string
    access_token: string,
    refresh_token: string,
    id_token: string,
    email: string
}

/***
 * Session
 */
export interface SessionSigninData {
    uid: String,
    callback_url: String
    token?: Token
}

/**
 * Google Account
 */
export interface GoogleAccount {
    client_id: string,
    project_id: string,
    auth_uri: string,
    token_uri: string,
    auth_provider_x509_cert_url: string,
    client_secret: string,
    redirect_uris: [string],
    javascript_origins: [string]
}

/**
 * Cloud Firestore
 */
export interface CloudFirestore {
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
}
