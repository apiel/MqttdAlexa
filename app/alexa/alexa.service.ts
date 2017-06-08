import Mqttd from '../lib/mqttd.service';
import moment = require("moment");

// AMAZON.DURATION for timer
// we could count how many time an undefined alexa key has been called

export default class {
    constructor(private mqttd: Mqttd) {}
    
    call(body: any) {       
        console.log('Alexa');  
        console.log(JSON.stringify(body.request, null, 4));
    
        let response: string = 'Ok, I do it';

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
