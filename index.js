'use strict';

const ActionsCore = require('@actions/core');
const ActionsGithub = require('@actions/github');

const Chalk = require('chalk');
const HueV3 = require('node-hue-api').v3;

const colors = {
    pink: '63307',
    blue: '46014',
    red: '1271',
    green: '21851',
    white: '8402'
}

const main = async () => {

    const colorInput = ActionsCore.getInput('color').trim();
    const color = colors[colorInput];

    if (!color) {
        throw new Error(`Cannot set to ${colorInput}, no such color exists`);
    }

    console.log(`Triggered by ${Chalk.bgBlue(ActionsGithub.context.payload.pusher.name)}`);
    console.log(`Input "color": ${colorInput} (hue: ${color})`);

    const remoteBootstrap = HueV3.api.createRemote(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    const api = await remoteBootstrap.connectWithTokens(process.env.ACCESS_TOKEN, process.env.REFRESH_TOKEN, process.env.USERNAME);

    const lights = await api.lights.getAll();

    await Promise.all(lights.map(({ id, name }) => {

        console.log(`Setting "${name}" ${colorInput} (hue: ${color})`);

        return api.lights.setLightStatse(id, {
            on: true,
            bri: 254,
            sat: 254,
            hue: color
        });
    }));

};

main();
