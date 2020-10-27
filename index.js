'use strict';

const Chalk = require('chalk');
const HueV3 = require('node-hue-api').v3;

const colors = {
    pink: [0.6264, 0.2768],
    blue: [0.1541, 0.0806],
    red: [0.6656, 0.3278],
    green: [0.2464, 0.6426],
    white: [0.5203, 0.4369]
}

const main = async () => {

    const colorInput = process.env.INPUT_COLOR;
    const color = colors[colorInput];

    if (!color) {
        throw new Error(`Cannot set to ${colorInput}, no such color exists`);
    }

    console.log(`Triggered by ${Chalk.bgBlue(ActionsGithub.context.payload.pusher.name)}`);
    console.log(`Input "color": ${colorInput} (xy: ${color})`);

    const remoteBootstrap = HueV3.api.createRemote(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    const api = await remoteBootstrap.connectWithTokens(process.env.ACCESS_TOKEN, process.env.REFRESH_TOKEN, process.env.USERNAME);

    const lights = await api.lights.getAll();

    await Promise.all(lights.map(({ name, id, capabilities }) => {

        if (capabilities.control.ct) {
            console.log(`Setting "${name}" ${colorInput} (xy: ${color})`);

            const state = {
                on: true,
                bri: 254,
                sat: 254,
                xy: color
            };

            return api.lights.setLightState(id, state);
        }
    }));
};

main();
