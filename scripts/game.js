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
	score		: 0,
	multiplier	: 1,
	path		: {x : beater.WIDTH/2, y: beater.HEIGHT/2},
	MIN_X		: 45,
	MIN_Y		: 45,
	MAX_X		: beater.WIDTH - 45,
	MAX_Y		: beater.HEIGHT - 45,
	previousShift	: 0, //0: left, 1: up, 2: right, 3: down
	currentShift	: 0,
	
	/*
	 * Initializes necessary variables for the game
	 *
	 * @return	none
	 */
	init : function()
	{
		this.reset();
		//console.log(beater.WIDTH);
		//console.log(beater.HEIGHT);
	},
	
	reset : function()
	{
		this.hitCircles = new Array();
		this.testTimer = 0;
		this.score = 0;
		this.multiplier = 1;
	},
	
	/*
	 * Updates all entities in the game based on time since last frame
	 *
	 * @param	{Number} dt	the amount of time that has elapsed since last update
	 *
	 * @return	none
	 */
	updateObjects : function(dt)
	{
		// update circles
		for(var i=0; i < this.hitCircles.length; i++)
			this.hitCircles[i].update(dt);
			
		// ToDo: Check for circles that have been clicked
		this.hitCircles = this.hitCircles.filter(function(hitCircle){
			return !hitCircle.isTouched();
		});
		
		// size check before filtering completed circles
		var size = this.hitCircles.length;
			
		// filter out circles that have completed their lifetime
		this.hitCircles = this.hitCircles.filter(function(hitCircle){
			return !hitCircle.isComplete();
		});
		
		//console.log("size: " + size);
		//console.log("length: " + this.hitCircles.length);
		
		// check against new length
		if(size != this.hitCircles.length)
			this.multiplier = 1;
	},
	
	/*
	 * Uses the byte frequency data of the audio in order to determine whether or not to spawn a circle
	 *
	 * @return	{BOOL} whether or not to spawn a circle
	 */
	willCreate : function()
	{
		var bfd = beater.audio.byteFrequencyData();
		
		//var max = Array.max(bfd);
		var avg = noZeroAverage(bfd);
		//var min = Array.min(bfd);
		
		//console.log("max: " + max);
		//console.log("min: " + min);
		//console.log("avg: " + avg/beater.MAX_FREQUENCY);
		
		var spawnChange = avg/beater.MAX_FREQUENCY;
		
		// random value to compare against
		var rdm = Math.random() + .55;
		//console.log("random: " + rdm);
		
		if(spawnChange >= rdm)
			return true;
			
		else
			return false
	},
	
	/*
	 * Creates a circle at a random position on the screen
	 *
	 * @return	none
	 */
	create : function()
	{
		// Randomly choose location
		//var randX = Math.random() * (beater.WIDTH - 30);// + 30;
		//var randY = Math.random() * (beater.HEIGHT - 30);// + 30;
		
		//console.log(this.path.x);
		//console.log(this.path.y);
	
		this.hitCircles.push(new beater.Circle(
			this.path.x, this.path.y, 10, '#aaa', '#999', 100));
	},
	
	/*
	 * Updates the score and multiplier labels of the game screen
	 * based on the game values
	 *
	 * @return	none
	 */
	updateScore : function()
	{
		// Modify labels
		beater.main.gameScreen.modify("score", {text: "Score: " + this.score});
		beater.main.gameScreen.modify("multiplier", {text: "Multiplier: " + this.multiplier});
	},
	
	updatePath : function(dt)
	{
		//0: left, 1: up, 2: right, 3: down
	
		// randomly choose where to go
		var rdm = Math.random();
		
		// left
		if(rdm < .25)
		{
			// check if previous movement was right
			if(this.previousShift == 2)
			{
				// move right instead!
				this.path.x += 10 * dt * 60/1000;
				this.currentShift = 2;
				
				// boundary checks
				if(this.path.x > this.MAX_X)
					this.path.x = this.MAX_X;
			}
		
			// move left
			else
			{
				this.path.x -= 10 * dt * 60/1000;
				this.currentShift = 0;
				
				// boundary check
				if(this.path.x < this.MIN_X)
					this.path.x = this.MIN_X;
			}
		}
			
		// up
		else if(rdm >= .25 && rdm < .5)
		{
			// check if previous movement was down
			if(this.previousShift == 3)
			{
				// move down instead!
				this.path.y += 10 * dt * 60/1000;
				this.currentShift = 3;
				
				// boundary check
				if(this.path.y > this.MAX_Y)
					this.path.y = this.MAX_Y;
			}
		
			// move up
			else
			{
				this.path.y -= 10 * dt * 60/1000;
				this.currentShift = 1;
				
				// boundary check
				if(this.path.y < this.MIN_X)
					this.path.y = this.MIN_X;
			}
		}
			
		// right
		else if(rdm >= .5 && rdm < .75)
		{
			//check if previous movement was left
			if(this.previousShift == 0)
			{
				// move left instead!
				this.path.x -= 10 * dt * 60/1000;
				this.curretShift = 0;
				
				// boundary check
				if(this.path.x < this.MIN_X)
					this.path.x = this.MIN_X;
			}
			
			// move right
			else
			{
				this.path.x += 10 * dt * 60/1000;
				this.currentShift = 2;
				
				// boundary check
				if(this.path.x > this.MAX_X)
					this.path.x = this.MAX_X;
			}
		}
		
		// down
		else
		{
			// check if previous movement was up
			if(this.previousShift == 1)
			{
				// move up instead!
				this.path.y -= 10 * dt * 60/1000;
				this.currentShift = 1;
				
				// boundary check
				if(this.path.y < this.MIN_Y)
					this.path.y = this.MIN_Y;
			}
		
			// move down
			else
			{
				this.path.y += 10 * dt * 60/1000;
				this.currentShift = 3;
				
				// boundary check
				if(this.path.y > this.MAX_Y)
					this.path.y = this.MAX_Y;
			}
		}
		
		this.previousShift = this.currentShift;
	},
	
	/*
	 * Updates the game based on time passed
	 *
	 * @param	{Number} dt	the amount of time that has changed since the last update
	 *
	 * @return	none
	 */
	update : function(dt)
	{
		// change to proper screen on completion
		if(beater.audio.hasCompleted)
			beater.main.changeState(beater.GAME_STATE.GAME_WIN, false);
			
		this.updatePath(dt);
		
		this.updateObjects(dt);
		this.updateScore();	// needs to be done after objects due to score/multiplier being affected in updateObjects()
		
		// create new circles based on music
		if(this.willCreate())
			this.create();
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
				
				// break out of loop
				break;
			}
		}
	}
};