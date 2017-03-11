var isHidden = true;

function initSlide() {
    
        // initialize mask, content, expandlet and title
        $('#title').animate(
                {'foo':-1000},
                {
                    step: function(foo){
                         $(this).attr('x', foo);
                    },
                    duration: 1
                }
            );
        
        $('.maskcontainer').css({width:'0%',});
        
        $('.slidecontent').css({right:'-50%'});
        
        $('.expandlet').animate({
                        top:'0%',
                    }, 600);
        
        // morow pointing up while appearing
        $('.pluszone').css({'transform' : 'rotate('+ 90 +'deg)'});
        window.setTimeout( function(){
                $('.pluszone').css({'transform' : 'rotate('+ 0 +'deg)'});},
            900);
                
        $('.expandlet').mouseenter(function() {
            $('.pluszone').finish();
            $('.pluszone').css({'transform' : 'rotate('+ 180 +'deg)'});
        });
        
        $('.expandlet').mouseleave(function() {
            $('.pluszone').finish();
            $('.pluszone').css({'transform' : 'rotate('+ 0 +'deg)'});
        });
    }


function hideSlideContent() {
        
        isHidden = true;

        $('.expandlet,#title,.maskcontainer,.slidecontent').finish();
        
        document.removeEventListener('click',hideSlideContent);

        // reset correct behaviour for morow
        $('.expandlet').mouseleave(function() {
            $('.pluszone').finish();
            $('.pluszone').css({'transform' : 'rotate('+ 0 +'deg)'});
        });
        
        $('#title').animate(
                {'foo':-1000},
                {
                    step: function(foo){
                         $(this).attr('x', foo);
                    },
                    easing: 'swing',
                    duration: 600
                }
            );

        $('.maskcontainer').animate({
                        width:'0%',
                    }, 500);
                    
        $('.slidecontent').animate({
                        right:'-50%',
                    }, 500);
            
        window.setTimeout( function(){
            $('.expandlet').animate({
                        top:'0%',
                    }, 100);
            window.setTimeout( function(){
                $('.pluszone').css({'transform' : 'rotate('+ 0 +'deg)'});},
                400);},
        500);
    }

function showSlideContent() {

    isHidden = false;
    
    $('.pluszone').css({'transform' : 'rotate('+ 270 +'deg)'});
    
    // block mouseleave behaviour of morow
    $('.expandlet').mouseleave(function() {
        $('.pluszone').finish();
        $('.pluszone').css({'transform' : 'rotate('+ 270 +'deg)'});
    });
    
    window.setTimeout( function(){
        $('.expandlet').animate({
                        top:'100%',
                    }, 100);},
        300);
    
    window.setTimeout( function(){
        $('#title').animate(
                {'foo':-8},
                {
                    step: function(foo){
                         $(this).attr('x', foo);
                    },
                    easing: 'swing',
                    duration: 600
                }
            );

        $('.maskcontainer').animate({
                        width:'50%',
                    }, 500);
                    
        $('.slidecontent').animate({
                        right:'5%',
                    }, 500);
                    
        $('.pluszone').css({'transform' : 'rotate('+ 90 +'deg)'});},
        800);
    
    window.setTimeout( function(){
        document.addEventListener('click',hideSlideContent);},
    500);
}

function toggleSlide() {
    if ( isHidden ) {
        showSlideContent();
    } else {
        hideSlideContent();
    }
}


// setBrightMask for dark photo !!
function setBrightMask() {
    $('svg').find('.base').css({fill:'white'});

    $('.expandlet')
                   .mouseenter(function() {
                       $(this).css({background:'rgba(255,255,255,0.7)'});
                   })
                   .mouseleave(function() {
                       $(this).css({background:'rgba(255,255,255,0.5)'});
                   });

    $('.controls .previous,.controls .next')
                   .mouseenter(function() {
                       $(this).css({background:'rgba(255,255,255,0.5)'});
                   })
                   .mouseleave(function() {
                       $(this).css({background:'rgba(255,255,255,0)'});
                   });
                   
    $('.controls, .expandlet').css({background:'rgba(255,255,255,0.5)'});

    $('.slidecontent').css({color:'black'});
    $('.morowpath').css({stroke:'black'});
    $('.pagecounter').css({color:'black'});
}

// setDarkMask for bright photo !!
function setDarkMask() {
    $('svg').find('.base').css({fill:'black'});

    $('.expandlet')
                   .mouseenter(function() {
                       $(this).css({background:'rgba(0,0,0,0.7)'});
                   })
                   .mouseleave(function() {
                       $(this).css({background:'rgba(0,0,0,0.5)'});
                   });

    $('.controls .previous,.controls .next')
                   .mouseenter(function() {
                       $(this).css({background:'rgba(0,0,0,0.5)'});
                   })
                   .mouseleave(function() {
                       $(this).css({background:'rgba(0,0,0,0)'});
                   });
                   
    $('.controls, .expandlet').css({background:'rgba(0,0,0,0.5)'});

    $('.pagecounter').css({color:'white'});
    $('.slidecontent').css({color:'white'});
    $('.morowpath').css({stroke:'white'});
}

    
$(function() {    
    
    initSlide();
    
    $('.expandlet').click(function() {
        showSlideContent();
    });
    

});
