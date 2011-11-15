/* Author: Vasili Zolotov
 
Instragram challenge unshredder
*/

var step = 32;
var slices = [];
var edges = [];

var srcImage = new Image();
srcImage.onload = function() { processImage( srcImage ); }
srcImage.src = "img/image1.png";

function processImage( img ) {
    var canvas = document.getElementById("source");
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0); 
    
    for ( var n=0; n * step < srcImage.width; n++ ) {
        slices[n] = context.getImageData( n*step, 0, step, srcImage.height );
    }
    
    for ( var l=0; l < slices.length; l++ ) {
        for ( var r=0; r < slices.length; r++ ) if ( l != r ) {
            var d = distance( slices[l], slices[r] );
            if ( edges[l] == null || d < edges[l][1] ) {
                edges[l] = [ r, d ];
            }
        }
    }
    /* TODO: this didn't quite work, thanks to darkened edges I think...*/
    for ( var n=0; n<slices.length; n++ ) {
        if ( edges.rightmost == undefined || edges[edges.rightmost][1] < edges[n][1] ) edges.rightmost = n;
    }
    
    var slice = edges.rightmost;
    for ( var slot = 0; slot < slices.length; slot++ ) {
        drawSlice( slice, slot );
        slice = edges[slice][0];
    }
}

function distance( left, right ) {
    var sum = 0;
    for ( var y=0; y < left.height-1; y++ ) {
        var d = 0;
        for ( var c=0; c<4; c++ ) { d+= Math.pow( left.data[step*y*4+(step-1)*4+c]-right.data[step*y*4+c], 2 ) }
        sum += Math.sqrt( d );
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























