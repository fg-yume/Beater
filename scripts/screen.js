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
			this.objects[i].data.update();
			//this.action("update", i);
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
		ctx.fillRect(0, 0, beater.WIDTH, beater.HEIGHT);
		ctx.strokeRect(0, 0, beater.WIDTH, beater.HEIGHT);
		
		ctx.restore();
	
		// draw objects
		for(var i=0; i< this.objects.length; i++)
		{
			this.objects[i].data.draw(ctx);
			//this.action("draw", i, ctx);
		}
	};
	
	/*
	 * Modifies the specified key with the given changes
	 *
	 * @param	{String} key		the key in the screen to modify
	 * @param	{Object} changes	an object that encapsulates all of the changes to be made
	 *
	 * @return	none
	 */
	Screen.prototype.modify = function(key, changes)
	{
		// look for key
		for(var i=0; i < this.objects.length; i++)
		{
			if(this.objects[i].key == key)
			{
				// Label changes
				if(this.objects[i].data instanceof beater.Label)
				{
					if(changes.text)
						this.objects[i].data.text = changes.text;
						
					if(changes.color)
						this.objects[i].data.color = changes.color;
				}
			
				break; // no need to continue
			}
		}
	};
	
	/*
	 * Checks the screen to see if the mouse position is currently intersecting with any clickable objects on the screen
	 *
	 * @return	none
	 */
	Screen.prototype.mouseCheck = function()
	{
		for(var i=0; i < this.objects.length; i++)
		{
			// don't check labels
			if(this.objects[i].data instanceof beater.Label)
				continue;
			
			if(pointInRect(beater.input.currentMouseState.pos, {x: this.objects[i].data.pos.x, y: this.objects[i].data.pos.y, width: this.objects[i].data.size.width, height: this.objects[i].data.size.width}))
			{
				this.objects[i].data.clicked = true;
				break;
			}
		}
	};
	
	Screen.prototype.action = function(type, iterator, arg)
	{
		if("draw" === type)
			this.objects[iterator].data.draw(arg);
			
		else if("update" === type)
			this.objects[iterator].data.update();
			
		else
			console.log("Invalid action called!");
	};
	
	// public API
	return Screen;
})();