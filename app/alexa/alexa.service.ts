import Mqttd from '../lib/mqttd.service';
import moment = require("moment");

// AMAZON.DURATION for timer
// we could count how many time an undefined alexa key has been called

export default class {
    constructor(private mqttd: Mqttd) {}
    
    call(body: any) {        
        console.log(JSON.stringify(body.request.intent.slots, null, 4));
        let slots: {[name: string]: {name: string, value: string}} = body.request.intent.slots;
        let timer: string = slots['timer'].value;
        delete slots['timer'];
        
        let key: string = Object.keys(slots)
                                .filter(k => { return slots[k].hasOwnProperty('value'); })
                                .map(k => { return slots[k].value; })
                                .join('-');
        
        console.log('Alexa call key: ' + key + ' with timer: ' + timer);
        return this.callKey(key, timer);
    }
    
    callKey(key: string, timer: string = null) {
        let response: string;
        let timerSec: number;
        if (timer) {
            timerSec = moment.duration(timer).asSeconds();
            console.log('timer as millis: ' + timerSec);
        }

        console.log('Alexa key itemStatus: ', key, timerSec);
        response = 'Action does not exit, create object key.';
        
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