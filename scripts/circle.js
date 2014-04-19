/*
 * circle.js
 * @author Freddy Garcia
 *
 * A circle that can be hit on the screen
 *
 * Requirements:
 *	ring.js
 */
 
"use strict";
 
var beater = beater || {};

beater.Circle = (function()
{	
	// private	----------------------------------------
	var STROKE_WIDTH_DIVIDER	= 10.0;		// constant used to calculate stroke width
	var RING_RELATIVE_RADIUS	= 3.5;		// radius of the ring relative to radius of the circle
	var STROKE_COLOR			= "#FFF";	// stroke color of the circle
	
	// public 	----------------------------------------
	
	/*
	 * Creates a circle with the given parameters
	 *
	 * @param	centerX		the x-coord of the circle's center
	 * @param	centerY		the y-coord of the circle's center
	 * @param	radius		the radius of the circle
	 * @param	fillColor	the fill color of the circle
	 * @param	strokeColor	the stroke color of the circle
	 * @param	timer		the time until the circle disappears
	 *
	 * @return	none
	 */
	var Circle = function(centerX, centerY, radius, fillColor, strokeColor, timer)
	{
		this.center 		= {
			x : centerX,
			y : centerY
		};
		this.radius			= radius;
		this.fillColor		= fillColor.toString();
		this.strokeColor	= strokeColor.toString();
		
		this.complete		= false; // If the circle has completed its lifetime
		this.strokeWidth	= radius/STROKE_WIDTH_DIVIDER;
		
		this.touched		= false; // if the circle has been clicked
		
		//this.createRing.bind(this);
		
		// Create outer ring
		this.createRing(this.center.x, this.center.y, this.radius * RING_RELATIVE_RADIUS, this.radius, this.fillColor, timer);
	};
	
	/*
	 * Returns whether this circle has completed its lifetime
	 *
	 * @return	{BOOL} if the circle has completed
	 */
	Circle.prototype.isComplete = function()
	{
		return this.complete;
	};
	
	/*
	 * Returns whether this circle has been clicked
	 *
	 * @return	{BOOL} if the circle has been clicked
	 */
	Circle.prototype.isTouched = function()
	{
		return this.touched;
	};
	
	/*
	 * Returns the difference in radii of the circle and the circle's ring
	 * and sets the circle's touched state to true
	 *
	 * @return	{Number} the difference in radii
	 */
	Circle.prototype.radiusDifference = function()
	{
		this.touched = true;
		
		//console.log("circle R: " + this.radius);
		//console.log("ring R: " + this.ring.Radius());
		
		//console.log(Math.abs(this.radius - this.ring.Radius()));
		
		// difference in radii between circle and ring
		return Math.abs(this.radius - this.ring.Radius());	
	};
	
	/*
	 * Updates the circle, as well as the surrounding ring, based on time elapsed since last frame
	 *
	 * @param	{Number} dt	the time that has elapsed since the last call to update
	 *
	 * @return	none
	 */
	Circle.prototype.update = function(dt)
	{
		//console.log("circle update");
	
		this.ring.update(dt);
	
		// check for completion
		if(this.ring.hasShrunk())
		{
			this.complete = true;
			//console.log("complete");
		}
	};
	
	/*
	 * Draws the circle to the screen
	 *
	 * @param	ctx		the 2D context to which the circle is being drawn to
	 *
	 * @return	none
	 */
	Circle.prototype.draw = function(ctx)
	{
		// restore point
		ctx.save();
		
		// context settings
		ctx.fillStyle 	= this.fillColor;
		ctx.strokeStyle	= STROKE_COLOR;
		ctx.lineWidth	= this.strokeWidth;
		
		// path
		ctx.beginPath();
			ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		
		// draw
		ctx.fill();
		ctx.stroke();
		
		// revert changes
		ctx.restore();
		
		this.ring.draw(ctx);
	};
	
	/*
	 * Creates a ring around the circle
	 *
	 * @param	timer	the time until the created ring shrinks into the circle
	 *
	 * @return	none
	 */
	Circle.prototype.createRing = function(centerX, centerY, radius, circleRadius, strokeColor, timer)
	{
		this.ring = new beater.Ring(centerX, centerY, radius , circleRadius, strokeColor, timer);
	};
	
	// public API
	return Circle;
})();