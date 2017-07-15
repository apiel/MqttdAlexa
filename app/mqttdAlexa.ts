import { connect } from 'mqtt';

import Httpd from './lib/httpd.service';
import AlexaService  from './alexa/alexa.service';

const httpd = new Httpd();
const mqttClient = connect('mqtt://localhost');

const alexaService = new AlexaService(mqttClient);
httpd.post('/alexa', alexaService.call.bind(alexaService));

mqttClient.on('connect', async () => {
    httpd.serve();
});
