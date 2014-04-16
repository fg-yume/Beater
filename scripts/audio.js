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
				data: new beater.Label("Helvetica", "Loading audio: 0%", 30, beater.WIDTH/2, 375, "#FFF", "#000"),
				key: "percent"
			}
		);
		
		// modify status label
		beater.main.loadMusicScreen.modify("status", {text: "Status: loading song", color: {fill: "#F00", stroke: "#000"}});
		
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
		console.log(beater.audio.percentLoaded);
		
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
			
		// analyser node
		a.analyserNode = a.audioCtx.createAnalyser();
		
		// decode audio
		a.audioCtx.decodeAudioData(arrayBuffer, function(buffer){
			// source node
			a.sourceNode = a.audioCtx.createBufferSource();
			a.sourceNode.buffer = buffer;
			a.sourceNode.connect(a.analyserNode);
			
			a.analyserNode.connect(a.audioCtx.destination);
			
			//console.log("pero actually loaded tho");
			
			// modify status label
			beater.main.loadMusicScreen.modify("status", {text: "Status: Ready! click play to begin!", color: {fill: "#0F0", stroke: "#000"}});
			
			//a.sourceNode.start(0);
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
		this.sourceNode.start(0);
	}
};