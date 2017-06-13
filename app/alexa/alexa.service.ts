import Mqttd from '../lib/mqttd.service';
import restify = require('restify');
import moment = require("moment");

// AMAZON.DURATION for timer
// we could count how many time an undefined alexa key has been called

export default class {
    constructor(private mqttd: Mqttd) {}
    
    call(body: any, request: restify.Request) {       
        console.log('Alexa');  
        console.log(JSON.stringify(body.request, null, 4));

        let response: string = 'Ok';
        if (request.params && request.params.topic && request.params.value) {
	    console.log('let publish in mqtt', request.params);
            this.mqttd.publish(request.params.value, request.params.topic, false);
        }
        else if (body.request.intent) {
            let intent = body.request.intent;
            if (intent.slots && intent.slots.action) {
                let value: string = intent.slots.action.value;
                if (intent.name === 'storeIntent') {
                    if (value === 'open' || value === 'close' || value === 'stop') {
                        // this.mqttd.publish(value, 'alex/-/-/store');
                        this.mqttd.publish('http://192.168.0.30/' + value, 'alex/-/-/wget');
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
