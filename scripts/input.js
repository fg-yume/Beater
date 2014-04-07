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
	 * Handles closure for circle creation
	 *
	 * @return 
	 */

	/*
	 * Handles keyboard presses during the game
	 *
	 * @return	none
	 */
	pollKeyboard : function()
	{
		//console.log("poll");

		if(beater.main.keydown[beater.KEYBOARD.KEY_Z] || beater.main.keydown[beater.KEYBOARD.KEY_X])
		{
			// spawn circle
			beater.main.hitCircles.push(new beater.Circle(beater.main.mouseX, beater.main.mouseY, 10, '#aaa', '#999', 100));
			
			// test
			beater.main.hitCircles.push(new beater.Circle(beater.main.mouseX + 50, beater.main.mouseY-10, 10, '#aaa', '#999', 100));
			
			//console.log("spawned circle");
		}
		
		// pausing
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