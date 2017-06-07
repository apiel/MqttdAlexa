const mosca = require('mosca'); // mqtt broker

export default class {
    mqttd: any;

    constructor(port: number = 1883) {
        this.mqttd = new mosca.Server({
            port: port,
            persistence: {
                factory: mosca.persistence.Memory
            }
        });
    }

    attachHttpServer(httpServer: any) {
        this.mqttd.attachHttpServer(httpServer);
    }

    publish(payload: string, topic: string, retain: boolean = true, qos: number = 0) {
        this.mqttd.publish({
            topic: topic,
            payload: payload,
            retain: retain,
            qos: qos
        }); 
        return this;
    }

    ready(callback: Function) {
        this.mqttd.on('ready', callback);
        return this;
    }
}