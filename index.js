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

    console.log(process.env);

    const color = colors[ActionsCore.getInput('color').trim()];
    console.log(`Input "color": ${color}`);

    console.log('Trigged by webhook event:');
    console.log(JSON.stringify(ActionsGithub.context.payload, null, 2));

    const remoteBootstrap = HueV3.api.createRemote(CLIENT_ID, CLIENT_SECRET);
    const api = await remoteBootstrap.connectWithTokens(ACCESS_TOKEN, REFRESH_TOKEN, USERNAME);

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
