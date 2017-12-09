    	
    //---------------------------------------------------
    // BUILDING MAP
    //---------------------------------------------------

    	var style = new ol.style.Style({
	        fill: new ol.style.Fill({
	          color: 'rgba(255, 255, 255, 0)'
	        }),
	        stroke: new ol.style.Stroke({
	          color: '#319FD3',
	          width: 1
	        }),
	        text: new ol.style.Text({
	          font: '12px Calibri,sans-serif',
	          fill: new ol.style.Fill({
	            color: '#000'
	          }),
	          stroke: new ol.style.Stroke({
	            color: '#fff',
	            width: 3
	          })
	        })
	      });



    	// vectorLayer needs a vectorSource

		var vectorSource = new ol.source.Vector({
		  //features: iconFeatures //add an array of features
		});

		var iconFeature = new ol.Feature({
		  geometry: new ol.geom.Point(ol.proj.transform([-72.0704, 46.678], 'EPSG:4326',     
		  'EPSG:3857')),
		  name: 'Null Island',
		  population: 4000,
		  rainfall: 500
		});
	
		vectorSource.addFeature(iconFeature);
		
		var iconFeature1 = new ol.Feature({
		  geometry: new ol.geom.Point(ol.proj.transform([-73.1234, 45.678], 'EPSG:4326',     
		  'EPSG:3857')),
		  name: 'Null Island Two',
		  population: 4001,
		  rainfall: 501
		});
		
		vectorSource.addFeature(iconFeature1);
		
		var markerLayer = new ol.layer.Vector({
		  source: vectorSource,
		  //style: iconStyle
		});
	


		var countriesLayer = new ol.layer.Vector({
	        source: new ol.source.Vector({
	          url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
	          format: new ol.format.GeoJSON()
	        }),
	        style: function(feature, resolution) {
	          //style.getText().setText(resolution < 5000 ? feature.get('name') : '');
	          return style;
	        }
	      });


		var map = new ol.Map({
			target: 'map',
			layers: [
			  new ol.layer.Tile({
			    source: new ol.source.OSM()
			  }),
			  markerLayer,
			  countriesLayer
			],
			view: new ol.View({
			  center: ol.proj.fromLonLat([50, 50]),
			  zoom: 3
			})
		});
        
        
        
        
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        
        // Gradient and pattern are in canvas pixel space, so we adjust for the
        // renderer's pixel ratio
        var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;
        
        var pattern = (function() {
            canvas.width = 11 * pixelRatio;
            canvas.height = 11 * pixelRatio;
            // white background
            context.fillStyle = 'rgba(255, 100, 102, 0.2)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            // outer circle
            context.strokeStyle = 'rgba(155, 50, 50, 0.5)';
            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(11 * pixelRatio,11 * pixelRatio);
            context.stroke();
            // inner circle
            //context.fillStyle = 'rgb(55, 0, 170)';
            //context.beginPath();
            //context.arc(5 * pixelRatio, 5 * pixelRatio, 2 * pixelRatio, 0, 2 * Math.PI);
            //context.fill();
            return context.createPattern(canvas, 'repeat');
          }());
          
        var pattern2 = (function() {
            canvas.width = 11 * pixelRatio;
            canvas.height = 11 * pixelRatio;
            // white background
            context.fillStyle = 'rgba(100, 255, 102, 0.2)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            // outer circle
            context.strokeStyle = 'rgba(50, 155, 50, 0.5)';
            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(11 * pixelRatio,11 * pixelRatio);
            context.stroke();
            // inner circle
            //context.fillStyle = 'rgb(55, 0, 170)';
            //context.beginPath();
            //context.arc(5 * pixelRatio, 5 * pixelRatio, 2 * pixelRatio, 0, 2 * Math.PI);
            //context.fill();
            return context.createPattern(canvas, 'repeat');
          }());
          
        var watStyle = new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: '#f00',
                    width: 1
                  }),
                  fill: new ol.style.Fill({
                    color: check ? pattern2 : pattern
                  }),
                  text: new ol.style.Text({
                    font: '12px Calibri,sans-serif',
                    //text: text,
                    fill: new ol.style.Fill({
                      color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                      color: '#f00',
                      width: 0
                    })
                  })
                });
        
        var watStyle2 = new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: '#0f0',
                    width: 1
                  }),
                  fill: new ol.style.Fill({
                    color: pattern2
                  }),
                  text: new ol.style.Text({
                    font: '12px Calibri,sans-serif',
                    //text: text,
                    fill: new ol.style.Fill({
                      color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                      color: '#0f0',
                      width: 0
                    })
                  })
                }); 
		
		var highlightStyleCache = {};

        var featureOverlay = new ol.layer.Vector({
	        source: new ol.source.Vector(),
	        map: map,
	        style: function(feature, resolution) {
	          var text = resolution < 1 ? feature.get('name') : '';
// 	          if (!highlightStyleCache[text]) {
// 	            highlightStyleCache[text] = watStyle;
// 	          }
	          return watStyle;
	        }
        });
        
        var featureOverlay2 = new ol.layer.Vector({
            source: new ol.source.Vector(),
            map: map,
            style: function(feature, resolution) {
              var text = resolution < 1 ? feature.get('name') : '';
              return watStyle2;
            }
        });
		
		var highlight;
        var displayFeatureInfo = function(pixel) {

        	// For each pixel hovered/clicked, we update feature aka name of zone
	        var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
	          return feature;
	        });

	        var info = document.getElementById('infoID');
	        if (feature) {
	          info.innerHTML = feature.getId() + ': ' + feature.get('name');
	        } else {
	          info.innerHTML = '&nbsp;';
	        }

	        // Testing if we went out of current zone with this new pixel
	        if (feature !== highlight) {
	        	// If so, we switch the highlight from the previous zone to the other
	          if (highlight) {
	            featureOverlay.getSource().removeFeature(highlight);
	          }
	          if (feature) {
	            featureOverlay.getSource().addFeature(feature);
	          }
	          highlight = feature;
	        }

	        return feature;

        };



    //---------------------------------------------------
    // BUILDING JS & AJAX ON MAP
    //---------------------------------------------------

        var isId = 'inMap';
        
        function makeItShine(delay, times, feat) {
            if(!check) {
            	for (var i = 0; i < times; i++) {
            		window.setTimeout( function() {
            		    featureOverlay.getSource().removeFeature(highlight);
                  	
                    }, i*delay);
                    window.setTimeout( function() {
                        featureOverlay.getSource().addFeature(highlight);
                  }, (i+0.5)*delay);
            	}
            } else {
                for (var i = 0; i < times; i++) {
                    window.setTimeout( function() {
                        featureOverlay2.getSource().addFeature(feat);
                    
                    }, i*delay);
                    window.setTimeout( function() {
                        featureOverlay2.getSource().removeFeature(feat);
                  }, (i+0.5)*delay);
                }
                window.setTimeout( function() {
                    featureOverlay2.getSource().addFeature(feat);
                }, times * delay)
            }

        }

        var check = 0;
        
        // Every Pop event will increase the length of isPop for the duration of the event
        // At the end of a Pop event, this flag will be popped from the list
        var isPop = [];
        

        function popFoundLogs(feat, check) {
            $('#infoID2').finish();
            isPop.push(1);
            if (check) {
                $('#infoID2').text(check.toString() + ' logs found for ' + feat.get('name'))
                             .css({'background-color':'rgba(100,255,100,0.7)'})
                             .show();
                
                             
            } else {
          		$('#infoID2').text('No logs found for ' + feat.get('name'))
          		             .css({'background-color':'rgba(255,100,100,0.7)'})
          					 .show();
          	}
          	
            window.setTimeout( function () {
            
                isPop.pop();
                
                if (!isPop.length) {
                    $('#infoID2').fadeOut(speedFactor);
                    
                }
                
            },1000);
        }

      var tag = 'NAN';

      function ajaxFillSideMap(feat) {

      	$('.pic-preview').slideUp(speedFactor/2);

      	type = 2;

      	sideLogContainer = $('.log-preview');

      	var tag = feat.getId();

      	// Implement ajax request to check if there is content for this country
        window.setTimeout( function() {
            sideLogContainer.load("{% url 'fillLogs' 2345 5432 %}"
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
        }, speedFactor/2);
        

        $( document ).ajaxComplete(function() {

            // Unbinding to prevent second call from the other ajax call for text content
            $( document ).unbind('ajaxComplete');

            $('.pic-preview').hide();

            var countryName = feat.get('name');

            $('.country-text').text(countryName + ' Preview');

            $('#switchbut').prop('value','Go to ' + countryName);

            $('#curr-id').text(tag);

            $('#curr-name').text(countryName);

            // Fetching the last image to load in an Image object
            var src = sideLogContainer.find('div:last').css('background-image');
            var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
            console.log(url);
            
            var img = new Image();
            img.src = url;

            // Trigger slide animation and events on Image load
            img.onload = function() {
                console.log('Image loaded');
        
	            $('.pic-preview').slideDown();
	        }

            // Back to map default type
            type = 1;

        });
     }



	// ajax build to know wether selected country has logs or not

	function globalCheckTag(tag) {
		// First step : get the csrf cookie we put in the DOM
		function getCookie(name) {

		    var cookieValue = null;

		    if (document.cookie && document.cookie !== '') {

		        var cookies = document.cookie.split(';');
		        for (var i = 0; i < cookies.length; i++) {
		            var cookie = jQuery.trim(cookies[i]);
		            // Does this cookie string begin with the name we want?
		            if (cookie.substring(0, name.length + 1) === (name + '=')) {
		                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                break;
		            }
		        }

		    }

		    return cookieValue;

		}

		var csrftoken = getCookie('csrftoken');
		// if 403 forbidden error, check console for cookie value
		console.log(csrftoken);


		function csrfSafeMethod(method) {
		    // these HTTP methods do not require CSRF protection
		    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		}

		// setup ajax request header with csrf cookie to be accepted by server
		$.ajaxSetup({

		    beforeSend: function(xhr, settings) {

		        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {

		            xhr.setRequestHeader("X-CSRFToken", csrftoken);

		        }

		    }
		});

		function checkTag(tag) {

		        $.ajax({
		    	   url: "{% url 'checkTag' 2345 %}".replace(/2345/g, tag.toString()),
		         type: "POST",
		         dataType: "json",
		         traditional: true,
		         data: {},
		         success: function(data) {
		                 check = data["check"];
		            }
		    
		        });

		        // Some sneaky adjustment
		        

		    }

		 checkTag(tag);

	}



      map.on('click', function(evt) {
        var feat = displayFeatureInfo(evt.pixel);

        if (feat) {
        	
			

			globalCheckTag(feat.getId());

	        $( document ).ajaxComplete(function() {
	        	// Unbinding to prevent second call from the other ajax call for text content
		        $( document ).unbind('ajaxComplete');
		        popFoundLogs(feat, check);
	        	if (check) {
		            ajaxFillSideMap(feat);
	        	} else {
	        	
	        	}
	        	
	        	makeItShine(speedFactor/1.5, 2, feat);
	        	
	        	check = 0;
	        });
	        
        }

      });



      map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        var feat = displayFeatureInfo(pixel);
        if (feat) {
        	$('#map').css( 'cursor', 'pointer' );
        } else {
        	$('#map').css( 'cursor', 'crosshair' );
        }
        
      });
	  
