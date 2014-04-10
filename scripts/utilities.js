/*
 * utilities.js
 * 
 * @author Freddy Garcia
 *
 * General functionality that will be used in 'Beater'
 */
 
"use strict";

/*
 * Returns the distance squared of the two parameters
 * Note: Assumes a and b have both 'x' and 'y' properties
 *
 * @param	a	the first parameter used for distance squared
 * @param	b	the second parameter used for distance squared
 *
 * @return	distance squared between a and b
 */
var distanceSquared = function(a, b)
{
	var ds = ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));

	return ds;
};