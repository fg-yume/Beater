/*
 * beater.js
 * @author Freddy Garcia
 *
 * Handles the main functionality for 'beater' game
 */
 
"use strict";
 
var beater = beater || {};

// Game constants	------------------------------------	

beater.KEYBOARD	= {
	"KEY_Z"	: 90,
	"KEY_X"	: 88,
	"KEY_P"	: 80
};								// available keyboard states
		
beater.GAME_STATE = {
	MAIN			: "MAIN",
	INSTRUCTIONS	: "INSTRUCTIONS",
	PAUSE			: "PAUSE",
	GAME			: "GAME",
	GAME_WIN		: "WIN",
	GAME_LOSE		: "LOSE"
}; 								// available game states

beater.OFFSET_LEFT		= document.querySelector("#canvas").offsetLeft;			// canvas offset from left of window
beater.OFFSET_TOP		= document.querySelector("#canvas").offsetTop;			// canvas offset from top of window
beater.CTX				= document.querySelector("#canvas").getContext('2d');	// 2d rendering context
beater.WIDTH			= document.querySelector("#canvas").width;				// width of the canvas
beater.HEIGHT			= document.querySelector("#canvas").height;				// height of the canvas

beater.main = {
	// Game variables	------------------------------------
	previousState 	: undefined,	// previous game state
	currentState 	: undefined,	// current game state
	testButton		: new beater.Button(beater.WIDTH/2, beater.HEIGHT/2, 50, 30, "#333", "#666", "Start!", function(){
		//this.changeState.bind(this);
		
		this.changeState(beater.GAME_STATE.GAME, false);
	}),

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
		//this.hitCircles		= new Array();	
		
		beater.game.init();
		
		// begin loop
		this.loop();
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
			beater.game.update();
		}
		
		// draw
		//this.draw();
		
		// set loop
		//requestAnimationFrame(this.update.bind(this));
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
			beater.game.draw(beater.CTX);
		}
		
		if(this.currentState == beater.GAME_STATE.PAUSE)
		{
			//console.log("draw pause");
			beater.CTX.save();
			
				beater.CTX.fillStyle 	= "#FFF";
				beater.CTX.font 		= "30px Arial";
				
				beater.CTX.fillText("Paused!", 200, 300);
			
			beater.CTX.restore();
		}
	},
	
	loop : function()
	{
		this.update();
		this.draw();
		
		requestAnimationFrame(this.loop.bind(this));
	},
	
	/*
	 * Check for collisions between the cursor and hit circles on the screen
	 *
	 * @return	none
	 */
	checkCollisions : function()
	{		
		if(this.currentState == beater.GAME_STATE.MAIN)
		{
			if(this.testButton.x <= beater.input.mouseX && this.testButton.x + this.testButton.width >= beater.input.mouseX)
			{
				console.log("first pass");
				if(this.testButton.y <= beater.input.mouseY && this.testButton.y + this.testButton.height >= beater.input.mouseY)
				{
					console.log("second pass");
					this.changeState(beater.GAME_STATE.GAME, false);
				}
			}
		}
	
		if(this.currentState == beater.GAME_STATE.GAME)
			beater.game.clickCheck();
	}
};