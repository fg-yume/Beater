/*
 * audio.js
 *
 * @author Freddy Garcia
 *
 * Handles audio loading for 'Beater'
 */
 
var beater = beater || {};

beater.audio = {
	audioCtx : undefined,
	analyserNode : undefined,
	sourceNode : undefined,
	hasLoaded : false,
	percentLoaded : 0,
	percentDecoded : 0,
	
	init : function()
	{
		console.log("audio init");
		this.audioCtx = new webkitAudioContext();
	},
	
	/*
	 * Loads the audio from the file that was dropped onto the screen.
	 *
	 * @param	{Event} event	the event (file) that triggers this function
	 */
	load : function(event)
	{
		var file = event.dataTransfer.files[0]; // file
		
		console.log(file);
		
		var reader = new FileReader();
		
		// events for reader
		reader.addEventListener('progress', this.onProgress, false);
		reader.addEventListener('loadend', function(event){
			if(event.target.readyState == FileReader.DONE)
			{
				// DONE == 2
				beater.audio.onAudioLoad(event.target.result);
			}
		}, false);
		
		reader.readAsArrayBuffer(file);
	},
	
	onProgress : function(event)
	{
		console.log("loaded:" + event.loaded / event.total);
	},
	
	onAudioLoad : function(arrayBuffer)
	{
		console.log("loaded!");
		var a = beater.audio;
	
		// check for sound already playing
		if(a.sourceNode)
			a.sourceNode.stop(0);
			
		// analyser node
		a.analyserNode = a.audioCtx.createAnalyser();
		
		// decode audio
		a.audioCtx.decodeAudioData(arrayBuffer, function(buffer){
			// source node
			a.sourceNode = a.audioCtx.createBufferSource();
			a.sourceNode.buffer = buffer;
			a.sourceNode.connect(a.analyserNode);
			
			a.analyserNode.connect(a.audioCtx.destination);
			
			console.log("pero actually loaded tho");
			//a.sourceNode.start(0);
			a.hasLoaded = true;
		});
	
		audioLoaded = true;
	},
	
	/*
	 * Plays the stored source node from the beginning
	 *
	 * @return	none
	 */
	play : function()
	{
		this.sourceNode.start(0);
	}
};