/*
 * Input.js
 * @author Freddy Garcia
 *
 * Handles user input in 'beater'
 */
 
"use strict";
 
var beater = beater || {};

// Mouse	---------------------------------------------------
beater.Mouse = (function(){
	var Mouse = function(x, y, isDown)
	{
		this.pos = {
			x : x,
			y : y
		};
		
		if(undefined !== isDown)
			this.isDown = isDown;
			
		else
			this.isDown = false;
	};
	
	return Mouse;
})();

// Input	-------------------------------------------------

beater.input = 
{
	// Game variables	------------------------------------
	keydown 			: [], 			// keys that are currently down
	currentMouseState	: new beater.Mouse(0, 0, false), // current mouse state
	previousMouseState	: new beater.Mouse(0, 0, false), // previous mouse state
	mouseDown			: false,
	mouseUp				: false,
	
	/*
	 * Sets the current state of the mouse to the parameter
	 *
	 * @param	newMS	the new mouse state to change to
	 *
	 * @return	none
	 */
	setMouse : function(newMS)
	{
		
		this.currentMouseState.isDown	= newMS;
		console.log("mouse change to " + this.currentMouseState.isDown);
		this.udMouse();
	},
	
	/*
	 * Handles keyboard presses during the various states in the game
	 *
	 * @return	none
	 */
	pollKeyboard : function()
	{
		// not in the 'pause' state
		if(beater.main.currentState != beater.GAME_STATE.PAUSE)
			if(this.keydown[beater.KEYBOARD.KEY_P])
				beater.main.changeState(beater.GAME_STATE.PAUSE);
		
		// 'game' state
		if(beater.main.currentState == beater.GAME_STATE.GAME)
		{
			if(this.keydown[beater.KEYBOARD.KEY_Z] || this.keydown[beater.KEYBOARD.KEY_X])
			{
				// spawn circle
				beater.game.hitCircles.push(new beater.Circle(this.mouseX, this.mouseY, 10, '#aaa', '#999', 100));
				
				// test
				beater.game.hitCircles.push(new beater.Circle(this.mouseX + 50, this.mouseY-10, 10, '#aaa', '#999', 100));
			}
		}
		
		// 'main' state
		if(beater.main.currentState == beater.GAME_STATE.MAIN)
		{
			if(this.keydown[beater.KEYBOARD.KEY_Z])
				beater.main.changeState(beater.GAME_STATE.GAME);
		}
	},
	
	moveMouse : function(event)
	{
		// update position of the mouse
		this.currentMouseState.pos.x = event.pageX - beater.OFFSET_LEFT;
		this.currentMouseState.pos.y = event.pageY - beater.OFFSET_TOP;
	},
	
	udMouse : function()
	{
		// presses
		if(!this.previousMouseState.isDown && this.currentMouseState.isDown)
			this.mouseDown = true;
		
		else
			this.mouseDown = false;
			
		// releases
		if(this.previousMouseState.isDown && !this.currentMouseState.isDown)
			this.mouseUp = true;
			
		else
			this.mouseUp = false;
	},

	/*
	 * Updates the mouse position and state
	 *
	 * @param	event	the event object received (mouse)
	 *
	 * @return	none
	 */
	updateMouse : function(event)
	{	
		console.log("mouseUp: " + this.mouseUp);
		console.log("mouseDown: " + this.mouseDown);
		//console.log("pos: " + this.currentMouseState.pos.x + ", " + this.currentMouseState.pos.y);
		
		this.previousMouseState = this.currentMouseState;
	}
};