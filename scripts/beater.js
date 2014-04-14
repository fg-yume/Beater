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
	GAME_LOSE		: "LOSE",
	LOAD			: "LOAD"
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
		// initialize values for the game
		beater.game.init();
		
		//console.log("init this");
		
		// defaults	---------------------------------
		this.previousState 	= beater.GAME_STATE.MAIN;
		this.currentState 	= beater.GAME_STATE.MAIN;
		
		// screens 	---------------------------------
		this.mainScreen 		= new beater.Screen("#000", "#F26");
		this.instructionScreen 	= new beater.Screen("#222", "#F26");
		this.gameScreen			= new beater.Screen("#213512", "#F26");
		this.pauseScreen		= new beater.Screen("#666", "#F26");
		this.gameOverScreen		= new beater.Screen("#888", "#F26");
		this.gameWinScreen		= new beater.Screen("#AAA", "#F26");
		this.loadMusicScreen	= new beater.Screen("#230143", "#F26");
		this.pauseScreen		= new beater.Screen("#22001D", "#F26");
		
		this.changeState.bind(this);
		
		// buttons	---------------------------------
		this.instructionButton	= new beater.Button(400, 700, 100, 30, "#012345", "#CCC", "Inst", function(){
			beater.main.changeState(beater.GAME_STATE.INSTRUCTIONS, false);
		});
		
		this.mainMenuButton 	= new beater.Button(400, 700, 100, 30, "#FFF", "#CCC", "Main", function(){
			beater.main.changeState(beater.GAME_STATE.MAIN, false);
		});
		
		this.gameButton			= new beater.Button(400, 750, 100, 30, "#543210", "#CCC", "Game", function(){
			//this.changeState.bind(this)
			beater.main.changeState(beater.GAME_STATE.GAME, false);
		});
		
		this.resumeButton		= new beater.Button(400, 700, 100, 30, "#FFF", "#CCC", "Resume", function(){
			beater.main.changeState(beater.main.previousState, true);
		});
		
		this.loadButton			= new beater.Button(500, 600, 100, 30, "#A34", "#CCC", "Select Music", function(){	
			beater.main.changeState(beater.GAME_STATE.LOAD, false);
		});
		
		// labels	---------------------------------
		this.mainLabel			= new beater.Label("Helvetica", "Beater: By Freddy Garcia", 50, beater.WIDTH/2, 200, "#FFF", "#000");
		
		this.pauseLabel			= new beater.Label("Helvetica", "Pause!", 15, beater.WIDTH/2, 50, "#FFF", "#000");
		
		this.gameOverLabel		= new beater.Label("Helvetica", "Game Over!", 15, beater.WIDTH/2, 50, "#FFF", "#000");
		
		this.gameWinLabel 		= new beater.Label("Helvetica", "Game Win!", 15, beater.WIDTH/2, 50, "#FFF", "#000");
		
		this.pauseLabel			= new beater.Label("Helvetica", "Paused!", 50, beater.WIDTH/2, 200, "#F00", "#000");
		
		this.loadLabel			= new beater.Label("Helvetica", "Please drag a song onto the game screen!", 50, beater.WIDTH/2, 200, "#FFF", "#000");
		
		// append to screens
		
		this.mainScreen.addItem(this.gameButton);
		this.mainScreen.addItem(this.instructionButton);
		this.mainScreen.addItem(this.mainLabel);
		
		//this.instructionScreen.addItem(this.instructionButton);
		this.instructionScreen.addItem(this.mainMenuButton);
		
		this.pauseScreen.addItem(this.resumeButton);
		this.pauseScreen.addItem(this.pauseLabel);
		
		this.loadMusicScreen.addItem(this.loadLabel);
		
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
		// input
		beater.input.pollKeyboard();
		//beater.input.updateMouse();
		
		// check for clicks
		if(beater.input.mouseDown)
			this.checkCollisions();
		
		if(this.currentState == beater.GAME_STATE.MAIN)
			this.mainScreen.update();
			
		if(this.currentState == beater.GAME_STATE.INSTRUCTIONS)
			this.instructionScreen.update();

		if(this.currentState == beater.GAME_STATE.GAME)
		{
			this.gameScreen.update();
			beater.game.update();
		}
		
		if(this.currentState == beater.GAME_STATE.PAUSE)
			this.pauseScreen.update();
	},

	/*
	 * Draws the screens of the game when necessary, as well as the actual game
	 *
	 * @return	none
	 */
	draw : function()
	{
		if(this.currentState == beater.GAME_STATE.MAIN)
			this.mainScreen.draw(beater.CTX);
	
		if(this.currentState == beater.GAME_STATE.GAME)
		{
			this.gameScreen.draw(beater.CTX);
			beater.game.draw(beater.CTX);
		}
		
		if(this.currentState == beater.GAME_STATE.INSTRUCTIONS)
			this.instructionScreen.draw(beater.CTX);
		
		if(this.currentState == beater.GAME_STATE.PAUSE)
			this.pauseScreen.draw(beater.CTX);
	},
	
	/*
	 * The main loop for beater
	 *
	 * @return	none
	 */
	loop : function()
	{
		console.log("loop");
	
		this.update();
		this.draw();
		
		beater.animationID = requestAnimationFrame(this.loop.bind(this));
	},
	
	/*
	 * Check for collisions between the the items on the screen
	 *
	 * @return	none
	 */
	checkCollisions : function()
	{		
		if(this.currentState == beater.GAME_STATE.MAIN)
			this.mainScreen.mouseCheck();
		
		if(this.currentState == beater.GAME_STATE.INSTRUCTIONS)
			this.instructionScreen.mouseCheck();
	
		if(this.currentState == beater.GAME_STATE.GAME)
			beater.game.clickCheck();
			
		if(this.currentState == beater.GAME_STATE.PAUSE)
			this.pauseScreen.mouseCheck();
	}
};