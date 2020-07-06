import * as settings from './settings.js';
import * as logic from './logic.js';

let debug = false;
let log = (...args) => console.log("CTC | ", ...args);

Hooks.on('init', () => {
    settings.registerSettings();
});

Hooks.on('ready', () => {
});

Hooks.on('createMeasuredTemplate', (scene,template,options,user) => {
    if (debug) log("Hook On createMeasureTemplate | ", scene, template, options, user);
    logic.templateAdded(template);                      //add to game.user flags
});

Hooks.on('renderCombatTracker', (combatTracker, html, combatData) => {
    if(debug) log("Hook On renderCombatTracker | ", combatTracker, html, combatData);
    if(combatTracker.combat !== null){                  //combat is active
        logic.checkUser(combatTracker);                 //check if new templates, check with user to remove
        logic.TurnZeroCheck(combatTracker);             //if its a new ROUND, ask each player if they want to remove their templates
    }else{
        //clear templates        
    }   
});