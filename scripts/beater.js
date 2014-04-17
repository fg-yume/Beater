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
	 * A special case is used for switching from pause state.
	 * TODO: Re-work method in order to make use of a single variable for unpausing
	 *
	 * @param 	{beater.GAME_STATE} newState		The state to switch into
	 * @param 	{Boolean}			isUnpausing		Whether the state change involves unpausing the game
	 *
	 * @return	none
	 */
	changeState : function(newState, isUnpausing)
	{
		// Return to the previous state from pause, rather than a new state
		if(isUnpausing)
		{
			var temp = newState; // assume newState == previousState
					
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
		beater.audio.init();
		
		// defaults	---------------------------------
		this.previousState 	= beater.GAME_STATE.MAIN;
		this.currentState 	= beater.GAME_STATE.MAIN;
		
		// screens 	---------------------------------
		this.mainScreen 		= new beater.Screen("#FFFAA3", "#F26");
		this.instructionScreen 	= new beater.Screen("#FFFAA3", "#F26");
		this.gameScreen			= new beater.Screen("#FFFAA3", "#F26");
		this.pauseScreen		= new beater.Screen("#FFFAA3", "#F26");
		this.gameOverScreen		= new beater.Screen("#FFFAA3", "#F26");
		this.gameWinScreen		= new beater.Screen("#FFFAA3", "#F26");
		this.loadMusicScreen	= new beater.Screen("#FFFAA3", "#F26");
		this.pauseScreen		= new beater.Screen("#FFEA5A", "#F26");
		
		this.changeState.bind(this);
		
		// buttons	---------------------------------
		this.instructionButton	= new beater.Button(400, 700, 100, 30, "#012345", "#CCC", "Inst", function(){
			beater.main.changeState(beater.GAME_STATE.INSTRUCTIONS, false);
		});
		
		this.mainMenuButton 	= new beater.Button(400, 700, 100, 30, "#FFF", "#CCC", "Main", function(){
			beater.main.changeState(beater.GAME_STATE.MAIN, false);
		});
		
		this.gameButton			= new beater.Button(400, 750, 100, 30, "#543210", "#CCC", "Play", function(){
			beater.main.changeState(beater.GAME_STATE.GAME, false);
			console.log("game");
			beater.audio.play();
		});
		
		this.resumeButton		= new beater.Button(400, 700, 100, 30, "#FFF", "#CCC", "Resume", function(){
			if(beater.main.previousState == beater.GAME_STATE.GAME)
				// resume audio if necessary
				beater.audio.play();
		
			beater.main.changeState(beater.main.previousState, true);
		});
		
		this.loadButton			= new beater.Button(500, 600, 100, 30, "#A34", "#CCC", "Select Music", function(){	
			beater.main.changeState(beater.GAME_STATE.LOAD, false);
		});
		
		// labels	---------------------------------
		this.mainLabel			= new beater.Label("Helvetica", "Beater: By Freddy Garcia", 50, beater.WIDTH/2 - 250, 200, "#000", "#000");
		
		this.pauseLabel			= new beater.Label("Helvetica", "Pause!", 15, beater.WIDTH/2 - 250, 50, "#F00", "#000");
		
		this.gameOverLabel		= new beater.Label("Helvetica", "Game Over!", 15, beater.WIDTH/2 - 250, 50, "#000", "#000");
		
		this.gameWinLabel 		= new beater.Label("Helvetica", "Game Win!", 15, beater.WIDTH/2 - 250, 50, "#000", "#000");
		
		this.pauseLabel			= new beater.Label("Helvetica", "Paused!", 50, beater.WIDTH/2 - 250, 200, "#000", "#000");
		
		this.loadLabel			= new beater.Label("Helvetica", "Please drag a song onto the game screen!", 50, beater.WIDTH/2 - 480, 200, "#000", "#000");
		
		this.loadStatusLabel	= new beater.Label("Helvetica", "Status: Waiting for music", 30, beater.WIDTH/2 - 200, 340, "#BF0A0A", "#000");
		
		this.scoreLabel 		= new beater.Label("Helvetica", "Score: 0", 25, 90, 40, "#000", "#000");
		
		this.multiplierLabel	= new beater.Label("Helvetica", "Multiplier: 0", 25, 90, 70, "#000", "#000");
		
		this.winLabel			= new beater.Label("Helvetica",
		"You completed the song!", 50, beater.WIDTH/2 - 450, 200, "#000", "#000");
		
		// append to screens
		
		this.mainScreen.addItem({data:this.loadButton, key:"button"});
		this.mainScreen.addItem({data:this.instructionButton, key:"button"});
		this.mainScreen.addItem({data:this.mainLabel, key:"label"});
		
		//this.instructionScreen.addItem(this.instructionButton);
		this.instructionScreen.addItem({data:this.mainMenuButton, key:"button"});
		
		this.pauseScreen.addItem({data:this.resumeButton, key:"button"});
		this.pauseScreen.addItem({data:this.pauseLabel, key:"label"});
		
		this.loadMusicScreen.addItem({data:this.loadLabel, key:"label"});
		this.loadMusicScreen.addItem({data:this.loadStatusLabel, key:"status"});
		this.loadMusicScreen.addItem({data:this.gameButton, key:"button"});
		
		this.gameScreen.addItem({data:this.scoreLabel, key:"score"});
		this.gameScreen.addItem({data:this.multiplierLabel, key:"multiplier"});
		
		this.gameWinScreen.addItem({data:this.winLabel, key:"label"});
		
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
			
		if(this.currentState == beater.GAME_STATE.LOAD)
			this.loadMusicScreen.update();
			
		if(this.currentState == beater.GAME_STATE.GAME_WIN)
			this.gameWinScreen.update();
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
	
		else if(this.currentState == beater.GAME_STATE.GAME)
		{
			this.gameScreen.draw(beater.CTX);
			beater.game.draw(beater.CTX);
		}
		
		else if(this.currentState == beater.GAME_STATE.INSTRUCTIONS)
			this.instructionScreen.draw(beater.CTX);
		
		else if(this.currentState == beater.GAME_STATE.PAUSE)
			this.pauseScreen.draw(beater.CTX);
			
		else if(this.currentState == beater.GAME_STATE.LOAD)
			this.loadMusicScreen.draw(beater.CTX);
		
		else if(this.currentState == beater.GAME_STATE.GAME_WIN)
			this.gameWinScreen.draw(beater.CTX);
		
		// default - should not get here!
		else
			console.log("invalid state for drawing!");
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
		
		else if(this.currentState == beater.GAME_STATE.INSTRUCTIONS)
			this.instructionScreen.mouseCheck();
	
		else if(this.currentState == beater.GAME_STATE.GAME)
			beater.game.clickCheck();
			
		else if(this.currentState == beater.GAME_STATE.PAUSE)
			this.pauseScreen.mouseCheck();
			
		else if(this.currentState == beater.GAME_STATE.LOAD && beater.audio.hasLoaded)
			this.loadMusicScreen.mouseCheck();
	}
};