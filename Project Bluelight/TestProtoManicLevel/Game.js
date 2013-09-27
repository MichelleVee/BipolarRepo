/**
 * Created with JetBrains WebStorm.
 * User: JBECKE15
 * Date: 9/19/13
 * Time: 5:41 PM
 * To change this template use File | Settings | File Templates.
 */

var c = document.getElementById("canvas");
var ctx=c.getContext("2d");
//ctx.fillStyle="#FF0000";
//ctx.fillRect(0,0,150,75);

/////////////
//Variables//
/////////////////////////////////////////////////////////////////////

//Fractal Background & Reveal
var backgroundImg = new Image();
var pixelArray = createArray(720,480);
backgroundImg.src = "background.png";

//Timer/Phase Ending
var endManic = false;
var startTime = 60;
var cTime = startTime;
//var lastTime;

//Player
var playerImg = new Image();
playerImg.src = "square.png";
var pwidth = playerImg.clientWidth;
var pheight = playerImg.clientHeight;
var posX = 360-32;
var posY = 240;
var rightKeyDown = false;
var leftKeyDown = false;
var upKeyDown = false;
var playerSpeed = 0;
var maxPlayerSpeed = 6;
var upSpeed = 0;
var gravity = 2;
var jumpStrength = 20;
var friction = 0.8;

//Platforms
var platformGravity = 0;
var platformImg = new Image();
platformImg.src = "platform.png";
var plX = 720 - 64;
var plY = 360;
var plwidth = platformImg.clientWidth;
var plheight = platformImg.clientHeight;
function platform(x, y)
{
    this.plx = x;
    this.ply = y;
    this.getx = function ()
    {
        return this.plx;
    }
    this.gety = function()
    {
        return this.ply;
    }
    this.setpos = function(a, b)
    {
        this.plx = a;
        this.ply = b;
    }
    this.sety = function(l)
    {
        this.ply = l;
    }
    this.break = function()
    {
        if(this.plx < 360)
        {
        this.setpos((360 * math.random()), -32);
        }
        if(this.plx > 360)
        {
            var check;
            while(check > (720 - plwidth))
            {
                check = 360 * (1 +math.random());
            }
            this.setpos(check, -32);
        }
    }
    this.collision = function(px, py)
    {
        //check for collision between player and platform
        var plw = plwidth;
        var plh = plheight;
        var pw = pwidth;
        var ph = pheight;
        var plx = this.plx;
        var ply = this.ply;

        if((px < (plx +plw) && px > plx) || ((px+pw) < (plx +plw) && (px +pw) > plx))
        {
            if(((py+ph) > (ply + plh)) && ((py+ph) <= (ply)))
            {
                upSpeed+= jumpStrength;
                this.break();
            }
        }

    }
}
                                                    var p1 = platform(400, 360);

//Debug
ctx.font = "32px Verdana";

//Setup
var Game = {};
Game.fps = 60;

document.onkeydown = keyDownListener;
document.onkeyup = keyUpListener;

//End Variables
////////////////////////////////////////////////////////////////

//Runs once per second.
Game.timerTick = function()
{
    cTime--;
    if(cTime < 0)
    {
        //Transition to depression phase.

        //When transition is done set the following variables below.
        cTime = startTime;
        endManic = true;
    }
}

//Runs once per frame
Game.run = function()
{
    Game.update();
    Game.draw();
}

Game.draw = function()
{
    if(endManic)
    {
        ctx.clearRect(0,0,720,480);
    }
    else
    {
        ctx.clearRect(0,0,720,480);
        ctx.drawImage(backgroundImg,0,0);
        //Cover background image here. This is really inefficient, needs to change later.
    //    for(var x = 0; x < 720; x+=10)
      //  {
       //     for(var y = 0; y < 480; y+=10)
         //   {
        //        ctx.clearRect(x,y,10,10);
        //    }
      //  }
        ctx.drawImage(playerImg,posX,posY);
        ctx.fillText((cTime).toString(),360 - 15,50);

        ctx.drawImage(platformImg, p1.getx(), p1.gety()); // draw platform 1
    }
}

Game.update = function()
{
    //Fractal Background Image Reveal
 //   var backgroundImageData = backgroundImg.getImageData(0, 0, backgroundImg.width, backgroundImg.height);
  //  for(var i = 0, n = backgroundImageData.length; i < n; i += 4)
  //  {
  //      backgroundImageData[i + 3] = 255;//Alpha
  //  }
 //   backgroundImg.putImageData(backgroundImageData,0,0,backgroundImg.width, backgroundImg.height);

    //Player movement stuff
    if(posX + playerSpeed * friction < 720 - playerImg.width)
    {
        if(posX + playerSpeed * friction > 0)
        {
            posX += playerSpeed * friction;
        }
        else
        {
            posX = 0;
        }
    }
    else
    {
        posX = 720 - playerImg.width;
    }
    if(posY >= 480)
    {
        upSpeed += jumpStrength * 1.2;
    }

    if(posY <= 120)
    {
        gravity = 6;
        platformGravity = 4;
    }
    else
    {
        gravity = 2
        platformGravity = 0;
    }
    posY += gravity - upSpeed;
    upSpeed--;
    if(upSpeed < 0)
    {
        upSpeed = 0;
    }

    if(platformGravity > 0)
    {
        p1.sety(p1.gety() - platformGravity);
    }

    if(endManic)
    {
        //ends game loop so that depressive phase can take over.
        //Be sure to play transition before doing this.
        clearInterval(Game._intervalId);
    }

}




function keyDownListener(e)
{
    //w and up
    if(e.keyCode == 87 || e.keyCode == 38)
    {
        //this is solely for testing jumping since we lack platforms currently.
        upSpeed += jumpStrength;
        upKeyDown = true;
    }
    //d and right
    if((e.keyCode == 68 || e.keyCode == 39))
    {
        rightKeyDown = true;
        playerSpeed++;
        if(playerSpeed > maxPlayerSpeed)
        {
            playerSpeed = maxPlayerSpeed;
        }
    }
    //a and left
    else if((e.keyCode == 65 || e.keyCode == 37))
    {
        leftKeyDown = true;
        playerSpeed--;
        if(playerSpeed < -maxPlayerSpeed)
        {
            playerSpeed = -maxPlayerSpeed;
        }
    }
}

function keyUpListener(e)
{
    //w and up
    if(e.keyCode == 87 || 38)
    {
        upKeyDown = false;
    }
    //d and right
    if((e.keyCode == 68 || e.keyCode == 39))
    {
       rightKeyDown = false;
    }
    //a and left
    else if((e.keyCode == 65 || e.keyCode == 37))
    {
       leftKeyDown = false;
    }
}

//easy multidimensional array creation for pixelArray
function createArray(length)
{
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1)
    {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

Game._intervalId = setInterval(Game.run,1000/Game.fps);
Game._timerIntervalId = setInterval(Game.timerTick, 1000);
