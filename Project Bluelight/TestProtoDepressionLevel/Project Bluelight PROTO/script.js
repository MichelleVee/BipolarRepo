/**
 * Created with JetBrains WebStorm.
 * User: Kappy
 * Date: 9/17/13
 * Time: 9:28 PM
 * To change this template use File | Settings | File Templates.
 */

//Setting up variables for the canvas, stage, and
//other elements for the game to run
var canvas, stage, bounds;
var g;

//Radius for drawing player circle **PROTOYPE ONLY**
var radius = 10;

//Useful keycode variables
var KEYCODE_ENTER = 13;
var KEYCODE_SPACE = 32;
var KEYCODE_UP = 38;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;

//Keyboard event variables
var leftHeld, upHeld, rightHeld;

//Initialize game variables
var player, enemy, glass;
var timerMsg;
var depthMeter, randDepth;
var gravity = 0.3;

//Key event initialization
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init()
{
    if(!(!!document.createElement('canvas').getContext))
    {
        var wrapper = document.getElementById("canvasWrapper");
        wrapper.innerHTML = "Your browser does not appear to support " +
            "the HTML5 Canvas element";
        return;
    }

    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);

    //This is strictly for testing the "pushback" the player
    //receives upon collision with an enemy
    stage.mouseEventEnabled = true;

    //Create the player
    player = new createjs.Shape();
    player.graphics.beginFill("black").drawCircle(0, 0, radius);
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    stage.addChild(player);

    //Create the timer
    timerMsg = new createjs.Text('30', 'Bold 25px Arial', 'black');
    timerMsg.x = 20;
    timerMsg.y = 20;
    stage.addChild(timerMsg);

    //This is for the event listener added to the Ticker for the timer.
    //Thus, it is put in the init() function as part of initializing the timer.
    var delay = 60;
    var timer = function()
    {
        if(delay <= 0)
        {
            timerMsg.text = parseInt(timerMsg.text - 1);
            delay = 60;
        }
        delay--;
    }

    //Initialize the Depth Meter
    depthMeter = new createjs.Shape();
    depthMeter.graphics.beginFill("black").drawRect(650, 20, 25, 150);
    stage.addChild(depthMeter);

    var randDelay = 60;
    randDepth = 0;

    randTimerMsg = new createjs.Text(randDepth, 'Bold 25px Arial', 'black');
    randTimerMsg.x = 50;
    randTimerMsg.y = 20;
    stage.addChild(randTimerMsg);

    var randTimer = function()
    {
        if(randDelay <= 0)
        {
            randDepth = Math.floor(Math.random() * 5);
            randTimerMsg.text = randDepth;
            randDelay = Math.floor(Math.random() * 601);
        }
        randDelay--;
    }

    //Set the update loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(window);
    createjs.Ticker.addEventListener('tick', timer);
    createjs.Ticker.addEventListener('tick', randTimer);
}

//Game Loop
function tick()
{
    if(leftHeld)
    {
        player.x -= 0.3;
        console.log("leftKey is held!");
    }

    if(rightHeld)
    {
        player.x += 0.3;
    }

    if(upHeld)
    {
        player.y -= 0.5;
    }

	//Gravitate down
	gravitate(player);
	
    player.onClick = knockBack;

    //For the depth meter simulation
    switch(randDepth)
    {
        case 0:
            depthMeter.graphics.clear().beginFill("black").drawRect(650, 20, 25, 150);
            break;
        case 1:
            depthMeter.graphics.clear().beginFill("black").drawRect(650, 20, 25, 125);
            break;
        case 2:
            depthMeter.graphics.clear().beginFill("black").drawRect(650, 20, 25, 100);
            break;
        case 3:
            depthMeter.graphics.clear().beginFill("black").drawRect(650, 20, 25, 75);
            break;
        case 4:
            depthMeter.graphics.clear().beginFill("black").drawRect(650, 20, 25, 50);
            break;
    }

    stage.update();
}

function gravitate(p)
{
	p.y += gravity;
}

function knockBack()
{
    var playerY = player.y;
    console.log("Mouse clicked!");
    createjs.Tween.get(player).to({y:playerY + 90}, 1000, createjs.Ease.getPowOut(2.2));

}
function handleKeyDown(e)
{
    if(!e)
    {
        var e = window.event;
    }

    if(e.keyCode == KEYCODE_LEFT)
    {
        leftHeld = true;
    }

    if(e.keyCode == KEYCODE_RIGHT)
    {
        rightHeld = true;
    }

    if(e.keyCode == KEYCODE_UP)
    {
        upHeld = true;
    }
}

function handleKeyUp(e)
{
    if(!e)
    {
        var e = window.event;
    }

    if(e.keyCode == KEYCODE_LEFT)
    {
        leftHeld = false;
    }

    if(e.keyCode == KEYCODE_RIGHT)
    {
        rightHeld = false;
    }

    if(e.keyCode == KEYCODE_UP)
    {
        upHeld = false;
    }
}