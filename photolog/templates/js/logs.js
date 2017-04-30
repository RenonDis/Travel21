
var speedFactor = 250;

$(function() {

    function hideFooter() {
        $('footer').fadeOut();
    }
    
    function showFooter() {
        $('footer').fadeIn();
    }

    function logButShow() {
        $('.log-button').hide().css({bottom:'-30%'});

        window.setTimeout( function() {
            $('.log-button').show().animate({bottom:'0%'}, speedFactor);
        }, 10*speedFactor);
    }
    
    logButShow();

    function hideMisc() {
        //$('.log-misc').css({left:'100%'});
        
        $('.log-misc').slideUp(200);
        
        $('.log-veil').mouseenter( function() {
            var miscDiv = $(this).find('.log-misc');
            miscDiv.stop(true);
            //miscDiv.animate({left:'0%'}, 300);
            miscDiv.slideDown(200);        
        });
        
        $('.log-veil').mouseleave( function() {
            var miscDiv = $(this).find('.log-misc');
            miscDiv.stop(true);
            //miscDiv.animate({left:'100%'}, 300);
            miscDiv.slideUp(200); 
        });
    }
    
    function showMisc() {
        //$('.log-misc').css({left:'0%'});
        miscDiv.slideDown(200);
    }
    
    hideMisc();
    
    function logUpShow(speedFactor) {
        var logs = [];
        var otherlogs = [];
        
        $('.last-log').each( function() {
            logs.push($(this));
        });
        
        $('.recent-log').each( function() {
            logs.push($(this));
        });
        
        $('.other-log').each( function() {
            otherlogs.push($(this));
        });
        
        var numberLogs = logs.length;
        var numberOtherLogs = otherlogs.length;
        
        for (var i = 0; i < numberLogs; i++) {
            logs[i].css({top:'200%'});
        }
        
        
        window.setTimeout( function() { 
        for (var j = 0; j < numberLogs; j++) {
            logs[j].delay(j*speedFactor).animate({
                top:'0%'},{
                easing: 'swing',
                duration: 300,
                complete: function(){}}
                );
        }
        }, speedFactor);
        
        for (var k = 0; k < numberOtherLogs; k++) {
            otherlogs[k].css({'margin-top':'100%'});
        }
        
        window.setTimeout( function() {
        for (var l = 0; l < numberOtherLogs; l++) {
            otherlogs[l].delay(l*speedFactor).animate({
                'margin-top':'0%'},{
                easing: 'swing',
                duration: speedFactor,
                complete: function(){}}
                );
        }
        showFooter();
        }, 4*speedFactor);

        $('.morelog-button').show();

    }
    
    logUpShow(speedFactor);

    function hideLogs(speedFactor) {
        $('.morelog-button').hide();
        removeMoreLogs();

        hideFooter();
    
        var logs = [];
        var otherlogs = [];
        
        $('.last-log').each( function() {
            logs.push($(this));
        });
        
        $('.recent-log').each( function() {
            logs.push($(this));
        });
        
        $('.other-log').each( function() {
            otherlogs.push($(this));
        });
        
        var numberLogs = logs.length;
        var numberOtherLogs = otherlogs.length;
        
        // Animating reverse tiles fly away
        
        for (var l = 0; l < numberOtherLogs; l++) {
            otherlogs[numberOtherLogs-1-l].animate({
                'margin-top':'100%'},{
                easing: 'swing',
                duration: speedFactor,
                complete: function(){}}
                ).fadeOut();
        }

        for (var j = 0; j < numberLogs; j++) {
            logs[numberLogs-1-j].delay((j+1)*speedFactor).animate({
                top:'200%'},{
                easing: 'swing',
                duration: speedFactor,
                complete: function(){}}
                ).fadeOut();
        }
    }

    function showMapSel(speedFactor) {
        $('.pic-preview').hide().slideDown();
        $('.log-map').fadeIn();
        $('.country-selection').slideDown(speedFactor);
        showFooter();
    }

    function hideMapSel(speedFactor) {
        hideFooter;
        $('#switchbut').prop('value','Select from Map');
        $('#switchbut').css({'position':'fixed','left':'40%','width':'20%'});
        $('#switchbut').insertAfter('.logcontainer');
        logButShow();
        
        $('.pic-preview').slideUp(speedFactor);
        $('.log-map').animate({
                'margin-top':'200%'},{
                easing: 'swing',
                duration: speedFactor,
                complete: function(){}}
                ).fadeOut();

        $('.country-selection').slideUp(speedFactor);
        
        // MANDATORY RESET TO KEEP IT WORKING DON'T MESS THIS
        highlight = 0;

        // function clearMap() {
        //     countriesLayer.getSource().clear();
        //     featureOverlay.getSource().clear();
        //     featureOverlay.getSource().removeFeature(highlight);
        // }
        // clearMap();
    }

    // ajax stuff

    var ajaxcontainer = $('.logcontainer');
    var type = 1;
    var isId = 'NAN';
    var tag = 'NAN';

    // Depending on the type, either fill side logs or full page logs
    function ajaxFillLogs(type) {

        // Hide current type
        var currentType = 1 - type;

        if (currentType) {
            hideMapSel(speedFactor);

            var isId = $('#curr-id').text();

            console.log(isId);

            tag = isId;

        } else {
            hideLogs(speedFactor-100);
        }

        window.setTimeout( function() {
            ajaxcontainer.load("{% url 'fillLogs' 2345 5432 %}"
                         .replace(/2345/g, type.toString())
                         .replace(/5432/g, tag.toString()),
                function( response, status, xhr ) {
                    if ( status == "error" ) {
                        var msg = "Sorry but there was an error: ";
                        console.log("LOAD ERROR")
                        $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
                    }
                }
            );
            console.log('Fetching log data from server..');
        }, type ? 4.1*speedFactor : 1.5*speedFactor);
        

        $( document ).ajaxComplete(function() {

            // Unbinding to prevent second call from the other ajax call for text content
            $( document ).unbind('ajaxComplete');
            
            if (type) {
                $('#switchbut').prop('value','Back');
                
                $('#switchbut').css({'position':'absolute','left':'30%','width':'30%'});
                $('#switchbut').appendTo('#map');
                
                window.setTimeout( function() {
                    // refreshing highlight 
                    highlight = 0;
                },1000);
                
                showMapSel(speedFactor);
                countryName = $('#curr-name').text();
                if (countryName != 'NAN') {
                    $('.country-text').text(countryName + ' Preview');
                }

            } else {
                logUpShow(speedFactor);
                hideMisc();
            }

            

        });
    }

    $('#switchbut').click( function() {
        ajaxFillLogs(type);
        type = 1 - type;
    })
    


    //Ajax stuff for displaying more logs

    function getMoreLogs() {

        // Inserting new morelogsAjax div for more logs
        $('<div class="morelogsAjax logcontainer morelogs"></div>').insertAfter('.logcontainer:last');

        var stepMoreLogs = $('.morelogsAjax').length;

        console.log(stepMoreLogs);

        $('.morelogsAjax:last')
            .load("{% url 'moreLogs' 2345 4567 %}"
                .replace(/2345/, stepMoreLogs.toString())
                .replace(/4567/, tag.toString())
                , function( response, status, xhr ) {
                if ( status == "error" ) {
                    var msg = "Sorry but there was an error: ";
                    console.log("LOAD ERROR")
                    console.log( msg + xhr.status + " " + xhr.statusText );
                }
            });

        $( document ).ajaxComplete(function() {

            // Unbinding to prevent second call from the other ajax call for text content
            $( document ).unbind('ajaxComplete');

            hideMisc();

        });
    }

    function removeMoreLogs() {
        $('.morelogsAjax').remove();

    }

    $('#morelogsbut').click( function() {
        getMoreLogs();
    })




});