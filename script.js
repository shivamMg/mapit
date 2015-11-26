$(document).ready(function(){
  var corvo = false, attano = true;
  var m1 = null, m2 = null;
  var step_two_text = 'Now add two markers on the Map by clicking at ' + 
  'the desired points and then click on <strong>Trace Route</strong>';
  // Icons downloaded from http://www.benjaminkeen.com/google-maps-coloured-markers
  var sourceIcon = 's.png', destinationIcon = 'd.png';

  var mapObj = new GMaps({
    el: '#map',
    lat: 48.857,
    lng: 2.295,
    click: function(e) {
      if (corvo) {
        mapObj.removeMarker((attano) ? m1 : m2);
      }

      if (attano) {
        m1 = mapObj.addMarker({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          icon: sourceIcon
        });
      } else {
        m2 = mapObj.addMarker({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          icon: destinationIcon
        });
      }
      // If two markers have been placed
      if (m1 !== null && m2 !== null) {
        corvo = true;
        $('#trace_route').prop('disabled', false);
      }
      attano = !attano;
    }
  });
  
  $('#loc_text').keypress(function(e){
    if (e.which == 13) {
      var address = $('#loc_text').val();
      GMaps.geocode({
        address: address,
        callback: function(results, status) {
          if (status == 'OK') {
            latlng = results[0].geometry.location;
            mapObj.setCenter(latlng.lat(), latlng.lng());
            $('#step_two').html(step_two_text);
          } else if (status == 'ZERO_RESULTS') {
            alert('Sorry, no location named ' + address);
          }
        }
      });
    }
  });

  $('#loc_button').click(function(){
    GMaps.geolocate({
      success: function(position) {
        mapObj.setCenter(position.coords.latitude, position.coords.longitude);
        $('#step_two').html(step_two_text);
      },
      error: function(error) {
        alert('Geolocation failed. Please try again or enter location manually.');
      },
      not_supported: function() {
        alert("Your browser does not support geolocation");
      }
    });
  });

  $('#trace_route').click(function(){
    var m1pos = m1.getPosition();
    var m2pos = m2.getPosition();
    // Remove previous route
    mapObj.removePolylines();
    mapObj.drawRoute({
      origin: [m1pos.lat(), m1pos.lng()],
      destination: [m2pos.lat(), m2pos.lng()],
      strokeColor: '#131540',
      strokeOpacity: 0.6,
      strokeWeight: 6
    });
    $('#static_map').prop('disabled', false);
  });

  $('#static_map').click(function(){
    var c = mapObj.getCenter();
    url = GMaps.staticMapURL({
      size: [1000, 700],
      lat: c.lat(),
      lng: c.lng(),
      zoom: mapObj.getZoom(),
      markers: [
        m1,
        m2
      ]
    });
    $('#static_url').val(url).select();
  });
});
