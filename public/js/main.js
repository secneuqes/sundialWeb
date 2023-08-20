$.lang = {};

$.lang.ko = {
    0: "앙부일구",
    1: "여러분의 위치에 맞는 앙부일구를 만들어보세요!",
    2: "설명",
    3: "학습 파일 다운로드",
    4: "학생용",
    5: "교사용",
    6: "앙부일구 제작",
    7: "앙부일구에 대해 알아보자!",
    8: "언어"
}

$.lang.en = {
    0: "Angbuilgu Sundial",
    1: "Make your own Angbuilgu sundial!",
    2: "Description",
    3: "Download learning files",
    4: "For Students",
    5: "For Teachers",
    6: "Make Angbuilgu Sundial",
    7: "Let's learn about Angbuilgu Sundial!",
    8: "Language"
}

$(window).on('load', function () {
    let lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguage('ko');
    }
});

function setLanguage(currentLanguage) {
    $('[data-langnum]').each(function () {
        $(this).html($.lang[currentLanguage][$(this).data('langnum')]);
        console.log($(this).data('langnum'));
    });
}

$('.langbtn').on('click', function () {
    console.log(`언어변경 : ${$(this).data('lang')}`);
    let lang = $(this).data('lang');
    setLanguageCookie(lang);
    setLanguage(lang);
});

function setLanguageCookie(lang) {
    document.cookie = `lang=${lang}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

function getLanguageCookie() {
    let value = document.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}
