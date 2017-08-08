import { Client } from 'mqtt';

import * as restify from 'restify';

export default class {
    constructor(private mqttClient: Client) {}
    
    call(body: any, request: restify.Request) {       
        console.log('Alexa');  
        console.log(JSON.stringify(body.request, null, 4));
        // console.log(JSON.stringify(request.query, null, 4));

        let response: string = 'Ok';
        if (request.query && request.query.topic && request.query.value) {
	    console.log('let publish in mqtt', request.query);
            this.mqttClient.publish(request.query.topic, request.query.value);
        }
        else if (body.request.intent) {
            let intent = body.request.intent;
            if (intent.slots && intent.slots.action) {
                let value: string = intent.slots.action.value;
                if (intent.name === 'storeIntent') {
                    if (value === 'open' || value === 'close' || value === 'stop') {
                        this.mqttClient.publish(
                            'alex/-/-/wget',
                            'http://192.168.0.30/' + value + "\0",
                            { retain: false }
                        );
                    }
                    else {
                        response = 'Sorry, invalid action for this intent.'
                    }
                }
                else {
                    response = 'Sorry, intent invalid.'
                }
            }
            else {
                response = 'Sorry, need action for this intent.'
            }
        }
        else {
            response = 'Sorry, no action found.';
        }
        return this.response(response);    
    }

    response(text: string) {
        return {
            "version": "1.0",
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": text
                },
                "shouldEndSession": true
            },
            "sessionAttributes": {}
        };
    }
}
