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
var player, enemy, glass, glassInst;
var SEEK = true;  //CHANGE THIS TO TURN SEEKING ON AND OFF
var gravity = 0.3;
var playerAccel = 0;
var accelSide = 0.05;
var colBoxSize = 20;

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

	//Create the glass
	glass = new Array();
	
	glassInst = new createjs.Shape();
	glassInst.graphics.beginFill("red").drawCircle(0,0, radius);
	glassInst.x = canvas.width / 2;
	glassInst.y = canvas.height / 2 - 20;
	glassInst.frozen = false;
	stage.addChild(glassInst);
	glass[0] = glassInst;
	
	glassInst = new createjs.Shape();
	glassInst.graphics.beginFill("red").drawCircle(0,0, radius);
	glassInst.x = canvas.width / 2 + 60;
	glassInst.y = canvas.height / 2 - 120;
	glassInst.frozen = false;
	stage.addChild(glassInst);
	glass[1] = glassInst;
	
	glass[0].target = glass[1];
	glass[1].target = glass[0];
	
	
    //Set the update loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(window);
}

//Game Loop
function tick()
{
	// PLAYER FUNCTIONS
    if(leftHeld)
    {
		//If player is not fully accelerated
		if(playerAccel > -0.3)
		{
			//Set player acceleration more left
			playerAccel -= accelSide;
		}
        console.log("leftKey is held!");
    }
	else //If not moving left
	{
		//Slowly come to a halt
		playerAccel -= (playerAccel/60);
	}
    
	if(rightHeld)
	{
		//If player is not fully accelerated
		if(playerAccel < 0.3)
		{
			//Set player acceleration more right
			playerAccel += accelSide;
		}
	}
	else //If not moving right
	{
	    //Slowly come to a halt
		playerAccel -= (playerAccel/60);
	}
	
	//GLASS FUNCTIONS
	
	//SEEK
	//*/
	if(SEEK)
	{
		for(var i = 0; i < glass.length; i++)
		{
			if(!glass[i].frozen)
			{
				glass[i].velx = (glass[i].target.x - glass[i].x)/400;
				glass[i].vely = (glass[i].target.y - glass[i].y)/400;
	
				glass[i].x += glass[i].velx;
				glass[i].y += glass[i].vely;
			}
		}
	}
	
	//*/
	
	//COLLISIONS
	//If glass is inside collision box

	//*/
	for(var i = 0; i < glass.length; i++)
	{
		if(player.x - colBoxSize < glass[i].x
			&& player.x + colBoxSize > glass[i].x
			&& player.y - colBoxSize < glass[i].y
			&& player.y + colBoxSize > glass[i].y)
		{
			knockBack();
		}
	}
	//*/
	for(var i = 0; i < glass.length-1; i++)
	{
		for(var j = i+1; j < glass.length; j++)
		{
			if((!glass[i].frozen && !glass[j].frozen)
				&& glass[i].x - colBoxSize < glass[j].x
				&& glass[i].x + colBoxSize > glass[j].x
				&& glass[i].y - colBoxSize < glass[j].y
				&& glass[i].y + colBoxSize > glass[j].y)
			{
				glass[i].frozen = true;
				glass[j].frozen = true;
			}
		}
	}
	//*/
	
	//Exert acceleration on player
	player.x += playerAccel;
	
    if(upHeld)
    {
        player.y -= 0.5;
    }

	//Gravitate down
	gravitate(player);
	
    player.onClick = knockBack;

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