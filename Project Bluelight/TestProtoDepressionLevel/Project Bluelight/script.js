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

    //Set the update loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(window);
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
        player.y -= 0.2;
    }

    player.onClick = knockBack;

    stage.update();
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