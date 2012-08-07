/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var keypadSelectedColor = "rgba(0, 200, 200, 1)";

function drawKeypad(x, y, h, w) {

	var divNum;
	var curX = x;
	var curY = y;
	var spacer = 5;
	var keyW = Math.ceil((w-2*spacer)/3);
	
	for (i=1; i<10; i++)
	{
		divNum = "#" + i.toString();
		
		if (i.toString() !== keypadSelectedNum)
			$(divNum).css({"visibility":"visible", "background-color": "white", "box-shadow": "0px 0px 30px rgba(0, 111, 220, 0.8)", "left": curX + "px", "top":curY + "px", "width":keyW + "px", "height":keyW + "px", "font": getButtonFont(keyW) }).css("line-height", keyW + "px");
		else
			$(divNum).css({"visibility":"visible", "background-color": keypadSelectedColor, "box-shadow": "0px 0px 30px rgba(0, 111, 220, 0.8)", "left": curX + "px", "top":curY + "px", "width":keyW + "px", "height":keyW + "px", "font": getButtonFont(keyW) }).css("line-height", keyW + "px");
		
		if (i !== 3 && i !== 6)
			curX += keyW + spacer;
		else
		{
			curX = x;
			curY += keyW + spacer;
		}	
	}	
	return;
}

function touchKeypad() {

}

function keypad(context, x, y, h, w) {

	this.context = context;
	this.x = x;
	this.y = y;
	this.h = h;	
	this.w = w;
	this.draw = function(){drawKeypad(this.x, this.y, this.h, this.w)}
	this.touch = touchKeypad;
	this.resize = function(newX,newY,newH,newW){
		this.x = newX;
		this.y = newY;
		this.h = newH;
		this.w = newW;
	} 
}
