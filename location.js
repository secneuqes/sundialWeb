let latitude, longitude;
let zoomLevel = 15;
let coords, marker, position;

function initMap() {
    if (navigator.geolocation) {
        //위치 정보를 얻기
        navigator.geolocation.getCurrentPosition((pos) => {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            // coords = new google.maps.LatLng(latitude, longitude);
            coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
            /// console.log(coords);
            $('#latitude').html("위도: " + latitude + "°");     // 위도
            $('#longitude').html("경도: " + longitude + "°"); // 경도
            $('#pos_accuracy').html("위치 정확도: ±" + pos.coords.accuracy + " (m)");
            let map = new google.maps.Map(document.getElementById('map'), {
                zoom: zoomLevel,
                center: coords
            });

            marker = new google.maps.Marker({
                position: coords,
                map: map,
                draggable: true
            });
            google.maps.event.addListener(marker, 'dragend', function () {
                position = marker.getPosition();
                $('#latitude').html("위도: " + position.lat() + "°");     // 위도
                $('#longitude').html("경도: " + position.lng() + "°"); // 경도
                $('#pos_accuracy').html("위치 정확도: -");
            });
        });
    }
    else {
        alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
}

