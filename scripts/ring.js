/*
 * ring.js
 * @author Freddy Garcia
 *
 * A ring that goes around hit circles
 */
 
"use strict";

var beater = beater || {};

beater.Ring = (function()
{
	// private 	----------------------------------------
	
	var RING_WIDTH	= 2;// constant ring width

	// public 	----------------------------------------
	
	/*
	 * Creates a ring with the given parameters
	 *
	 * @param 	centerX 		the x-coord of the ring's center
	 * @param 	centerY			the y-coord of the ring's center
	 * @param	radius			the initial radius of the ring
	 * @param	circleRadius 	the radius to shrink towards
	 * @param	color			the color of the ring
	 * @param 	shrinkTime 		the amount of time (seconds) before the ring completely shrinks
	 *
	 * @return 	none
	 */
	var Ring = function(centerX, centerY, radius, circleRadius, color, shrinkTime)
	{
		this.centerX		= centerX;		
		this.centerY		= centerY;		
		this.radius			= radius;
		this.finalRadius	= circleRadius;
		this.color			= color;
	
		this.shrunk 		= false;
		this.shrinkRate 	= (this.radius - this.finalRadius) / shrinkTime;
	};
	
	/*
	 * Returns whether the ring has finished shrinking
	 *
	 * @return 	if ring has shrunk
	 */
	Ring.prototype.hasShrunk = function()
	{
		return this.shrunk;
	};
	
	/*
	 * Returns the radius of the ring
	 *
	 * @return	the radius of the ring
	 */
	Ring.prototype.Radius = function()
	{
		return this.radius;
	};
	
	/*
	 * Updates the ring
	 *
	 * @return 	none
	 */
	Ring.prototype.update = function(dx)
	{
		this.radius -= this.shrinkRate;
		
		// update when final radius is reached
		if(this.radius <= this.finalRadius)
			this.shrunk = true;
	};
	
	/*
	 * Draws the ring to the canvas
	 * 
	 * @param	ctx		The context to draw to
	 *
	 * @return 	none
	 */
	Ring.prototype.draw = function(ctx)
	{
		// restore point
		ctx.save();
		
		// context settings
		ctx.strokeStyle	= this.color;
		ctx.lineWidth	= RING_WIDTH;
		
		// path
		ctx.beginPath();
			ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		
		// draw
		ctx.stroke();
		
		// revert changes
		ctx.restore();
	};
	
	// public API
	return Ring;
})();