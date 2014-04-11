/*
 * screen.js
 * @author Freddy Garcia
 *
 * A screen on the game
 */
 
"use strict";

var beater = beater || {};

beater.Screen = (function()
{
	/*
	 * Creates a screen with a set fill and stroke color
	 *
	 * @param	fill	the fill color for the screen
	 * @param	stroke	the stroke color for the screen
	 *
	 * @return	none
	 */
	var Screen = function(fill, stroke)
	{
		this.color = {
			fill	: fill,
			stroke	: stroke
		};
	
		this.objects = new Array(); // array of objects
	};
	
	/*
	 * Adds the object to the list of objects for the screen
	 *
	 * @param	object	the object to add to the screen
	 *
	 * @return	none
	 */
	Screen.prototype.addItem = function(object)
	{
		this.objects.push(object);
	};
	
	/*
	 * Updates all of the items on the screen
	 *
	 * @return	none
	 */
	Screen.prototype.update = function()
	{
		/*this.objects.forEach(function(obj){
			obj.update();
		});*/
		for(var i=0; i<this.objects.length; i++)
		{
			//this.objects[i].update();
			this.action("update", i);
		}
	};
	
	/*
	 *	Draws all of the items on the screen
	 *
	 * @param	ctx		the drawing context to draw to
	 *
	 * @return	none
	 */
	Screen.prototype.draw = function(ctx)
	{
		ctx.save();
		
		// clear screen
		ctx.clearRect(0, 0, beater.WIDTH, beater.HEIGHT);
		
		// settings
		ctx.fillStyle 	= this.color.fill;
		ctx.strokeStyle = this.color.stroke;
		ctx.lineWidth 	= 50;
		
		// draw background
		ctx.rect(0, 0, beater.WIDTH, beater.HEIGHT);
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	
		// draw objects
		for(var i=0; i< this.objects.length; i++)
		{
			//this.objects[i].draw(ctx);
			this.action("draw", i, ctx);
		}
	};
	
	Screen.prototype.checkCollisions = function()
	{
		for(var i=0; i < this.objects.length; i++)
		{
			if(pointInRect(beater.input.currentMouseState.pos, objects[i].pos) &&
				typeof this.objects[i] === beater.Button)
			{
				objects[i].clicked = true;
				break;
			}
		}
	};
	
	Screen.prototype.action = function(type, iterator, arg)
	{
		if("draw" === type)
			this.objects[iterator].draw(arg);
			
		else if("update" === type)
			this.objects[iterator].update();
			
		else
			console.log("Invalid action called!");
	};
	
	// public API
	return Screen;
})();