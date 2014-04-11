/*
 * label.js
 *
 * @author Freddy Garcia
 *
 * A label on the screen for 'beater'
 */
 
"use strict";

var beater = beater || {};

beater.Label = (function()
{
	// private  ----------------------------------------
	var TEXT_BASELINE = "middle";
	var TEXT_ALIGN	= "center";

	// public	----------------------------------------
	
	/*
	 * Creates a label with the given parameters
	 *
	 * @param	fontFamily		the font-family for the label
	 * @param	text			the text to be displayed by the string
	 * @param	size			the size of the text
	 * @param	x				the x-coord of the text
	 * @param	y				the y-coord of the text
	 * @param	fill			the fill color of the text
	 * @param	stroke			the stroke color of the text
	 * @param	hasShadow		the shadow property of the text
	 * @param	shadowColor		the shadow color of the text (optional)
	 * @param	shadowOffsetX	the shadow offset of the text (optional)
	 * @param	shadowOffsetY	the shadow offset of the text (optional)
	 * @param	shadowBlur		the shadow's blur value (optional)
	 *
	 * @return	none
	 */
	var Label = function(fontFamily, text, size, x, y, fill, stroke, hasShadow, shadowColor, shadowOffsetX, shadowOffsetY, shadowBlur)
	{
		this.font	= fontFamily;
		this.text	= text;
		this.size	= size;
		this.x		= x;
		this.y		= y;
		this.color 	= {
			fill	: fill,
			stroke	: stroke
		};
		this.shadow	= hasShadow;
		
		// optional shadow variables
		if(this.shadow)
		{
			this.shadowColor 	= shadowColor;
			this.shadowOffset 	= {
				x	: shadowOffsetX,
				y	: shadowOffsetY
			};
			this.shadowBlur		= shadowBlur;
		}
	};
	
	/*
	 * Changes the text of the label to the given parameter
	 *
	 * @param	newText	the new text for the label
	 *
	 * @return	none
	 */
	Label.prototype.Text = function(newText)
	{
		this.text = newText;
	};
	
	/*
	 * Updates the label
	 *
	 * @return none
	 */
	Label.prototype.update = function()
	{
		// empty for labels
	};
	
	/*
	 * Draws the label on the given drawing context
	 *
	 * @param	ctx		the drawing context to draw to
	 *
	 * @return	none
	 */
	Label.prototype.draw = function(ctx)
	{
		// restore point
		ctx.save();
		
			// settings
			ctx.font			= this.size + "px " + this.font;
			ctx.textBaseline 	= TEXT_BASELINE;
			ctx.textAlign 		= TEXT_ALIGN;
			ctx.fillStyle 		= this.color.fill;
			ctx.strokeStyle		= this.color.stroke;
			
			// shadow settings
			if(this.shadow)
			{
				ctx.shadowColor 	= this.shadowColor;
				ctx.shadowOffsetX	= this.shadowOffsetX;
				ctx.shadowOffsetY	= this.shadowOffsetY;
				ctx.shadowBlur		= this.shadowBlur;
			}
		
			// draw
			ctx.fillText(this.text, this.x, this.y);
			
		// revert changes
		ctx.restore();
	};
	
	// public API
	return Label;
})();