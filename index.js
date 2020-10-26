'use strict';

const ActionsCore = require('@actions/core');
const ActionsGithub = require('@actions/github');

const HueV3 = require('node-hue-api').v3;

const colors = {
    pink: '63307',
    blue: '46014',
    red: '1271',
    green: '21851',
    white: '8402'
}

const main = async () => {

    const color = colors[ActionsCore.getInput('color').trim()];
    console.log(`Input "color": ${color}`);

    console.log('Trigged by webhook event:');
    console.log(JSON.stringify(ActionsGithub.context.payload, null, 2));

    const remoteBootstrap = HueV3.api.createRemote(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    const api = await remoteBootstrap.connectWithTokens(process.env.ACCESS_TOKEN, process.env.REFRESH_TOKEN, process.env.USERNAME);

    const lights = await api.lights.getAll();

    await Promise.all(lights.map(({ id, name }) => {

        console.log(`Setting ${name} to hue:${color}`);

        return api.lights.setLightState(id, {
            on: true,
            bri: 254,
            sat: 254,
            hue: color
        });
    }));

};

main();
