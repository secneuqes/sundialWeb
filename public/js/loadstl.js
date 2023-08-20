let lang;

$.lang = {};

$.lang.ko = {
    0: "STL 파일 로드",
    1: "3D 모델을 생성합니다!",
    2: "기다리는 동안 앙부일구 부품의 원리에 대하여 탐구해보세요!",
    3: "영침",
    4: "지평환",
    5: "시반 & 선",
    6: "태양의 운동이 궁금한가요?",
    7: "태양의 일주운동 시뮬레이션",
    8: "태양의 일주운동 학습하기",
    9: "파일을 제작하는데 평균 4~5분의 시간이 소요됩니다.",
    10: "잠시만 기다려주세요...",
    11: "앙부일구의 구성"
};

$.lang.en = {
    0: "Load STL File",
    1: "Create a 3D model!",
    2: "Explore the principles of the sundial parts while waiting!",
    3: "Pointer",
    4: "Equatorial Ring",
    5: "Dial & Line",
    6: "Are you curious about the movement of the sun?",
    7: "Sun's annual motion simulation",
    8: "Learn about the sun's annual motion",
    9: "It takes an average of 4 to 5 minutes to create a file.",
    10: "Please wait a moment...",
    11: "Sundial's composition"
};

$(window).on('load', () => {
    lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguage('ko');
    }
    var refreshIntervalId = setInterval(() => {
        fetch('/loadstl/progress', { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                let progress = data.progress;
                updateProgress(progress);
                if (data.end) {
                    console.log('button attr');
                    $('#ok_btn').attr('disabled', false);
                    $('#ok_btn').html('다운로드!');
                    clearInterval(refreshIntervalId);
                }
            });
    }, 1000);
})

const sunMoveJava = () => {
    $('.modaltitle').text("태양의 일주운동 시뮬레이션");
    $('.modalcontent').html("");
    $('.modalcontent').append(`<iframe style="overflow-y: hidden;" src="https://javalab.org/diurnal_motion_of_sun/" width="100%" height="1000px" scrolling="no" sandbox="allow-scripts allow-same-origin allow-downloads" allow="fullscreen; geolocation;">
</iframe>`);
}

const sunMoveText = () => {
    $('.modaltitle').text("태양의 일주운동 알아보기");
    $('.modalcontent').html("");
    $('.modalcontent').append(`
<div class="img-slider">
  <div><img src="./img/슬라이드1.jpg" alt="이미지1" id="infoimg"></div>
  <div><img src="./img/슬라이드2.jpg" alt="이미지2" id="infoimg"></div>
  <div><img src="./img/슬라이드3.jpg" alt="이미지3" id="infoimg"></div>
  <div><img src="./img/슬라이드4.jpg" alt="이미지4" id="infoimg"></div>
</div>`);
}

const changeIMG = (a) => {
    $('.modaltitle').text("앙부일구 구성");
    $('.modalcontent').append(`<img class="infoimg" src="./">`)
    $('.infoimg').attr('src', `./img/${a.replace(/^\s+|\s+$/g, '')}.png`);
    console.log(`./img/${a}.png`);
}

const updateProgress = (progress) => {
    if (progress >= 100) {
        $('#progress-bar').attr('value', 100);
        $('#progress-bar').attr('max', 100);
        $('#progress-bar-perc').html('100' + '%');
    } else if (progress > 0 && progress < 100) {
        $('#progress-bar').attr('value', progress);
        $('#progress-bar').attr('max', 100);
        $('#progress-bar-perc').html(progress + '%');
    }
    else {
        $('#progress-bar-perc').html('0%');
    }
}

const mv = document.querySelector("#model-viewer");

flag = 0;

const annotationClicked = (a) => {
    let ds = a.parentNode.dataset;
    mv.cameraTarget = ds.target;
    mv.cameraOrbit = ds.orbit;
    if (ds.fov !== undefined) mv.fieldOfView = ds.fov;
    if (flag === 1) {
        flag = 0;
        mv.cameraTarget = "auto auto auto";
        mv.cameraOrbit = "33.67deg 50.85deg auto";
        mv.fieldOfView = "90deg";
    } else {
        let str = ``;
        flag = 1;
    }
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