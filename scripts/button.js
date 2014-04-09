/*
 * Button.js
 * @author Freddy Garcia
 *
 * A "button" in beater
 */
 
"use strict";
 
var beater = beater || {};
 
beater.Button = (function()
{
	// private	----------------------------------------
	var STROKE_WIDTH = 2;

	// public 	----------------------------------------
	
	/*
	 * Creates a button with the given parameters
	 *
	 * @param	x		the x-coord of the button (top-left)
	 * @param	y		the y-coord of the button (top-left)
	 * @param	width	the width of the button
	 * @param	height	the height of the button
	 * @param	fill	the fill color of the button
	 * @param	stroke	the stroke color of the button
	 * @param	text	the text of the button
	 * @param	func	the function to call when the button is clicked
	 */
	var Button = function(x, y, width, height, fill, stroke, text, func)
	{
		this.x		= x;
		this.y		= y;
		this.width	= width;
		this.height	= height;
		this.fill	= fill;
		this.stroke	= stroke;
		this.text	= text;
		this.func	= func;
		
		this.clicked = false;
	};
	
	Button.prototype.update = function()
	{
		if(this.clicked && this.func !== undefined)
			this.func();
	};
	
	Button.prototype.draw = function(ctx)
	{
		// restore point - pre rectangle
		ctx.save();
		
			// rectangle settings
			ctx.fillStyle = this.fill;
			ctx.strokeStyle = this.stroke;
			
			// draw
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.stroke();
		
		// revert changes - post rectangle
		ctx.restore();
		
		// restore point - pre text
		ctx.save();
		
			// text settings
			ctx.font = "12px Arial";
			ctx.fillStyle = "#FFF";
			
			// draw
			ctx.fillText(this.text, this.x + this.width/4, this.y + this.height/2);
		
		// revert changes - post text
		ctx.restore();
	};
	
	return Button;
})();