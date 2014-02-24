/* audio.js
    Raymond Kim */
// Make webkit browsers use the prefix-free version of AudioContext.
  var AudioContext = AudioContext || webkitAudioContext;
  var context = new AudioContext(), buffer;
  var source;
  var source2;
  var gainNode = context.createGain();
  var gainNode2 = context.createGain();
    
    function setAudioFile(buffer) {
        source = context.createBufferSource();
        source.buffer = buffer;
        source.loop= true;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        //source.start(0); // Play sound immediately
    };

    function speedUp() {
        source.playbackRate.value += 1.0;
    }

    function play() {
       source.noteOn(0); 
    }

    function setAudioFile2(buffer) {
        gainNode2 = context.createGain(); 
        source2 = context.createBufferSource();
        source2.buffer = buffer;
        source2.connect(gainNode2);
        gainNode2.connect(context.destination);
        //source.start(0); // Play sound immediately
    };

    function play2() {
      source2.start(0);
    }

    var loadAudioFile = (function (url) {
        var request = new XMLHttpRequest();

        request.open('get', 'boneless.mp3', true);
        request.responseType = 'arraybuffer';

        request.onload = function () {
                context.decodeAudioData(request.response,
                     function(incomingBuffer) {
                         setAudioFile(incomingBuffer);
                     }
                );
        };

        request.send();
    }());
    // track 2
    var loadAudioFile2 = (function (url) {
        var request = new XMLHttpRequest();

        request.open('get', 'Alive.mp3', true);
        request.responseType = 'arraybuffer';

        request.onload = function () {
                context.decodeAudioData(request.response,
                     function(incomingBuffer) {
                         setAudioFile2(incomingBuffer);
                     }
                );
        };

        request.send();
    }());

// rightmost slider
  $(function() {
    $( "#slider-vertical1" ).slider({
      orientation: "vertical",
      range: "min",
      min: 40,
      max: 60,
      value: 50,
      
    });
  });

  // right gain slider
  $(function() {
    $( "#gainsliderright" ).slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 50,
      slide: function(e, ui) {
        var slider_val = ui.value;
        volume = slider_val / 100;
        gainNode2.gain.value = volume;
      },
    });
  });

  // leftmost slider
    $(function() {
    $( "#slider-vertical2" ).slider({
      orientation: "vertical",
      range: "min",
      min: 40,
      max: 60,
      value: 50,
      
    });
  });

  // left gain slider
  $(function() {
    $( "#gainsliderleft" ).slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 50,
      slide: function(e, ui) {
        var slider_val = ui.value;
        volume = slider_val / 100;
        gainNode.gain.value = volume;
      },
      })
    });

  // below is code for spinning jog wheels

$(document).ready(function() {
 $("#play2buttonstop").hide();
 $("#play1buttonstop").hide();
var lspinning = false;
var rspinning = false;
var lstop = false;
var rstop = false;
var lto;
var rto;
$("#play1button").click(function () {
       var $elie = $("#leftwheel");
       if (!lspinning) {
        $("#play1button").hide();
         $("#play1buttonstop").show();
       rotate(0);
       } 
       function rotate(degree) {
           lspinning = true;
           var incspeed = 0;
         
           var speed = 100 - $( "#slider-vertical2" ).slider( "value" ); // down to go faster; up to go slower
           
           incspeed = -(1 - speed/50.0); //normalized value between -1 and 1
           source.playbackRate.value    =  incspeed+1;  
           // For webkit browsers: e.g. Chrome
           $elie.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
           // For Mozilla browser: e.g. Firefox
           $elie.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
  
           // Animate rotation with a recursive call
           if (!lstop){
           lto = setTimeout(function() { rotate(10+degree); },65);
           }
       }
       // function changeVolume(degree) {

       //     var slider_val = $( "#gainsliderleft" ).slider( "value" );
       //     console.log(slider_val);
           
       //     volume = slider_val / 100; //normalized value between 0 and 1
       //     gainNode.gain.value = volume;  
       // }
    
});

 $("#play2button").click(function () {
       var $elie = $("#rightwheel");
       if (!rspinning) {
          $("#play2button").hide();
          $("#play2buttonstop").show();
       rotate(0);
       } 
       function rotate(degree) {
           rspinning = true;
           var incspeed = 0;
         
           var speed = 100 - $( "#slider-vertical1" ).slider( "value" ); // down to go faster; up to go slower
           
           incspeed = -(1 - speed/50.0); //normalized value between -1 and 1
           source2.playbackRate.value    =  incspeed+1;   
           console.log("hi");
           // For webkit browsers: e.g. Chrome
           $elie.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
           // For Mozilla browser: e.g. Firefox
           $elie.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
  
           // Animate rotation with a recursive call
           if (!rstop){
           rto = setTimeout(function() { rotate(10 + 8*incspeed+degree); },66);
           }
       }
       // function changeVolume(degree) {

       //     var slider_val = $( "#gainsliderright" ).slider( "value" );
       //     console.log(speed);
           
       //     volume = slider_val / 100; //normalized value between 0 and 1
       //     gainNode.gain.value = 0;  
       // }
    
});

  $('#play1buttonstop').click(function() {
    clearTimeout(lto);
    lstop = true;
    $('#play1button').show();
    $('#play1buttonstop').hide();
  });

  $('#play2buttonstop').click(function() {
    // stop rightwheel
    $("#rightwheel").stop(true);
    rstop = true;
    $('#play2button').show();
    $('#play2buttonstop').hide();
  });
});