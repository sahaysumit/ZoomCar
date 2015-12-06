$(document).ready(function(){
    var $itemList = $('.item-list li');
   $('#totalCnt').text($itemList.length);
    $itemList.on('click', function(){
        var indexOf =  $(this).index();
        $.getJSON("https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel", function(data){
            $.each(data.parcels, function(){
                // $('.item-list').append('<li class="clearfix"><div class="left-items"><i class="fa fa-yelp"></i><h4 class="item-name">'+data.parcels.name+'</h4></div></li>')
                var item = data.parcels[indexOf];
                $('.item-hdr').text(item.name);
                $('.itm-cat').text(item.type);
                $('.itm-wt').text(item.weight);
                $('.itm-ph').text(item.phone);
                $('.itm-price').text(item.price);
                $('.itm-qt').text(item.quantity);
                $('.itm-col').css('background-color', item.color);
                $("#image-of-obj").attr("src",item.image);
                $('#maplat').val(item.live_location.latitude);
                $('#maplon').val(item.live_location.longitude);
                var date =  new Date(item.date * 1000);
                var month = date.getMonth();
                var dat = date.getDate();
                var year = date.getFullYear();
                var item1 = item.live_location.latitude;
                var item2 = item.live_location.longitude;
                mapLoader(item1, item2);
                $('.curr-loc').on('click', function(){
                    mapLoader(item1, item2);
                });

                // var month = formatDate.getDate()
                $('.eta').val(month+"/"+dat+"/"+year);
                $('.share-btn').on('click', function(){
                    window.location.href= item.link;
                });
                $('.like-btn').on('click', function(){
                    $(this).css('background-color', 'yellow');
                });
            })
        });
       $itemList.removeClass('active-class');
       $itemList.find('.fa-chevron-circle-down').removeClass('disp-none');
       $itemList.find('.fa-chevron-circle-right').addClass('disp-none');
       $this = $(this);
       $this.addClass('active-class');
       $this.find('.fa-chevron-circle-down').addClass('disp-none');
       $this.find('.fa-chevron-circle-right').removeClass('disp-none'); 
      
    });

    $.getJSON("https://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits", function(data){
        $('#api-hits').text(data.api_hits);
    });
	

	$("#filter").keyup(function(){

    // Retrieve the input field text and reset the count to zero
    var filter = $(this).val();
    if(filter==null){
       $itemList.hide();
        return;
    }

    var regex = new RegExp(filter, "i");
    // Loop through the comment list
    $itemList.each(function(){

        // If the list item does not contain the text phrase fade it out
        if ($(this).find('h4').text().search(regex) < 0 && $(this).find('h5').text().search(regex) < 0) {
            $(this).hide();

        // Show the list item if the phrase matches and increase the count by 1
        } else {
            $(this).show();
        }
    });


});
    function mapLoader(item1, item2){
         var lat = item1,
             lng = item2,
             latlng = new google.maps.LatLng(lat, lng),
             image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
         //zoomControl: true,
         //zoomControlOptions: google.maps.ZoomControlStyle.LARGE,

         var mapOptions = {
             center: new google.maps.LatLng(lat, lng),
             zoom: 13,
             mapTypeId: google.maps.MapTypeId.ROADMAP,
             panControl: true,
             panControlOptions: {
                 position: google.maps.ControlPosition.TOP_RIGHT
             },
             zoomControl: true,
             zoomControlOptions: {
                 style: google.maps.ZoomControlStyle.LARGE,
                 position: google.maps.ControlPosition.TOP_left
             }
         },
         map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions),
             marker = new google.maps.Marker({
                 position: latlng,
                 map: map,
                 icon: image
             });

         var input = document.getElementById('searchTextField');
         var autocomplete = new google.maps.places.Autocomplete(input, {
             types: ["geocode"]
         });

         autocomplete.bindTo('bounds', map);
         var infowindow = new google.maps.InfoWindow();

         google.maps.event.addListener(autocomplete, 'place_changed', function (event) {
             infowindow.close();
             var place = autocomplete.getPlace();
             if (place.geometry.viewport) {
                 map.fitBounds(place.geometry.viewport);
             } else {
                 map.setCenter(place.geometry.location);
                 map.setZoom(17);
             }

             moveMarker(place.name, place.geometry.location);
             $('.MapLat').val(place.geometry.location.lat());
             $('.MapLon').val(place.geometry.location.lng());
         });
         google.maps.event.addListener(map, 'click', function (event) {
             $('.MapLat').val(event.latLng.lat());
             $('.MapLon').val(event.latLng.lng());
             infowindow.close();
                     var geocoder = new google.maps.Geocoder();
                     geocoder.geocode({
                         "latLng":event.latLng
                     }, function (results, status) {
                         console.log(results, status);
                         if (status == google.maps.GeocoderStatus.OK) {
                             console.log(results);
                             var lat = results[0].geometry.location.lat(),
                                 lng = results[0].geometry.location.lng(),
                                 placeName = results[0].address_components[0].long_name,
                                 latlng = new google.maps.LatLng(lat, lng);

                             moveMarker(placeName, latlng);
                             $("#searchTextField").val(results[0].formatted_address);
                         }
                     });
         });
        
         function moveMarker(placeName, latlng) {
             marker.setIcon(image);
             marker.setPosition(latlng);
             infowindow.setContent(placeName);
             //infowindow.open(map, marker);
         }
    }
});
