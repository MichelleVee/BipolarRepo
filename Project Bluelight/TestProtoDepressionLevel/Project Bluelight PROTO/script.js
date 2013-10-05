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
var player, enemy, glass, glassInst, orbs, orbInst;
var SEEK = true;  //CHANGE THIS TO TURN SEEKING ON AND OFF
var gravity = 0.3;
var playerAccel = 0;
var accelSide = 0.05;
var colBoxSize = 20;
var glassNumber = 8;  //CHANGE THIS TO CHANGE THE AMOUNT OF GLASS
var glassSpawnInterval = 300; //CHANGE THIS TO CHANGE HOW OFTEN GLASS SPAWNS
var orbSpawnInterval = 600;  //CHANGE THIS TO CHANGE HOW OFTEN ORBS SPAWN

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
	
	createGlassWave();

	//Create the orbs
	
	orbs = new Array();
	
	createOrb();
	
    //Set the update loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addListener(window);
}

//Game Loop
function tick()
{
	var ticks = createjs.Ticker.getTicks(true);
	
	if(ticks % glassSpawnInterval == 0)
	{
		createGlassWave();
	}
	
	if(ticks % orbSpawnInterval == 0)
	{
		createOrb();
	}
	

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
	
	//ORBS
	
	//SEEK
	if(SEEK)
	{
		for(var i = 0; i < orbs.length; i++)
		{
			//If player is not moving, orbs stop
			orbs[i].velx = (player.x - orbs[i].x)/(Math.sqrt(distSq(orbs[i],player))) / 2;
			if(upHeld)
			{
				orbs[i].velx *= Math.abs(playerAccel)+0.5;
			}
			else
			{
				orbs[i].velx *= Math.abs(playerAccel);
			}
			orbs[i].vely = (player.y - orbs[i].y)/(Math.sqrt(distSq(orbs[i],player))) / 2;
			if(upHeld)
			{
				orbs[i].velx *= Math.abs(playerAccel)+0.5 ;
			}
			else
			{
				orbs[i].vely *= Math.abs(playerAccel);
			}
			
			orbs[i].x += orbs[i].velx;
			orbs[i].y += orbs[i].vely;
		}
	}
	
	//GLASS
	
	//SEEK
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
	
	//COLLISIONS
	//If glass is inside collision box

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
	
	for(var i = 0; i < glass.length-1; i++)
	{
		for(var j = i+1; j < glass.length; j++)
		{
			if((!glass[i].frozen || !glass[j].frozen)
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
	
	for(var i = 0; i < orbs.length; i++)
	{
		if(player.x - colBoxSize < orbs[i].x
			&& player.x + colBoxSize > orbs[i].x
			&& player.y - colBoxSize < orbs[i].y
			&& player.y + colBoxSize > orbs[i].y)
		{
			knockBack();
			orbs.splice(i, 1);
		}
	}
	
	//Exert acceleration on player
	player.x += playerAccel;
	
    if(upHeld)
    {
        player.y -= 0.5;
    }

	//Gravitate down
	gravitate(player);
	
	for(var i = 0; i < glass.length; i++)
	{
		gravitate(glass[i]);
	}

    stage.update();
}

function createGlassWave()
{
	for(var i = 0; i < glassNumber; i++)
	{
		glassInst = new createjs.Shape();
		glassInst.graphics.beginFill("red").drawCircle(0,0, radius);
		glassInst.x = (canvas.width / 2) + (Math.floor(Math.random()*4.5) *(canvas.width / 8) * ((Math.floor(Math.random()*2)*2)-1));
		glassInst.y = canvas.height / 2 - 255;
		glassInst.targetFound = false;
		glassInst.frozen = false;
		stage.addChild(glassInst);
		glass.push(glassInst);
		findNewTarget(glassInst);
	}
}

function createOrb()
{
	orbInst = new createjs.Shape();
	orbInst.graphics.beginFill("blue").drawCircle(0,0, radius);
	orbInst.x = (canvas.width / 2) + 350 * ((Math.floor(Math.random()*2)*2)-1);
	orbInst.y = (canvas.height / 2) + (Math.floor(Math.random()*3) *(canvas.height / 8) * ((Math.floor(Math.random()*2)*2)-1));
	stage.addChild(orbInst);
	orbs.push(orbInst);
}

function distSq(a,b)
{
	var distance = ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y));
	return distance;
}

function findNewTarget(a)
{
	var shortest = 1000000;
	var curDist;
	var curTarget;
	for(var i = 0; i < glass.length; i++)
	{
		//if a and glass[i] are not the same
		if(a != glass[i])
		{
			curDist = distSq(a,glass[i]);
			//current distance is less than the shortest
			if(curDist < shortest)
			{
				shortest = curDist;
				curTarget = glass[i];
			}
		}
	}
	if(curTarget)
	{
		a.target = curTarget;
		curTarget.target = a;
		a.targetFound = true;
		curTarget.targetFound = true;
	}
}

function gravitate(p)
{
	p.y += gravity;
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

function knockBack()
{
    var playerY = player.y;
    console.log("Mouse clicked!");
    createjs.Tween.get(player).to({y:playerY + 90}, 1000, createjs.Ease.getPowOut(2.2));

}