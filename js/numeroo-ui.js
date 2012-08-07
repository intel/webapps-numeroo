/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var option_showpossible = 0;
var option_flaginvalid = 0;
var mainMenuCanvas;
var mainMenuContext;
var startGameCanvas;
var startGameContext;
var boardCanvas;
var boardContext;
var topCanvas;
var topContext;
var bottomCanvas;
var bottomContext;
var highlightContext;
var boardWidth;
var screenWidth;
var screenHeight;
var deviceWidth;
var deviceHeight;
var cellSelected = -1;
var pickerMode = 0;
var game;
var Sounds = {};
var helpDialog;
var winDialog;
var gamecomplete = false;
var currentPage = "mainMenu";
var playMenuVisible = false;
var blockDialogRedraw = false;
var textSize;
var buttonTextSize = 20;
var inGameButtonHeight;
var miniSize;
var shadowOffset = 15;

var images = {};

/* Fonts */
var buttonFont = "bold 40px Arial";
var numberFont = "sans-serif";

var numerooRightEdge;
var mainMenuButtonLeftEdge;
var mainMenuButtonRightEdge
var mainMenuButtonHeight;
var mainMenuButtonWidth;
var mainMenuButton1Y;
var mainMenuButton2Y;
var mainMenuButton3Y;

var playMenuLeftEdge; 
var playMenuTop;
var playMenuHeight;
var playMenuWidth;
var timerBottom;
var xNumberPick;
var yNumberPick;
var npWidth;

var boardOffset = 20;
var cancelTimer;
var timer = 0;
var timerBegin;
var timerPause;
var timerResume;
var pausedSeconds = 0;
var logoWidth;
var logoLeft;
var logoHeight;
var logoBottom;
var gridMenuBarLeft;
var gridMenuBarWidth;

/*Themeable items */
var currentTheme = "Manila";
var fixedNumberColor = "green";
var gameMenuBarColor = "#e6e8e7";
var logoImage = new Image();
var squareSelector = new Image();
var highlightColor = "rgba(253, 243, 216, 0.5)";
var numPickBoxColor = "rgba(0, 0, 0, 1)";
var numPickTextColor = "rgba(255, 255, 255, 1)";
var numNoteBoxColor = "rgba(100, 0, 100, 1)"; 
var numNoteBoxSelectedColor = "rgba(200, 0, 200, 1)";
var numPickOutlineColor = "rgba(0, 255, 255, 1)";
var boardBGColor1 = "rgba(200, 200, 200, 1)";
var boardBGColor2 = "rgba(255, 255, 255, 1)";
var gridColor = "rgba(0, 0, 0, 1)";
var smallGridColor = "rgba(0, 0, 0, 1)"; 
var standardTextColor = "black";
var glossyButton = "5px 5px 10px rgba(0, 0, 0, 0.7), 0px 0px 3px rgba(0, 0, 0, .1), inset 0px 0px 26px rgba(245,245,245,0.5)";

var standardButtonColor = "rgba(220,220,220,1)";
var standardButtonGradiant ="-webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0.8)), to(rgba(255, 255, 255, 0)), color-stop(49%, rgba(255, 255, 255, 0.4)), color-stop(50%, rgba(255, 255, 255, 0)), color-stop(60%, rgba(255, 255, 255, 0.0)), color-stop(70%, rgba(255, 255, 255, 0.0)), color-stop(80%, rgba(255, 255, 255, 0.0)), color-stop(90%, rgba(255, 255, 255, 0.2)), color-stop(99%, rgba(255, 255, 255, .3))  )";
var buttonSelectedColor = "rgba(236, 0, 140, 1)";
var buttonGrayedColor = "rgba(100, 100, 100, 1)";
var easyDiff = "Easy";
var normalDiff = "Normal";
var hardDiff = "Hard";
var difficulty = easyDiff;
var aboutText = "Help";
var noteMode = false;
var gameFinished = false;

function errorOccured(errorString) {

}

function getFontSize(stringToSize, areaH, areaW, usePercent, context, theme)
{
    if (theme == undefined)
        theme = currentTheme;

    var fontSize = "";
    var textH = areaH * usePercent;
    fontSize = "bold " + (textH|0) + "px " + theme;

    context.save();
    context.fillstyle = "black";
    context.font = fontSize;

    if((context.measureText(stringToSize).width) > areaW)
    {
        var ratio = areaW / (context.measureText(stringToSize).width + 30);
        textH = textH * ratio;    // Shrink it to fit
        fontSize = "bold " + textH + "px " + theme;
    }

    context.restore();
    return fontSize;
}

function getButtonFont(buttonHeight)
{
    buttonTextSize = (buttonHeight*.5)|0;
    var fontString = "bold " + buttonTextSize.toString() + "px " + currentTheme;        
    
    return fontString;
}

function getScreenDimensions() {
    var w;
    var h;
    if($(window).width() > $(window).height())
    {
        w = $(window).width();
        h = $(window).height();
    }
    else
    {
        h = $(window).width();
        w = $(window).height();
    }

    screenWidth = 800;
    screenHeight = 480;

    if((w >= 1024)&&(h >= 600))
    {
        screenWidth = 1024;
        screenHeight = 600;
    }

    if((w >= 1230)&&(h >= 720))
    {
        screenWidth = 1230;
        screenHeight = 720;
    }

    if((w >= 1280)&&(h >= 720))
    {
        screenWidth = 1280;
        screenHeight = 720;
    }
}

function drawMainMenu(){

    getScreenDimensions();
    mainMenuContext.canvas.width = screenWidth;
    mainMenuContext.canvas.height = screenHeight;

    jQuery("#mainMenuCanvas").height(screenHeight); 
    jQuery("#mainMenuCanvas").width(screenWidth); 

    mainMenuContext.save();

    mainMenuContext.clearRect(0, 0, mainMenuContext.canvas.width, mainMenuContext.canvas.height);    
    mainMenuContext.drawImage(images.mainMenuBG, 0, 0, mainMenuContext.canvas.width, mainMenuContext.canvas.height);

    numerooRightEdge =     2 * (screenWidth / 3.22);
    mainMenuButtonLeftEdge = numerooRightEdge - (screenWidth / 5);    
    mainMenuButtonHeight = screenHeight / 12;

    var mainMenuItemSpacer = ((screenHeight - (4 * (mainMenuButtonHeight + shadowOffset))) / 10) | 2; 

    mainMenuButtonWidth = numerooRightEdge - mainMenuButtonLeftEdge;
    mainMenuButtonRightEdge = mainMenuButtonLeftEdge + mainMenuButtonWidth;
    mainMenuButton1Y = (screenHeight / 2) + mainMenuItemSpacer;
    mainMenuButton2Y = (mainMenuButton1Y + mainMenuButtonHeight) + mainMenuItemSpacer;
    mainMenuButton3Y = (mainMenuButton2Y + mainMenuButtonHeight) + mainMenuItemSpacer;

    buttonTextSize = getFontSize($("#resumeGameButton").text(), mainMenuButtonHeight, mainMenuButtonWidth - (mainMenuButtonWidth / 10), 0.5, mainMenuContext, "Manila");
    $("#newGameButton").css({
        "display": "block",
        "left": (mainMenuButtonLeftEdge + 1) + "px",
        "top":(mainMenuButton1Y + 1) + "px",
        "width":(mainMenuButtonWidth - 2) + "px",
        "height":(mainMenuButtonHeight - 2) + "px",
        "font": buttonTextSize,
        "line-height": mainMenuButtonHeight + "px"
    });

    if(localStorage.getItem("hasData") === "true")
    {
        $("#resumeGameButton").css({
            "display": "block",
            "left": (mainMenuButtonLeftEdge + 1) + "px",
            "top":(mainMenuButton2Y + 1) + "px",
            "width":(mainMenuButtonWidth - 2) + "px",
            "height":(mainMenuButtonHeight - 2) + "px",
            "font": buttonTextSize,
            "line-height": mainMenuButtonHeight + "px"
        });
        $("#aboutButton").css({
            "display": "block",
            "left": (mainMenuButtonLeftEdge + 1) + "px",
            "top":(mainMenuButton3Y + 1) + "px",
            "width":(mainMenuButtonWidth - 2) + "px",
            "height":(mainMenuButtonHeight - 2) + "px",
            "font": buttonTextSize,
            "line-height": mainMenuButtonHeight + "px"
        });
    }
    else
    {
        $("#aboutButton").css({
            "display": "block",
            "left": (mainMenuButtonLeftEdge + 1) + "px",
            "top":(mainMenuButton2Y + 1) + "px",
            "width":(mainMenuButtonWidth - 2) + "px",
            "height":(mainMenuButtonHeight - 2) + "px",
            "font": buttonTextSize,
            "line-height": mainMenuButtonHeight + "px"
        });
    }

    mainMenuContext.restore();

    if (playMenuVisible)
        drawPlayBar();
}

function drawPlayBar() {

    playMenuLeftEdge = numerooRightEdge + 70;
    playMenuTop = mainMenuContext.canvas.height / 2.5;    
    playMenuHeight = images.playMenu.height; 
    playMenuWidth = images.playMenu.width;
    
    if (playMenuHeight + playMenuTop > screenHeight)
    {
        var ratio = screenHeight / (playMenuHeight + playMenuTop);
        playMenuHeight = playMenuHeight * ratio;
        playMenuWidth = playMenuWidth * ratio;
    }
    
    var buttonWidth = playMenuWidth * .75;
    var buttonLeftEdge = playMenuLeftEdge + (playMenuWidth - buttonWidth)/2;    
    var easyButtonTop = playMenuTop + (playMenuHeight * .3);
    var playButtonHeight = ((playMenuHeight - (easyButtonTop - playMenuTop) - (60 + 2 * shadowOffset)) / 3);
    buttonTextSize = (playButtonHeight*.5)|0;

    var normalButtonTop = easyButtonTop + playButtonHeight + 30;
    var hardButtonTop = normalButtonTop + playButtonHeight + 30;
    
    mainMenuContext.drawImage(images.playMenu, numerooRightEdge + 70, playMenuTop, playMenuWidth, playMenuHeight);
    
    mainMenuContext.save();
    mainMenuContext.fillStyle = "#ec0001"; 
    mainMenuContext.shadowColor = "black";
            
    mainMenuContext.beginPath();
    
    mainMenuContext.moveTo(numerooRightEdge + 80, mainMenuButton1Y); // give the (x,y) coordinates
    mainMenuContext.lineTo(mainMenuButtonRightEdge + 25, mainMenuButton1Y + (mainMenuButtonHeight / 2));
    mainMenuContext.lineTo(numerooRightEdge + 80, mainMenuButton1Y + mainMenuButtonHeight);
    mainMenuContext.lineTo(numerooRightEdge + 80, mainMenuButton1Y);
            
    mainMenuContext.fill();    
    mainMenuContext.closePath();    
                
    $("#easyGameButton").css({
            "visibility": "visible",
            "left": (buttonLeftEdge + 1) + "px",
            "top":(easyButtonTop + 1) + "px",
            "width":(buttonWidth - 2) + "px",
            "height":(playButtonHeight - 2) + "px",
            "font": "bold " + buttonTextSize.toString() + "px " + "Manila",
            "line-height": playButtonHeight + "px"
        });
    $("#normalGameButton").css({
            "visibility": "visible",
            "left": (buttonLeftEdge + 1) + "px", 
            "top":(normalButtonTop + 1) + "px", 
            "width":(buttonWidth - 2) + "px", 
            "height":(playButtonHeight - 2) + "px", 
            "font": "bold " + buttonTextSize.toString() + "px " + "Manila",
            "line-height": playButtonHeight + "px"
        });
    $("#hardGameButton").css({
            "visibility": "visible",
            "left": (buttonLeftEdge + 1) + "px", 
            "top":(hardButtonTop + 1) + "px", 
            "width":(buttonWidth - 2) + "px", 
            "height":(playButtonHeight - 2) + "px", 
            "font": "bold " + buttonTextSize.toString() + "px " + "Manila",
            "line-height": playButtonHeight + "px"
        });

    mainMenuContext.restore();
}

function startTimer(){
    
    if (timer === 0)
    {        
        timerBegin = new Date().getTime();
        pausedSeconds = 0;         
    }
    else if (timerPause)
    {
        var unpauseTime = new Date().getTime() - timerPause;  
        var pauseSecs = Math.floor(Math.floor(unpauseTime / 100) / 10);  
        pausedSeconds += pauseSecs;    
        
        timerPause = undefined;        
    }
        
    //If we need to resize this, restart the timeout

    var itemSpacer = ((screenHeight - (7 * (inGameButtonHeight + shadowOffset)) - logoHeight) / 10) | 2; 
    
    var minutes = Math.floor(timer / 60);
    var seconds = timer % 60;
    var timerWidth =logoWidth;
    var timerLeft = logoLeft;
    var timerTop = logoBottom + itemSpacer;
    
    timerBottom = timerTop + inGameButtonHeight;
    
    bottomContext.save();
    bottomContext.fillStyle = "black";
        
    if (seconds < 10)
        seconds = "0" + seconds;
        
    if (minutes < 10)
            minutes = "0" + minutes;
    
    var timeString = minutes + ":" + seconds;
    
    bottomContext.font = getFontSize("00:00" + "  " + difficulty, (timerBottom - timerTop), timerWidth, 0.9, bottomContext);
    
    var stringSize = bottomContext.measureText(timeString + difficulty).width;
    var spaceSize = logoWidth - stringSize;
    var difficultyLeft = timerLeft + bottomContext.measureText(timeString).width + spaceSize;
    
    bottomContext.fillText(timeString, timerLeft, timerTop + 30);
    bottomContext.fillText(difficulty, difficultyLeft, timerTop + 30);
    
    bottomContext.restore();
    
    if (cancelTimer)
        clearInterval(cancelTimer);
            
    cancelTimer = setInterval(function(){
        
        var time = new Date().getTime() - timerBegin;  
        timer = Math.floor(Math.floor(time / 100) / 10);  
         
        timer -= pausedSeconds;
     
        timerTop = logoBottom + itemSpacer;
        timerBottom = timerTop + inGameButtonHeight;
        timerWidth = logoWidth;
        timerLeft = logoLeft;
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;
            
        if (seconds < 10)
            seconds = "0"+seconds;
            
        if (minutes < 10)
            minutes = "0"+minutes;
            
        bottomContext.save();
        bottomContext.fillStyle = gameMenuBarColor;    
        bottomContext.fillRect(gridMenuBarLeft, logoBottom, gridMenuBarWidth , ($("#viewHintButton").position().top - 5) - logoBottom);
        
        bottomContext.fillStyle = "black";
        
        bottomContext.font = getFontSize("00:00" + "  " + difficulty, (timerBottom - timerTop), timerWidth, 0.9, bottomContext);
        
        timeString = minutes + ":" + seconds
        
        bottomContext.fillText(timeString, timerLeft, timerTop + 30);
        bottomContext.fillText(difficulty, difficultyLeft, timerTop + 30);
        bottomContext.restore();
        localStorage.setItem("timer", timer);
        localStorage.setItem("pausedSeconds", pausedSeconds);
        localStorage.setItem("timerBegin", timerBegin);
        localStorage.setItem("timerPause", timerPause);
        
        timerResume = new Date().getTime();
        localStorage.setItem("timerResume", timerResume);        
        
    }, 100);
}

function pauseTimer(){
    if (cancelTimer)
    {
        clearInterval(cancelTimer);
        timerPause = new Date().getTime();
    }
}

function drawGameMenu(){
    
    /* Draw Bar and Logo */
    bottomContext.fillStyle = gameMenuBarColor;    
    bottomContext.fillRect(gridMenuBarLeft, 0, gridMenuBarWidth , screenHeight);
    
    inGameButtonHeight = screenHeight / 13;    
    logoWidth = logoImage.width;
    logoHeight = logoImage.height;

            
    if (logoWidth > gridMenuBarWidth * .9)
    {
        logoWidth = gridMenuBarWidth * .9;
        logoHeight = (logoImage.height/logoImage.width)*logoWidth;
    }

    logoLeft = gridMenuBarLeft + ((gridMenuBarWidth - logoWidth) / 2);
    
    var inGameButtonWidth = logoWidth - shadowOffset;
    var itemSpacer = ((screenHeight - (7 * (inGameButtonHeight + shadowOffset)) - logoHeight) / 10) | 2; 
    
    logoBottom = itemSpacer / 2 + logoHeight;
        
    startTimer();
        
    bottomContext.drawImage(logoImage, logoLeft, itemSpacer / 2, logoWidth, logoHeight );

    /* Draw buttons */
    
    
    buttonTextSize = (inGameButtonHeight*.5)|0;
    var viewHintButtonTop = timerBottom + itemSpacer;     
    var writeNoteButtonTop = viewHintButtonTop + inGameButtonHeight + itemSpacer;
    var helpButtonTop = writeNoteButtonTop + inGameButtonHeight + itemSpacer;
    var startNewButtonTop = screenHeight - inGameButtonHeight - itemSpacer - shadowOffset ;
    var gmButtonTextSize = getFontSize($("#writeNoteButton").text(), inGameButtonHeight, inGameButtonWidth - 5, 0.5, bottomContext);
    
    $("#viewHintButton").css({"visibility":"visible", "background-color": standardButtonColor, "left": (logoLeft + 1) + "px", "top":(viewHintButtonTop + 1) + "px", "width":(inGameButtonWidth - 2) + "px", "height":(inGameButtonHeight - 2) + "px", "font": gmButtonTextSize }).css("line-height", inGameButtonHeight + "px");
    $("#startNewGameButton").css({"visibility":"visible", "background-color": standardButtonColor, "left": (logoLeft + 1) + "px", "top":(startNewButtonTop + 1) + "px", "width":(inGameButtonWidth - 2) + "px", "height":(inGameButtonHeight - 2) + "px", "font": gmButtonTextSize }).css("line-height", inGameButtonHeight + "px");
    
    if (option_showpossible != 1)
    {
        $("#writeNoteButton").css({"visibility":"visible", "left": (logoLeft + 1) + "px", "top":(writeNoteButtonTop + 1) + "px", "width":(inGameButtonWidth - 2) + "px", "height":(inGameButtonHeight - 2) + "px", "font": gmButtonTextSize }).css("line-height", inGameButtonHeight + "px");
        $("#helpButton").css({"visibility":"visible", "background-color": standardButtonColor, "left": (logoLeft + 1) + "px", "top":(helpButtonTop + 1) + "px", "width":(inGameButtonWidth - 2) + "px", "height":(inGameButtonHeight - 2) + "px", "font": gmButtonTextSize }).css("line-height", inGameButtonHeight + "px");

        if (noteMode)
        {
            $("#writeNoteButton").css("color", "white");
            $("#writeNoteButton").css({"-webkit-box-shadow": glossyButton, "background-image": standardButtonGradiant});
            $("#writeNoteButton").css("background-color", buttonSelectedColor);
            $("#writeNoteButton").css("background-size", "");
        }
        else
        {
            $("#writeNoteButton").css("color", "black");
            $("#writeNoteButton").css({"-webkit-box-shadow": glossyButton, "background-image": standardButtonGradiant});
            $("#writeNoteButton").css("background-color", standardButtonColor);
            $("#writeNoteButton").css("background-size", "");
        }
            $("#writeNoteButton").show();
    }
    else
    {
        $("#writeNoteButton").hide();
        $("#viewHintButton").css({"visibility": "hidden"});
        $("#helpButton").css({"visibility":"visible", "background-color": standardButtonColor, "left": (logoLeft + 1) + "px", "top":(viewHintButtonTop + 1) + "px", "width":(inGameButtonWidth - 2) + "px", "height":(inGameButtonHeight - 2) + "px", "font": gmButtonTextSize }).css("line-height", inGameButtonHeight + "px");
    }
}

function printCellNumbers(cellNumber)
{
    var s = boardWidth/9;
    var t = boardWidth/27;
    var x = boardOffset;
    var y = (screenHeight - boardWidth) / 2

    if(game.cells[cellNumber].value != 0)
    {
        boardContext.font = textSize.toString() + "px " + numberFont;
        if(game.cells[cellNumber].fixed)
            boardContext.fillStyle = fixedNumberColor;
        else if((option_flaginvalid == 1) && !game.checkValidCell(cellNumber))
            boardContext.fillStyle = "red";
        else
            boardContext.fillStyle = standardTextColor;
            
        var tDim = boardContext.measureText(game.cells[cellNumber].value.toString());
        var xOffset = (((cellNumber % 9)|0) * s) + (s/2) - ((tDim.width)/2);
        var yOffset = (((cellNumber / 9)|0) * s) + (s*3/4);            
           
        boardContext.font = numberFont;
        boardContext.fillText(game.cells[cellNumber].value.toString(), x+xOffset, y+yOffset);
     }
     else if(option_showpossible == 1)
     {
        boardContext.font = miniSize.toString() + "px " + numberFont;
        boardContext.fillStyle = fixedNumberColor;
        for(j = 0; j < 9; j++)
        {
            if(!game.checkPossible(cellNumber, j+1))
                continue;
            var tDim = boardContext.measureText((j+1).toString());
            var xOffset = (((cellNumber % 9)|0) * s) + (((j % 3)|0) * t) + (s/6) - ((tDim.width)/2);
            var yOffset = (((cellNumber / 9)|0) * s) + (((j / 3)|0) * t) + (s/4) + 1;

            boardContext.font = numberFont;
            boardContext.fillText((j+1).toString(), x+xOffset, y+yOffset);                        
        }
     }
     else
     {
        boardContext.font = miniSize.toString() + "px " + numberFont;
        boardContext.fillStyle = standardTextColor;
        for(j = 0; j < 9; j++)
        {
            if(!game.cells[cellNumber].possible[j].selected)
                continue;
    
            if((game.cells[cellNumber].possible[j].hinted && !game.checkPossible(cellNumber, j+1)) || ((option_flaginvalid == 1) && !game.checkPossible(cellNumber, j+1)) )
                boardContext.fillStyle = "red";                    
            else if (game.cells[cellNumber].possible[j].hinted)
                boardContext.fillStyle = fixedNumberColor;
            else
                boardContext.fillStyle = standardTextColor;

            var tDim = boardContext.measureText((j+1).toString());
            var xOffset = (((cellNumber % 9)|0) * s) + (((j % 3)|0) * t) + (s/6) - ((tDim.width)/2);
            var yOffset = (((cellNumber / 9)|0) * s) + (((j / 3)|0) * t) + (s/4);

            boardContext.fillText((j+1).toString(), x+xOffset, y+yOffset);
        }
    }
}

function drawBoard() {
    getScreenDimensions();
    if(screenWidth <= screenHeight)
        boardWidth = (screenWidth - boardOffset) < screenHeight *.6 ? (screenWidth - boardOffset) : (screenHeight *.6) - boardOffset;        
    else
        boardWidth = (screenHeight - boardOffset) < screenWidth *.6 ? (screenHeight - boardOffset) : (screenWidth *.6) - boardOffset;

    var x = boardOffset;
    var y = (screenHeight - boardWidth) / 2;

    boardContext.canvas.width = screenWidth;
    boardContext.canvas.height = screenHeight;
    boardContext.clearRect(0, 0, boardContext.canvas.width, boardContext.canvas.height);
    
    var i, j;
    var xBmin = boardOffset;
    var yBmin = (screenHeight - boardWidth) / 2;
    var m = boardWidth/3; 
    var s = boardWidth/9;
    var t = boardWidth/27;
    textSize = (s*3/4)|0;    
    miniSize = (textSize/3)|0;

    // draw the board sized square
    
    boardContext.lineWidth=7;
    boardContext.strokeStyle = gridColor;
    boardContext.strokeRect(x, y, boardWidth, boardWidth);

    var counter = 1;
    boardContext.strokeStyle = gridColor;
    boardContext.lineWidth=4;

    for(i = 0; i < 3; i++)
    {
        for(j = 0; j < 3; j++)
        {
            counter++;    
            if (currentTheme == "Nancy")        //Nancy theme's board is drawn slightly differently
            {
                boardContext.lineWidth=4;
                boardContext.strokeStyle = smallGridColor;
                if (counter % 2 != 0)
                    boardContext.strokeRect(x+(j*m), y+(i*m), m, m);                
            }
            else
                boardContext.strokeRect(x+(j*m), y+(i*m), m, m);
        }
    }

    // draw all 81 little squares
    boardContext.fillStyle = "rgba(0, 255, 100, 0.3)";
    boardContext.lineWidth=1;
    counter = 1;
    for(i = 0; i < 9; i++)
    {
        for(j = 0; j < 9; j++)
        {                    
            if (currentTheme == "Nancy")
            {
                boardContext.strokeStyle = smallGridColor;
                if ( ((j > 2 && j < 6) && (i < 3 || i > 5)) || 
                    ((j < 3 || j > 5) && (i > 2 && i < 6) ))      
                {          
                    boardContext.lineWidth = 4;
                    boardContext.strokeRect(x+(j*s), y+(i*s), s, s);
                }
                else
                {
                    boardContext.lineWidth = 1;
                    boardContext.strokeRect(x+(j*s) + 3.5, y+(i*s) + 3.5, s - 7, s - 7);
                }        
            }
            else
            {            
                boardContext.strokeRect(x+(j*s), y+(i*s), s, s);
            }
        
            if (j % 3 == 0)
                counter++;
        }
    }

    // fill in the numbers        
    for(i = 0; i < 81; i++)
    {
        printCellNumbers(i);
    }

    localStorage.setItem("cells", JSON.stringify(game.cells));
}

function drawGrid() {

    currentPage = "gameGrid";
    game.checkComplete();

    getScreenDimensions();
    if(screenWidth <= screenHeight)
        boardWidth = (screenWidth - boardOffset) < screenHeight *.6 ? (screenWidth - boardOffset) : (screenHeight *.6) - boardOffset;        
    else
        boardWidth = (screenHeight - boardOffset) < screenWidth *.6 ? (screenHeight - boardOffset) : (screenWidth *.6) - boardOffset;

    var x = boardOffset;
    var y = (screenHeight - boardWidth) / 2;

    bottomContext.canvas.width = screenWidth;
    bottomContext.canvas.height = screenHeight;
    highlightContext.canvas.width = screenWidth;
    highlightContext.canvas.height = screenHeight;
    boardContext.canvas.width = screenWidth;
    boardContext.canvas.height = screenHeight;
    topContext.canvas.width = screenWidth;
    topContext.canvas.height = screenHeight;
        
    bottomContext.clearRect(0, 0, bottomContext.canvas.width, bottomContext.canvas.height);
    highlightContext.clearRect(0, 0, highlightContext.canvas.width, highlightContext.canvas.height);
    topContext.clearRect(0, 0, topContext.canvas.width, topContext.canvas.height);
    boardContext.clearRect(0, 0, boardContext.canvas.width, boardContext.canvas.height);
    
    var i, j;
    var xBmin = boardOffset;
    var yBmin = (screenHeight - boardWidth) / 2;
    var m = boardWidth/3; 
    var s = boardWidth/9;
    var t = boardWidth/27;
    textSize = (s*3/4)|0;    
    miniSize = (textSize/3)|0;

    gridMenuBarLeft = boardWidth + (3 * boardOffset) + s;
    gridMenuBarWidth = screenWidth - gridMenuBarLeft - 10;
    
    // draw the board sized square
    
    boardContext.lineWidth=7;
    boardContext.strokeStyle = gridColor;
    boardContext.strokeRect(x, y, boardWidth, boardWidth);
    
    drawGameMenu();
        
    // draw valid row/col/3x3 highlights
    
    var counter = 1;
    bottomContext.save();
    bottomContext.fillStyle = boardBGColor1;
    boardContext.strokeStyle = gridColor;
    
    boardContext.lineWidth=4;
 
    for(i = 0; i < 3; i++)
    {
        for(j = 0; j < 3; j++)
        {
            if (counter % 2 == 0)
                bottomContext.fillStyle = boardBGColor2;
            else
                bottomContext.fillStyle = boardBGColor1;

            bottomContext.fillRect(x+3*(j*s), y+3*(i*s), 3*s, 3*s);
            counter++;    
            
            if (currentTheme == "Nancy")        //Nancy theme's board is drawn slightly differently
            {
                boardContext.lineWidth=4;
                boardContext.strokeStyle = smallGridColor;
                if (counter % 2 != 0)
                    boardContext.strokeRect(x+(j*m), y+(i*m), m, m);                
            }
            else
                boardContext.strokeRect(x+(j*m), y+(i*m), m, m);
        }
    }
    bottomContext.restore();
    
    boardContext.fillStyle = "rgba(0, 255, 100, 0.3)";
    var minorvictory = false;

    for(i = 0; i < 9; i++)
    {
        if(game.validrow[i])
        {
            if(game.prevvalidrow[i]||!game.ready||gamecomplete)
            {    
                drawRect(highlightContext, xBmin, yBmin+(i*s), boardWidth, s);
            }
            else
            {
                minorvictory = true;
                animateRect(highlightContext, xBmin, yBmin+(i*s), boardWidth, s, "row");
            }
        }
        game.prevvalidrow[i] = game.validrow[i];
        if(game.validcol[i])
        {
            if(game.prevvalidcol[i]||!game.ready||gamecomplete)
            {
                drawRect(highlightContext, xBmin+(i*s), yBmin, s, boardWidth);
            }
            else
            {
                minorvictory = true;
                animateRect(highlightContext, xBmin+(i*s), yBmin, s, boardWidth, "col");
            }
        }
        game.prevvalidcol[i] = game.validcol[i];
        if(game.validsub[i])
        {
            if(game.prevvalidsub[i]||!game.ready||gamecomplete)
            {
                drawRect(highlightContext, xBmin+((i%3)*m), yBmin+(((i/3)|0)*m), m, m);
            }
            else
            {
                minorvictory = true;
                animateRect(highlightContext, xBmin+((i%3)*m), yBmin+(((i/3)|0)*m), m, m, "sub");
            }
        }
        game.prevvalidsub[i] = game.validsub[i];
    }

    if(gamecomplete && !blockDialogRedraw)
    {
        // game is complete
        cellSelected = -1;
        Sounds.youwin.play();
        animateRect(bottomContext, 0, 0, 
            bottomContext.canvas.width, bottomContext.canvas.height);
        pauseTimer();
        
        var mins = Math.floor(timer / 60);
        var secs = timer % 60;
        if (secs < 10)
            secs = "0" + secs;
            
        if (mins < 10)
            mins = "0" + mins;
            
        $("#win_contents2 t").html(mins + ":" + secs);
        
        $("#inGameButtons").hide();
        
        gameFinished = true;
        localStorage.setItem("hasData", "false");    //Don't allow a finished game to be resumed
        
        winDialog.show();
    }
    else if(minorvictory)
    {
        Sounds.rowsuccess.play();
    }

    
    // draw all 81 little squares
    boardContext.lineWidth=1;
    counter = 1;
    for(i = 0; i < 9; i++)
    {
        for(j = 0; j < 9; j++)
        {                    
            if (currentTheme == "Nancy")
            {
                boardContext.strokeStyle = smallGridColor;
                if ( ((j > 2 && j < 6) && (i < 3 || i > 5)) || 
                    ((j < 3 || j > 5) && (i > 2 && i < 6) ))      
                {          
                    boardContext.lineWidth = 4;
                    boardContext.strokeRect(x+(j*s), y+(i*s), s, s);
                }
                else
                {
                    boardContext.lineWidth = 1;
                    boardContext.strokeRect(x+(j*s) + 3.5, y+(i*s) + 3.5, s - 7, s - 7);
                }        
            }
            else
            {            
                boardContext.strokeRect(x+(j*s), y+(i*s), s, s);
            }
        
            if (j % 3 == 0)
                counter++;
        }
    }

    // fill in the numbers        
    for(i = 0; i < 81; i++)
    {
        printCellNumbers(i);
    }

    localStorage.setItem("cells", JSON.stringify(game.cells));
    localStorage.setItem("prevvalidrow", JSON.stringify(game.prevvalidrow));
    localStorage.setItem("prevvalidcol", JSON.stringify(game.prevvalidcol));
    localStorage.setItem("prevvalidsub", JSON.stringify(game.prevvalidsub));
}

function drawStartNewGameMenu()
{
    currentPage = "newGameMenu";
    
    $("#inGameButtons").hide();
    var newGameButtonLeft;
    var startEasyTop = timerBottom; 

    pauseTimer();
    
    if (!gameFinished)
    {
        bottomContext.save();    
        bottomContext.fillStyle = gameMenuBarColor;    
        bottomContext.fillRect(gridMenuBarLeft, timerBottom + 10, gridMenuBarWidth , screenHeight);
        bottomContext.restore();
        
        $("#closeButton").show();
        newGameButtonLeft = logoLeft;    
    }
    else
    {        
        $("#closeButton").hide();    //User must select a new game to play as this one is finished
        bottomContext.clearRect(0, 0, bottomContext.canvas.width, bottomContext.canvas.height);
        newGameButtonLeft = screenWidth / 2 - (logoWidth / 2);
        startEasyTop = 0;    
    }
        
    startGameContext.canvas.width = screenWidth;
    startGameContext.canvas.height = screenHeight;
    
     $("#startNewGameCanvas").show();
     $("#startNewGameCanvas").css("z-index", "10");   

    /* Draw overlay */
        
    startGameContext.save();
    startGameContext.fillStyle = "rgba(230, 232, 231, 0.8)"; 
    startGameContext.fillRect(0,0,screenWidth, screenHeight);
    var startGameButtonHeight = screenHeight / 12 - 2;
    
    var inGameSpacer = ((screenHeight - (6 * (startGameButtonHeight + shadowOffset))) / 10) | 2;
        
    
    var startNormalTop = startEasyTop + startGameButtonHeight + inGameSpacer;
    var startHardTop = startNormalTop + startGameButtonHeight + inGameSpacer;
    var chooseTop = startHardTop + startGameButtonHeight + inGameSpacer;    
    var startGameButtonWidth = (logoWidth - shadowOffset);

    if (startEasyTop == 0)
    {
        var menuSpacer = screenHeight * 1/10 ;
        startEasyTop += menuSpacer;
        startNormalTop += menuSpacer;
        startHardTop += menuSpacer;
        chooseTop += menuSpacer;    
    }

    $("#easyGameButton").css({
        "visibility":"visible",
        "z-index": "11", 
        "left": (newGameButtonLeft + 1) + "px", 
        "top":(startEasyTop) + "px", 
        "width":(startGameButtonWidth - 2) + "px", 
        "height":(startGameButtonHeight) + "px", 
        "font": getButtonFont(startGameButtonHeight),
        "line-height": startGameButtonHeight + "px"
    });
    $("#normalGameButton").css({
        "visibility":"visible", 
        "z-index": "11", 
        "left": (newGameButtonLeft + 1) + "px", 
        "top":(startNormalTop) + "px", 
        "width":(startGameButtonWidth - 2) + "px", 
        "height":(startGameButtonHeight) + "px", 
        "font": getButtonFont(startGameButtonHeight),
        "line-height": startGameButtonHeight + "px"
    });
    $("#hardGameButton").css({
        "visibility":"visible",
        "z-index": "11", 
        "left": (newGameButtonLeft + 1) + "px", 
        "top":(startHardTop) + "px", 
        "width":(startGameButtonWidth - 2) + "px", 
        "height":(startGameButtonHeight) + "px", 
        "font": getButtonFont(startGameButtonHeight),
        "line-height": startGameButtonHeight + "px"
    });
    $("#chooseThemeText").css({
        "visibility":"visible", 
        "z-index": "11", 
        "left": (newGameButtonLeft + 1) + "px", 
        "top":(chooseTop) + "px", 
        "width":(logoWidth - 2) + "px", 
        "height":(startGameButtonHeight) + "px", 
        "font": getFontSize($("#chooseThemeText").text(), startGameButtonHeight, logoWidth - 5, 1, startGameContext),
        "line-height": startGameButtonHeight + "px"
    });

    switch(difficulty){
        case easyDiff:
            $("#easyGameButton").css("background-color", buttonSelectedColor);
            $("#normalGameButton").css("background-color",standardButtonColor);
            $("#hardGameButton").css("background-color",standardButtonColor);
            break;
        case normalDiff:
            $("#easyGameButton").css("background-color",standardButtonColor);
            $("#normalGameButton").css("background-color", buttonSelectedColor);
            $("#hardGameButton").css("background-color",standardButtonColor);
            break;
        case hardDiff:
            $("#easyGameButton").css("background-color",standardButtonColor);
            $("#normalGameButton").css("background-color",standardButtonColor);
            $("#hardGameButton").css("background-color", buttonSelectedColor);
            break;
        default:
            break;
    }
    
    $("#gameLevelButtons").show();
        
    var iconSpace = (startGameButtonWidth - (images.nancyThemeIconOn.width + images.manilaThemeIconOn.width + images.arigatoThemeIconOn.width)) / 2;
    var iconWidth = images.nancyThemeIconOn.width;
    
    if (iconSpace < 0)
    {
        iconWidth = (startGameButtonWidth - 4) / 3;
        iconSpace = 2;    
    }    
    
    var nancyIconRight = (newGameButtonLeft + iconWidth);
    var manilaIconRight = nancyIconRight + iconSpace + iconWidth;
    var themeIconTop = chooseTop + startGameButtonHeight + inGameSpacer - shadowOffset;
    var themeIconBottom = themeIconTop + images.manilaThemeIconOn.height;
    var optionsButtonTop = themeIconBottom + inGameSpacer;
    var startNewButtonTop = optionsButtonTop + startGameButtonHeight + inGameSpacer;
    
    $("#manilaThemeIcon").attr("src", "images/global/btn_manilatheme_off.png");
    $("#nancyThemeIcon").attr("src", "images/global/btn_nancytheme_off.png");
    $("#arigatoThemeIcon").attr("src", "images/global/btn_arigatotheme_off.png");
    
    switch (currentTheme)
    {
        case "Manila" :
            $("#manilaThemeIcon").attr("src", "images/global/btn_manilatheme_on.png");
            break;
        case "Nancy" :
            $("#nancyThemeIcon").attr("src", "images/global/btn_nancytheme_on.png");
            break;
        case "Arigato" :
            $("#arigatoThemeIcon").attr("src", "images/global/btn_arigatotheme_on.png");
            break;
        default:
            break;    
    }    
    
    $("#nancyThemeIcon").css({"left": (newGameButtonLeft + 1) + "px", "top":themeIconTop + "px", "right":nancyIconRight + "px", "width":iconWidth + "px"}); 
    $("#manilaThemeIcon").css({"left": (nancyIconRight + iconSpace) + "px", "top":themeIconTop + "px", "right": + "px", "width":iconWidth + "px"}); 
    $("#arigatoThemeIcon").css({"left": (manilaIconRight + iconSpace) + "px", "top":themeIconTop + "px", "width":iconWidth + "px"}); 
    $("#closeButton").css({"left": (screenWidth - (images.closeButton.width + 20)) + "px", "top":20 + "px"});
        
    $("#optionsButton").css({"z-index": "11", "background-color": standardButtonColor, "left": (newGameButtonLeft + 1) + "px", "top":optionsButtonTop + "px", "width":(startGameButtonWidth - 2) + "px", "height":(startGameButtonHeight) + "px", "font": getButtonFont(startGameButtonHeight) }).css("line-height", startGameButtonHeight + "px");
    $("#startGameButton").css({"z-index": "11", "background-color": standardButtonColor, "left": (newGameButtonLeft + 1) + "px", "top":startNewButtonTop + "px", "width":(startGameButtonWidth - 2) + "px", "height":(startGameButtonHeight) + "px", "font": getButtonFont(startGameButtonHeight) }).css("line-height", startGameButtonHeight + "px");
    
    $("#newGameThemeButtons").show();    
    startGameContext.restore();
}

function selectCell(event)
{    
    var ymin = (screenHeight - boardWidth) / 2;  
    var cW = boardWidth/9;
    var xC;
    var yC;
    
    xC = event.offsetX - ((event.offsetX - boardOffset) % cW);
    yC = event.offsetY - ((event.offsetY - ymin) % cW);
    cellSelected = Math.floor(((((yC-ymin+1)/cW)*9) + ((xC-boardOffset+1)/cW)));

    // check to be sure the cell is selectable
    if((cellSelected < 0)||(cellSelected >= 81) ) 
        cellSelected = -1;
}

function drawPicker(event) {
    
    // clear the whole canvas first
    topContext.clearRect(0, 0, topContext.canvas.width, topContext.canvas.height);

    // calculate the board, touch, and cell coordinates
               
    var xBmin = boardOffset;
    var yBmin = (screenHeight - boardWidth) / 2;
    var bWidth = boardWidth/3;
    var cWidth = boardWidth/9;
    var xCell;
    var yCell;    

    var boardRight = xBmin + boardWidth + boardOffset;
    xNumberPick = boardRight;
    yNumberPick = 0;
    npWidth = screenHeight / 9;
    
    if((cellSelected < 0)||(cellSelected >= 81) ) 
        return;
    
    if(cellSelected < 0)
    {
        
        selectCell(event);
      
        xCell = event.offsetX - ((event.offsetX - xBmin) % cWidth);
        yCell = event.offsetY - ((event.offsetY - yBmin) % cWidth);
    }
    else
    {
        xCell = xBmin + ((cellSelected%9)*cWidth);
        yCell = yBmin + (((cellSelected/9)|0)*cWidth);
    }

    var i;
    var textSize = (bWidth*3/4)|0;
    topContext.font = textSize.toString() + "px " + numberFont;
    
    if (!game.cells[cellSelected].fixed)        // Don't draw number selector if it's a fixed number    
    {       
        for(i = 0; i < 9; i++)
        {
            topContext.fillStyle = (pickerMode)?((game.cells[cellSelected].possible[i].selected)?numNoteBoxSelectedColor:numNoteBoxColor):numPickBoxColor; 
            topContext.strokeStyle = numPickOutlineColor;
            topContext.lineWidth = 5;        
            topContext.fillRect(xNumberPick, yNumberPick + (npWidth*i), npWidth, npWidth);
            topContext.strokeRect(xNumberPick, yNumberPick + (npWidth*i), npWidth, npWidth);        
        }     
    }
            
    topContext.fillStyle = highlightColor;            
    topContext.fillRect(xBmin, yCell, cWidth*9, cWidth);
    topContext.fillRect(xCell, yBmin, cWidth, cWidth*9);

    // Redraw the selected cell so it stands out           
    topContext.clearRect(xCell, yCell, cWidth, cWidth);
    topContext.lineWidth=4;
  
    bottomContext.fillStyle  = "rgba(255, 255, 255, 1)";
    bottomContext.fillRect(xCell, yCell, cWidth, cWidth);
    var boxBuffer = currentTheme != "Nancy" ? .25 : 0;
    
    if (currentTheme != "Nancy")
        topContext.drawImage(squareSelector, xCell - (cWidth * boxBuffer), yCell - (cWidth * boxBuffer), cWidth + 2*(cWidth * boxBuffer), cWidth + 2*(cWidth * boxBuffer));
    else
        bottomContext.drawImage(squareSelector, xCell - (cWidth * boxBuffer), yCell - (cWidth * boxBuffer), cWidth + 2*(cWidth * boxBuffer), cWidth + 2*(cWidth * boxBuffer));
        
    printCellNumbers(cellSelected);
    
    topContext.fillStyle = numPickTextColor;
    var txtSize = ((boardWidth/9)*3/4)|0;
    
    for(i = 0; i < 9; i++)
    {        
        topContext.save();
        topContext.font = txtSize.toString() + "px " + numberFont;
        
        var num = (i+1).toString();
        var tDim = topContext.measureText(num);
        var xOffset = (npWidth / 2) - (tDim.width/2);
        var yOffset = npWidth / 2;
                
        topContext.textBaseline = "middle";        
        topContext.fillText(num, xNumberPick + xOffset, yNumberPick + (npWidth*i) + yOffset);         
        topContext.restore();        
    }
}

function handlePicker(event) {

    var xBmin = xNumberPick;
    var yBmin = yNumberPick;
    var cWidth = npWidth;
    var xCell = event.offsetX - ((event.offsetX - xBmin) % cWidth);
    var yCell = event.offsetY - ((event.offsetY - yBmin) % cWidth);
    var num = (((yCell-yBmin+1)/cWidth) + ((xCell-xBmin+1)/cWidth) + 1)|0;

    Sounds.button.play();
    if(pickerMode == 0)
    {
        game.setValue(cellSelected, num);
        
        // clear the whole canvas first
        topContext.clearRect(0, 0, topContext.canvas.width, topContext.canvas.height);
        cellSelected = -1;
        drawGrid();
    }
    else
    {
        game.cells[cellSelected].possible[num-1].selected = !game.cells[cellSelected].possible[num-1].selected;
        drawPicker(event);
        drawBoard();
    }
}

var ignoreMouseUp = false;
var mouseTimeout;

function getNumberKey(event)
{
    if (event.which > 48 && event.which < 58)
        return event.which - 48;
    else if (event.which > 96 && event.which < 106)
        return event.which - 96;
    else if (event.which === 46 || event.which === 8)
        return 0;
    else if (event.which === 16)
    {        
        if (option_showpossible != 1)
        {
            pickerMode = !pickerMode;
            noteMode = !noteMode;
            drawGrid();        
            drawPicker();
        }
    }
    else if (event.which == 37)            //Left Arrow, move selected squre
    {
        if (cellSelected % 9 != 0)
            cellSelected--;
        else
            cellSelected += 8;
        
        drawGrid();         
        drawPicker();   
    }
    else if (event.which == 39)            //Right Arrow, move selected squre
    {
        if ((cellSelected + 1) % 9 != 0) 
        {
            cellSelected++;
        }   
        else
            cellSelected -= 8;

        drawGrid();         
        drawPicker();
    }
    else if (event.which == 38)            //Up Arrow, move selected squre
    {
        if (cellSelected - 9 >= 0)
        {
            cellSelected -= 9;
        }   
        else
            cellSelected += 72;

        drawGrid();         
        drawPicker();
    }
    else if (event.which == 40)            //Down Arrow, move selected squre
    {
        if (cellSelected + 9 < 81)
        {
            cellSelected += 9;
        }   
        else
            cellSelected -= 72;
            
        drawGrid();         
        drawPicker();
    }
    return -1;
}

function onKeypress(event)
{    
    if ((cellSelected > -1)&&(currentPage == "gameGrid"))
    {
        var numberPressed = getNumberKey(event);
    
        if (!noteMode && !pickerMode)        //If this is a number selection
        {            
            game.setValue(cellSelected, numberPressed);            
                   
            drawGrid();
            drawPicker();        
        }
        else if (numberPressed > 0)         //If this is a note
        {            
            game.cells[cellSelected].possible[numberPressed-1].selected = !game.cells[cellSelected].possible[numberPressed-1].selected;
            drawGrid();         
            drawPicker();       
        }
        else if (numberPressed === 0)
        {
            game.setValue(cellSelected, 0);
            drawGrid();         
            drawPicker();   
        }        
    }         
    if (event.which === 72)
    {
        if(helpDialog.shown)
           helpDialog.hide();
        else
           helpDialog.show();
    }
}

function onMouseDown(event) {
    if(currentPage != "gameGrid")
        return;

    mouseTimeout = setTimeout(function () {
        event.isPressAndHold = true;
        onMouseUp(event);
        ignoreMouseUp = true;
    }, 200);
}

function onMouseUp(event) {
    if(currentPage != "gameGrid")
        return;

    clearTimeout(mouseTimeout);

    if (ignoreMouseUp) {
        ignoreMouseUp = false;
        return;
    }

    // calculate the board dimensions
   
    var xBmin = boardOffset; 
    var yBmin = (screenHeight - boardWidth) / 2;
    var xBmax = xBmin + boardWidth;
    var yBmax = yBmin + boardWidth;

    // if this touch happened on the board
    if((event.offsetX >= xBmin)&&(event.offsetX <= xBmax)&&
       (event.offsetY >= yBmin)&&(event.offsetY <= yBmax))
    {
        if(!(cellSelected < 0))
            cellSelected = -1;    
        
        selectCell(event);
        if(game.cells[cellSelected].fixed)
        {
            cellSelected = -1;    
            return;
        }
        
        if (!noteMode)
        {
            //If all options are shown, disable notes mode
            if (option_showpossible == 0)            
                pickerMode = event.isPressAndHold ? 1 : 0;
            else
                pickerMode = 0;
        }

        drawGrid();
        drawPicker(event);

    }
    else if ((event.offsetX >= xNumberPick) && (event.offsetX <= (xNumberPick + npWidth)) &&
            (event.offsetY >= yNumberPick)&&(event.offsetY <= yNumberPick + ((npWidth * 9))) )
    { 
        if(cellSelected >= 0)
            handlePicker(event);            
    }
    else
    {
        topContext.clearRect(0, 0, topContext.canvas.width, topContext.canvas.height);
        cellSelected = -1;
        drawGrid();
    }
}

function imageLoader(sources){

    var imagesLoaded = 0;
    var imagesToLoad = 0;

    // get num of sources
    for (var src in sources) {
        imagesToLoad++;
    }

    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
               if (++imagesLoaded === imagesToLoad)
               {    
                   updateTheme();
                $(window).trigger("imagesLoaded");
            }
        };
        images[src].src = sources[src];
    }    
}

function drawPage(){
    switch (currentPage) {
        case "mainMenu" :
            drawMainMenu();
            break;
        case "gameGrid" :
            drawGrid();
            break;
        case "newGameMenu" :
            drawGrid();
            drawStartNewGameMenu();
        default :
            break;
    }
}

function loadText() {
    
    easyDiff = chrome.i18n.getMessage("easy");
    normalDiff = chrome.i18n.getMessage("normal");
    hardDiff = chrome.i18n.getMessage("hard");
    difficulty = easyDiff;
    aboutText = chrome.i18n.getMessage("about");
    $("#newGameButton").text(chrome.i18n.getMessage("newGame"));
    $("#resumeGameButton").text(chrome.i18n.getMessage("resumeGame"));
    $("#aboutButton").text(chrome.i18n.getMessage("about")); 
    $("#help_contents").html(chrome.i18n.getMessage("aboutGameText"));    
    $("#easyGameButton").text(chrome.i18n.getMessage("easy"));
    $("#normalGameButton").text(chrome.i18n.getMessage("normal"));
    $("#hardGameButton").text(chrome.i18n.getMessage("hard"));
    $("#viewHintButton").text(chrome.i18n.getMessage("viewHint"));
    $("#writeNoteButton").text(chrome.i18n.getMessage("writeNotes"));
    $("#helpButton").text(chrome.i18n.getMessage("help"));
    $("#startNewGameButton").text(chrome.i18n.getMessage("newGame"));
    $("#startGameButton").text(chrome.i18n.getMessage("start"));
    $("#chooseThemeText").text(chrome.i18n.getMessage("chooseTheme"));
    $("#win_contents1").html(chrome.i18n.getMessage("youWin"));
    $("#win_contents2").html(chrome.i18n.getMessage("gameOverText"));
}

function init() {
    if (window.chrome&&window.chrome.i18n)
        loadText();

    currentTheme = localStorage.getItem("theme");

    if (!currentTheme)
    {  
       currentTheme = "Manila";
       localStorage.setItem("theme", currentTheme);
    }        

    var sources = {
        mainMenuBG: "images/global/bg_title.png",
        playMenu: "images/global/bg_playmenu.png",
        manilaLogo: "images/Manila/logo_manilatheme.png",
        nancyLogo: "images/Nancy/logo_nancytheme.png",
        arigatoLogo: "images/Arigato/logo_arigatotheme.png",
        nancyThemeIconOn: "images/global/btn_nancytheme_on.png",
        manilaThemeIconOn: "images/global/btn_manilatheme_on.png",
        arigatoThemeIconOn: "images/global/btn_arigatotheme_on.png",
        nancyThemeIconOff: "images/global/btn_nancytheme_off.png",
        manilaThemeIconOff: "images/global/btn_manilatheme_off.png",
        arigatoThemeIconOff: "images/global/btn_arigatotheme_off.png",
        closeButton: "images/global/img_closearrow.png",
        manilaSquareSelector: "images/Manila/img_squareselector.png",
        nancySquareSelector: "images/Nancy/img_choosenum.png",
        nancySquareSelectorGreen: "images/Nancy/img_choosenumgreen.png",
        arigatoSquareSelector: "images/Arigato/img_squareselector.png"
        }
        
    imageLoader(sources);
    
    $("#fontLoader").hide();
  
    bottomCanvas = document.getElementById("bottomcanvas");
    highlightCanvas = document.getElementById("highlightcanvas");
    boardCanvas = document.getElementById("gridcanvas");
    topCanvas = document.getElementById("topcanvas");
    mainMenuCanvas = document.getElementById("mainMenuCanvas");
    startGameCanvas = document.getElementById("startNewGameCanvas");

    if (!boardCanvas.getContext('2d') || !topCanvas.getContext('2d'))
    {
        errorOccured("Couldn't retrieve context from canvas");
        return;
    }
    bottomContext = bottomCanvas.getContext('2d');
    highlightContext = highlightCanvas.getContext('2d');
    boardContext = boardCanvas.getContext('2d');
    topContext = topCanvas.getContext('2d');
    mainMenuContext = mainMenuCanvas.getContext('2d');
    startGameContext = startGameCanvas.getContext('2d');

    $(window).bind('resize', drawPage);        
    $(window).bind('imagesLoaded', drawPage);

    topCanvas.addEventListener('mousedown', onMouseDown);
    topCanvas.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeypress);
}

function game_restart(d) {
    $("#licensebtnl").hide();
    localStorage.setItem("hasData", "true");
    Sounds.newgame.play();
    game = new NumberPlaceGame(d);
    localStorage.setItem("nucells", JSON.stringify(game.cells));
    noteMode = false;
    gameFinished = false;
    blockDialogRedraw = false;
    timer = 0;
    pausedSeconds = 0;
    timerPause = undefined;
    drawGrid();    
    game.ready = true;
}

function updateTheme()
{
    switch(currentTheme) {
        case "Manila":
            Sounds.newgame = Sounds.newgames[2];
            Sounds.youwin = Sounds.youwins[2];
            fixedNumberColor = "green";
            gameMenuBarColor = "#e6e8e7";
            logoImage = images.manilaLogo;
            squareSelector = images.manilaSquareSelector;
            buttonFont = "bold 40px Arial";
            numberFont = "sans-serif";
            boardBGColor1 = "rgba(200, 200, 200, 1)";
            boardBGColor2 = "rgba(255, 255, 255, 1)";
            gridColor = "rgba(0, 0, 0, 1)";
            highlightColor = "rgba(253, 243, 216, 0.5)";
            standardTextColor = "black";
            buttonSelectedColor = "rgba(0, 200, 200, 1)";
            keypadSelectedColor = "rgba(0, 200, 200, 1)";
            break;
        case "Nancy":
            Sounds.newgame = Sounds.newgames[1];
            Sounds.youwin = Sounds.youwins[1];
            fixedNumberColor = "#00ffff";
            gameMenuBarColor = "#4444ff";
            logoImage = images.nancyLogo;
            squareSelector = images.nancySquareSelector;
            buttonFont = "bold 40px Nancy";
            numberFont = "Nancy";
            boardBGColor1 = "rgba(0, 0, 0, 1)";
            boardBGColor2 = "rgba(50, 50, 50, 1)";
            smallGridColor = "gray";
            gridColor = "black";
            highlightColor = "rgba( 160, 160, 160, .5)"; 
            standardTextColor = "white";
            buttonSelectedColor = "rgba(0, 200, 1, 1)";
            keypadSelectedColor = "rgba(200, 0, 200, 1)";
            break;
        case "Arigato":
            Sounds.newgame = Sounds.newgames[0];
            Sounds.youwin = Sounds.youwins[0];
            fixedNumberColor = "purple";
            gameMenuBarColor = "rgba( 245, 243, 222, 1)";
            logoImage = images.arigatoLogo;
            squareSelector = images.arigatoSquareSelector;
            buttonFont = "bold 40px Arigato";
            numberFont = "Arigato";
            boardBGColor1 = "rgba( 144, 212, 213, 1)";
            boardBGColor2 = "rgba( 245, 243, 222, 1)"; 
            highlightColor = "rgba( 249, 175, 150, .5)"; 
            gridColor = "rgba(0, 0, 0, 1)";
            standardTextColor = "black";
            buttonSelectedColor = "rgba( 249, 175, 150, 1)";
            keypadSelectedColor = "rgba(0, 200, 100, 1)";
            break;
    }
    $(".ui-dialog-title").css({"font-family": currentTheme});
    $(".ui-dialog-content").css({"font-family": currentTheme});
}

window.addEventListener('load', function () {
    license_init("license", "primary");
    Sounds.newgames = [];
    Sounds.newgames[0] = new GameSound("audio/Arigato_NewGame.ogg");
    Sounds.newgames[1] = new GameSound("audio/Electra_NewGame.ogg");
    Sounds.newgames[2] = new GameSound("audio/Manila_NewGame.ogg");
    Sounds.newgame = Sounds.newgames[0];
    Sounds.youwins = [];
    Sounds.youwins[0] = new GameSound("audio/Arigato_YouWin.ogg");
    Sounds.youwins[1] = new GameSound("audio/Electra_YouWin.ogg");
    Sounds.youwins[2] = new GameSound("audio/Manila_YouWin.ogg");
    Sounds.youwin = Sounds.youwins[0];
    Sounds.difficulty = new GameSound("audio/NavChange_Difficulty.ogg");
    Sounds.rowsuccess = new GameSound("audio/Resume.ogg");
    Sounds.menu = new GameSound("audio/Pause.ogg");
    Sounds.button = new GameSound("audio/GeneralButtonSelect.ogg");

    helpDialog = new infodialog("help_dialog");
    winDialog = new infodialog("win_dialog", function() {
        blockDialogRedraw = true;
        drawStartNewGameMenu();
    });

    $(".button").css({"-webkit-box-shadow": glossyButton, "background-image": standardButtonGradiant});
    $("#writeNoteButton").css({"-webkit-box-shadow": glossyButton, "background-image": standardButtonGradiant});    

    $('#easyButton').click(function () {
        game_restart("easy");
    });
    $('#mediumButton').click(function () {
        game_restart("medium");
    });
    $('#hardButton').click(function () {
        game_restart("hard");
    });
    
    $('#mainMenuCanvas').click(function(e) {

        var clearScreen = false;
        
        if ( e.offsetX >= playMenuLeftEdge && e.offsetX <= playMenuLeftEdge + playMenuWidth )
        {
            if ( !(e.offsetY >= playMenuTop && e.offsetY <= playMenuTop + playMenuHeight))
            {                
                clearScreen = true;            
            }
        }
        else
        {                
            clearScreen = true;    
        }
        
        if (clearScreen)
        {
            $("#easyGameButton").css({"visibility": "hidden"});
            $("#normalGameButton").css({"visibility": "hidden"});
            $("#hardGameButton").css({"visibility": "hidden"});
                        
            playMenuVisible = false;
            drawMainMenu();
        }
    });
            

    $('#newGameButton').click( function(){                        
        Sounds.button.play();
        drawPlayBar();
        $("#gameLevelButtons").show();    
        playMenuVisible = true;    
    });    

    $('#resumeGameButton').click( function(){    
        Sounds.button.play();
        currentTheme = localStorage.getItem("theme");
        updateTheme();
    
    if (localStorage.getItem("hasData") === "true")
    {
        game = new NumberPlaceGame("easy");
        game.cells = JSON.parse(localStorage.getItem("cells") );
        
        game.prevvalidrow = JSON.parse(localStorage.getItem("prevvalidrow") );
        game.prevvalidcol = JSON.parse(localStorage.getItem("prevvalidcol") );
        game.prevvalidsub = JSON.parse(localStorage.getItem("prevvalidsub") );

        difficulty = localStorage.getItem("difficulty");
        if(difficulty == easyDiff)
            option_flaginvalid = 1;
        else
            option_flaginvalid = 0;

        timer = parseFloat(localStorage.getItem("timer"));
        pausedSeconds = parseFloat(localStorage.getItem("pausedSeconds"));
        timerBegin = parseFloat(localStorage.getItem("timerBegin"));
        timerPause = parseFloat(localStorage.getItem("timerPause"));
        timerResume = parseFloat(localStorage.getItem("timerResume"));
        
        if (!timerPause)
            timerPause = timerResume;
            
        currentTheme = localStorage.getItem("theme");
        updateTheme();
        
        game.ready = true;
       
        $("#mainMenuCanvas").hide();
        $("#mainMenuButtons").hide();
        $("#startNewGameCanvas").css("z-index", "1"); 
        $("#startNewGameCanvas").hide();         
        $("#gameLevelButtons").hide();
        $("#newGameThemeButtons").hide();
        $("#inGameButtons").show();
            
        game.checkValidGrid();
        $("#licensebtnl").hide();
        drawGrid();
    }

    });    
    
    $('#aboutButton').click( function(){    
        Sounds.button.play();
        helpDialog.show();
        return false;
    });
        
    $(".button").mousedown( function() {
        $(this).css("background-color",buttonSelectedColor);
    });
    
    $(".button").mouseup( function() {
        $(this).css("background-color",standardButtonColor);    
    });
    
    $(".button").mouseleave( function() {
        if (currentPage != "newGameMenu")
            $(this).css("background-color",standardButtonColor);
    });
    
    $(".gameButton").click( function(){
    
        if (currentPage == "mainMenu")
        {
            $("#mainMenuCanvas").hide(); 
            $("#mainMenuButtons").hide();
            $("#gameLevelButtons").hide();        
            $("#gameLevelButtons").hide();
            $("#newGameThemeButtons").hide();
            $("#inGameButtons").show();                
        }

        switch (this.id)
        {
            case "easyGameButton":
                difficulty = easyDiff;
                if (currentPage == "mainMenu")
                {
                    localStorage.setItem("difficulty", difficulty);
                    option_flaginvalid = 1;
                    game_restart("easy");                    
                }
                else
                {
                    Sounds.menu.play();
                    $(this).css("background-color",buttonSelectedColor);
                    $("#normalGameButton").css("background-color",standardButtonColor);
                    $("#hardGameButton").css("background-color",standardButtonColor);                
                }                
                break;
            case "normalGameButton":
                difficulty = normalDiff;
                if (currentPage == "mainMenu")
                {
                    localStorage.setItem("difficulty", difficulty);
                    option_flaginvalid = 0;
                    game_restart("medium");
                }
                else
                {
                    Sounds.menu.play();
                    $(this).css("background-color",buttonSelectedColor);
                    $("#easyGameButton").css("background-color",standardButtonColor);
                    $("#hardGameButton").css("background-color",standardButtonColor);                
                }
                break;
            case "hardGameButton":
                difficulty = hardDiff;
                if(currentPage == "mainMenu")
                {
                    localStorage.setItem("difficulty", difficulty);
                    option_flaginvalid = 0;
                    game_restart("hard");
                }
                else
                {
                    Sounds.menu.play();
                    $(this).css("background-color",buttonSelectedColor);
                    $("#easyGameButton").css("background-color",standardButtonColor);
                    $("#normalGameButton").css("background-color",standardButtonColor);        
                }
                break;
            default:
                Sounds.button.play();
                break;                
        }        
    });

    $("#viewHintButton").click( function(){
        if(cellSelected > -1)
        {
            Sounds.button.play();
            var noNotes = true;
            
            for (i = 0; i < 9; i++)
            {    
                //Only hint numbers the user has already selected
                if (game.cells[cellSelected].possible[i].selected && !game.cells[cellSelected].possible[i].hinted)
                {
                    game.cells[cellSelected].possible[i].hinted = true;
                    noNotes = false;
                }
            }
            
            if (noNotes)
            {
                for (i = 0; i < 9; i++)
                {                    
                    if (!game.cells[cellSelected].possible[i].hinted)
                    {
                        if (game.checkPossible(cellSelected, i+1))
                        {    //Give one hint per click                        
                            game.cells[cellSelected].possible[i].selected = true;
                            game.cells[cellSelected].possible[i].hinted = true;
                            break;
                        }
                    }                            
                }
            }
        }
        drawBoard();
        drawPicker();
    });

    $("#writeNoteButton").click( function(){
        Sounds.button.play();
        if (option_showpossible != 1)
        {
            noteMode = !noteMode;        
            
            if (noteMode)
            {
                $(this).css({"background-color":buttonSelectedColor, "color": "white" });
                pickerMode = 1;
            }
            else
            {
                $(this).css({"background-color":standardButtonColor, "color": "black"});
                pickerMode = 0;
            }    
            drawGrid();
            drawPicker();
        }
    });

    $("#helpButton").click( function(){
        Sounds.button.play();
        helpDialog.show();
        return false;
    });
    
    $("#startNewGameButton").click( function(){
        Sounds.button.play();
        drawStartNewGameMenu();
    });
    
    $("#nancyThemeIcon").click(
          
      function(){
          if (currentTheme != "Nancy")
          {
            Sounds.difficulty.play();
            $(this).attr("src", "images/global/btn_nancytheme_on.png");              
            currentTheme = "Nancy";
            localStorage.setItem("theme", currentTheme);
            $("#manilaThemeIcon").attr("src", "images/global/btn_manilatheme_off.png");
            $("#arigatoThemeIcon").attr("src", "images/global/btn_arigatotheme_off.png");
            updateTheme();
        }        
      }        
      
    );
    
    $("#manilaThemeIcon").click(
          
      function(){
          if (currentTheme != "Manila")
          { 
            Sounds.difficulty.play();
              $(this).attr("src", "images/global/btn_manilatheme_on.png"); 
              currentTheme = "Manila";
              localStorage.setItem("theme", currentTheme);
            $("#nancyThemeIcon").attr("src", "images/global/btn_nancytheme_off.png");
            $("#arigatoThemeIcon").attr("src", "images/global/btn_arigatotheme_off.png");
            updateTheme();
        }
      }
      
    );
    
    $("#arigatoThemeIcon").click(
          
      function(){ 
          if (currentTheme != "Arigato")
          {
            Sounds.difficulty.play();
              $(this).attr("src", "images/global/btn_arigatotheme_on.png"); 
              currentTheme = "Arigato";
              localStorage.setItem("theme", currentTheme);
            $("#manilaThemeIcon").attr("src", "images/global/btn_manilatheme_off.png");
            $("#nancyThemeIcon").attr("src", "images/global/btn_nancytheme_off.png");
            updateTheme();
        }
      }
      
    );
    
    $("#closeButton").click(
        function(){ 
            Sounds.button.play();
            if (!gameFinished)        
            {
                $("#startNewGameCanvas").css("z-index", "1"); 
                $("#startNewGameCanvas").hide();         
                $("#gameLevelButtons").hide();
                $("#newGameThemeButtons").hide();
                $("#inGameButtons").show();                
                drawGrid();
            }
        }
    );
            
    $("#startGameButton").click( function(){
        Sounds.button.play();
        localStorage.setItem("difficulty", difficulty);
        localStorage.setItem("theme", currentTheme);            
        updateTheme();
        
        $("#startNewGameCanvas").css("z-index", "1"); 
        $("#startNewGameCanvas").hide();         
        $("#gameLevelButtons").hide();
        $("#newGameThemeButtons").hide();
        $("#inGameButtons").show();
        
        switch(difficulty){
            case easyDiff :
                option_flaginvalid = 1;
                game_restart("easy");
                break;
            case normalDiff :
                option_flaginvalid = 0;
                game_restart("medium");
                break;
            case hardDiff :
                option_flaginvalid = 0;
                game_restart("hard");
                break;
            default:
                break;
        }
    });

    init();
    window.ontouchstart = function (e) {};
    window.ontouchmove = function (e) {};
    window.ontouchend = function (e) {};
});
