/*
 * audio.js
 *
 * @author Freddy Garcia
 *
 * Handles audio loading for 'Beater'
 */
 
var beater = beater || {};

beater.audio = {
	audioCtx 		: undefined,
	analyserNode 	: undefined,
	sourceNode 		: undefined,
	hasLoaded 		: false,
	percentLoaded 	: 0,
	startOffset		: 0,
	startTime		: 0,
	hasCompleted	: false,
	audioBuffer		: null,
	
	reset : function()
	{
		this.startOffset = 0;
		this.startTime = 0;
		this.hasCompleted = false;
		this.audioBuffer = null;
		this.hasLoaded = false;
		this.audioBuffer = null;
	},
	
	init : function()
	{
		// set up the audio context that is supported in the browser
		window.AudioContext = window.AudioContext || 
						window.webkitAudioContext ||
						window.mozAudioContext	  ||
						window.oAudioContext	  ||
						window.msAudioContext;
		
		// create audio context if available
		if(window.AudioContext)
		{
			console.log("audio init");
			this.audioCtx = new AudioContext();
		}
		
		// no audio context support
		else
			console.log("Audio context not supported!");
			
		// node creation
		this.analyserNode = this.audioCtx.createAnalyser();
	},
	
	/*
	 * Loads the audio from the file that was dropped onto the screen.
	 *
	 * @param	{Event} event	the event (file) that triggers this function
	 */
	load : function(event)
	{
		var file = event.dataTransfer.files[0]; // file
		
		//console.log(file);
		
		var reader = new FileReader();
		
		// events for reader
		reader.addEventListener('progress', this.onProgress, false);
		reader.addEventListener('loadend', function(event){
			if(event.target.readyState == FileReader.DONE) // DONE == 2
				beater.audio.onAudioLoad(event.target.result);
			else
				console.log("FILE IS NOT READY!");
		}, false);
		
		// add progress label
		beater.main.loadMusicScreen.addItem(
			{
				data: new beater.Label("Helvetica", "Loading audio: 0%", 30, beater.WIDTH/2 - 210, 375, "#000", "#000"),
				key: "percent"
			}
		);
		
		// modify status label
		beater.main.loadMusicScreen.modify("status", {text: "Status: loading song", color: {fill: "#BF0A0A", stroke: "#000"}});
		
		reader.readAsArrayBuffer(file);
	},
	
	/*
	 * Updates the progress of the download for the file that was dropped on the screen
	 *
	 * @param	{FileReader} event	the event that will trigger this function
	 *
	 * @return	none
	 */
	onProgress : function(event)
	{	
		beater.audio.percentLoaded = Math.round(event.loaded / event.total * 100).toFixed(2);
		//console.log(beater.audio.percentLoaded);
		
		// update screen labels
		//beater.main.loadMusicScreen.modify(
		beater.main.loadMusicScreen.modify("percent", {text: "loading audio: " + beater.audio.percentLoaded + "%"});
	},
	
	/*
	 * The function to call when the audio has finished loading
	 * 
	 * @param	{ArrayBuffer} arrayBuffer the array containing the audio data
	 *
	 * @return	none 
	 */
	onAudioLoad : function(arrayBuffer)
	{
		//console.log("loaded!");
		
		// modify status label
		beater.main.loadMusicScreen.modify("status", {text: "Status: Decoding audio!"});
		
		var a = beater.audio;
	
		// check for sound already playing
		if(a.sourceNode)
			a.sourceNode.stop(0);
		
		// decode audio
		a.audioCtx.decodeAudioData(arrayBuffer, function(buffer){
			// store buffer
			a.audioBuffer = buffer;
			
			// modify status label
			beater.main.loadMusicScreen.modify("status", {text: "Status: Ready! click play to begin!", color: {fill: "#1C6E0C", stroke: "#000"}});

			a.hasLoaded = true;
		});
	},
	
	/*
	 * Plays the stored source node from the beginning
	 *
	 * @return	none
	 */
	play : function()
	{
		// grab current time
		this.startTime = this.audioCtx.currentTime;
		
		// recreate source node (already optimized for this)
		this.sourceNode = this.audioCtx.createBufferSource();
		this.sourceNode.buffer = this.audioBuffer;
		this.sourceNode.loop = false;
		
		// connect to nodes
		this.sourceNode.connect(this.analyserNode);
		this.sourceNode.connect(this.audioCtx.destination);
	
		// start playback from where it was paused
		this.sourceNode.start(0, this.startOffset % this.sourceNode.buffer.duration)
		
		// timer that will fire at song end
		var timer = setTimeout(function(){
			console.log("audio completed!");
			beater.audio.hasCompleted = true;
		}, this.sourceNode.buffer.duration * 1000); // time for audio is in seconds, not milliseconds
	},
	
	pause : function()
	{
		//console.log("stop!");
		this.sourceNode.stop();
		
		// measure time passed
		this.startOffset += this.audioCtx.currentTime - this.startTime;
	}
};