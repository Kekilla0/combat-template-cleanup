let debug = false;
let log = (...args) => console.log("CTC | ", ...args);

export async function templateAdded(template)
{
    let template_ids = await game.user.getFlag('combat-template-cleanup','ids') ? await game.user.getFlag('combat-template-cleanup','ids') : [];
    template_ids.push(template._id);
    game.user.unsetFlag('combat-template-cleanup','ids');
    game.user.setFlag('combat-template-cleanup', 'ids', template_ids);

    if(debug) log("TEMPLATE ADDED | ",template , template_ids, game.user.data.flags);
}

export async function checkUser(combatTracker)
{
    let template_ids = await game.user.getFlag('combat-template-cleanup', 'ids') ? await game.user.getFlag('combat-template-cleanup', 'ids') : [];

    let copyTemplates = [...canvas.templates.placeables];

    for(let template of copyTemplates)
    {
        if (debug) log("CHECK USER TEMPLATE | FOR LOOP | ", template, template_ids);

        if(template_ids.includes(template.id) && template.data.user === game.user.id)
        {
            if (debug) log ("CHECK USER TEMPLATE | FOR LOOP | SHOULD PAN AND DISPLAY");

            await _pan(template);
            let confirmation = await _dialog();

            if(confirmation === `yes`)
            {
                _remove(template);
            }
        }
    }
    await game.user.unsetFlag('combat-template-cleanup','ids'); 
}

export async function TurnZeroCheck(combatTracker)
{
    if(combatTracker.combat.turn === 0 && combatTracker.combat.round !== 0)
    {
        let copyTemplates = [...canvas.templates.placeables];

        for(let template of copyTemplates)
        {
            if(template.data.user === game.user.id)
            {
                if(debug) log ("This is your template | ", template);
                await _pan(template);
                let confirmation = await _dialog();

                if(confirmation === `yes`)
                {
                    _remove(template);
                }          
            }   
        }
    }
}

async function _pan(template)
{
    await canvas.animatePan({x : template.x, y : template.y, duration : 250});
}

async function _remove(template)
{
    canvas.templates.deleteMany(template.id);
}

function _dialog()
{
    return new Promise(resolve =>{
        new Dialog({
            title: `Remove Template`,
            buttons: {
              yes: {
                label: `Yes`,
                callback: () => {
                  resolve('yes');
                }
              },
              no: {
                label: `No`,
                callback: () => {
                  resolve('no');
                }
              },
            },
            default: "close",
            close: () => resolve('no')
          }).render(true);
    })
}
