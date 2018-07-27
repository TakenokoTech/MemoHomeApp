import * as request from 'superagent'

export function form(path: string, params: Object = {}): Promise<any> {
    console.log(path, params)
    return new Promise((resolve, reject) => {
        request
            .post(path)
            .type('form')
            .send(params)
            .end((err, res): void => {
                if (err) 
                    reject(err)
                else
                    resolve(res)
            })
    })
}
