// TODO balance changes
// TODO add grouping large mumbers by size (10k 10m 10b 10t etc)

// #region variables

const player = 
{
    resource: 0,
    lifetimeResource: 0,
    clicks: 0,
    clicksRollingTotal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

/*******************************************************************************
* upgradeTemplate:
  {
    name - string
    costGrowAmount - number
    costGrowFactor - number
    owned - number
    constConstant - number
    priceFunction - function(baseCost, costGrowFactor, owned)
    efficacy - number
  }

* name - the name of the upgrade in plain text
* costGrowAmount - the amount to scale around
* costGrowFactor - the amount the owned will affect the cost
    - 1 on a linear means increase the cost by the cost grow each time
    - 2 on a linear means increase the cost by 200% the cost grow each time

    - 2 on an exponential means the cost will double each purchase
    - 3 on an exponential means the cost will triple on each purchase
* owned - the number owned by the player
* costConstant - the cost added onto any calculated cost growth

* priceFunction - the function that will return the adjusted price based on the
    baseCost and how many are owned

* efficacy - the amount to add or multiply by
*******************************************************************************/
const upgrades =
{
    autoClickers:
    {
        pickaxe:
        {
            name: "Pickaxe",
            shopname: "⛏️",
            growBase: 50,
            growFactor: 1,
            owned: 0,
            costConstant: 50,
            priceFunction: linear,
            efficacy: 1
        }
    },

    clickMultipliers:
    {
        worker:
        {
            name: "Hire Worker",
            shopname: "👷",
            growBase: 500,
            growFactor: 1.5,
            owned: 0,
            costConstant: 1000,
            priceFunction: exponential,
            efficacy: 1.5
        }
    },

    autoGainers:
    {
        fabrication:
        {
            name: "Research Fabrication",
            shopname: "⚛️",
            growBase: 200,
            growFactor: 2,
            owned: 0,
            costConstant: 10,
            priceFunction: exponential,
            efficacy: 5
        }
    },

    globalMultipliers:
    {
        thievery:
        {
            name: "Improptu Cooperation",
            shopname: "🤝",
            growBase: 10000,
            growFactor: 1.8,
            owned: 0,
            costConstant: 10000,
            priceFunction: exponential,
            efficacy: 1.5
        }
    }
}

let elements = 
{
    currentResource: document.getElementById("current-resource"),
    lifetimeResource: document.getElementById("lifetime-resource"),
    totalGps: document.getElementById("total-gps"),
    manualCps: document.getElementById("manual-cps"),
    autoCps: document.getElementById("auto-cps"),
    autoGps: document.getElementById("auto-gps"),
    clickMultiplier: document.getElementById("click-multiplier"),
    globalMultiplier: document.getElementById("global-multiplier"),
    inventory: document.getElementById("inventory"),
    boughtUpgrades: document.getElementById("bought-upgrades"),
    autoGainers: document.getElementById("auto-gainers"),
    autoClickers: document.getElementById("auto-clickers"),
    clickMultipliers: document.getElementById("click-multipliers"),
    globalMultipliers: document.getElementById("global-multipliers"),
    stats: document.getElementById("stats")
}

// #endregion
// #region click functions

function clickTarget()
{
    player.resource += calculateclickMultiplier() * calculateGlobalMultiplier();
    player.lifetimeResource += calculateclickMultiplier() * calculateGlobalMultiplier();
    player.clicks += 1;

    drawInventory();
    drawStats();
    drawShop();
}

function updateManualClicks()
{
    player.clicksRollingTotal.shift();
    player.clicksRollingTotal.push(player.clicks);
    player.clicks = 0;
    drawStats();
}

function autoClick()
{
    player.resource += calculateAutoAmount();
    player.lifetimeResource += calculateAutoAmount();

    drawInventory();
    drawStats();
    drawShop();
}

// #endregion
// #region calculation functions

function calculateManualCps()
{
    let amount = 0;

    for(let i = 0; i < player.clicksRollingTotal.length; i++)
    {
        amount += player.clicksRollingTotal[i];
    }

    amount /= player.clicksRollingTotal.length;
    return amount;
}

function calculateAutoAmount()
{
    let amount = 0;

    amount += calculateAutoClicks();
    amount *= calculateclickMultiplier();

    amount += calculateAutoGains();
    amount *= calculateGlobalMultiplier();

    return amount;
}

function calculateAutoClicks()
{
    let amount = 0;

    for(let key in upgrades.autoClickers)
    {
        amount += upgrades.autoClickers[key].owned * upgrades.autoClickers[key].efficacy;
    }

    return amount;
}

function calculateclickMultiplier()
{
    let amount = 1;

    for(let key in upgrades.clickMultipliers)
    {
        amount += upgrades.clickMultipliers[key].owned * upgrades.clickMultipliers[key].efficacy;
    }

    return amount;
}

function calculateAutoGains()
{
    let amount = 0;

    for(let key in upgrades.autoGainers)
    {
        amount += upgrades.autoGainers[key].owned * upgrades.autoGainers[key].efficacy;
    }

    return amount;
}

function calculateGlobalMultiplier()
{
    let amount = 1;

    for(let key in upgrades.globalMultipliers)
    {
        amount += upgrades.globalMultipliers[key].owned * upgrades.globalMultipliers[key].efficacy;
    }

    return amount;
}

// #endregion
// #region shop functions

function purchaseUpgrade(category, upgrade)
{
    const item = upgrades[category][upgrade];
    if(getItemCost(item) < player.resource)
    {
        player.resource -= getItemCost(item);
        item.owned += 1;
    }

    drawInventory();
    drawShop();
    drawStats();
}

function getItemCost(item)
{
    return Math.floor(item.priceFunction(item.growBase, item.growFactor, item.owned, item.costConstant));
}

function linear(growBase, growFactor, owned, costConstant)
{
    return growBase * ((growFactor * owned)) + costConstant;
}

function exponential(growBase, growFactor, owned, costConstant)
{
    return growBase * ((growFactor ** owned) - 1) + costConstant;
}

// #endregion
// #region draw functions

function drawInventory()
{
    saveGame();
    elements.lifetimeResource.innerText = Math.floor(player.lifetimeResource.toString());
    
    elements.currentResource.innerText = Math.floor(player.resource.toString());

    let template = "";

    for(let key1 in upgrades)
    {
        for(let key2 in upgrades[key1])
        {
            template +=
            `
            <p class="my-2 text-warning">${upgrades[key1][key2].name}: x${Math.floor(upgrades[key1][key2].owned)}</p>
            `;
        }
    }

    elements.boughtUpgrades.innerHTML = template;
}

function drawStats()
{
    elements.totalGps.innerText = Math.floor(calculateAutoAmount() + calculateManualCps()).toString();
    elements.manualCps.innerText = calculateManualCps().toString();
    elements.autoCps.innerText = calculateAutoClicks().toString();
    elements.autoGps.innerText = calculateAutoGains().toString();
    elements.clickMultiplier.innerText = calculateclickMultiplier().toString();
    elements.globalMultiplier.innerText = calculateGlobalMultiplier().toString();
}

function drawShop()
{
    let template = "";

    for(let key in upgrades.autoGainers)
    {
        const item = upgrades.autoGainers[key];
        template +=
        `
        <button class="my-1 d-flex btn ${player.resource > getItemCost(item) ? "btn-warning text-light\"" : "btn-secondary text-dark\" disabled"} onclick="purchaseUpgrade('autoGainers', '${key}')" title="${item.name}">
            <hr>
            <div class="d-flex flex-column text-end me-1">
                <span class="text-light ms-1">+${item.efficacy}/s</span>
                <span class="text-light ms-1">${getItemCost(item)} Cheese</span>
            </div>
            <span class="my-auto shopname">${item.shopname}</span>
        </button>
        `;
    }
    
    elements.autoGainers.innerHTML = template;

    template = "";

    for(let key in upgrades.autoClickers)
    {
        const item = upgrades.autoClickers[key];
        template +=
        `
        <button class="my-1 d-flex btn ${player.resource > getItemCost(item) ? "btn-warning text-light\"" : "btn-secondary text-dark\" disabled"} onclick="purchaseUpgrade('autoClickers', '${key}')" title="${item.name}">
            <hr>
            <div class="d-flex flex-column text-end me-1">
                <span class="text-light ms-1">+${item.efficacy}/s</span>
                <span class="text-light ms-1">${getItemCost(item)} Cheese</span>
            </div>
            <span class="my-auto shopname">${item.shopname}</span>
        </button>
        `;
    }

    elements.autoClickers.innerHTML = template;
    
    template = "";

    for(let key in upgrades.clickMultipliers)
    {
        const item = upgrades.clickMultipliers[key];
        template +=
        `
        <button class="my-1 d-flex btn ${player.resource > getItemCost(item) ? "btn-warning text-light\"" : "btn-secondary text-dark\" disabled"} onclick="purchaseUpgrade('clickMultipliers', '${key}')" title="${item.name}">
            <hr>
            <div class="d-flex flex-column text-end me-1">
                <span class="text-light ms-1">+${item.efficacy}x</span>
                <span class="text-light ms-1">${getItemCost(item)} Cheese</span>
            </div>
            <span class="my-auto shopname">${item.shopname}</span>
        </button>
        `;
    }

    elements.clickMultipliers.innerHTML = template;

    template = "";

    for(let key in upgrades.globalMultipliers)
    {
        const item = upgrades.globalMultipliers[key];
        template +=
        `
        <button class="my-1 d-flex btn ${player.resource > getItemCost(item) ? "btn-warning text-light\"" : "btn-secondary text-dark\" disabled"} onclick="purchaseUpgrade('globalMultipliers', '${key}')" title="${item.name}">
            <hr>
            <div class="d-flex flex-column text-end me-1">
                <span class="text-light ms-1">+${item.efficacy}x</span>
                <span class="text-light ms-1">${getItemCost(item)} Cheese</span>
            </div>
            <span class="my-auto shopname">${item.shopname}</span>
        </button>
        `;
    }

    elements.globalMultipliers.innerHTML = template;
}

// #endregion

function saveGame()
{
    window.localStorage.setItem("mm_player", JSON.stringify(player));
    window.localStorage.setItem("mm_upgrades", JSON.stringify(upgrades));
}

function loadGame()
{
    const loadedPlayer = JSON.parse(window.localStorage.getItem("mm_player"));
    const loadedUpgrades = JSON.parse(window.localStorage.getItem("mm_upgrades"));

    if(loadedPlayer && loadedUpgrades)
    {
        for(let key in loadedPlayer)
        {
            player[key] = loadedPlayer[key];
        }
        
        // NOTE It's ugly, but it avoids JSON.stringify ignoring function properties of objects
        for(let key1 in loadedUpgrades)
        {
            for(let key2 in loadedUpgrades[key1])
            {
                upgrades[key1][key2].owned = loadedUpgrades[key1][key2].owned;
            }
        }
    }

    saveGame();
}

loadGame();

drawShop();
drawInventory();
drawStats();

setInterval(updateManualClicks, 1000);
setInterval(autoClick, 1000);