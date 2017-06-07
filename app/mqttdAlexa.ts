import Events = require('events');
import Httpd from './lib/httpd.service';
import Mqttd from './lib/mqttd.service';

import AlexaService  from './alexa/alexa.service';

const eventEmitter = new Events.EventEmitter();

let httpd = new Httpd();
let mqttd = new Mqttd();

let alexaService = new AlexaService(mqttd);
httpd.post('/alexa', alexaService.call.bind(alexaService));

mqttd.attachHttpServer(httpd.httpd);

mqttd.ready(async () => {
    httpd.serve();
});