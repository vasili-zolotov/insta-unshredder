/* Author: Vasili Zolotov
 
Instragram challenge unshredder solution
*/

var step = 32;
var slices;
var edges;

var debug = {};

function loadImage( path ) {
    var srcImage = new Image();
    srcImage.onload = function() { processImage( srcImage ); }
    srcImage.src = path;
}

function processImage( img ) {
    slices = []; edges = [];
    
    var canvas = document.getElementById("source");
    var context = canvas.getContext("2d");
    context.drawImage( img, 0, 0 ); 
    // produce slices
    for ( var n=0; n * step < img.width; n++ ) {
        slices[n] = context.getImageData( n*step, 0, step, img.height );
    }
    // find shortest right edge for each tile
    for ( var l=0; l < slices.length; l++ ) {
        for ( var r=0; r < slices.length; r++ ) if ( l != r ) {
            var d = distance( slices[l], slices[r] );
            if ( edges[l] == null || d < edges[l][1] ) edges[l] = [ r, d ];
        }
    }
    // find longest edge among the shortest
    var dmax = 0;
    for ( var n=0; n < edges.length; n++ ) {
        if ( edges[n][1] > edges[dmax][1] ) dmax = n;
    }
    // build an index on edge target to traverse edges right to left
    var index = {}
    for ( var n=0; n < edges.length; n++ ) {
        if ( index[edges[n][0]] == undefined || edges[n][1] < index[edges[n][0]][1] ) index[edges[n][0]] = [ n, edges[n][1] ];
    }
    // find the leftmost tile
    var left = dmax;
    for ( var n=0; n < edges.length; n++ ) {
        if ( index[left] == undefined || index[left] == dmax ) break;
        left = index[left][0];
    }
    // draw the tiles left to right
    var slice = left;
    var dsum = 0;
    for ( var slot = 0; slot < slices.length; slot++ ) {
        drawSlice( slice, slot );
        dsum += edges[slice][1];
        slice = edges[slice][0];
        
    }
    // dump state for debugging
    debug.index = index;
    debug.dmax = dmax;
    debug.left = left;
    debug.dsum = dsum;
}

function distance( left, right ) {
    var sum = 0;
    for ( var y=1; y < left.height-1; y++ ) {
        var d = 0;
        for ( var c=0; c<4; c++ ) { d+= Math.pow( left.data[step*y*4+(step-1)*4+c]-right.data[step*y*4+c] , 2 ) }
        sum += 1 - 1/(Math.sqrt(d+1));
     }
    return sum;
}

function drawSlice( slice, slot ) {
    var canvas = document.getElementById("solution");
    var context = canvas.getContext("2d");
    context.putImageData( slices[slice], slot*step, 0 );
    context.textBaseline = "top";
    context.fillText( slice.toString(), slot*step + 1 , 1);
}























