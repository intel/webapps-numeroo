/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function RectAnimator(context, x, y, w, h) {
    this.stamp = game.stamp;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.percent = 0;
    this.timer = null;
    this.context = context;
    this.time = 0;
}

RectAnimator.prototype.frame = function() {
    /* if the game changed, stop animating */
    if(this.stamp != game.stamp)
    {
        clearInterval(this.timer);
        return;
    }

    var aw = this.w * this.percent;
    var ah = this.h * this.percent;
    var ax = this.x + (this.w/2) - (aw/2);
    var ay = this.y + (this.h/2) - (ah/2);
    var r = 0;
    var g = (255 * this.percent)|0;
    var b = 255 - ((155 * this.percent)|0);

    this.context.fillStyle = "rgba(" + r.toString() + ", " + g.toString() + ", " + b.toString() + ", 0.3)";
    this.context.clearRect(ax, ay, aw, ah);
    this.context.fillRect(ax, ay, aw, ah);

    if(this.percent >= 1.0)
    {
        clearInterval(this.timer);
        return;
    }

    var t1 = (new Date()).getTime();
    var t0 = this.time;
    var dT = (t0 == 0)?20:(t1-t0);
    this.percent += (dT*(0.0025));
    this.time = t1;

    if(this.percent > 1.0)
        this.percent = 1.0;
}

RectAnimator.prototype.run = function() {
    var t = this;
    this.timer = setInterval(function(){t.frame();}, 20);
}

function animateRect(context, x, y, w, h) {
    var anim = new RectAnimator(context, x, y, w, h);
    anim.run();
}

function drawRect(context, x, y, w, h) {
    context.fillStyle = "rgba(0, 255, 100, 0.3)";
    context.clearRect(x, y, w, h);
    context.fillRect(x, y, w, h);
}
