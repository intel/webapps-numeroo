/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/*--------------------------------------------
 js class for an infodialog, id is the id of
 the dialog as defined in html, and arg is
 an optional callback to trigger on dialog
--------------------------------------------*/
function infodialog(id, arg) {
    var self = this;
    self.id = id;
    self.shown = false;
    self.dialog = document.getElementById(self.id);
    self.hideclass = self.dialog.className;
    self.showclass = self.dialog.className+" shown";
    self.exitCB = arg;

    self.show = function show() {
        self.shown = true;
        self.dialog.className = self.showclass;
    };
    self.hide = function hide() {
        self.shown = false;
        self.dialog.className = self.hideclass;
    };

    $("#"+id+" .close").click(function () {
        self.hide();
        if(self.exitCB)
            self.exitCB();
    });
}
