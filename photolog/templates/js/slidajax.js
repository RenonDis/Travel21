

$(function() {

    // // First step : get the csrf cookie we put in the DOM
    // function getCookie(name) {

    //     var cookieValue = null;
    
    //     if (document.cookie && document.cookie !== '') {
    
    //         var cookies = document.cookie.split(';');
    //         for (var i = 0; i < cookies.length; i++) {
    //             var cookie = jQuery.trim(cookies[i]);
    //             // Does this cookie string begin with the name we want?
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    
    //     }
    
    //     return cookieValue;

    // }
    
    // var csrftoken = getCookie('csrftoken');
    // // if 403 forbidden error, check console for cookie value
    // console.log(csrftoken);
    
    
    // function csrfSafeMethod(method) {
    //     // these HTTP methods do not require CSRF protection
    //     return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    // }
    
    // // setup ajax request header with csrf cookie to be accepted by server
    // $.ajaxSetup({

    //     beforeSend: function(xhr, settings) {
    
    //         if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
    
    //             xhr.setRequestHeader("X-CSRFToken", csrftoken);
    
    //         }

    //     }
    // });
    
//     var tab_bouteille = [];    
//     tab_bouteille[0]={"nom": 'vodka',"quantite": '25'};
//     tab_bouteille[1]={"nom": 'chartreuse',"quantite": '25'};
//     
//     var content = '';
//     var counter = 0;
//     var contextt ='';
//     
//     $(document).click(function() {
//     
//         console.log('opstuff');
    
//         $.ajax({
//     
//          type: "POST",
//          dataType: "json",
//          traditional: true,
//          data: {'list_bouteille': JSON.stringify(counter)},
//          success: function(data) {
//                  console.log(data["HTTPRESPONSE"]);
//                  content = data["HTTPRESPONSE"];
//                  contextt = data["contextt"];
//             }
//     
//         });      
    
//         counter += 1;
//     
//         window.setTimeout(function(){
//             $('.pagecounter').text(contextt);
//             $('html').css('background-image', 'url(/media/'+content+')');
//         },100);
//         
//     
//         
//     });


    idNext = 0;
    idPrev = 0;

    // UpdateCounter and emit when page is finished loading
    function UpdateCounter() {
        var idLen = idList.length;

        var idText = Math.round($('.metaid').text());

        var idFront = idList.indexOf(idText)+1;

        $('.pagecounter').text(idFront+'/'+idLen);
        
        window.setTimeout( function() {
            $('body').removeClass('page-is-changing');
            }, 400
        );
        
        $( document ).unbind('ajaxComplete');
        
        console.log('Counter updated, page loaded');
        
    }

    UpdateCounter();
 
    // Loop loading function toggling class to animate bar
    function loadingFunk() {
        if ($('.page-is-changing').length) {
            $('body').addClass('loading-page');
            
            window.setTimeout( function() {
                $('body').removeClass('loading-page');
                }, 400
            );
            
            window.setTimeout( function() {
                loadingFunk();
                }, 800
            );
        }
    }
    
    function drawLoading() {
        var l4 = new Vivus('loadingsvg', {
            type: 'async',
            start: 'autostart',
            duration: 80,
            forceRender: false,
        //animTimingFunction: Vivus.EASE_OUT_BOUNCE
        });
        l4.play(1);
        window.setTimeout( function() {
            l4.play(-1);
            },1000
        );
    }
    
    function firstLoading() {
        console.log(isFirst);
    
        if ( isFirst ) {
            
            drawLoading();
            
            window.setTimeout( function() {
                firstLoading();
            },2000);
        }
    }
    
    // Initialize slide changing, clear events and launch loading animation
    function initControlDom() {
    
        hideSlideContent();
        
        $('body').addClass('page-is-changing');

        $( document ).unbind('ajaxComplete')
                     .unbind('ready');
        
        loadingFunk();

        
    }

    // Make ajax calls and manage transitions meanwhile with optimized loading time
    function goAnySide(idSide, isPrev) {

        var isHid = isHidden;
        
        //Hide expandlet and controls if first
        
        if ( isFirst ) {
            $('.expandlet, .controls').hide();
        }
        
        // slideDelay allows time for slide to hide if shown
        var slideDelay = 1;
        if ( !isHid ) { slideDelay = 400; }
        
        console.log(slideDelay);
        console.log(typeof(slideDelay));

        // Retrieve IDs of next and previous articles
        var idToFetch;
        if ( isPrev ) { 
            idToFetch = idSide[0]; 
        } else {
            idToFetch = idSide[1];
        }
        
        initControlDom();
        
        var displayedDiv = $('.displayed');
        var hiddenDiv = $('.imgslot').not('.displayed');
        
        // Call fillcover with img bg for next slide
        hiddenDiv.load("{% url 'fillslide' 0 2345 %}".replace(/2345/, idToFetch.toString()), function( response, status, xhr ) {
            if ( status == "error" ) {
                var msg = "Sorry but there was an error: ";
                console.log("LOAD ERROR")
                $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        });
        console.log('Fetching img data from server..');
                
        // Once the call is made, still need to wait for img loading
        $( document ).ajaxComplete(function() {

            // Unbinding to prevent second call from the other ajax call for text content
            $( document ).unbind('ajaxComplete');
        
            // Fetching the image to load in an Image object
            var src = hiddenDiv.find('.overlay').css('background-image');
            var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            console.log(url);
            
            var img = new Image();
            img.src = url;
            
            // Timeout for slide delay
            window.setTimeout( function() {
            
                // Trigger slide animation and events on Image load
                img.onload = function() {
                    console.log('Image loaded');
                    
                    // Clearing the event to prevent second calls
                    img.onload = null;
                    
                    // Call fillslide to fill text areas
                    $('.ajaxtextcontent')
                        .load("{% url 'fillslide' 1 2345 %}".replace(/2345/, idToFetch.toString()), function( response, status, xhr ) {
                            if ( status == "error" ) {
                                var msg = "Sorry but there was an error: ";
                                console.log("LOAD ERROR")
                                $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
                            }
                        });
                
                    // Launch animation
                    console.log('Launching slide..');
                    
                    if ( isPrev ) {
                        displayedDiv.removeClass('displayed');
                        hiddenDiv.addClass('displayed');
                        $('.inc').css({left:'-100%'})
                                 .animate({left:'0%'})
                                 .removeClass('inc');
                    } else {
                        $('.overlay').not('.inc').animate({left:'-100%'}
                            ,"slow"
                            ,function() {
                                displayedDiv.removeClass('displayed');
                                hiddenDiv.addClass('displayed');
                                $('.inc').removeClass('inc');
                            }
                        );
                    }
                    
                    // Front format once everything is loaded
                    $( document ).ajaxComplete(function() {
                    
                        UpdateCounter();
                        
                        // Re enabling for init anim
                        if ( isFirst ) {
                            $('.expandlet, .controls').show();
                            isFirst = false;
                        }
                        
                        initSlide();
                    });
                    
                    // Display text content if displayed before
                    if(!isHid) { 
                        window.setTimeout(function() {
                            showSlideContent(); 
                        },100);
                    }
                };
                
                if (img.complete) img.onload();                      
                    
                }, slideDelay
            );    
            
        });
                
    }
    
    // Define explicit func for clarity
    function goPrevious(idSide) {
        // Adding condition to avoid user overflows
        if (!($('.page-is-changing').length)) {
            goAnySide(idSide, 1);
        }
    }

    function goNext(idSide) {
        if (!($('.page-is-changing').length)) {
            goAnySide(idSide, 0);
        }
    }

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                goPrevious(idSide);
            break;

            case 39: // right
                goNext(idSide);
            break;
            
            case 32: // space
                toggleSlide();
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


    $('.next').click( function() {
                  
        goNext(idSide);

    });


    $('.previous').click( function() {
        
        goPrevious(idSide);

    });
    
    // Animation if first image to load
    
    if ( isFirst ) {
        
        window.setTimeout( function() {
            $('.svgloading').show();
            firstLoading();
        }, 600);
        
        goNext(idSide);
    }
    
    
});

