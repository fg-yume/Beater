/*
 * game.js
 * Requirements:
 *	utilities.js
 *
 * @author Freddy Garcia
 *
 * Handles functionality for the game section of 'beater'
 */
 
"use strict";

var beater = beater || {};

beater.game = {
	// Game variables	------------------------------------
	hitCircles	: undefined, // hit circles currently in the game
	testTimer	: 50,
	
	init : function()
	{
		this.hitCircles = new Array();
	},
	
	/*
	 * Updates all entities in the game
	 *
	 * @return	none
	 */
	updateObjects : function()
	{
		// update circles
		for(var i=0; i < this.hitCircles.length; i++)
			this.hitCircles[i].update();
			
		// ToDo: Check for circles that have not been clicked but are complete
			
		// filter out circles that have completed their lifetime
		this.hitCircles = this.hitCircles.filter(function(hitCircle){
			return !hitCircle.isComplete();
		});
	},
	
	/*
	 * Updates the game
	 *
	 * @return	none
	 */
	update : function()
	{
		this.updateObjects();
			
		// test
		this.testTimer -= 1;
		
		if(this.testTimer <= 0)
		{
			this.hitCircles.push(new beater.Circle(beater.input.mouseX, beater.input.mouseY, 10, '#aaa', '#999', 100));
			
			this.testTimer = 100;
		}
	},
	
	/*
	 * Draws the entities in 'Beater'
	 *
	 * @return	none
	 */
	draw : function(ctx)
	{
		// draw hit circles
		for(var i=0; i < this.hitCircles.length; i++)
			this.hitCircles[i].draw(ctx);
	},
	
	/*
	 * The loop for the game section of 'Beater'
	 *
	 * @return	none
	 */
	loop : function()
	{
		this.update();
		this.draw();
	},
	
	/*
	 * Check mouse clicks against the hit circles on the screen
	 *
	 * @return none
	 */
	clickCheck : function()
	{
		// game collision detection
		for(var i = 0; i < this.hitCircles.length; i++)
		{
			var ds = distanceSquared({x:beater.input.mouseX, y:beater.input.mouseY},
					{x:this.hitCircles[i].centerX, y:this.hitCircles[i].centerY});
			
			// if dist^2 <= radius^2
			if(ds <= this.hitCircles[i].radius * this.hitCircles[i].radius)
			{
				// collision resolution
				var diff = this.hitCircles[i].radiusDifference();
				if(diff <= 1)
				{
					// score += 30
					// multiplier ++
					// hp stuff
				}
					
				else if(diff <= 3)
				{
					// score += 10
					// multiplier ++
					// hp stuff
				}
					
				else if (diff <= 5)
				{
					// score += 5
					// multiplier ++
					// hp stuff
				}
					
				else
				{
					// multiplier = 1;
				}
				
				// break out of loop
				break;
			}
		}
	}
};