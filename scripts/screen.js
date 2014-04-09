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
		this.objects.forEach(function(obj){
			obj.update();
		});
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
		this.objects.forEach(function(obj){
			obj.draw(ctx);
		});
	};
	
	// public API
	return Screen;
})();