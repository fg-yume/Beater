/*
 * Input.js
 * @author Freddy Garcia
 *
 * Handles user input in 'beater'
 */
 
"use strict";
 
var beater = beater || {};

// Game constants	------------------------------------

beater.input = 
{
	// Game variables	------------------------------------
	keydown : [], 			// keys that are currently down
	mouseX	: undefined,	// x-coord of mouse
	mouseY	: undefined,	// y-coord of mouse
	
	/*
	 * Handles keyboard presses during the various states in the game
	 *
	 * @return	none
	 */
	pollKeyboard : function()
	{
		//console.log("poll");
		
		// 'main' state
		if(beater.main.currentState == beater.GAME_STATE.MAIN)
		{
			if(this.keydown[beater.KEYBOARD.KEY_Z])
				beater.main.changeState(beater.GAME_STATE.GAME);
		}

		// 'game' state
		if(beater.main.currentState == beater.GAME_STATE.GAME)
		{
			if(this.keydown[beater.KEYBOARD.KEY_Z] || this.keydown[beater.KEYBOARD.KEY_X])
			{
				// spawn circle
				beater.main.hitCircles.push(new beater.Circle(this.mouseX, this.mouseY, 10, '#aaa', '#999', 100));
				
				// test
				beater.main.hitCircles.push(new beater.Circle(this.mouseX + 50, this.mouseY-10, 10, '#aaa', '#999', 100));
				
				//console.log("spawned circle");
			}
		}
		
		// not in the 'pause' state
		if(beater.main.currentState != beater.GAME_STATE.PAUSE)
			if(this.keydown[beater.KEYBOARD.KEY_P])
				beater.main.changeState(beater.GAME_STATE.PAUSE);
	},

	/*
	 * Updates the position of the mouse
	 *
	 * @param	event	the event object received
	 *
	 * @return	none
	 */
	updateMouse : function(event)
	{
		// proper offsets
		this.mouseX = event.pageX - beater.OFFSET_LEFT;
		this.mouseY = event.pageY - beater.OFFSET_TOP;
		
		//console.log(beater.main.mouseX + ", " + beater.main.mouseY);
	}
};