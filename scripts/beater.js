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

beater.MAX_FREQUENCY	= 255;	// maximum frequency value for audio

beater.main = {
	// Game variables	------------------------------------
	previousState 	: undefined,	// previous game state
	currentState 	: undefined,	// current game state
	testButton		: new beater.Button(beater.WIDTH/2, beater.HEIGHT/2, 50, 30, "#333", "#666", "Start!", function(){
		//this.changeState.bind(this);
		this.changeState(beater.GAME_STATE.GAME, false);
	}),
	clickTimer		: 0,
	previousTime	: undefined,
	currentTime		: undefined,

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
		this.mainScreen 		= new beater.Screen("#A61BFF", "#530E7F");
		this.instructionScreen 	= new beater.Screen("#A61BFF", "#530E7F");
		this.gameScreen			= new beater.Screen("#A61BFF", "#530E7F");
		this.pauseScreen		= new beater.Screen("#A61BFF", "#530E7F");
		this.gameOverScreen		= new beater.Screen("#A61BFF", "#530E7F");
		this.gameWinScreen		= new beater.Screen("#A61BFF", "#530E7F");
		this.loadMusicScreen	= new beater.Screen("#A61BFF", "#530E7F");
		this.pauseScreen		= new beater.Screen("#62347F", "#530E7F");
		
		this.changeState.bind(this);
		
		// buttons	---------------------------------
		this.instructionButton	= new beater.Button(beater.WIDTH/2, 700, 100, 30, "#012345", "#CCC", "Inst", function(){
			beater.main.changeState(beater.GAME_STATE.INSTRUCTIONS, false);
		});
		
		this.mainMenuButton 	= new beater.Button(beater.WIDTH/2, 700, 100, 30, "#FFF", "#CCC", "Main", function(){
			beater.main.changeState(beater.GAME_STATE.MAIN, false);
		});
		
		this.gameButton			= new beater.Button(beater.WIDTH/2, 550, 100, 30, "#543210", "#CCC", "Play", function(){
			beater.main.changeState(beater.GAME_STATE.GAME, false);
			console.log("game");
			beater.audio.play();
		});
		
		this.resumeButton		= new beater.Button(beater.WIDTH/2, 700, 100, 30, "#FFF", "#CCC", "Resume", function(){
			if(beater.main.previousState == beater.GAME_STATE.GAME)
				// resume audio if necessary
				beater.audio.play();
		
			beater.main.changeState(beater.main.previousState, true);
		});
		
		this.loadButton			= new beater.Button(beater.WIDTH/2, 600, 100, 30, "#A34", "#CCC", "Select Music", function(){	
			beater.main.changeState(beater.GAME_STATE.LOAD, false);
		});
		
		this.restartButton		= new beater.Button(beater.WIDTH/2, 600, 100, 30, "#A34", "#CCC", "Restart!", function(){
			beater.main.changeState(beater.GAME_STATE.MAIN,false);
			beater.main.reset();
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
		
		this.highScoreLabel		= new beater.Label("Helvetica", "High Score: 0", 30, beater.WIDTH/2 - 300, 260, "#000", "#000");
		
		this.maxChainLabel		= new beater.Label("Helvetica", "Max chain: 0", 30, beater.WIDTH/2 - 300, 300, "#000", "#000");
		
		this.instructionLabel	= new beater.Label("Helvetica", "Instructions!", 50, beater.WIDTH/2 - 400, 200, "#000", "#000");
		
		this.instructionLabel2 	= new beater.Label("Helvetica", "Click the circles when the outer ring is close to the circle to gain points!", 25, beater.WIDTH/2 - 450, 300, "#000", "#000");
		
		// append to screens
		
		this.mainScreen.addItem({data:this.loadButton, key:"button"});
		this.mainScreen.addItem({data:this.instructionButton, key:"button"});
		this.mainScreen.addItem({data:this.mainLabel, key:"label"});
		
		//this.instructionScreen.addItem(this.instructionButton);
		this.instructionScreen.addItem({data:this.mainMenuButton, key:"button"});
		this.instructionScreen.addItem({data:this.instructionLabel, key:"label"});
		this.instructionScreen.addItem({data:this.instructionLabel2, key: "label"});
		
		this.pauseScreen.addItem({data:this.resumeButton, key:"button"});
		this.pauseScreen.addItem({data:this.pauseLabel, key:"label"});
		
		this.loadMusicScreen.addItem({data:this.loadLabel, key:"label"});
		this.loadMusicScreen.addItem({data:this.loadStatusLabel, key:"status"});
		this.loadMusicScreen.addItem({data:this.gameButton, key:"button"});
		//this.loadMusicScreen.addItem({data:this.mainMenuButton, key:"button"});
		
		this.gameScreen.addItem({data:this.scoreLabel, key:"score"});
		this.gameScreen.addItem({data:this.multiplierLabel, key:"multiplier"});
		
		this.gameWinScreen.addItem({data:this.winLabel, key:"label"});
		this.gameWinScreen.addItem({data:this.restartButton, key:"restart"});
		this.gameWinScreen.addItem({data:this.highScoreLabel, key:"highscore"});
		this.gameWinScreen.addItem({data:this.maxChainLabel, key:"maxmult"});
		
		// begin time check
		this.previousTime = new Date().getTime();
		
		// begin loop
		this.loop();
	},

	/*
	 * Updates the game based on time
	 *
	 * @param	{Number} dt	the delta time since the last update
	 *
	 * @return	none
	 */
	update : function(dt)
	{
		// update click timer
		this.clickTimer--;
	
		// input
		beater.input.pollKeyboard();
		
		// check for clicks
		if(beater.input.mouseDown)
			this.checkCollisions();
		
		// updating based on current state
		if(this.currentState == beater.GAME_STATE.MAIN)
			this.mainScreen.update();
			
		if(this.currentState == beater.GAME_STATE.INSTRUCTIONS)
			this.instructionScreen.update();

		if(this.currentState == beater.GAME_STATE.GAME)
		{
			this.gameScreen.update();
			beater.game.update(dt);
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
		// check current time
		this.currentTime = new Date().getTime();
		
		// delta time
		var dt = this.currentTime - this.previousTime;
		this.previousTime = this.currentTime;
	
		this.update(dt);
		this.draw();
		
		beater.animationID = requestAnimationFrame(this.loop.bind(this));
	},
	
	/*
	 * Resets all aspects of beater to their defaults
	 *
	 * @return	none
	 */
	reset : function()
	{
		// reset labels in load screen
		this.loadMusicScreen.modify("status", {text:"Status: Waiting for music", color: {fill:"#BF0A0A", stroke:"#000"}});
		this.loadMusicScreen.remove("percent");
	
		// reset game
		beater.game.reset();
		beater.audio.reset();
	},
	
	/*
	 * Check for collisions between the the items on the screen
	 *
	 * @return	none
	 */
	checkCollisions : function()
	{		
		if(this.currentState == beater.GAME_STATE.MAIN && this.clickTimer <= 0)
		{
			this.mainScreen.mouseCheck();
			this.clickTimer = 10;
		}
		
		else if(this.currentState == beater.GAME_STATE.INSTRUCTIONS && this.clickTimer <= 0)
		{
			this.instructionScreen.mouseCheck();
			this.clickTimer = 10;
		}
	
		else if(this.currentState == beater.GAME_STATE.GAME)
			beater.game.clickCheck();
			
		else if(this.currentState == beater.GAME_STATE.PAUSE && this.clickTimer <= 0)
		{
			this.pauseScreen.mouseCheck();
			this.clickTimer = 10;
		}
			
		else if(this.currentState == beater.GAME_STATE.LOAD && beater.audio.hasLoaded && this.clickTimer <= 0)
		{
			this.loadMusicScreen.mouseCheck();
			this.clickTimer = 10;
		}
			
		else if(this.currentState == beater.GAME_STATE.GAME_WIN)
		{
			this.gameWinScreen.mouseCheck();
			this.clickTimer = 10;
		}
			
		//this.clickTimer = 10;
	}
};