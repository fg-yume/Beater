/*
 * utilities.js
 * 
 * @author Freddy Garcia
 *
 * General functionality that will be used in 'Beater'
 */
 
"use strict";

/*
 * Returns the distance squared of the two points
 * Note: Assumes 'a' and 'b' contain {x,y}
 *
 * @param	a	the first point
 * @param	b	the second point
 *
 * @return	distance squared between a and b
 */
var distanceSquared = function(a, b)
{
	var ds = ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));

	return ds;
};

/*
 * Returns whether or not a point is inside of a rectangle
 * Note: Assumes a contains {x,y} and b contains {x, y, width, height} 
 *
 * @param	a	the point
 * @param	b	the rectangle
 *
 * @return	if point 'a' is within 'b'
 */
var pointInRect = function(a, b)
{
	// x,y is in top-left of rectangle
	var intersects;
	
	if((b.x <= a.x && b.x + b.width >= a.x) &&
	(b.y <= a.y && b.y + b.height >= b.y))
		intersects = true;
		
	else
		intersects = false;
		
	return intersects;
}