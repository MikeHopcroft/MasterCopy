// The MIT License (MIT)
// 
// Copyright (c) 2015 Michael Hopcroft
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// Array of Images that have been loaded.
var images = [];

// The index into images of the Image currently being displayed.
// Equal to -1 when images is empty.
var currentImage = -1;

// Div that displays application instructions when there are no images loaded.
var instructions = null;

// Empty div used for "Toggle white stage" functionality.
var blank = null;

// Div containing all drag handles.
var handlesDiv = null;

// Corner drag handles.
var handleUL = null;
var handleUR = null;
var handleLR = null;
var handleLL = null;

// Drag handles for translate, rotate, and scale.
var handleTranslate = null;
var handleRotateAndScale = null;

// Top-level element to which CSS transform is applied.
var stage = null;

// Holds the overlay image used for demo mode.
var overlay = null;

// User interface for loading image files. Normally hidden.
var imageSelector = null;

// clientX and clientY values from last mousemove event.
// Used to detect mouse moves in order to restore drag
// handle visibility.
var lastX = null;
var lastY = null;


///////////////////////////////////////////////////////////////////////////////
//
// Handle implements generic drag handle functionality.
//
///////////////////////////////////////////////////////////////////////////////
function Handle(element, x, y) {
    var handle = {
        element: element,
        centerX: element.offsetWidth / 2,
        centerY : element.offsetHeight / 2,

        dest: new Point(x, y),
        newDest: new Point(x, y),

        mousedownListener: null,
        mousemoveListener: null,
        mouseupListener: null,


        PositionElement: function () {
            // TODO: Remove this coupling with styles.
            this.element.style.left = (this.dest.x - this.centerX) + "px";
            this.element.style.top = (this.dest.y - this.centerY) + "px";
        },


        MouseDown: function (event) {
            if (event.ctrlKey) {
                this.SetCtrlMode(true);
            }
            // (deltaX, deltaY) has position of mouse down relative to center of element.
            this.deltaX = event.pageX - this.element.offsetLeft - this.centerX;
            this.deltaY = event.pageY - this.element.offsetTop - this.centerY;

            handleUL.TransformStart();
            handleUR.TransformStart();
            handleLR.TransformStart();
            handleLL.TransformStart();
            handleTranslate.TransformStart();
            handleRotateAndScale.TransformStart();

            window.addEventListener('mouseup', this.mouseupListener);
            window.addEventListener('mousemove', this.mousemoveListener);

            event.preventDefault();     // Disable selection.
            this.MouseMove(event);
        },


        MouseMove: function (event) {
            this.MoveTo(event.pageX - this.deltaX,
                        event.pageY - this.deltaY)
        },


        MouseUp: function (event) {
            window.removeEventListener('mouseup', this.mouseupListener);
            window.removeEventListener('mousemove', this.mousemoveListener);
            this.SetCtrlMode(false);
        },


        TransformStart: function() {
            this.transformStart = this.dest;
        },


        Transform: function (M) {
            var v = [this.transformStart.x, this.transformStart.y, 1];
            var n = MatrixVector3(M, v);

            this.dest = new Point(n[0], n[1]);

            // TODO: Remove this coupling with styles.
            this.element.style.left = (n[0] - this.centerX) + "px";
            this.element.style.top = (n[1] - this.centerY) + "px";
            UpdateStageTransform();
        },


        SetCtrlMode: function(mode)
        {
            // Default behavior is to do nothing.
        },


        Initialize : function () {
            this.mousedownListener = this.MouseDown.bind(this),
            this.mousemoveListener = this.MouseMove.bind(this),
            this.mouseupListener = this.MouseUp.bind(this),

            this.element.addEventListener("mousedown", this.mousedownListener);
        },
    };

    handle.Initialize();
    return handle;
}


///////////////////////////////////////////////////////////////////////////////
//
// CornerHandle
//
///////////////////////////////////////////////////////////////////////////////
function CornerHandle(element, x, y) {
    var handle = new Handle(element, x, y);
    handle.source = new Point(x, y);
    handle.newSource = new Point(x, y);
    handle.ctrlMode = false;

    handle.MoveTo = function (x, y) {
        if (this.ctrlMode) {
            var H = BackProject(handleUL, handleUR, handleLR, handleLL);
            var b = MatrixVector4(H, [x, y, 0, 1]);
            this.newSource = new Point(b[0] / b[3], b[1] / b[3]);
            this.newDest = new Point(x, y);

            // TODO: Remove this coupling with styles.
            this.element.style.left = (x - this.centerX) + "px";
            this.element.style.top = (y - this.centerY) + "px";
        }
        else {
            this.dest = new Point(x, y);

            // TODO: Remove this coupling with styles.
            this.element.style.left = (x - this.centerX) + "px";
            this.element.style.top = (y - this.centerY) + "px";
            UpdateStageTransform();
        }
    };


    handle.SetCtrlMode = function (mode) {
        if (this.ctrlMode != mode) {
            this.ctrlMode = mode;

            if (mode) {
                // TODO: Remove this coupling with styles.
                this.element.style.backgroundColor = "red";
                this.newSource = this.source;
                this.newDest = this.dest;
            }
            else {
                // TODO: Remove this coupling with styles.
                this.element.style.backgroundColor = "aquamarine";
                this.dest = this.newDest;
                this.source = this.newSource;
                UpdateStageTransform();
            }
        }
    };


    return handle;
}


///////////////////////////////////////////////////////////////////////////////
//
// TranslateHandle
//
///////////////////////////////////////////////////////////////////////////////
function TranslateHandle(element, x, y) {
    var handle = new Handle(element, x, y);
    handle.PositionElement();

    handle.MoveTo = function (x, y) {
        var dx = x - this.transformStart.x;
        var dy = y - this.transformStart.y;
        var T = [
            1, 0, dx,
            0, 1, dy,
            0, 0, 1
        ];

        // Transform all four handles.
        handleUL.Transform(T);
        handleUR.Transform(T);
        handleLR.Transform(T);
        handleLL.Transform(T);
    };

    return handle;
}


///////////////////////////////////////////////////////////////////////////////
//
// ScaleHandle
//
///////////////////////////////////////////////////////////////////////////////
function ScaleHandle(element, x, y) {
    var handle = new Handle(element, x, y);
    handle.PositionElement();

    handle.MoveTo = function (x, y) {
        var x1 = this.transformStart.x;
        var y1 = this.transformStart.y;
        var x2 = x - this.element.offsetLeft - this.centerX + this.deltaX;
        var y2 = y - this.element.offsetTop - this.centerY + this.deltaY;

        // http://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d
        var s1 = Math.sqrt(x1 * x1 + y1 * y1);
        var s2 = Math.sqrt(x2 * x2 + y2 * y2);
        var cos = (x1 * x2 + y1 * y2) / s1 / s1;    // cos scaled by s2/s1.
        var sin = (x1 * y2 - x2 * y1) / s1 / s2;

        // First transform translates center of window to origin.
        var center = Math.min(window.innerWidth, window.innerHeight) / 2;
        var T1 = [
            1, 0, -center,
            0, 1, -center,
            0, 0, 1
        ];

        // Second transform rotates.
        var R = [
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        ];

        // Third transform translates origin back to center of window.
        var T2 = [
            1, 0, center,
            0, 1, center,
            0, 0, 1
        ];

        var T = MatrixMatrix3(MatrixMatrix3(T2, R), T1);

        // Transform all four handles.
        handleUL.Transform(T);
        handleUR.Transform(T);
        handleLR.Transform(T);
        handleLL.Transform(T);
    };

    handle.TransformStart = function (p) {
        this.transformStart = new Point(this.deltaX, this.deltaY);
    }

    return handle;
}


///////////////////////////////////////////////////////////////////////////////
//
// Event handlers.
//
///////////////////////////////////////////////////////////////////////////////


// Prevent scrolling of browser window.
function KeyDown(event) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
}


function KeyUp(event) {
    RestoreHandleVisibility();
    if (event.keyCode == 39) {
        // Right arrow. Advance to next image.
        NextImage();
    }
    else if (event.keyCode == 37) {
        // Left arrow. Display previous image.
        PreviousImage();
    }
    else if (event.keyCode == 46) {
        // Delete. Unload image.
        UnloadCurrentImage();
    }
    else if (event.keyCode == 76) {
        // L key for Load
        OpenImageSelector();
    }
    else if (event.keyCode == 82) {
        // R for rotate.
        Rotate();
    }
    else if (event.keyCode == 87) {
        // W for white stage.
        ToggleFlashlight("white");
    }
    else if (event.keyCode == 66) {
        // B for black stage.
        ToggleFlashlight("black");
    }
    else if (event.keyCode == 32) {
        // Exit flashlight mode.
        ToggleFlashlight("");
    }
    else if (event.keyCode == 88) {
        // X for reset transformation.
        ResetTransformation();
    }
    else if (event.keyCode == 68) {
        // D toggles demo mode.
        ToggleDemoMode(); 
    }
    //else {
    //    window.alert("char = " + event.char + ", " + event.keyCode)
    //}
}


// Prevent selection.
function MouseDown(event) {
    event.preventDefault();
}


function MouseMove(event) {
    // Lots of things other than an actual user mouse move
    // can trigger this event. Compare current position with
    // previous position to see if mouse really moved.
    if (lastX != event.clientX || lastY != event.clientY)
    {
        if (lastX != null && lastY != null) {
            RestoreHandleVisibility();
        }
        lastX = event.clientX;
        lastY = event.clientY;
    }
}


///////////////////////////////////////////////////////////////////////////////
//
// Page level functions.
//
///////////////////////////////////////////////////////////////////////////////
function RestoreHandleVisibility()
{
    handlesDiv.classList.remove("handlesFade");

    // Trigger reflow before adding handlesFade back.
    // This will restart the transition.
    handlesDiv.offsetWidth = handlesDiv.offsetWidth;

    handlesDiv.classList.add("handlesFade");
}


function Rotate() {
    handleUL.TransformStart();
    handleUR.TransformStart();
    handleLR.TransformStart();
    handleLL.TransformStart();

    // First transform translates center of window to origin.
    var center = Math.min(window.innerWidth, window.innerHeight) / 2;
    var T1 = [
        1, 0, -center,
        0, 1, -center,
        0, 0, 1
    ];

    // Second transform rotates.
    var pi = 3.1415926;
    var angle = 90.0 / 360.0 * 2 * pi;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var R = [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    ];

    // Third transform translates origin back to center of window.
    var T2 = [
        1, 0, center,
        0, 1, center,
        0, 0, 1
    ];

    var T = MatrixMatrix3(MatrixMatrix3(T2, R), T1);

    // Transform all four handles.
    handleUL.Transform(T);
    handleUR.Transform(T);
    handleLR.Transform(T);
    handleLL.Transform(T);
}


function ToggleFlashlight(className) {
    if (stage.firstChild == blank &&
        (className.length == 0 || blank.className == className)) {
        UpdateStageImage();
    }
    else {
        blank.className = className;
        stage.replaceChild(blank, stage.firstChild);
    }
}


function ToggleDemoMode() {
    if (overlay.style.display != "block") {
        overlay.style.display = "block";
    }
    else {
        overlay.style.display = "none";
    }
}


function Project(from, to) {
    var X = perspective_4point_transform(
        from[0].x, from[0].y, to[0].x, to[0].y,
        from[1].x, from[1].y, to[1].x, to[1].y,
        from[2].x, from[2].y, to[2].x, to[2].y,
        from[3].x, from[3].y, to[3].x, to[3].y
    );

    return X;
}


function BackProject(h1, h2, h3, h4)
{
    var d1 = h1.source;
    var d2 = h2.source;
    var d3 = h3.source;
    var d4 = h4.source;

    var s1 = h1.dest;
    var s2 = h2.dest;
    var s3 = h3.dest;
    var s4 = h4.dest;

    var H = Project([s1, s2, s3, s4],
                    [d1, d2, d3, d4]);

    return H;
}


function UpdateElementProjection(elt, h1, h2, h3, h4) {
    var w = elt.offsetWidth;
    var h = elt.offsetHeight;

    var s1 = h1.source;
    var s2 = h2.source;
    var s3 = h3.source;
    var s4 = h4.source;

    var d1 = h1.dest;
    var d2 = h2.dest;
    var d3 = h3.dest;
    var d4 = h4.dest;

    var H = Project([s1, s2, s3, s4],
                    [d1, d2, d3, d4]);

    var results = [];
    for (i = 0 ; i < 4 ; ++i) {
        for (j = 0 ; j < 4 ; ++j) {
            results.push(H[j][i].toFixed(20));
        }
    }

    var t = "matrix3d(" + results.join(", ") + ")";
    elt.style["-moz-transform"] = t;
    elt.style["-o-transform"] = t;
    elt.style["-webkit-transform"] = t;
    elt.style.transform = t;
}


function UpdateStageTransform() {
    UpdateElementProjection(stage,
                            handleUL, handleUR, handleLR, handleLL);
}


// Resets all transformations and adjusts the display are to fit in the window.
function ResetTransformation() {
    var w = stage.offsetWidth;
    var h = stage.offsetHeight;
    handleUL.source = new Point(0, 0);
    handleUR.source = new Point(w, 0);
    handleLR.source = new Point(w, h);
    handleLL.source = new Point(0, h);

    var padding = 20;
    var x = Math.min(window.innerWidth, window.innerHeight) - (padding * 2);
    var x0 = padding;
    var x1 = padding + x;

    handleUL.MoveTo(x0, x0);
    handleUR.MoveTo(x1, x0);
    handleLR.MoveTo(x1, x1);
    handleLL.MoveTo(x0, x1);

    UpdateStageTransform();
}


function Initialize() {
    // IMPORTANT: Must set margins and paddings to 0px in order to
    // make drag handle math work correctly.
    // TODO: See whether this can be done in the stylesheet.
    document.documentElement.style.margin = "0px";
    document.documentElement.style.padding = "0px";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";

    stage = document.getElementById("stage");
    instructions = document.getElementById("instructions");
    overlay = document.getElementById("overlay");
    blank = document.createElement("div");
    imageSelector = document.getElementById("imageSelector");

    imageSelector.addEventListener("click", HideImageSelector);

    // Positions of corner handles will be initialized in ResetTransformation().
    handleUL = new CornerHandle(document.getElementById("handleUL"), 0, 0);
    handleUR = new CornerHandle(document.getElementById("handleUR"), 0, 0);
    handleLR = new CornerHandle(document.getElementById("handleLR"), 0, 0);
    handleLL = new CornerHandle(document.getElementById("handleLL"), 0, 0);
    handlesDiv = document.getElementById("handles");

    var center = Math.min(window.innerWidth, window.innerHeight)/2;
    handleTranslate = TranslateHandle(document.getElementById("handleTranslate"), center, center);
    handleRotateAndScale = ScaleHandle(document.getElementById("handleRotateAndScale"), center, center);

    window.addEventListener('keydown', KeyDown);
    window.addEventListener('keyup', KeyUp);             // TODO: combine with KeyDown?
    window.addEventListener('mousedown', MouseDown)
    window.addEventListener('mousemove', MouseMove)

    ResetTransformation();
}


window.addEventListener('load', Initialize);



///////////////////////////////////////////////////////////////////////////////
//
// Image file loading.
//
///////////////////////////////////////////////////////////////////////////////

// Displays the current image if there is one, otherwise displays instructions.
function UpdateStageImage() {
    if (images.length > 0) {
        stage.replaceChild(images[currentImage], stage.firstChild);
    }
    else {
        stage.replaceChild(instructions, stage.firstChild);
    }
}


function LoadImagesHelper(files, position) {
    if (position < files.length) {
        reader = new FileReader();
        reader.onloadend = function () {
            image = new Image();
            image.onload = function () {
                image.className = "image"
                image.width = 100;
                image.height = 100;
                images.push(image);
                currentImage = images.length - 1;
                UpdateStageImage();
            };
            image.src = reader.result;
            LoadImagesHelper(files, position + 1);
        }
        reader.readAsDataURL(files[position]);
    }
}


function LoadImages(files) {
    LoadImagesHelper(files, 0);
}


function HideImageSelector(event)
{
    imageSelector.style.visibility = "hidden";
    imageSelector.removeChild(imageSelector.firstChild);
}


// Feature detection strategy from
//   http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser.
function IsFireFox() {
    return (typeof InstallTrigger !== 'undefined');
}


function OpenImageSelector()
{
    div = document.getElementById("imageSelector");

    input = document.createElement("input");
    input.className = "fileInput";
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.addEventListener("change", function (e) { LoadImages(input.files); });
    div.appendChild(input);

    // As a security measure, FireFox will prevent input.click() from opening
    // the file selection dialog. If we're running in FireFox, just make the 
    // input field visible, but don't click.
    if (IsFireFox()) {
        div.style.visibility = "visible";
    }
    else {
        input.click();
    }
}


function UnloadCurrentImage()
{
    if (images.length > 0) {
        images.splice(currentImage, 1);
        if (currentImage == images.length)
            currentImage = images.length - 1;
        UpdateStageImage();
    }
}


function NextImage() {
    if (images.length > 0) {
        currentImage = (currentImage + 1) % images.length;
        UpdateStageImage();
    }
}


function PreviousImage() {
    if (images.length > 0) {
        currentImage = (currentImage + images.length - 1) % images.length;
        UpdateStageImage();
    }
}
