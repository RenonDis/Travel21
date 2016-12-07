

// $(document).addEventListener("DOMContentLoaded", function(){
//     var instance = new Accordion({
//         containerSelector: '.accordion-instance',
//         itemSelector: '.accordion-item',
//         toggleSelector: '.accordion-toggle'
//     });
// });

$( document ).ready(function() {

    // Enable cache to avoid loading jquery and ajax every time
    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
        if ( options.dataType == 'script' || originalOptions.dataType == 'script' ) {
            options.cache = true;
        }
    });
    
    var globalDelay = 1800;
    
    function drawBird() {
        var l1 = new Vivus('Logo', {
            type: 'scenario-sync',
            start: 'autostart',
            duration: 10,
            forceRender: false,
        //animTimingFunction: Vivus.EASE_OUT_BOUNCE
        });
    }
    
    function drawTitle() {
        var l2 = new Vivus('travelTitle', {
            type: 'async',
            start: 'autostart',
            duration: 70,
            forceRender: false,
        //animTimingFunction: Vivus.EASE_OUT_BOUNCE
        });
    }
    
    function drawIntroTitle() {
        var l3 = new Vivus('introTitle', {
            type: 'async',
            start: 'autostart',
            duration: 100,
            forceRender: false,
        //animTimingFunction: Vivus.EASE_OUT_BOUNCE
        });
        l3.play(1000);
        window.setTimeout( function() {
            l3.play(-2);
            },400
        );
    }

    function articleShow(){
        var wow = $('article').height();
        $('article').css({marginTop:'100%',});
        window.setTimeout( function() {
            $('article').animate({
                            marginTop:'10%',
                        }, 700);}, globalDelay - 700
        );
    }
    
    function headerShow(){
        $(".header,.topmenu").css({top:'-100px',});
        $(".header,.topmenu").delay(globalDelay).animate({
                        top:'0px',
                    }, {
     easing: 'swing',
     duration: 400,
     complete: function(){
        
    }});
    }
    
    //sliding logs in display
    
    function logShow(){
        var logs = [];
        $('.logentry').each( function() {
            logs.push($(this));
        });
        
        var numberLogs = logs.length;
        
        for (var i = 0; i < numberLogs; i++) {
            logs[i].css({right:'-200%'});
        }
        
        window.setTimeout( function() {
        for (var j = 0; j < numberLogs; j++) {
            logs[j].delay(j*200).animate({
                right:'0%'},{
                easing: 'swing',
                duration: 200,
                complete: function(){}}
                );
            
            //some translation effects on hovering
            
            logs[j].mouseenter(function() {
                    $(this).css({right:'1%'});
                    })
                   .mouseleave(function() {
                    $(this).css({right:'0%'});
                    });
        }
        }, globalDelay);
    }
    
    function tileShow(){
    
        var tiles = [];
        $('.tile').each( function() {
            $(this).find('a').each( function() {
                $(this).toggleClass( 'active', false );
            });
            tiles.push($(this));
        });
        //console.log(tiles);
        var numberTiles = tiles.length;
        for (var i = 0; i < numberTiles; i++) {
            tiles[i].css({top:'-100px',});
        }
        
        //setting active tile
        
        if ($('.index').length) {
            tiles[0].find('a').each( function() {
                $(this).toggleClass( 'active', true );
            });
        }
        
        if ($('.logs').length) {
            tiles[1].find('a').each( function() {
                $(this).toggleClass( 'active', true );
            });
        }
        
        if ($('.map').length) {
            tiles[2].find('a').each( function() {
                $(this).toggleClass( 'active', true );
            });
        }
        
        if ($('.about').length) {
            tiles[3].find('a').each( function() {
                $(this).toggleClass( 'active', true );
            });
        }
        
        //dropping tiles in display
        window.setTimeout( function() {
        for (var j = 0; j < numberTiles; j++) {
            tiles[j].delay(j*100).animate({
                top:'0px'},{
                easing: 'swing',
                duration: 400,
                complete: function(){}}
                
                );
        }
        },500 + globalDelay);
    }
    
    function fakeHover() {
        $('.header').slideUp();
        $('.topmenu').slideUp();
        $('.fakeheader').mouseleave(function() {
                $('.header, .topmenu').delay(2000).slideUp();
            })
                        .mouseenter(function() {
                // some security to prevent header from bouncing
                $('.header').stop(true);
                $('.topmenu').stop(true);
                $('.header').slideDown();
                $('.topmenu').slideDown();
                //drawTitle();
        });
    }
    
    function globalShow(){
        articleShow();
        headerShow();
        $("#Logo").hide();
        window.setTimeout( function(){
            $("#Logo").show();
            drawBird();}, 2000 + globalDelay
        );
        tileShow();
        window.setTimeout( function(){
            drawTitle();
            $('.introtitle').hide();
        }, globalDelay
        );
        
        $('#travelTitle').mouseenter(function() {drawTitle();});
    }
    
    $('.introtitle').hide();
    
    if (!$('.slideshow').length) {
        
        $('footer').show();
        
        if (intro.length) {
            globalDelay = 1800;
            globalShow();
            $('.introtitle').show();
                drawIntroTitle();
            
        }
        else {
            globalDelay = 0;
            articleShow();
        }
    }
    
    // for photo slideshow, hidden for development
    else {
    
        $('footer').hide();
        
            $('.header').hide();
            $('.topmenu').hide();
        window.setTimeout( function(){
            fakeHover();}, 250
        );
        
    }
    
    
    


});





