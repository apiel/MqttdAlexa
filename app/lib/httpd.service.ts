import * as restify from 'restify';
import * as plugins from 'restify-plugins';
import { fs } from 'mz';

export default class {
    httpd: restify.Server;

    constructor() {
        this.httpd = restify.createServer({
            key: fs.readFileSync('/etc/nginx/alexa/alexa-private-key.pem'),
            certificate: fs.readFileSync('/etc/nginx/alexa/ssl.pem'),  
//            log: console          
        });
        this.httpd.use(plugins.bodyParser({ mapParams: false }));
        // this.httpd.use(plugins.queryParser()); // take care that it doesnt conflict with Alexa
    }

    serve(port: number = 9999) {
        this.httpd.listen(port, () => {
            console.log('%s listening at %s', this.httpd.name, this.httpd.url);
        });     
    }

    post(route: any, callbackFunction: Function) {
        this.httpd.post(route, (request: restify.Request, response: restify.Response, next: restify.Next) => {
            this.postAction(request, response,  callbackFunction);
            return next();            
        });
    }

    async postAction(request: restify.Request, response: restify.Response, callbackFunction: Function) {
        try {
            let body: any = request.body;
            var responseValue = await callbackFunction(body, request);
            response.json(200, responseValue);
        }
        catch(error) {
            response.json(400, error);
        }
    }
}
