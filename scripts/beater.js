/*
 * beater.js
 * @author Freddy Garcia
 *
 * Handles the main functionality for 'beater'
 */
 
"use strict";
 
var beater = beater || {};

// Game constants	------------------------------------	
		
beater.GAME_STATE = {
	MAIN			: "MAIN",
	INSTRUCTIONS	: "INSTRUCTIONS",
	PAUSE			: "PAUSE",
	GAME			: "GAME",
	GAME_WIN		: "WIN",
	GAME_LOSE		: "LOSE"
}; 								// available game states

beater.KEYBOARD	= {
	"KEY_Z"	: 90,
	"KEY_X"	: 88,
	"KEY_P"	: 80
};								// available keyboard states

beater.OFFSET_LEFT		= document.querySelector("#canvas").offsetLeft;			// canvas offset from left of window
beater.OFFSET_TOP		= document.querySelector("#canvas").offsetTop;			// canvas offset from top of window
beater.CTX				= document.querySelector("#canvas").getContext('2d');	// 2d rendering context
beater.WIDTH			= document.querySelector("#canvas").width;				// width of the canvas
beater.HEIGHT			= document.querySelector("#canvas").height;				// height of the canvas

beater.main = {
	// Game variables	------------------------------------

	previousState 	: undefined,	// previous game state
	currentState 	: undefined,	// current game state
	keydown 		: [], 			// keys that are currently down
	mouseX			: undefined,	// x-coord of mouse
	mouseY			: undefined,	// y-coord of mouse
	hitCircles		: undefined,	// hit circles currently in the game
	testTimer		: 50,
	
	//testFunc : this.changeState(beater.GAME_STATE.GAME, false),
	
	testButton		: new beater.Button(beater.WIDTH/2, beater.HEIGHT/2, 50, 30, "#333", "#666", "Start!"),

	// Game methods		------------------------------------

	/*
	 * Changes the state of the game to the specified new state.
	 * A special case is used for the window going back into focus.
	 *
	 * @param 	newState		The state to switch into
	 * @param 	isUnpausing		Whether the state change involves unpausing the game
	 *
	 * @return	none
	 */
	changeState : function(newState, isUnpausing)
	{
		// Return to the previous state from pause, rather than a completely new state
		if(isUnpausing)
		{
			var temp = newState;
					
			this.previousState 	= this.currentState;
			this.currentState	= temp;
		}
		
		// Standard shift
		else
		{
			this.previousState 	= this.currentState;
			this.currentState 	= newState;
		}
	},

	/*
	 * Initializes necessary values in the game and begins the main loop.
	 *
	 * @return 	none
	 */
	init : function()
	{
		//console.log("init this");
		
		// defaults
		this.previousState 	= beater.GAME_STATE.MAIN;
		this.currentState 	= beater.GAME_STATE.MAIN;
		this.mouseX			= 0;
		this.mouseY			= 0;
		this.hitCircles		= new Array();	
		
		this.update();
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
		{
			this.hitCircles[i].update();
		}
			
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
		//this.previousState = this.currentState;
		
		// input
		beater.input.pollKeyboard();
		
		if(this.currentState == beater.GAME_STATE.MAIN)
		{
			this.testButton.update();
		}

		if(this.currentState == beater.GAME_STATE.GAME)
		{
			this.updateObjects();
			
			// test
			this.testTimer -= 1;
			if(this.testTimer <= 0)
			{
				this.hitCircles.push(new beater.Circle(this.mouseX, this.mouseY, 10, '#aaa', '#999', 100));
				
				//console.log(currMouseX +" " + currMouseY);
				
				this.testTimer = 100;
			}
		}
		
		// draw
		this.draw();
		
		// set loop
		requestAnimationFrame(this.update.bind(this));
	},

	/*
	 * Draws all of the objects in 'beater' to the rendering context
	 *
	 * @return	none
	 */
	draw : function()
	{
		beater.CTX.clearRect(0, 0, beater.WIDTH, beater.HEIGHT);
		
		beater.CTX.fillStyle = '#ccc';
		beater.CTX.fillRect(0, 0, beater.WIDTH, beater.HEIGHT);
	
		if(this.currentState == beater.GAME_STATE.MAIN)
		{
			this.testButton.draw(beater.CTX);
			
			beater.CTX.save();
			
			beater.CTX.fillStyle 	= "#FFF";
			beater.CTX.font 		= "20px Arial";
			
			beater.CTX.fillText("Press Z while hovering over start button to begin!", 50, 200);
			
			beater.CTX.restore();
		}
	
		if(this.currentState == beater.GAME_STATE.GAME)
		{
			// draw hit circles
			for(var i=0; i < this.hitCircles.length; i++)
				this.hitCircles[i].draw(beater.CTX);
		}
		
		if(this.currentState == beater.GAME_STATE.PAUSE)
		{
			console.log("draw pause");
			beater.CTX.save();
			
			beater.CTX.fillStyle 	= "#FFF";
			beater.CTX.font 		= "30px Arial";
			
			beater.CTX.fillText("Paused!", 200, 300);
			
			beater.CTX.restore();
		}
	},
	
	/*
	 * Check for collisions between the cursor and hit circles on the screen
	 *
	 * @return	none
	 */
	checkCollisions : function()
	{
		if(this.gameState == beater.GAME_STATE.MAIN)
		{
			console.log("main collision detection");
			
			if(testButton.x <= this.mouseX && testButton.x + testButton.width >= this.mouseX)
				if(testButton.y <= this.mouseY && testButton.y + testButton.height >= this.mouseY)
				{
					this.changeState(beater.GAME_STATE.GAME, false);
				}
		}
	
		if(this.gameState == beater.GAME_STATE.GAME)
		{
			for(var i = 0; i < this.hitCircles.length; i++)
			{
				var distSquared = ((this.mouseX - this.hitCircles[i].centerX) * 
				(this.mouseX - this.hitCircles[i].centerX)) + 
				((this.mouseY - this.hitCircles[i].centerY) * 
				(this.mouseY - this.hitCircles[i].centerY))
				
				// if dist^2 <= radius^2
				if(distSquared <= this.hitCircles[i].radius * this.hitCircles[i].radius)
				{
					// collision resolution
					var diff = hitCircles[i].radiusDifference();
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
	}
};