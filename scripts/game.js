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
	testTimer	: 0,
	score		: 0,
	multiplier	: 1,
	
	/*
	 * Initializes necessary variables for the game
	 *
	 * @return	none
	 */
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
		
		//console.log("game update");
			
		// test
		this.testTimer -= 1;
		
		if(this.testTimer <= 0)
		{
			this.hitCircles.push(new beater.Circle(beater.input.currentMouseState.pos.x, beater.input.currentMouseState.pos.y, 10, '#aaa', '#999', 100));
			
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
	 * Check mouse clicks against the hit circles on the screen
	 *
	 * @return none
	 */
	clickCheck : function()
	{
		// game collision detection
		for(var i = 0; i < this.hitCircles.length; i++)
		{
			var ds = distanceSquared(beater.input.currentMouseState.pos,
					this.hitCircles[i].center);
					
			//console.log(ds);
			
			// if dist^2 <= radius^2
			if(ds <= this.hitCircles[i].radius * this.hitCircles[i].radius)
			{
				// collision resolution and set clicked to true
				var diff = this.hitCircles[i].radiusDifference();
				
				//console.log(diff);
				
				if(diff <= 4)
				{
					this.score += 30 * this.multiplier;
					this.multiplier ++;
					// hp stuff
				}
					
				else if(diff <= 7)
				{
					this.score += 10 * this.multiplier;
					this.multiplier ++;
					// hp stuff
				}
					
				else if (diff <= 10)
				{
					this.score += 5 * this.multiplier;
					this.multiplier ++;
					// hp stuff
				}
					
				else
					this.multiplier = 1;
				
				// Modify labels
				beater.main.gameScreen.modify("score", {text: "Score: " + this.score});
				beater.main.gameScreen.modify("multiplier", {text: "Multiplier: " + this.multiplier});
				
				// break out of loop
				break;
			}
		}
	}
};