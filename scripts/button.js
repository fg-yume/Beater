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
	 * @param	x		the x-coord of the button (center)
	 * @param	y		the y-coord of the button (center)
	 * @param	width	the width of the button
	 * @param	height	the height of the button
	 * @param	fill	the fill color of the button
	 * @param	stroke	the stroke color of the button
	 * @param	text	the text of the button
	 * @param	func	the function to call when the button is clicked
	 */
	var Button = function(x, y, width, height, fill, stroke, text, func)
	{
		this.pos 	= {
			x : x,
			y : y
		};
		this.size	= {
			width : width,
			height : height
		};
		this.fill	= fill;
		this.stroke	= stroke;
		this.text	= text;
		this.func	= func;
		
		this.clicked = false;
	};
	
	/*
	 * Updates the button; The button's function is called if the button has been clicked
	 *
	 * @return	none
	 */
	Button.prototype.update = function()
	{
		if(this.clicked /*&& "function" == typeof func*/)
			this.func();
			
		this.clicked = false;
	};
	
	/*
	 * Draw the button in the given drawing context
	 *
	 * @param	ctx	the context that the button is being drawn to
	 */
	Button.prototype.draw = function(ctx)
	{
		// restore point - pre rectangle
		ctx.save();
		
			// rectangle settings
			ctx.fillStyle = this.fill;
			ctx.strokeStyle = this.stroke;
			ctx.lineWidth = STROKE_WIDTH;
			
			// this breaks!
			//ctx.rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
			//ctx.fill();
			//ctx.stroke();
			
			// draw
			ctx.fillRect(this.pos.x - this.size.width/2, this.pos.y - this.size.height/2, this.size.width, this.size.height);
			ctx.strokeRect(this.pos.x - this.size.width/2, this.pos.y - this.size.height/2, this.size.width, this.size.height);
		
		// revert changes - post rectangle
		ctx.restore();
		
		// restore point - pre text
		ctx.save();
		
			// text settings
			ctx.font = "12px Arial";
			ctx.fillStyle = "#3A3CB1";
			ctx.textAlign = "center";
			
			// draw text centered on the button
			ctx.fillText(this.text, this.pos.x, this.pos.y + this.size.height/8);
		
		// revert changes - post text
		ctx.restore();
	};
	
	return Button;
})();