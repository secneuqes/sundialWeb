let latitude, longitude, altitude;
let zoomLevel = 15;
let coords, marker, position;
let decl;
let lang;

$.lang = {};

$.lang.ko = {
    0: '위치 입력',
    1: '현재 위치를 확인해주세요!',
    2: '확인',
};

$.lang.en = {
    0: 'Location',
    1: 'Please check your current location!',
    2: 'OK',
};

$(window).on('load', () => {
    $('#refresh_decl').hide();
    fetchData().then(res => {
        if (res.declination !== null) {
            decl = res.declination;
            if (lang === 'ko') {
                $('#mag_declination').html("편각: " + decl);
            } else {
                $('#mag_declination').html("Magnetic Declination: " + decl);
            }
            $('#ok_btn').attr('disabled', false);
        } else {
            $('#refresh_decl').show();
        }
    });
});

function refresh_declination() {
    fetchData().then(res => {
        if (res.declination !== null) {
            decl = res.declination;
            if (lang === 'ko') {
                $('#mag_declination').html("편각: " + decl);
            } else {
                $('#mag_declination').html("Magnetic Declination: " + decl);
            }
            $('#ok_btn').attr('disabled', false);
            $('#refresh_decl').hide();
        } else {
            $('#refresh_decl').show();
            $('#ok_btn').attr('disabled', true);

        }
    });
}

function initMap() {
    lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguage('ko');
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            altitude = 10;
            coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
            if (lang === 'ko') {
                $('#latitude').html("위도: " + latitude + "°");     // 위도
                $('#longitude').html("경도: " + longitude + "°"); // 경도
                $('#pos_accuracy').html("위치 정확도: ±" + pos.coords.accuracy + " (m)");
            } else {
                $('#latitude').html("Latitude: " + latitude + "°");     // 위도
                $('#longitude').html("Longitude: " + longitude + "°"); // 경도
                $('#pos_accuracy').html("Position Accuracy: ±" + pos.coords.accuracy + " (m)");
            }

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
                latitude = position.lat();
                longitude = position.lng();
                if (lang === 'ko') {
                    $('#latitude').html("위도: " + latitude + "°");     // 위도
                $('#longitude').html("경도: " + longitude + "°"); // 경도
                $('#pos_accuracy').html("위치 정확도: -");
                fetchData().then(res => {
                    decl = res.declination;
                    $('#mag_declination').html("편각: " + decl);
                });
                } else {
                    $('#latitude').html("Latitude: " + latitude + "°");     // 위도
                $('#longitude').html("Longitude: " + longitude + "°"); // 경도
                $('#pos_accuracy').html("Position Accuracy: -");
                fetchData().then(res => {
                    decl = res.declination;
                    $('#mag_declination').html("Magnetic Declination: " + decl);
                });
                }
                
            });
        });
    }
    else {
        if (lang==='ko') {
            alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
}

async function fetchData() {
    const response = await fetch(`/location/decl?lat=${latitude}&lon=${longitude}`, { method: 'GET' });
    const data = await response.json();
    return data;
}

function laturl() {
    location.href = "/loadstl?latitude=" + String(latitude) + "&decl=" + String(decl);
}

function setLanguage(currentLanguage) {
    $('[data-langnum]').each(function () {
        $(this).html($.lang[currentLanguage][$(this).data('langnum')]);
        console.log($(this).data('langnum'));
    });
}

function getLanguageCookie() {
    let value = document.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}