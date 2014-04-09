/*
 * Input.js
 * @author Freddy Garcia
 *
 * Handles user input in 'beater'
 */
 
"use strict";
 
var beater = beater || {};

beater.input = 
{
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
			if(beater.main.keydown[beater.KEYBOARD.KEY_Z])
				beater.main.changeState(beater.GAME_STATE.GAME);
		}

		// 'game' state
		if(beater.main.currentState == beater.GAME_STATE.GAME)
		{
			if(beater.main.keydown[beater.KEYBOARD.KEY_Z] || beater.main.keydown[beater.KEYBOARD.KEY_X])
			{
				// spawn circle
				beater.main.hitCircles.push(new beater.Circle(beater.main.mouseX, beater.main.mouseY, 10, '#aaa', '#999', 100));
				
				// test
				beater.main.hitCircles.push(new beater.Circle(beater.main.mouseX + 50, beater.main.mouseY-10, 10, '#aaa', '#999', 100));
				
				//console.log("spawned circle");
			}
		}
		
		// not in the 'pause' state
		if(beater.main.currentState != beater.GAME_STATE.PAUSE)
			if(beater.main.keydown[beater.KEYBOARD.KEY_P])
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
		beater.main.mouseX = event.pageX - beater.OFFSET_LEFT;
		beater.main.mouseY = event.pageY - beater.OFFSET_TOP;
		
		//console.log(beater.main.mouseX + ", " + beater.main.mouseY);
	}
};