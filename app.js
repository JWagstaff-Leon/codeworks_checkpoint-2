// #region variables

const player = 
{
    resource: 0,
    lifetimeResource: 0,
    clicks: 0,
    rollingTotalClicksPerSecond: [] // TODO decide how many seconds this will count to round over
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
    clickAdders:
    {
        pickaxe:
        {
            name: "Pickaxe",
            costGrowAmount: 10,
            costGrowFactor: 0,
            owned: 0,
            costConstant: 10,
            priceFunction: linear,
            efficacy: 1
        }
    },

    clickMultipliers:
    {
        worker:
        {
            name: "Hire Worker",
            costGrowAmount: 10,
            costGrowFactor: 1,
            owned: 0,
            costConstant: 10,
            priceFunction: exponential,
            efficacy: 1.5
        }
    },

    autoAdders:
    {
        fabrication:
        {
            name: "Research Fabrication",
            costGrowAmount: 10,
            costGrowFactor: 1,
            owned: 0,
            costConstant: 10,
            priceFunction: exponential,
            efficacy: 5
        }
    },

    globalMultipliers:
    {
        thievry:
        {
            name: "Improptu Cooperation",
            costGrowAmount: 10,
            costGrowFactor: 0,
            owned: 0,
            costConstant: 10,
            priceFunction: linear,
            efficacy: 1.5
        }
    }
}

let intervalIds = 
{
    autoSpeed: undefined
}

let elements = 
{
    inventory: document.getElementById("inventory"),
    shop: document.getElementById("shop"),
    stats: document.getElementById("stats")
}

// #endregion
// #region game functions

function clickTarget()
{
    player.resource += 1;

    drawInventory();
    drawStats();
}

function updateAutoSpeed()
{
    clearInterval(intervalIds.clicksPerSecond)

    startInterval(autoClick, 1000) // TODO determine this time
}

function calculateAutoAmount()
{

}

function purchaseUpgrade(category, upgrade)
{
    if(upgrades[category][upgrade].increaseFunction(baseCost, owned) < player.resource)
    {
        playerResource -= upgrades[category][upgrade].increaseFunction(baseCost, owned);
        upgrades[category][upgrade].owned += 1;
    }

    updateAutoSpeed();

    drawInventory();
    drawResource();

}

// #endregion
// #region priceFunctions

function linear(growBase, costFactor, owned, costConstant)
{
    return growBase * (1 + (costFactor * owned)) + costConstant;
}

function exponential(growBase, costFactor, owned, costConstant)
{
    return growBase * (costFactor ** (owned - 1)) + costConstant;
}

// #endregion
//  #region draw functions

function drawResource()
{

}

function drawInventory()
{

}

function drawStats()
{
    
}

// #endregion