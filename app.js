// #region variables

const player = 
{
    resource: 0,
    lifetimeResource: 0,
    clicks: 0,
    rollingTotalClicksPerSecond: [] // TODO decide how many seconds this will count to round over
}

// TODO flesh out upgrades object
const upgrades =
{
    clickMultipliers:
    {
        upgradeTemplate:
        {
            name: "Template_Click_Upgrade",
            baseCost: 1,
            owned: 0,
            increaseFunction: undefined
        }
    },

}

let intervalIds = 
{
    clicksPerSecond: undefined
}

let elements = 
{
    inventory: document.getElementById("inventory"),
    shop: document.getElementById("shop"),
    stats: document.getElementById("stats")
}

// #endregion
// #region game functions

function click()
{
    player.resource += 1;
    console.log(player.resource);
}

// #endregion
//  #region draw functions

function drawInventory()
{
    let template = "";

    elements.stats.innerHTML = template;
}

// #endregion