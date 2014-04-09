/*
 * main.js
 * @author Freddy Garcia
 *
 * Handles main functionality for the browser and initializes 'beater'
 */

"use strict";

var beater = beater || {};		

/*
 * Modernizr being used to set entry point for the application and load necessary javascript files
 */
Modernizr.load(
	{
		// files to load
		load : [
			'scripts/ring.js',
			'scripts/circle.js',
			'scripts/input.js',
			'scripts/button.js',
			'scripts/screen.js',
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
				beater.main.changeState("PAUSE", false);
			});
			
			/*
			 * Action to take when window becomes the main focus
			 *
			 * @return none
			 */
			window.addEventListener('focus', function(){
				beater.main.changeState(beater.main.previousState, true);
			});
			
			/* 
			 * Action to take when a key is pressed down
			 *
			 * @return none
			 */
			window.addEventListener('keydown', function(e){
				//console.log("keydown = " + e.keyCode);
				beater.main.keydown[e.keyCode] = true;
			});
			
			/*
			 * Action to take when a key is released
			 *
			 * @return none
			 */
			window.addEventListener('keyup', function(e){
				//console.log("keyup = " + e.keyCode);
				beater.main.keydown[e.keyCode] = false;
			});
			
			/*
			 * Action to take when the mouse is clicked on the canvas
			 *
			 * @return	none
			 */
			document.querySelector("#canvas").addEventListener('mousedown', function(e){
				//console.log("canvas clicked :#");
				beater.main.checkCollisions();
			});
			
			
			/*
			 * Action to take when the mouse is moved on the canvas
			 *
			 * @return 	none
			 */
			document.querySelector("#canvas").addEventListener('mousemove',
			function(e){
				//console.log("mouse move on canvas");
				beater.input.updateMouse(e);
			});
			
			// start up 'beater'
			beater.main.init();
		}
	}
);