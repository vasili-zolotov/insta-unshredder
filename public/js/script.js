/* Author: Vasili Zolotov
 
Instragram challenge unshredder
*/

var step = 32;
var slices = [];
var edges = [];

function loadImage( path ) {
    var srcImage = new Image();
    srcImage.onload = function() { processImage( srcImage ); }
    srcImage.src = path;
}

function processImage( img ) {
    slices = []; edges = [];
    
    var canvas = document.getElementById("source");
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0); 
    
    for ( var n=0; n * step < img.width; n++ ) {
        slices[n] = context.getImageData( n*step, 0, step, img.height );
    }
    
    for ( var l=0; l < slices.length; l++ ) {
        for ( var r=0; r < slices.length; r++ ) if ( l != r ) {
            var d = distance( slices[l], slices[r] );
            if ( edges[l] == null || d > edges[l][1] ) {
                edges[l] = [ r, d ];
            }
        }
    }
    
    for ( var n=0; n<slices.length; n++ ) {
        if ( edges.rightmost == undefined || edges[edges.rightmost][1] > edges[n][1] ) edges.rightmost = n;
    }
    
    var slice = edges.rightmost;
    for ( var slot = 0; slot < slices.length; slot++ ) {
        drawSlice( slice, slices.length -1 - slot );
        for ( var i = 0; i < edges.length; i++ ) if ( slice == edges[i][0] && i != edges.rightmost ) { slice = i; break; }
    }
}

function distance( left, right ) {
    var sum = 0;
    for ( var y=0; y < left.height-1; y++ ) {
        var d = 0;
        for ( var c=0; c<4; c++ ) { d+= Math.pow( left.data[step*y*4+(step-1)*4+c]-right.data[step*y*4+c], 2 ) }
        sum += 1/(Math.sqrt( d )+1);
     }
    return sum;
}

function drawSlice( slice, slot ) {
    var canvas = document.getElementById("result");
    var context = canvas.getContext("2d");
    context.putImageData( slices[slice], slot*step, 0 );
    context.textBaseline = "top";
    context.fillText( slice.toString(), slot*step + 1 , 1);
}























