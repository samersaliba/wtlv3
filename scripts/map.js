function getDestination (e) {
    return JSON.parse('{"lat": ' + $(e).data('destination').replace(',',', "lng": ')+'}');
}

function showMarkers(){
    $(".card").each(function(index,e){
        addMarker(getDestination (e),index,'FF0000',$('#title' + index).text().trim());
        $(e).find('.badge').text(index); //Number badge
        $(e).find('.collapse').on('show.bs.collapse', function (e) {
            var a = e.target.id.substr(8);
            window.setTimeout(function(){
                map.panTo(getDestination (e.target.parentElement));
                window.setTimeout(function(){
                    map.setZoom(14); 
                },500);
            },500);
        });
        $(e).find('.collapse').on('hide.bs.collapse', function (e) {
            map.fitBounds(bounds);
        });
    });
}
                  
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}	
                        
function showDistInfo (origin){ //show time and distance
    var service = new google.maps.DistanceMatrixService;
    var destinations=[];
    $(".card").each(function(index,e){
        destinations.push(getDestination (e));
    });
    service.getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function(response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
            //console.log(response);
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            //deleteMarkers(markersArray);

            for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    $('.dist').eq(j).text(results[j].duration.text);
                    $('.card').eq(j).data('sort',results[j].distance.value);
                }
            }
            sortItems();
            showMarkers();
        }
    });
} //showDistInfo

function sortItems(){ //sort the churches according to data-sort value
    var divList = $(".card").clone(true,true);
    divList.sort(function(a, b){
        return $(a).data("sort")-$(b).data("sort"); 
    });
    $("#accordion").html(divList);
}

// Delete
function deleteMarkers(markersArray) {
       for (var i = 0; i < markersArray.length; i++) {
           markersArray[i].setMap(null);
       }
       markersArray = [];
}

function addMarker(pos,letter,color,title){
    markersArray.push(new google.maps.Marker({
        title: title,
        map: map,
        position: pos,
        icon: 'https://chart.googleapis.com/chart?' +
           'chst=d_map_pin_letter&chld=' + letter + '|' + color + '|000000'
    }));
    map.fitBounds(bounds.extend(pos));
}

function scrollToMap() { //scroll to show map on smaller devices
    var bodyRect = document.body.getBoundingClientRect()
    var rect = document.getElementById("map").getBoundingClientRect();
    var rect2 = document.getElementById("topnav").getBoundingClientRect();
    document.body.scrollTop = rect.top - bodyRect.top - rect2.bottom;
    window.scroll({ 
        top: rect.top - bodyRect.top - rect2.bottom, // could be negative value
        left: 0, 
        behavior: 'smooth' 
    });
}