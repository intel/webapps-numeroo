/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// check to see if the value is possible in this cell
NumberPlaceGame.prototype.checkPossible = function(idx, val) {

    var i, j;
    // first index in this cell's row
    var rowidx = ((idx / 9)|0)*9;
    // index of this cell's column in the first row
    var colidx = (idx % 9)|0;
    // first index of this cell's 3x3 subgrid
    var subidx = (((rowidx / 27)|0)*27) + (((colidx / 3)|0)*3);

    // check the row
    for(i = rowidx; i < (rowidx+9); i++)
        if(i != idx && this.cells[i].value == val)
            return false;
            
    // check the column
    for(i = colidx; i < 81; i+=9)
        if(i != idx && this.cells[i].value == val)
            return false;
            
    // check the 3x3 subgrid
    for(j = subidx; j < subidx+27; j+=9)
        for(i = j; i < j+3; i++)
            if(i != idx && this.cells[i].value == val)
                return false;

    return true;
}

// check to see if a cell's value is legal
NumberPlaceGame.prototype.checkValidCell = function(idx) {

    if(this.cells[idx].value == 0)
        return true;

    var i, j;
    // first index in this cell's row
    var rowidx = ((idx / 9)|0)*9;
    // index of this cell's column in the first row
    var colidx = (idx % 9)|0;
    // first index of this cell's 3x3 subgrid
    var subidx = (((rowidx / 27)|0)*27) + (((colidx / 3)|0)*3);
    
    // check the row
    for(i = rowidx; i < (rowidx+9); i++)
        if(i != idx && this.cells[i].value == this.cells[idx].value)
            return false;
            
    // check the column
    for(i = colidx; i < 81; i+=9)
        if(i != idx && this.cells[i].value == this.cells[idx].value)
            return false;
            
    // check the 3x3 subgrid
    for(j = subidx; j < subidx+27; j+=9)
        for(i = j; i < j+3; i++)
            if(i != idx && this.cells[i].value == this.cells[idx].value)
                return false;

    return true;
}

NumberPlaceGame.prototype.isValidGroup = function(a, b, c, d, e, f, g, h, i) {

    var checklist = [];
    var j;
    if((option_flaginvalid == 1)&&
       ((!a.valid)||(!b.valid)||(!c.valid)||(!d.valid)||(!e.valid)||
        (!f.valid)||(!g.valid)||(!h.valid)||(!i.valid)))
        return false;

    for(j = 0; j < 10; j++)
        checklist[j] = false;
    
    checklist[a.value] = true;
    checklist[b.value] = true;
    checklist[c.value] = true;
    checklist[d.value] = true;
    checklist[e.value] = true;
    checklist[f.value] = true;
    checklist[g.value] = true;
    checklist[h.value] = true;
    checklist[i.value] = true;

    // need numbers 1 through 9    
    for(j = 1; j <= 9; j++)
        if(!checklist[j])
            return false;

    return true;
}

// test all cell values and determine which rows, cols, and 3x3 subgrids are valid
NumberPlaceGame.prototype.checkValidGrid = function() {

    var i;            
    for(i = 0; i < 9; i++)
    {    
        // check the rows
        this.validrow[i] = this.isValidGroup(
            this.cells[(i*9)+0], this.cells[(i*9)+1], this.cells[(i*9)+2], 
            this.cells[(i*9)+3], this.cells[(i*9)+4], this.cells[(i*9)+5], 
            this.cells[(i*9)+6], this.cells[(i*9)+7], this.cells[(i*9)+8]);

        // check the columns
        this.validcol[i] = this.isValidGroup(
            this.cells[i+0], this.cells[i+9], this.cells[i+18], 
            this.cells[i+27], this.cells[i+36], this.cells[i+45], 
            this.cells[i+54], this.cells[i+63], this.cells[i+72]);

        // check the 3x3 subgrids
        this.validsub[i] = this.isValidGroup(
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 0], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 1], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 2], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 9], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 10], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 11], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 18], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 19], 
            this.cells[(((i/3)|0)*27) + ((i%3)*3) + 20]);
    }
}

// test all cell values and determine which rows, cols, and 3x3 subgrids are valid
NumberPlaceGame.prototype.checkComplete = function() {

    var i, victorycounter = 0;
    for(i = 0; i < 9; i++)
    {
        if(this.validrow[i])
        {
            victorycounter++;
        }
        if(this.validcol[i])
        {
            victorycounter++;
        }
        if(this.validsub[i])
        {
            victorycounter++;
        }
    }

    if(victorycounter >= 27)
        gamecomplete = true;
    else
        gamecomplete = false;
}

NumberPlaceGame.prototype.setValue = function(idx, value) {
    if (idx > -1 && value > -1)
    {
            if(this.cells[idx].fixed)
                return;

            this.cells[idx].value = value;
            this.cells[idx].valid = this.checkValidCell(idx);
            this.checkValidGrid();
    }
}

NumberPlaceGame.prototype.randomPuzzle = function(difficulty) {
    var self = this;
    var file = "data/"+difficulty;
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.onload = function(e) {
        var requestStr = this.responseText.split("\n");
        var line = (Math.random() * (requestStr.length - 1))|0;
        self.puzzle = requestStr[line].split(" ");
    }
    request.send();
}

function NumberPlaceGame(difficulty) {

    this.stamp = (new Date()).getTime();
    this.cells = [];
    this.validrow = [];
    this.validcol = [];
    this.validsub = [];
    this.prevvalidrow = [];
    this.prevvalidcol = [];
    this.prevvalidsub = [];
    this.ready = false;
    gamecomplete = false;

    this.randomPuzzle(difficulty);

    var i;
    // all values start out empty
    for(i = 0; i < 81; i++)
        this.cells[i] = new NumberPlaceCell();

    // grid starts out invalid
    for(i = 0; i < 9; i++)
    {
        this.validrow[i] = false;
        this.validcol[i] = false;
        this.validsub[i] = false;
        this.prevvalidrow[i] = false;
        this.prevvalidcol[i] = false;
        this.prevvalidsub[i] = false;
    }
    
    // generate a new grid
    for(i = 0; i < 81; i++)
    {
        var v = parseInt(this.puzzle[i]);
        this.cells[i].value = v;
        if(v > 0)
            this.cells[i].fixed = true;
        else
            this.cells[i].fixed = false;
    }
    this.checkValidGrid();
}

function PossibleCell() {
    this.selected = false;
    this.hinted = false;
}

function NumberPlaceCell() {
    this.value = 0;
    this.fixed = false;
    this.valid = true;
    this.possible = [];
    for(var i = 0; i < 9; i++)
        this.possible[i] = new PossibleCell();
}
