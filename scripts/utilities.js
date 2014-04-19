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
 * Note: Assumes 'a' contains {x,y} and 'b' contains {x, y, width, height} 
 *		 Assumes x,y positions for 'b' are top-left corner
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
	(b.y <= a.y && b.y + b.height >= a.y))
		intersects = true;
		
	else
		intersects = false;
		
	return intersects;
};

/*
 * Returns the average of the values in an array (excluding 0s)
 *
 * @param	{Array} array	the array to find the average from
 *
 * @return	{Number} 		the average of the values in the array
 */
var noZeroAverage = function(array)
{
	var sum = 0;		// sum of the values in the array
	var numItems = 0; 	// num of items in the array (excluding 0s)
	
	for(var i=0; i < array.length; i++)
	{
		sum += array[i];
	
		if(array[i] > 0)
			numItems ++;
	}
	
	// average
	return sum / numItems;
};

/*
 * Returns the maximum value of the given array
 *
 * @param	{Array} array	the array to find max of
 *
 * @return	{Number}		the maximum value in the array
 *
 * @source	http://ejohn.org/blog/fast-javascript-maxmin/
 */
Array.max = function(array)
{
	return Math.max.apply(Math, array);
};

/*
 * Returns the minimum value of the given array
 *
 * @param	{Array} array	the array to find min of
 *
 * @return	{Number}		the minimum value in the array
 *
 * @source	http://ejohn.org/blog/fast-javascript-maxmin/
 */
Array.min = function(array)
{
	return Math.min.apply(Math, array);
};