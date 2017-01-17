Contributing to MasterCopy
==========================

I welcome contributions to MasterCopy.
Until this project is up and running and there is better documentation
of the goals and engineering standards, I recommend that you send me an email
with a feature proposal before starting major work. This will avoid disappointments
in pull requests that don't get integrated.

The following are some areas for future development.

## Housekeeping Wish List

**Cross-platform Testing and Continuous Integration**
Right now MasterCopy is tested on a few versions of a few browsers.
It would be nice if there was some automated way to test it on more browsers.

**Ideomatic JavaScript, HTML, and CSS**
The code should follow best practices for JavaScript, HTML, and CSS.

**Make UserInterface.js more general**
It should be easy for someone to build another version of MasterCopy, reusing
UserInterface.js. As an example, consider a version that performs three transforms
of three images for projecting onto the three visible faces of a cube.
Instead of adding this feature the MasterCopy, it should be possible to write
another simple HTML file that would leverage most of the code in UserInterface.js.

**Fix Bugs**
I will enter bugs in the GitHub issues list shortly.

## Features for Transferring Artwork

**Fixed Aspect Ratio Cropping Rectangle.**
Suppose you have a 2:3 image that you would like to transfer to a 4:5 canvas.
You'd like to crop the image, instead of stretching it. MasterCopy is able to
generate a 4:5 rectangle (or whatever you request)
that can be moved and resized in crop mode. This
is probably just the red rectangle that today marks
the border of the user's image.

**Image Processing** It would be nice to load one image and then adjust
curves and perhaps do edge detection in MasterCopy. Then one could load a 
photograph and generate a version that shows detail in the darks and another
that shows detail in the lights.

## Features for Video Installations
Imagine projecting onto the front of a building,
the three faces of a cube, or perhaps onto a white theater set.
Trees and other obstacles prevent you from putting the projector
directly in front of the building, so you are using
MasterCopy to eliminate distortions so that it looks as if
the projector was right in front.

**IFrame Mode** Instead of loading an image, display an iframe that
can show any user content, including video. UI could be a popup window
where the user enters the url for the iframe, or they might be able to
just drag/drop the url into the iframe.

**Cropping Regions**
Consider the following scenario: You are setting up a video installation
and want to project a video onto the triangular front of a gable on a house.
You don't want the projector to light up any area outside of the triangular
front. After aligning the artwork in MasterCopy, you enter cropping mode and
use a set of simple tools to draw an arbitrary cropping mask. This could be
a polygon or it could include splines (e.g. to allow for circles). In design
mode, the cropping region would be semi-transparent so that it was easy to
see if artwork was being cropped away. Outside of design mode, the crop
would be black.

**Load and Save Cropping Regions** There should be some way to save cropping
regions, either to some sort of isolated storage or cookie, or it might load
the clipboard with some text that the user could save in a file that could be
loaded in the future. Could generate a data file or the html source for the
session.

**Multiple Projections** Imagine projecting onto the three visible faces of
a cube, or the back and side walls of a theater set. It would be nice if one
could add additional perspective rectangles to MasterCopy and then align each
one. This would allow one projector to display three images on the three visible
faces of a cube.

