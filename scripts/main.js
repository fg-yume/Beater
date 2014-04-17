/*
 * main.js
 * @author Freddy Garcia
 *
 * Handles main functionality for the browser and initializes 'beater'
 */

"use strict";

var beater = beater || {};		

beater.animationID = undefined;

/*
 * Modernizr being used to set entry point for the application and load necessary javascript files
 */
Modernizr.load(
	{
		// files to load
		load : [
			'scripts/utilities.js',
			'scripts/audio.js',
			'scripts/ring.js',
			'scripts/circle.js',
			'scripts/button.js',
			'scripts/label.js',
			'scripts/screen.js',
			'scripts/input.js',
			'scripts/game.js',
			'scripts/beater.js'
		],
		
		/*
		 * Set up window events after loading is complete
		 * This is the entry point for the application
		 *
		 * @return none
		 */
		complete : function()
		{
			// Event listeners --------------------------------------
			
			/*
			 * Action to take when window goes out of focus
			 *
			 * @return none
			 */
			window.addEventListener('blur', function(){
				if(beater.main.currentState != beater.GAME_STATE.LOAD)
				{
					beater.main.changeState("PAUSE", false);
					cancelAnimationFrame(beater.animationID);
					
					// needed to display pause
					beater.main.update();
					beater.main.draw();
					
					// stop music
					beater.audio.pause();
				}
			});
			
			/*
			 * Action to take when window becomes the main focus
			 *
			 * @return none
			 */
			window.addEventListener('focus', function(){
				if(beater.main.currentState != beater.GAME_STATE.LOAD)
				{
					//beater.main.changeState(beater.main.previousState, true);
					beater.main.loop();
				}
			});
			
			/* 
			 * Action to take when a key is pressed down
			 *
			 * @return none
			 */
			window.addEventListener('keydown', function(e){
				//console.log("keydown = " + e.keyCode);
				beater.input.keydown[e.keyCode] = true;
			});
			
			/*
			 * Action to take when a key is released
			 *
			 * @return none
			 */
			window.addEventListener('keyup', function(e){
				//console.log("keyup = " + e.keyCode);
				beater.input.keydown[e.keyCode] = false;
			});
			
			/*
			 * Action to take when the mouse is clicked on the canvas
			 *
			 * @return	none
			 */
			document.querySelector("#canvas").addEventListener('mousedown', function(e){
				beater.input.setMouse(true);
			});
			
			/*
			 * Action to take when the mouse goes up on the canvas
			 *
			 * @return	none
			 */
			document.querySelector("#canvas").addEventListener('mouseup',
			function(e){
				beater.input.setMouse(false);
			});
			
			/*
			 * Action to take when the mouse is moved on the canvas
			 *
			 * @return	none
			 */
			document.querySelector("#canvas").addEventListener('mousemove',
			function(e){
				beater.input.moveMouse(e);
				//console.log("mouse move");
			});
			
			document.querySelector("#canvas").addEventListener('dragover', function(e){
				e.stopPropagation();
				e.preventDefault();
				e.dataTransfer.dropEffect = "link";
			});
			
			document.querySelector("#canvas").addEventListener('drop', function(e){
				e.stopPropagation();
				e.preventDefault();
				
				// only load if on correct state
				if(beater.main.currentState == beater.GAME_STATE.LOAD)
					beater.audio.load(e);
			});
			
			// start up 'beater'
			beater.main.init();
		}
	}
);