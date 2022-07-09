# Pixel Creator
Free online editor for pixel art and animated sprites.

## Documentation
On the home page you can see list of your projects and if you want you can create an account or login to the existing. It's not necessary, you only need this if you want to save your project online.

You can either create a project or import the existing one saved earlier with .picr file.

On the workplace page you can select different brushes and pen sizes either by clicking buttons or using these shortcuts:

1 - set pen size to 1

2 - set pen size to 2

3 - set pen size to 3

4 - set pen size to 4

P - pen

L - line

B - bucket

E - eraser

R - rectangle: Shift - to keep 1:1 ratio

C - circle: Shift - to keep 1:1 ratio

S - selection: Shift - to move, Ctrl + C and Ctrl + V - to copy and paste

O - pipette

You can select color using color picker or typing rgb colors' values in it's fields.

Frames can created, copied and deleted and moved by clicking corresponding buttons and dragging the needed frame.

Can undo and redo drawing actions by Ctrl + Z and Ctrl + Y.

For sprites there is an sprite animation, so you can watch how it's looking and you can also set fps you need.

You can save you projects online and later changes if you are logged in.
You can export a png file of your sprite or image on the corresponding modal and setting the size of the square.
You can import .picr file by combining two projects or replacing frames of the opened one.

## About this app
Front end is made using React, Mobx, SCSS, GrapgQl with Apollo Client.
Back end is made using Apollo Server combined with Express framework.
Both are made with TypeScript.

## Usage

### Dev version
1. Copy this repository to your machine
2. Go to server directory in your terminal.
3. Install it's dependencies.
4. Type npm start or run dev.
5. Go to client directory in your terminal.
6. Install it's dependencies.
7. Type npm start.

### Prod version
[You can try it here](https://pixel-creator.herokuapp.com/) or if you want to launch its on you local machine you need: 
1. Install dependencies in server and client directories.
2. Go to server directory in your terminal.
3. Type npm run buildFullApp.
4. Go to build directory in your terminal. 
5. Type npm start.

