var svgNS = "http://www.w3.org/2000/svg";
var n;
var svgImg;
var SVGDir = "SVG/"
var imgsDir = "/seterra/images/system/ex/"
var reviewMode = 0;
var canReview = 0;
var typingStarted = 0;
var fontsize;
var labelPadding;
var myAniTimeout2;
var myAniTimeout3;
var myAniTimeout;
var tVideo;
var tVideo1;
var tVideo2;
var origHeight;
var origWidth;
var newWidth;
var newHeight;
var aspectRatio;
var circleTimeout;
var zoomInfoCount = 0;
var hasZoomed = false
var ctrlKeyDown = false;
var myPreventClick = false
var flagHidden = false;
var gameMode = "pin";
// var arrQuestions = [];
var questionCount;
var arrHints = [];
var currQuestion = "";
var currQ;
var radiusRatio;
var i5;
var hideRect;
var hideText;
var hideLabel;
var q;
var ordinal;
var qid;
var objQ;
var mouseX;
var mouseY;
var anim = false;
var guesses = 0;
var correctClicks = 0;
var wrongClicks = 0;
var totalClicks = 0;
var score;
var flasher;
var flasher2;
var isFlashing = false;
var flashTimeout;
var fadeTime = 50;
var gameTime;
var gameDuration;
var gameDuration2;
var gMode;
var infoTextX = 0
var infoTextY = 0
var infoTextWidth = 0
var infoTextHeight = 0
var start;
var end;
var newTime;
var totalSeconds;
var scale = 1;
var isDragChecking = false;
var scalenum = 0;
var lastLeft = 0;
var lastTop = 0;
var scrollingDisabled = false;
var usingTouch = false;
var currentDragItem;
var currentHover;
var currAreaHover = '';
var dragX;
var dragY;
var hintPattern = ["*_", "_*_", "__*__", "________________________________________"];
var bDoAnimate = 1;
var panZoom
var mouseDetected = false;
var newLanguageURL
var learnColors = ["#f0c54e", "#7c054e", "#018ccf", "#f3f3f3", "#b92f22", "#529e70", "#0f4d28", "#d154a1"];
var mutationObserverConfig;
var mutationObserverCallback;
var mutationObserver;

function positionPopup() {
    var winH = $(window).height();
    var winW = $(window).width();
    $(".popup-overlay").css('top', winH / 2 - 700 / 2 + window.pageYOffset);
    $(".popup-overlay").css('left', winW / 2 - 800 / 2);
}

$(document).ready(function () {
    $("body").css("cursor", "progress");
    if (getMobileOperatingSystem() == "iOS") {
        $(".appIOS").show()
    }

    if (getMobileOperatingSystem() == "Android") {
        $(".appAndroid").show()
    }
    
    function onMouseMove(e) {
        if (matchMedia('(pointer:fine)').matches) {
            mouseDetected = true;
        }
        window.removeEventListener('mousemove', onMouseMove, false);
        // initializeMouseBehavior();
    }
    window.addEventListener('mousemove', onMouseMove, false);

    if (lang.substr(lang.length - 3) == "-sl") {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/seterra/css/game_vg2.css'));
        guessColors = ["#dddddd ", "#ffd970", "#e2b22d", "#bf4140"];
    } else {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/seterra/css/game_vg1.css'));
    }
    
    //set svg size to override native width/height values
    usingTouch = isTouchDevice();
    setupEventBinding();
    setGameMode();
    if (gameMode == "video") {
        preloadImages()
    }
    scaleSVG();

    if (isChallenge == true) {

        $(".top10-wrapper").addClass("top10-wrapper-challenge")

        setTimeout(function () { if ($("#divDown").is(":visible") == true) { $("#divDown").trigger("click"); } }, 1000);
        $("#divScoreGameMode").hide()
    }
    $(document).keyup(function (event) {
        if (event.keyCode == 82) { //r
            if (event.altKey) {
                hideCompletion()
                $("#completion").hide();
                $('#cmdRestart').click();
            }
        }

        if (event.keyCode == 87) { //w
            if (event.altKey) {
                var n
                n = parseInt($('#contentwrapper').css("max-width")) + 100
                $('#contentwrapper').css("max-width", n.toString() + "px");

                n = parseInt($('#leftcol').css("max-width")) + 100
                $('#leftcol').css("max-width", n.toString() + "px");

                $('#bannerImg').css("max-width", "950px");
                scaleSVG();
            }
        }

        if (event.keyCode == 81) { //q
            if (event.altKey) {
                var n
                n = parseInt($('#contentwrapper').css("max-width")) - 100
                if (n < 1200) { return }
                $('#contentwrapper').css("max-width", n.toString() + "px");

                n = parseInt($('#leftcol').css("max-width")) - 100
                $('#leftcol').css("max-width", n.toString() + "px");
                scaleSVG();
            }
        }
    })

    $(document).keyup(function (event) {
        if (false && event.keyCode == 83) { //s
            if (event.altKey) {
                var svgdiv = document.getElementById("svgDiv")
                var htmlContent = svgdiv.innerHTML;
                var canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'canvas');
                canvas.width = svgdiv.getBoundingClientRect().width;
                canvas.height = svgdiv.getBoundingClientRect().height;
                document.body.appendChild(canvas);
                //rasterizeHTML.drawHTML(htmlContent, canvas);
            }
        }
    })

    $(window).resize(function () {
        if (questionCount == 0) { moveGamePartList(); }
        scaleSVG();
        positionPopup();
        positionSkipButton();
        infoTextX = 0;
        formatInfoText();
        if (gameMode == 'multi') {
            showThisMulti()
        }

        if (gameMode == 'type' || gameMode == 'typeauto') {
            showThisTypeQuestion();
        }
    });

    var pledges = window.getPledgeLevel()
    if (pledges >= 400) {
        $(".openPrintDialog").show()
        $(".openPrintDialog").on("click", function () {

            var h
            h = $("#svgDiv").html()
            $(".popup-overlay").show()
            h = h.replace("svgpoint", "svgpointprint")
            $("#popup-map").html(h);

            $(".popup-overlay, .popup-content").addClass("active");

            var origHeight = $("#svgpointprint").height();
            var origWidth = $("#svgpointprint").width();

            aspectRatio = origWidth / origHeight;
            var newHeight = 500;
            var newWidth = newHeight * aspectRatio;
            $("#svgpointprint").attr("width", newWidth + "px");
            $("#svgpointprint").attr("height", newHeight + "px");
            $("#popup-map").css("left", (670 - newWidth) / 2)
            $("#popup-map").css("top", 0)

            makePrintable();
            positionPopup();
            return (false);
        });
    } else {
        $(".openPrintDialog").hide()
    }

    $(".printclose").on("click", function () {
        $(".popup-overlay, .popup-content").removeClass("active");

        $("#popup-map").html("");
        return (false);
    });

    $("body").css("cursor", "default");

    var userLang = navigator.language || navigator.userLanguage;
    if (typeof availableLanguages !== 'undefined') {
        if (userLang != lang && gameID != '1999') {
            if (availableLanguages.split(',').indexOf(userLang) > -1) {
                let languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
                newLanguageURL = window.location.href.replace("/" + lang + "/", "/" + userLang + "/")
                $("#gameselect").prepend('<div id="divLanguage"><img src="/seterra/images/system/flags/langlistflags/flag-' + userLang + '.png"> &nbsp;This game is also available in ' + languageNames.of(userLang) + '. <a href="' + newLanguageURL + '">Click here</a> to go to the ' + languageNames.of(userLang) + ' version. </div>')
            }
        }
    }

    $(window).focus(function () {
        ctrlKeyDown = false; //Hotfix for the ctrl+t bug
    })
});

function logLanguageChange() {
    writeToLogFile("Language change. From: " + window.location.href + ". To: " + newLanguageURL)
}

function isTouchDevice() {
    return 'ontouchstart' in window
        || 'onmsgesturechange' in window;
};

function moveGamePartList() {
    var svg = document.getElementById("svgpoint");
    var pnt = svg.getBBox();
    var p = $(".gamewindow:first");
    var position = p.position();
    if (p.width() > 500) {
        setTimeout(function () {
            $(".gamelist").css({
                "position": "absolute",
                top: p.position().top - 80,
                left: p.position().left + 100,
                width: p.width() - 180,
                "z-index": 999,
                padding: "10px",
                opacity: 0.8,
                "font-size": "21px",
                border: "1px solid gray",
                "border-radius": "10px"

            })
            if (darkmode == '1') {
                $(".gamelist").css({
                    backgroundColor: "#0e1e43",
                })
            } else {
                $(".gamelist").css({
                    backgroundColor: "white",
                })
            }
        }, 1000)
    }
}

function initGame() {

    mutationObserverConfig = { attributes: false, childList: true, subtree: true, characterData: true,};
    mutationObserverCallback = function (mutationsList, observer) {
        if (parseInt($("#lblFinalScore2").text()) > score) {

            $('#completion').css("background-color", "#bf4140")
            setTimeout(function () {
                writeToLogFile("Cheating attempted: " + $('#lblFinalScore2').text() + " Actual score: " + score + " Page: " + window.location.href + " Game mode: " + $("#drpGameMode option:selected").text())
                setupCompletion()
                showCompletion()
            }, 100)
            showCheating()
        }
    };
    mutationObserver = new MutationObserver(mutationObserverCallback);

    $("g").removeData("centerpointx")
    $("g").removeData("centerpointy")

    $("#divTips").html("")

    if (customID != '') {
        $("#divTips").hide()
    }

    if (typeof (aspectRatio) != "undefined" && typeof (panZoom) != "undefined") {
        panZoom.setViewBox(0, 0, 900, 900 / aspectRatio, 0)
    }

    mutationObserver.disconnect();

    $("input").blur();
    $("#divFlagZoom").hide();

    $("g").attr("data-colors", "0")

    if (gameMode == 'pin' && window.location.href.indexOf("fastclick=1") == -1 && window.location.href.indexOf("hoverclick=1") == -1 && window.location.href.indexOf("shownext=1") == -1) {
        $('#divSkip').show()
    } else {
        $('#divSkip').hide()
    }

    $("g").removeClass("prompted")

    clearTimeout(tVideo)
    clearTimeout(tVideo1)
    clearTimeout(tVideo2)
    clearTimeout(myAniTimeout2)
    anim = detectAnimation()
    $("#anicircle2").remove

    updateReviewLink();
    disableReviewLink();
    hideTypeInputForm();
    hideMultiInputForm();
    $(".gamepartlist").show();
    clearHints();
    $(".showafter").css({ opacity: '' });

    $('#INFOTEXT').css({ opacity: "0.001" })
    $("label_quizLabel").remove()

    if (lang.substr(lang.length - 3) == "-sl" || gameID == '3448') {
        fontsize = 20
        labelPadding = 18
    } else {
        fontsize = 12
        labelPadding = 8
    }
    if (reviewMode == 0) {
        clearCorrect();
    } else {

    }
    objCountry = jQuery.grep(objCountry2, function (n) { return (n.quiz == 1 && n.correct == 0) });

    questionCount = objCountry.length;
    if (questionCount == 0) { moveGamePartList(); }
    q = "";

    guesses = 0;
    correctClicks = 0;
    wrongClicks = 0;
    totalClicks = 0;
    currQuestion = "";
    typingStarted = 0;
    clearScore();
    hideExtraInfo();
    $(".city3").remove();
    $(".city2").remove();
    $(".imgFlag").remove();

    if (gameMode != 'typeeasy') {
        $("#dlstgamelist").show();
    }

    $("#currQuestion").html("");

    if (gameMode.substr(0, 5) == "place") {
        if (gameMode == 'placelabels') { $("#currQuestion").html("| " + dragDropText1) } else { $("#currQuestion").html("| " + dragDropTextFlags1) }
        $("#imgQuestionFlag").hide();
    }

    if (gameMode == 'type' || gameMode == 'typeauto') {
        $("#currQuestion").html("| " + inputLabel);
        $("#imgQuestionFlag").show();
    }

    if (gameMode == "typeeasy") {
        $("#imgQuestionFlag").hide();
        updateScore();
        var i
        for (i = 0; i < objCountry.length; i++) {
            objCountry[i].cleanText = cleanUpSpecialChars(objCountry[i].qText)
        }
    }

    if (showInfoText == 0) {
        $("#divExtraInfo").hide();
        $("#divExtraInfo").height(0);
    }

    if (gameMode == "video") {
        if (window.location.href.indexOf("alphabetical=1") == -1) {
            shuffle(objCountry)
        }
        $("#currQuestion").html("");
        $("#imgQuestionFlag").hide();
        $("#HUDWrapper").hide();
        $("#divExtraInfo").hide();
        $('#timer').hide;
        $("#HUD").hide();
    }

    if (gameMode == 'video' || gameMode == 'show') {
        for (var i = objCountry.length - 1; i >= 0; i--) {
            if (objCountry[i].imageFile != '') {
                $("#leftcol").append("<img class='imgFlag' id='IMG_" + objCountry[i].id + "' src='/seterra/images/system/flags/" + HTMLClean(objCountry[i].imageFile) + "' style='height:2px'>")
            }
        }
    }

    gameReset2();
    stopFlashing();
    setupCompletion();
    clearLabels();
    svgImg = document.getElementById("svgDiv")
    formatInfoText();
    initMap(svgImg);
    n = svgImg.getElementsByTagName("g");
    initGroups(n);

    $('#imgInFlag').hide();
    $('#imgOutFlag').hide();

    objEventBinding();

    var svgtop;
    svgtop = $("svg").offset().top - 20;

    if (gameMode == '-') { gameMode = 'learn' };
    if (gameMode != 'learn' && gameMode != 'wikipedia' && gameMode != 'show') {

        $("#HUDGroup").show();
        $("#score").show();
        if (gameMode != 'multi') {
            $("#timer").show();
        } else {
            $("#timer").hide();
        }
        $("#currQuestion").show();
        $("#HUDWrapper").css("opacity", "0.5");

        opacity: 0.5;
        if (objCountry.length > 0) startTimer();
    } else {
        $('#imgQuestionFlag').hide();

        $("#score").hide();
        $("#timer").hide();
        $("#currQuestion").hide();
        $("#HUDWrapper").css("opacity", "0.1");
    }
    if (objCountry.length == 0) $("#HUDGroup").hide();
    var i = 0;
}

function updateReviewLink() {
    var obj1, obj2

    if (lang == "am" || lang == "cs" || lang == "zh" || lang == "el" || lang == "tr" || lang == "en" || lang == "sv" || lang.substr(lang.length - 3) == "-sl" || lang == "sv-an" || lang == "en-an" || lang == "de-an" || lang == "de" || lang == "ja" || lang == "hu" || lang == "da" || lang == "uk" || lang == "fr" || lang == "nb" || lang == "pl" || lang == "nl" || lang == "fi" || lang == "ru" || lang == "ro" || lang == "tr" || lang == "pt" || lang == "it" || lang == "es") {
        obj1 = jQuery.grep(objCountry2, function (n) { return (n.quiz == 1 && n.correct == 0) });
        obj2 = jQuery.grep(objCountry2, function (n) { return (n.quiz == 1) });
        if (obj1.length > 0 && obj1.length != obj2.length) {
            enableReviewlink();
        } else {
            disableReviewLink();
        }
    } else {
        $("#lnkReview").hide();
    }
}

function enableReviewlink() {
    document.getElementById("lnkReview").style.pointerEvents = "default";
    document.getElementById("lnkReview").style.cursor = "pointer";
    document.getElementById("lnkReview").style.opacity = "1";
    canReview = 1;
}

function disableReviewLink() {
    document.getElementById("lnkReview").style.pointerEvents = "auto";
    document.getElementById("lnkReview").style.cursor = "default";
    document.getElementById("lnkReview").style.opacity = "0.3";
    canReview = 0;
}

function setCorrect(id) {
    var i
    for (i = 0; i < objCountry2.length; i++) {
        if (objCountry2[i].id == id) {
            objCountry2[i].correct = 1;
        }
    }
}

function clearCorrect(id) {
    for (var i = 0; i < objCountry2.length; i++) {
        objCountry2[i].correct = 0;
    }
}

function setReviewMode(mode) {
    reviewMode = mode;
}

function clearHints() {
    arrHints = [];
    $("#hints").html('');
}

function showCheating() {
    $("#divCheating").remove()

    $("#panBlog").after("<div class='featureddiv'  id='divCheating' style='margin-left: -20px;'><div class='featureditem'><a class= featured' href='/seterra/en/p/cheating-in-school'><div class='divFeaturedImage'><img title='Cheating in school' class='featuredimage' src='/images/system/cheating-in-school_150.jpg' alt='Why Cheating in School Is Wrong' width='150' border='0'></div><b>Cheating in School—There's No Upside!</b></span></h4><p style='margin:0px'><span>Read why cheating is wrong and learn the consequences. </span></p></a></div></div></div><div style='clear:both'></div>")
    blink("#divCheating");
}

function blink(selector) {
    $(selector).fadeOut(2000, function () {
        $(this).fadeIn(2000, function () {
            blink(this);
        });
    });
}

function clearLabels() {
    $(".svgLabelTextVideo").remove();
    $(".svgLabelText").remove();
    $(".labelBkgrd").remove();
    $(".labelBkgrd2").remove();
    $(".infoLink").remove();
    $(".dragItem").remove();
    $(".label").remove();
    $(".qImgWrapper").remove();
    $(".flagImage").remove();
    $(".flagRect").remove();
}

function scaleSVG() {
    origHeight = $("#svgpoint").height();
    origWidth = $("#svgpoint").width();
    aspectRatio = origWidth / origHeight;
    newWidth = $(".gamewindow").width();
    newHeight = newWidth / aspectRatio;

    $("#svgpoint").attr("width", newWidth + "px");
    $("#svgpoint").attr("height", newHeight + "px");
    $("#svgDiv").attr("width", newWidth + "px");
    $("#svgDiv").attr("height", newHeight + "px");
    scale = newWidth / origWidth;
    scalenum++;
}


function setupEventBinding() {
    $("input[name='gameMode']").change(function () { setGameMode() });

    $('#cbSoundOn').prop('checked', (typeof sessionStorage.cbSoundOn !== 'undefined') ? (sessionStorage.cbSoundOn == 'true') : true);
    //when checkbox is updated, update stored value
    $('#cbSoundOn').change(function () { sessionStorage.cbSoundOn = $(this).prop('checked'); });

    //when checkbox is updated, update stored value
    $('#cbVoice').change(function () { sessionStorage.cbVoice = $(this).prop('checked'); if (gameMode == "pin" || gameMode == "pinhard" || gameMode == "placelabels" || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') { playLocation(lang, q) } });

    // $(window).resize(function () { scaleSVG() })
    $(window).resize(function () {
        formatInfoText();
    })
}

function objEventBinding() {
    $(".q").removeAttr("onclick");
    $(".q").removeAttr("ondblclick");
    $(".q").removeAttr("onmousedown");
    $(".q").removeAttr("onmouseover");
    $(".q").removeAttr("onmouseenter");
    $(".noq").removeAttr("onclick");
    $(".noq").removeAttr("onmousedown");
    $(".q").off("click");
    $(".q").attr("data-toggle", "0")
    $("body").unbind("keyup");
    $("body").unbind("keypress");
    $(window).unbind("mousemove")
    $(".gamewindow").unbind('mouseenter mouseleave');

    if (gameMode == "wikipedia") {
        $(".q").attr("onclick", "playLocation(lang,this.id);window.open(this.getAttribute('data-wikipediaLink'), '_blank');showInfoText2(this);return false;");
        $(".q").attr("onmouseover", "showLabel(this,false , '#FFFFFF', false);");
        $(".q").attr("onmouseout", "$('#RECT_' + this.id).remove(); $('#TEXT_' + this.id).remove();hideLines(this)");
        $(this)

    } else {
        $(".q").prop("onclick", null);
        $(".q").prop("onmouseover", null);
        $(".q").prop("onmouseout", null);

        $(".q").contextmenu(function () {
            return true;
        })
    }

    if (gameMode == "pin") {
        if (typeof tipModeP != 'undefined') {
            $("#divTips").html(getString(tipModeP))
        }
    }

    if (gameMode == "learn") {
        if (typeof tipModeL != 'undefined') {
            $("#divTips").html(getString(tipModeL))
        }
        $(".q").attr("onclick", "learn(event,this, true)");
        $(".q").attr("ondblclick", "learn(event,this, false);event.preventDefault()");
        if (flagHidden == false) { $("#imgInFlag").show() } else { $("#imgOutFlag").show() }
    }

    if (gameMode == "show") {
        if (true) { //showall 
            //$("#divTips").html(getString(tipModeS))
            $(".q").attr("onclick", "if (myPreventClick == true || ctrlKeyDown == true) { return } else {showAllClick(event, this) };");
            $(".semitransparent").attr("fill-opacity", semitransparentOpacity);

            $(".semitransparent").attr("fill", semitransparentColor);
            showAllLabels()
        } else {
            $(".showafter").css({ opacity: 1 });
            $(".q").attr("onclick", "showLabelToggle2(this,false, '#FFFFFF', true);playLocation(lang,this.id,this.getAttribute('data-sayAfter'));showInfoText2(this);");
            $(".semitransparent").attr("fill-opacity", semitransparentOpacity);
            $(".semitransparent").attr("fill", semitransparentColor);
            for (var i = objCountry.length - 1; i >= 0; i--) {
                addSVGAttribute(document.getElementById(objCountry[i].id), "answered");
                showLabel(document.getElementById(objCountry[i].id), false, '#259853', true); //MW
            }
        }

        $("body").keypress(function (e) {
            if (e.which == 102) { //f
                removeAllLabels()
                for (var i = objCountry.length - 1; i >= 0; i--) {
                    document.getElementById(objCountry[i].id).setAttribute('data-toggle', "1")
                    showAFlag(document.getElementById(objCountry[i].id), false); //MW
                }
            }
        });

        $("body").keypress(function (e) {
            if (e.which == 97) { //a
                for (var i = objCountry.length - 1; i >= 0; i--) {
                    document.getElementById(objCountry[i].id).setAttribute('data-toggle', "1")
                    showLabel(document.getElementById(objCountry[i].id), false, '#eeeeee', true); //MW
                }
            }
        });

        $("body").keypress(function (e) {
            if (e.which == 103) { //g
                removeAllLabels()
                for (var i = objCountry.length - 1; i >= 0; i--) {
                    document.getElementById(objCountry[i].id).setAttribute('data-toggle', "1")
                    var len = getTextLength(document.getElementById(objCountry[i].id));
                    if (len > 5) {
                        showAFlag(document.getElementById(objCountry[i].id), false); //MW
                    } else {
                        showAFlag(document.getElementById(objCountry[i].id), true); //MW}
                    }
                }
            }
        });
    }

    if (gameMode == 'pinhard' || gameMode == 'pinhardnoborders') {
        $(".noq").attr("onclick", "checkQuestion(this, evt)");
    }

    if (gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') {
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/seterra/css/noborders.css'));
        if (gameID == '3167') { //special case
            $(".misc").hide()
        }
    } else {
        if (window.location.href.indexOf("noborders=1") == -1) {
            $('link[rel=stylesheet][href~="/seterra/css/noborders.css"]').remove();
        }
    }

    if (gameMode == 'pin' || gameMode == 'pinhard' || gameMode == 'pinflags' || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') {
        if (showInfoImageTop == 1) {

            if (flagHidden == false) { $("#imgInFlag").show() } else { $("#imgOutFlag").show() }
        }

        $(window).mousemove(function (event) {
            $("#label_quizLabel").offset({ top: event.pageY + 18, left: event.pageX + 5 });
            $(".label").stop();
            $(".label").css({ "opacity": "1" })
            lastLeft = event.pageX; lastTop = event.pageY;
        });
        $(".gamewindow").hover(function () { makeQuizLabel(showInfoImageTop, qText, objQ.imageFile); $(".label").fadeIn() }, function () { $(".label").hide() });

        if (window.location.href.indexOf("fastclick=1") != -1) {
            $(".q").attr("onmousedown", "checkQuestion(this, evt)");

        } else if (window.location.href.indexOf("hoverclick=1") != -1) {
            $(".q").attr("onmouseover", "checkQuestion(this, evt)");
            $(".clickarea").css("pointer-events", "none");
        } else {
            $(".q").attr("onclick", "checkQuestion(this, evt)");
        }
        objCountry = shuffle(objCountry);
        if (objCountry.length > 0) nextQuestion();
    }

    if (gameMode == 'pin' && $("#divSkip").is(":visible")) {
        $("body").keyup(function (e) {

            if (event.altKey == true) {
                if (event.keyCode == 83) { //s
                    event.preventDefault();
                    nextQuestion();
                }

                if (event.keyCode == 72) { //h, generate hashtags
                    var html = $("#dlstgamelist").html()
                    var regex = /(<([^>]+)>)/ig
                    html = html.replace(regex, "");
                    html = html.replace(/ /g, '')
                    html = html.split(",").map(val => "#" + val).join(' ');
                    $("#dlstgamelist").html(html)
                }
            }
        })
    }

    if (gameMode == "multi") {
        if (typeof tipModeM != 'undefined') {
            $("#divTips").html(getString(tipModeM))
        }
        objCountry = shuffle(objCountry);
        showMultiInputForm();
        //$("#cmdRestart").focus();
        setTimeout(function () { nextMulti(); }, 50);
        $("body").unbind("keyup");
        $("body").keyup(function (e) {
            if (e.which == 49) {
                checkMultiAnswer('1');
                e.preventDefault();
            }

            if (e.which == 50) {
                checkMultiAnswer('2');
                e.preventDefault();
            }

            if (e.which == 51) {
                checkMultiAnswer('3');
                e.preventDefault();
            }

            if (e.which == 52) {
                checkMultiAnswer('4');
                e.preventDefault();
            }
        });

        $("body").keyup(function (e) {

            var event = window.event || e;
            if (event.ctrlKey == true) {
                if (event.keyCode == 39) {
                    $("#multiInputForm").css('left', parseInt($("#multiInputForm").css('left')) + 100);
                }
                if (event.keyCode == 37) {
                    $("#multiInputForm").css('left', parseInt($("#multiInputForm").css('left')) - 100);
                }
            }
            if (event.altKey == true) {

                if (event.keyCode == 72) { //h
                    event.preventDefault();
                    getHint();
                }
                //if (event.keyCode == 83) { //s
                //    event.preventDefault();
                //    nextMulti();
                //}
            }

            if (event.keyCode == 38) {
                $("#multiInputForm").css('top', parseInt($("#multiInputForm").css('top')) - 100);
            }
            if (event.keyCode == 40) {
                $("#multiInputForm").css('top', parseInt($("#multiInputForm").css('top')) + 100);
            }
        })
    }

    if (gameMode == 'type' || gameMode == 'typeauto') {
        if (typeof tipModeT != 'undefined') {
            $("#divTips").html(getString(tipModeT))
        }
        objCountry = shuffle(objCountry);
        showTypeInputForm();

        nextTypeQuestion();
        setTimeout(function () { showThisTypeQuestion(); }, 300);

        $("body").keypress(function (e) {
            if (e.which == 13) {
                checkTypeAnswer();
                e.preventDefault();
            }
        });
    }

    if (gameMode == "typeeasy") {
        showTypeEasyInputForm();
        $("#dlstgamelist").hide();

        $("body").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
            }
        });
        $("body").unbind("keyup");
        $("body").keyup(function (e) {

            if (event.altKey == false && event.key != "Alt") {
                if (typingStarted == 0) { gameReset2(); startTimer(); typingStarted = 1 }
                checkTypeEasyAnswer();
            }
        });
    }

    if (gameMode == "video") {
        $("#imgVideo").fadeIn(500);
        i5 = 0;
        $("#lblVideo").css("color", "white")
        $("#lblVideo").text(gameName);
        $("#lblVideo").hide();
        $("#lblVideo").css("top", "400px");
        $("#lblVideo").css("font-size", "20px");
        $("#lblVideo").css("opacity", "0.01")
        $("#lblVideo").show();
        $("#lblVideo").animate({
            "font-size": "40px", "opacity": "1"
        }, 1000);

        setTimeout(function () {
            videoLoop();
        }, 1000);

        setTimeout(function () {
            $("#lblVideo").fadeOut(1200)
            $("#imgVideo").fadeOut(1200)

        }, 3000)
    } else {
        $("#lblVideo").hide();
        $("#imgVideo").hide();
    }


    if (gameMode.substring(0, 5) == "place") {
        createDragLabels();

        var strOn
        if (window.location.href.indexOf("hoverclick=1") == -1) {
            strOn = "mousedown"
        } else {
            strOn = "mouseover"
        }

        $(".dragItem").on(strOn, function () {
            bDoAnimate = 1;

            clearTimeout(hideRect);
            clearTimeout(hideText);

            $("#RECT_INFO").remove();
            $("#TEXT_INFO").remove();

            $(".dragItem").removeClass("clickedLabel");
            $(this).addClass("clickedLabel");
            if (isFlashing == true) {
                stopFlashing();
                paintGroup(document.getElementById(q), "#006633");
            }

            q = $(this).attr("id");
            q = q.replace("LABEL_", "");
            if (gameMode == "placelabels") {
                playLocation(lang, q);
            }

            for (var i = objCountry2.length - 1; i >= 0; i--) {
                if (objCountry2[i].id == q) {
                    if (gameMode == 'placelabels' || objCountry2[i].imageFile == '') {
                        $('#currQuestion').html(" | " + clickOnText + ' ' + objCountry2[i].qText);
                    } else {
                        $('#currQuestion').html(" | " + clickOnText + " <img style='height:20px' src='/seterra/images/system/flags/" + objCountry2[i].imageFile + "'>");
                    }
                    if (gameMode == "placeflags") {
                        if (showInfoImageTop == 1 && objCountry2[i].imageFile != "") {
                            $('#imgQuestionFlag').show();
                            $('#imgQuestionFlag').attr('src', '/seterra/images/system/flags/' + objCountry2[i].imageFile);

                        } else {
                            $('#imgQuestionFlag').hide();
                        }
                    }
                }
            }
        });
        if (window.location.href.indexOf("fastclick=1") == -1) {
            $(".q").attr("on" + strOn, "checkDragQuestion(this, evt)");
        } else {
            $(".q").attr("onmousedown", "checkDragQuestion(this, evt)");
        }
    }


    if (gameMode == "placeflags") {

        $("body").keypress(function (e) {
            if (e.which == 102 && location.hostname === "localhost") {
                for (var i = objCountry.length - 1; i >= 0; i--) {

                    len = getTextLength(document.getElementById(objCountry[i].id));
                    showLabel(document.getElementById(objCountry[i].id), false, '#ffffff', false); //MW

                    if (len < 3) {
                        $("#FLAG_" + objCountry[i].id).fadeOut(2000);
                        $("#FLAGRECT_" + objCountry[i].id).fadeOut(2000);
                    }
                }
            }
        });
    }

    if (objCountry.length > 40) {
        $(window).bind('mousewheel DOMMouseScroll', function (event) {
            if (ctrlKeyDown == false) {
                if (typeof (panZoom) == 'undefined' && mouseDetected == true && window.location.href.indexOf("nozoom=1") == -1) {

                    if (zoomInfoCount < 2 && $("#zoomInfo").is(":hidden")) {
                        $("#zoomInfo").show(); $("#zoomInfo").fadeOut(5000);
                        zoomInfoCount++
                    }
                }
            }
        })
    }

    $("body").keydown(function (e) {
        if (e.which == 17) {
            ctrlKeyDown = true;
            if (typeof (panZoom) == 'undefined' && mouseDetected == true && window.location.href.indexOf("nozoom=1") == -1 && (window.location.href.indexOf("fastclick=1") == -1 || window.location.href.indexOf("zoom=1")!=-1)) {
                panZoom = $("#svgpoint").svgPanZoom({
                    events: {
                        drag: true,
                        dragCursor: "move", // cursor to use while dragging the SVG
                        doubleClick: false
                    },

                    animationTime: 0,
                    limits: {
                        x: 0,
                        y: 0,
                        x2: 900,
                        y2: Math.round(900 / aspectRatio)
                    },

                    initialViewBox: {
                        x: 0,
                        y: 0,
                        width: 900,
                        height: Math.round(900 / aspectRatio)
                    },
                    maxZoom: 40,
                    zoomFactor: 0.25
                })
            }
        }
    });

    $("body").keyup(function (e) {
        if (e.which == 17) {
            ctrlKeyDown = false;
        }
    });
}



function showAllClick(event, x) {

    if (event.altKey == true) {
        paintNextColor(x)
    } else {
        showLabelToggle2(x, false, '#FFFFFF', false);
        showInfoText2(x);
        if (x.getAttribute('data-toggle') == '0') {
            playLocation(lang, x.id, x.getAttribute('data-sayAfter'))
        }
    }
}

function showAllLabels() {
    for (var i = objCountry.length - 1; i >= 0; i--) {
        showLabel(document.getElementById(objCountry[i].id), false, '#ffffff', false); //MW
    }
}

function onPanZoom() {
    if (gameMode == 'multi') {
        showThisMulti()
    }
    if (gameMode == 'type' || gameMode == 'typeauto') {
        showThisTypeQuestion()
    }

    formatInfoText();

    if (typeof (panZoom) != "undefined") {
        var w = panZoom.getViewBox().width
    }

    if (w < 300) {
        $('.labelBkgrd').css('opacity', '0.8');
        $('.city, .city1').css('opacity', '0.5');

        $(".clickarea").css("pointer-events", "none");
        $(".city2").css("pointer-events", "none");
        $(".flagImage").css("pointer-events", "none");
        $(".flagImage").css('opacity', '0.7');

        if (hasZoomed == false) {
            setTimeout(function () {
                //writeToLogFile("Zooming <300. Page: " + window.location.href + ". Game mode: " + gameMode)
            }, 100)
            hasZoomed = true;
        }
    }
    if (w >= 300) {
        $(".flagImage").css("pointer-events", "");
        $(".flagImage").css('opacity', '1');
        $('.labelBkgrd').css('opacity', '0.8');
        if (window.location.href.indexOf("hoverclick=1") == -1) {
            $(".clickarea").css("pointer-events", "");
        }
        $(".city2").css("pointer-events", "");
        if (w < 700) {
            $('.city, .city1').css('opacity', '0.7');
        }
    }
    if (w > 500) { $('.labelBkgrd').css('opacity', '0.7'); }
    if (w > 700) {
        $('.labelBkgrd').css('opacity', '0.9');
        $('.city, .city1').css('opacity', '1');
    }
    if ((window.location.href.indexOf("resizelabels=1") != -1 || true)) {
        var n = 0;
        $(".svgLabelText").each(function (index, element) {
            if ($(this).css("display") != 'none') {
                var id
                n = n + 1
                id = $(this).attr("id")
                id = id.substring(5, id.length)
                positionAndResizeLabel(id)
            }
        });
    }
}

function learn(event, x, fade) {

    if (event.altKey == true) {
        if (fade == true) {

            paintNextColor(x)
        }
    } else {
        if (fade == true) {
            showLabel(x, 8000, '#d6e9de', false);
            var color = $(x).attr("data-colors");
            if (typeof color === "undefined") {
                if (lang.substr(lang.length - 3) != "-sl") { addSVGAttribute(x, "learnClicked"); }
            }
        } else {
            showLabel(x, false, '#FFFFFF', false);
            var cwidth = $("#RECT_" + x.id).attr('width');
            var cleft = $("#RECT_" + x.id).attr('x');
            $("#RECT_" + x.id).attr('x', parseFloat(cleft) - 2);
            $("#RECT_" + x.id).attr('width', parseFloat(cwidth) + 4);
        }
        playLocation(lang, x.id, x.getAttribute('data-sayAfter'));
        showInfoText2(x);
        if (showInfoImageTop == 1 && x.getAttribute('data-imageFile') != "") {
            $('#imgQuestionFlag').show();
            $('#imgQuestionFlag').attr('src', '/seterra/images/system/flags/' + x.getAttribute('data-imageFile'));
        } else {
            $('#imgQuestionFlag').hide();
        }
    }
}

function paintNextColor(x) {
    var color = $(x).attr("data-colors");
    if (typeof color === "undefined") {
        color = 0
    } else {
        color = parseInt(color)
    }

    if (color != (learnColors.length)) {
        paintGroup(x, learnColors[color])
        $(x).attr('class', '');
    } else {
        unPaintGroup(x)
        $(x).attr("class", "q");
    }
    color++
    color = color % (learnColors.length + 1)

    $(x).attr("data-colors", color);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// This function runs the hidden game mode "video", which can only be started by replacing p with v in the URL.
// Example: https://online.seterra.com/en/vgv/3007 . The game mode can be used for creating youtube videos. 
function videoLoop() {
    tVideo = setTimeout(function () {
        var objArea;

        scaleSVG();
        if (i5 > 0 && i5 < objCountry.length + 1) {
            var currG = document.getElementById(objCountry[i5 - 1].id);
        }
        if (i5 < objCountry.length) {
            playCorrectAnswerSound(1);
            paintGroup(document.getElementById(objCountry[i5].id), "#ffffff");

            var objArea = document.getElementById(objCountry[i5].id);
            $("#anicircle2").remove
            bDoAnimate = true;
            clearTimeout(myAniTimeout2)
            showCircle(objArea, "#anicircle2")

            var currG = document.getElementById(objCountry[i5].id);
            var rad = $(currG).find(".city").attr("r")

            if (rad == undefined) {
                rad = $(currG).find(".city1").attr("r")
            }
            rad = parseInt(rad)
            $(currG).find(".city").attr("r", (rad + 2).toString());
            $(currG).find(".city1").attr("r", (rad + 2).toString());
            var obj = document.getElementById(objCountry[i5].id)
            setTimeout(function () {
                obj.classList.remove("q")
            }, 2500)

            setTimeout(function () {
                $(currG).find(".city").attr("r", rad);
                $(currG).find(".city1").attr("r", rad);
            }, 3000)
        }
        tVideo1 = setTimeout(function () {
            if (i5 < objCountry.length + 1) {
                playLocation(lang, objCountry[i5 - 1].id);
            }
            showCircle(objArea, "#anicircle")
        }, 1500);

        tVideo2 = setTimeout(function () {
            if (i5 < objCountry.length + 1) {
                objArea = document.getElementById(objCountry[i5 - 1].id);
                showLabel(objArea, false, "#eeeeee", false);

                var strID = objCountry[i5 - 1].id
                var imgFile = objArea.getAttribute('data-imageFile')
                var p = getCenterpoint(objArea);
                addFlag(p.x, p.y - 38, imgFile, objCountry[i5 - 1].id)

                setTimeout(function () {
                    $("#RECT_" + strID).fadeOut(1000);
                    $("#TEXT_" + strID).fadeOut(1000)
                }, 1000);

                setTimeout(function () {
                    $("#FLAG_" + strID).fadeOut(1000)
                    $("#FLAGRECT_" + strID).fadeOut(1000)
                    paintGroup(document.getElementById(objCountry[i5 - 1].id), "#eeeeee");
                }, 1000);
            }
        }, 1700);
        //  increment the counter
        if (i5 < (objCountry.length)) {            //  if the counter < 10, call the loop function
            videoLoop();             //  ..  again which will trigger another 
        } else {
            setTimeout(function () {
                $("#lblVideo").hide();
                $("#lblVideo").css("top", "400px");
                $("#lblVideo").css("font-size", "10px");
                $("#lblVideo").css("opacity", "0.01")
                $("#lblVideo").show();
                $("#lblVideo").animate({
                    "font-size": "35px", "opacity": "1"
                }, 2000);

                $("#HUDWrapper").hide();
                $("#lblVideo").text( window.location.hostname + "/seterra/" + lang);
                $("#imgVideo").fadeIn(1500);
                $("#lblVideo").css("color", "white");
            }, 2000
            )
        }                        //  ..  setTimeout()
        i5++;
    }, 3000)
}

function formatInfoText() {
    var infotext = document.getElementById("INFOTEXT");

    if (infotext != null) {
        if (typeof (panZoom) != "undefined") {
            var w = panZoom.getViewBox().width
            if (w < 900) { $('#divExtraInfo').hide(); return; }
        }

        var rect = infotext.getBoundingClientRect();
        var svg = document.getElementById("svgpoint");
        infoTextX = rect.left + window.pageXOffset;
        infoTextY = rect.top + window.pageYOffset;
        infoTextWidth = rect.width;
        infoTextHeight = rect.height;

        $('#divExtraInfo').show()
        $('#divExtraInfo').css({
            top: infoTextY + "px",
            left: infoTextX + "px",
            width: infoTextWidth,
            height: infoTextHeight,
            opacity: 0.85
        });

        $('#divExtraInfo').addClass("divExtraInfoFloat")

        var itext = $('#divExtraInfo').html();
        if (itext.length < 2) {
            $('#divExtraInfo').css({
                opacity: 0.1
            })
        } else {
            $('#divExtraInfo').css({
                opacity: 0.85
            })
        }

        if (lang != 'en' && lang != 'en-an') {
            $('#divExtraInfo').css({
                opacity: 0.01
            })
        }
    }
}


function hoverdiv() {

    var div2 = document.getElementById("imgZoom")
    var pos
    pos = div2.getBoundingClientRect();
    $("#divFlagZoom").css({ left: (Math.round(pos.left + 40)) + "px" });

    $("#divFlagZoom").css({ top: Math.round(window.scrollY + pos.top - 60) + "px" });
    $("#divFlagZoom").toggle();
    return false;
}

function hoverdiv2(id) {
    var div2 = document.getElementById("FLAG_" + id)

    $("#divFlagZoom").html("<img id='flagZoom' src='" + div2.getAttribute("href") + "'>")
    img = document.getElementById("flagZoom")
    pos = div2.getBoundingClientRect();
    var i
    i = Math.round(pos.left - img.naturalWidth / 2) + 15
    $("#divFlagZoom").css({ left: i + "px" });

    $("#divFlagZoom").css({ top: Math.round(window.scrollY + pos.top - 10 - img.naturalHeight) + "px" });
    //$("#flagZoom").css({ width: "150px" });
    $("#divFlagZoom").show();
    document.getElementById("divFlagZoom").style.visibility = 'visible'
    return false;
}

function showText2(e) {
    if (showInfoText == 1) {
        showInfoText2(e);
    };

    if ($(e)[0].hasClass("noq") == true) {
        myColor = "#3b965f"
        myLabelColor = "#3b965f"
    } else {
        myColor = guessColors[Math.min(e.getAttribute("data-errors"), 3)];
        myLabelColor = labelColors[Math.min(e.getAttribute("data-errors"), 3)];
    }
    if (gameMode == "placeflags") {
        if ($("#FLAG_" + e.getAttribute("id")).length == 0 || $("#FLAG_" + e.getAttribute("id")).css("display") == 'none') {
            $("#FLAG_" + e.getAttribute("id")).show()
            $("#FLAG_" + e.getAttribute("id")).fadeOut(2000)
            //showLabel(e, 3002, myLabelColor, false);
        }
    } else {
        if ($("#TEXT_" + e.getAttribute("id")).length == 0 || $("#TEXT_" + e.getAttribute("id")).css("display") == 'none') { showLabel(e, 3002, myLabelColor, false); }
    }
    if (e.getAttribute("data-errors") >= 3) { paintLabel(e.id, "white") }
    //if (e.querySelectorAll(".city").length == 0) paintGroup(e, myColor );
}

function showInfoText2(s) {
    var str;

    if (s.getAttribute("data-imageFile") != "") {
        str = "<img id ='imgZoom'  src='/seterra/images/system/flags/" + s.getAttribute("data-imageFile") + "' style='float:left;height:17px;border:1px solid #dddddd' onmouseover=\"hoverdiv()\" onmouseout=\"hoverdiv()\">" + ' &nbsp; '
        $("#divFlagZoom").html("<img src='/seterra/images/system/flags/" + s.getAttribute("data-imageFile") + "'>")
    }
    else { str = "" };
    $("#divExtraInfo").html(str + s.getAttribute('data-infoText'));

    formatInfoText();
}

function hideExtraInfo() {
    $("#divExtraInfo").html("");
}

function createDragLabels() {
    if (gameMode == 'placeflags') { objCountry = shuffle(objCountry); }

    if (usingTouch == true) {
        if (gameMode == 'placelabels') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' ><div class='dragHandle'>" + HTMLClean(objCountry[i].qText) + "<div class='dragInnerHandle' ></div></div></div>")
            }
        }

        if (gameMode == 'placeflags') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' style='height:36px;'><div class='dragHandle'><img id='IMG_" + objCountry[i].id + "' src='/seterra/images/system/flags/" + objCountry[i].imageFile + "' style='height:30px;margin-left:auto;margin-right:auto;display:block; -webkit-user-drag: none;'><div class='dragInnerHandle' ></div></div></div>")
            }
        }

    } else {
        if (gameMode == 'placelabels') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0'  ><div class='dragHandle'> " + HTMLClean(objCountry[i].qText) + "</div></div>")
            }
        }
        if (gameMode == 'placeflags') {
            for (var i = objCountry.length - 1; i >= 0; i--) {
                if (objCountry[i].imageFile != '') {
                    $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' style='height:32px;'  ><div class='dragHandle' ><img id='IMG_" + objCountry[i].id + "' src='/seterra/images/system/flags/" + objCountry[i].imageFile + "' style='height:26px;margin-left:auto;margin-right:auto;display:block;-webkit-user-drag: none;'></div></div>")
                } else {
                    $("#dragLabels").prepend("<div id='LABEL_" + objCountry[i].id + "' class='dragItem' data-errors='0' style='height:32px;overflow:hidden' ><div class='dragHandle'>" + HTMLClean(objCountry[i].qText) + "<div class='dragInnerHandle' ></div></div></div>")
                }
            }
        }
    }

    //$(".gamepartlist").hide();
    $("#dlstgamelist").hide();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function nextQuestion() {
    if (isFlashing == true) {
        stopFlashing();
        if (document.getElementById(q).classList.contains("q")) {
            paintGroup(document.getElementById(q), selectedAreaColor);
        }
    }
    wrongClicks = 0;
    // objCountry = shuffle(objCountry);
    if (typeof (aspectRatio) != "undefined" && typeof (panZoom) != "undefined") {
        //panZoom.setViewBox(0, 0, 900, 900 / aspectRatio, 0)
    }
    if (window.location.href.indexOf("shownext=1") == -1) {
        quickShuffle(objCountry); //December 3 2020
    }
    objQ = objCountry[0];
    q = objQ.id;

    if (lastLeft == 0) {
        lastLeft = window.innerWidth / 2;
        lastTop = window.innerHeight / 2;
    }

    qText = getQuizLabeltext(objQ, objCountry)

    makeQuizLabel(showInfoImageTop, qText, objQ.imageFile);

    if (gameMode == 'pin' || gameMode == 'pinhard' || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') { currQuestion = clickOnText + ' ' + qText; } else { currQuestion = '' };
    if (gameMode == 'pinflags') { currQuestion = clickOnText }

    $('#currQuestion').html(" | " + currQuestion);

    setTimeout(function () {
        positionSkipButton()
    }, 10)

    if (objCountry.length == 1) { $("#divSkip").hide() }

    //if (window.location.href.indexOf("shownext=1") != -1) {
    //   if (objCountry.length > 1) {
    //       $('#currQuestion').html($('#currQuestion').html() + " | " + objCountry[1].qText);
    //   }
    //}

    if (showInfoImageTop == 1 && (gameMode == 'pin' || gameMode == 'pinhard' || gameMode == 'pinflags' || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') && objQ.imageFile != "") {
        $("#imgQuestionFlag").show();
        $("#imgQuestionFlag").attr("src", "/seterra/images/system/flags/" + objQ.imageFile);
        if (flagHidden == false) { $("#imgInFlag").show() } else { $("#imgOutFlag").show() }

    } else {
        $("#imgQuestionFlag").hide();
    }

    $(".qLabel").remove();

    playLocation(lang, objQ.id);
    setTimeout("formatInfoText()", 500);
    bDoAnimate = 1;
}

function positionSkipButton() {
    var w = $('#currQuestion').width() + $('#score').width() * 1.5 + $('#timer').width() * 1.5
    //if (w < $('#HUDWrapper').width() *0.7) { w = $('#HUDWrapper').width() *0.7}
    $("#divSkip").css({ top: 0, left: w, position: 'absolute' });
    $("#divSkip").css({ height: $('#HUDWrapper').height() });
    $("#divSkip").attr("title", skipValue + " (Alt+S)");
}

function getPos(el) {
    // yay readability
    for (var lx = 0, ly = 0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return { x: lx, y: ly };
}

function nextTypeQuestion() {
    quickShuffle(objCountry); //December 3 2020
    $("#inpCountry").val("");
    $("#inpCountry").css("color", "#000000");
    $("#hints").html('');
    $("#hints").show();

    var objArea = document.getElementById(objCountry[0].id);
    objArea.setAttribute("class", "q");

    if (currQ != undefined) {
        if (objCountry.length > 1) {
            do {
                objCountry = shuffle(objCountry);
            } while (objCountry[0].id == currQ.id)
        }
    }
    objQ = objCountry[0];
    $("#imgQuestionFlag").hide();
    q = objQ.id;
    qText = objQ.qText;
    var objArea = document.getElementById(objQ.id);

    if (lang.substr(lang.length - 3) != "-sl") {
        objArea.setAttribute("class", "prompted");
    }

    arrHints = [];
    $("#hints").hide();
    if (objQ.hints && objQ.hints != "") {
        arrHints = objQ.hints.split(",");
    }

    var elemCountry = $("#" + objQ.id);
    var hintIdx = elemCountry.attr("hint-index") - 1;

    if (arrHints.length > 0) {
        $("#hints").append('<ul></ul>');
        if (hintIdx > -1) {
            $("#hints").show();
            for (var i = 0; i <= hintIdx; i++) {
                if (i < arrHints.length) {
                    $("#hints ul").append('<li><div class="hint" >' + arrHints[i] + '</div></li>')
                }
            }
        }
    } else {
        $("#hints").html('');
        // get hint from hint pattern
        if (hintIdx > -1) {
            getHintFromPattern(hintIdx, objQ.qText);
            $("#hints").append("HINT: " + getHintFromPattern(hintIdx, objQ.qText));
            $("#hints").show();
        }
    }

    showThisTypeQuestion();
    $("#inpCountry").focus();

    if (typeof (aspectRatio) != "undefined" && typeof (panZoom) != "undefined") {
        panZoom.setViewBox(0, 0, 900, 900 / aspectRatio, 0)
    }
}

function nextMulti() {
    quickShuffle(objCountry); //December 3 2020
    var objArea = document.getElementById(objCountry[0].id);
    wrongClicks = 0;
    objQ = objCountry[0];

    var n
    var n2
    var arr = new Array(4);
    var obj
    for (n = 0; n < 3; n++) {
        var fOK
        do {
            fOK = true
            obj = objCountry2[Math.floor(Math.random() * objCountry2.length)];

            if (obj.id == objQ.id) fOK = false;
            for (n2 = 0; n2 < n; n2++) {
                if (obj.id == arr[n2].id) {
                    fOK = false;
                }
            }
        } while (fOK == false)
        arr[n] = obj
    }

    arr[3] = objQ
    arr = shuffle(arr)
    $("#btnAnswer1").html("1. " + arr[0].qText);
    $("#btnAnswer2").html("2. " + arr[1].qText);
    $("#btnAnswer3").html("3. " + arr[2].qText);
    $("#btnAnswer4").html("4. " + arr[3].qText);
    $("button").removeClass("strike")

    q = objQ.id;
    qText = objQ.qText;
    if (showInfoImageTop == 1 && objQ.imageFile != "") {
        $("#imgQuestionFlag").show();
        $("#imgQuestionFlag").attr("src", "/seterra/images/system/flags/" + objQ.imageFile);
        if (flagHidden) { $("#imgInFlag").hide() } else { $("#imgInFlag").show() }
    } else {
        $("#imgQuestionFlag").hide();
    }

    var objArea = document.getElementById(objQ.id);

    $("#anicircle2").remove
    bDoAnimate = true;

    clearTimeout(myAniTimeout2)
    setTimeout(function () { showCircle(objArea, "#anicircle2"); }, 20);

    myAniTimeout2 = setTimeout(function () { showCircle(objArea, "#anicircle2"); }, 4000);

    if (lang.substr(lang.length - 3) != "-sl") {
        objArea.setAttribute("class", "prompted");
    }

    showThisMulti(q, false, "#eeeeee", true);
    if (typeof (aspectRatio) != "undefined" && typeof (panZoom) != "undefined") {
        panZoom.setViewBox(0, 0, 900, 900 / aspectRatio, 0)
    }
}

function hideFlag() {
    flagHidden = true;
    $("#questionFlag").hide()
    $("#imgInFlag").hide()
    $("#imgOutFlag").show()
    $("#imgCursorFlag").hide();
}

function showFlag() {
    flagHidden = false;
    $("#questionFlag").show()
    $("#imgInFlag").show()
    $("#imgOutFlag").hide()
    $("#imgCursorFlag").show();
}

function skipQuestion() {
    currQ = objQ;

    var lines = document.getElementById(currQ.id).getElementsByTagName("line");
    if (lines.length > 0) {
        lines[lines.length - 1].setAttribute("opacity", "0");
    }

    var errors = $("#" + currQ.id).attr("data-errors");
    var objArea = document.getElementById(objQ.id);
    objArea.setAttribute("class", "q");
    if (!errors || errors == 0) {
    } else {
        if (errors < 3) {
            paintGroup(objArea, guessColors[errors]);

        } else {
            paintGroup(objArea, guessColors[3]);
        }
    }
    nextTypeQuestion();
}

function repaintGroup(g) {
    var errors;
    var errors = $(g).attr("data-errors");
    if (errors < 3) {
        paintGroup(g, guessColors[errors]);
    } else {
        paintGroup(g, guessColors[3]);
    }
    if (g.querySelectorAll(".city").length != 0 || g.querySelectorAll(".city1").length != 0) showLabel(g, false, labelColors[Math.min(g.getAttribute("data-errors"), 3)], true);
}

function getHint() {
    $("#hints").show();
    var elemCountry = $("#" + objQ.id);
    var hintIdx = elemCountry.attr("hint-index") ? elemCountry.attr("hint-index") : 0;

    if (arrHints.length > 0) {
        $("#hints").html('');
        $("#hints").append('<ul></ul>');
        for (var i = 0; i <= hintIdx; i++) {
            if (i < arrHints.length) {
                $("#hints ul").append('<li><div class="hint" >' + arrHints[i] + '</div></li>')
            }
        }
        hintIdx++;
        elemCountry.attr("hint-index", hintIdx);
        totalClicks++;

        var wClicks = elemCountry.attr("data-errors") ? elemCountry.attr("data-errors") : 0;

        elemCountry.attr("data-errors", parseInt(wClicks) + 1);
        updateScore();
    } else {
        if (hintPattern.length > hintIdx) {
            $("#hints").html('');
            if (hintIdx < 3) {
                $("#hints").append(hintLabel + ": " + getHintFromPattern(hintIdx, objQ.qText));
            } else {
                $("#hints").append(getHintFromPattern(hintIdx, objQ.qText));
            }
            hintIdx++;
            elemCountry.attr("hint-index", hintIdx);
            totalClicks++;
            var wClicks = elemCountry.attr("data-errors") ? elemCountry.attr("data-errors") : 0;
            elemCountry.attr("data-errors", parseInt(wClicks) + 1);
            updateScore();
        }
    }
    $("#inpCountry").focus();
}

function getHintFromPattern(idx, text) {

    var pattern = hintPattern[idx];
    var leading = pattern.substring(0, pattern.indexOf("*"))
    var leadingExposed = leading.length;
    var trailing = pattern.substring(pattern.indexOf("*") + 1, pattern.length)
    var trailingExposed = trailing.length;

    leadIdx = leadingExposed - 1;
    trailIdx = text.length - trailingExposed;

    var arrText = text.split("");
    for (var i = 0; i < text.length; i++) {

        if (i > leadIdx && i < trailIdx) {
            arrText[i] = "*";
        }
    }

    var hint = arrText.join("");
    return hint;
}

function handleArrowKeys(e) {
    var event = window.event || e;
    if (event.ctrlKey == true) {
        if (event.keyCode == 39) {
            $("#typeInputForm").css('left', parseInt($("#typeInputForm").css('left')) + 100);
        }
        if (event.keyCode == 37) {
            $("#typeInputForm").css('left', parseInt($("#typeInputForm").css('left')) - 100);
        }

        if (event.keyCode == 38) {
            $("#typeInputForm").css('top', parseInt($("#typeInputForm").css('top')) - 100);
        }
        if (event.keyCode == 40) {
            $("#typeInputForm").css('top', parseInt($("#typeInputForm").css('top')) + 100);
        }
    }
    if (event.altKey == true) {

        if (event.keyCode == 72) { //h
            event.preventDefault();
            getHint();
        }

        if (event.keyCode == 83) { //s
            event.preventDefault();
            skipQuestion();
        }
    }

    if (gameMode == 'type') {
        if (event.keyCode == 38) {
            $("#typeInputForm").css('top', parseInt($("#typeInputForm").css('top')) - 100);
        }
        if (event.keyCode == 40) {
            $("#typeInputForm").css('top', parseInt($("#typeInputForm").css('top')) + 100);
        }
    }
}

function showTypeInputForm() {

    if ($(".type-input-form").length == 0) {

        // if (inputLabel == "") { inputLabel = "Country" };

        var formHtml = '<div id="typeInputForm" class="type-input-form"><input type="text" id="inpCountry" /><button id="btnSubmitAnswer" value="Submit Answer"  onclick="checkTypeAnswer()">-</button><button  id="btnSkip" value="Skip"  onclick="skipQuestion()">-</button><button id="btnHint" value="Give me a hint!" onclick="getHint()">-</button><div id="hints">&nbsp;</div></div>';
        $("body").append(formHtml)
        $('body').on('keyup', function (event) { handleArrowKeys(event) })

        $("#btnSubmitAnswer").html(submitValue);
        $("#btnSkip").html(skipValue);
        $("#btnHint").html(hintValue);
    } else {
        $(".type-input-form").show();
    }

    $("#typeInputForm").mouseover(function (ev) {
        if (ev.target == this) {
            $(this).css('background-color', 'rgba(255, 255, 255, 0.3)')
            $("#typeInputForm").prop('title', 'Drag here to move the text box')
        }
    });

    $("#typeInputForm").mouseout(function (ev) {
        $("#typeInputForm").css('background-color', 'rgba(255, 255, 255, 0.1)')
        $("#typeInputForm").prop('title', '')
    });

    if (gameMode == "typeauto") {
        var availableTags = [];
        for (i = 0; i < objCountry2.length; i++) {
            availableTags.push(objCountry2[i].qText)
        }

        $("#inpCountry").autocomplete({
            source: availableTags
        });
        $("#inpCountry").autocomplete("enable");
        $("#inpCountry").autocomplete("option", "delay", 0);
    } else {
        $("#inpCountry").autocomplete({
            source: []
        });
        $("#inpCountry").autocomplete("disable");
    }
}

function showMultiInputForm() {
    if ($(".multi-input-form").length == 0) {
        // if (inputLabel == "") { inputLabel = "Country" };
        var formHtml = '<div id="multiInputForm" class="multi-input-form"><button id="btnAnswer1" value="" onclick="checkMultiAnswer(\'1\')" /><button id="btnAnswer2" value="" onclick="checkMultiAnswer(\'2\')" /><button id="btnAnswer3" value="" onclick="checkMultiAnswer(\'3\')" /><button id="btnAnswer4" value="" onclick="checkMultiAnswer(\'4\')" /></div>';
        $("body").append(formHtml)
        $("#multiInputForm").draggable()
    } else {
        $(".multi-input-form").show();
    }

    $("#multiInputForm").mouseover(function (ev) {
        if (ev.target == this) {
            $(this).css('background-color', 'rgba(255, 255, 255, 0.3)')
            $("#multiInputForm").prop('title', 'Drag here to move the button box')
        }
    });

    $("#multiInputForm").mouseout(function (ev) {
        $("#multiInputForm").css('background-color', 'rgba(255, 255, 255, 0.1)')
        $("#multiInputForm").prop('title', '')
    });
}

function showTypeEasyInputForm() {
    if ($(".typeeasy-input-form").length == 0) {
        var formHtml = '<span id="typeEasyInputForm" class="typeeasy-input-form"><span id="typeeasyprompt">' + enterLocation + ': </span><input type="text" id="inpC2" /><button id="btnGiveUp" onclick="typeEasyGiveUp();return false" >' + giveUp + '</span>';
        $(formHtml).insertAfter("#HUDGroup")
    } else {
        $(".typeeasy-input-form").show();
        $("#inpC2").val("");
    }
    $("#inpC2").focus();
}

function hideTypeInputForm() {
    if ($(".type-input-form").length != 0) {
        $(".type-input-form").hide();
    }

    if ($(".typeeasy-input-form").length != 0) {
        $(".typeeasy-input-form").hide();
    }
}

function hideMultiInputForm() {
    if ($(".multi-input-form").length != 0) {
        $(".multi-input-form").hide();
    }
}

function checkMultiAnswer(n) {
    var guess = $("#btnAnswer" + n).text().substring(3);
    var answer = objQ.qText;

    if (objCountry.length == 0) return;

    if (guess == answer) {
        animateCircle($(".multi-input-form").position().left + 115, $(".multi-input-form").position().top - 30, "#anicircle")

        var objArea = document.getElementById(objCountry[0].id);
        playLocation(lang, objQ.id, objArea.getAttribute('data-sayAfter'));

        if (wrongClicks == 0) setCorrect(objQ.id)
        correctClicks++;
        totalClicks++;
        objArea.setAttribute("class", "");
        if (showInfoText == 1) {
            showInfoText2(objArea);
        };
        if (wrongClicks < 3) {
            paintGroup(objArea, guessColors[wrongClicks]);

        } else {
            paintGroup(objArea, guessColors[3]);
        }

        if (objArea.querySelectorAll(".city,.city1").length > 0) {
            if (showLabels == 1) { showLabel(objArea, false, labelColors[Math.min(wrongClicks, 3)], true) } else { showLabel(objArea, 3000, labelColors[Math.min(wrongClicks, 3)], false) };

            showDot(objArea);

        } else {
            if (keepAreaLabels == 1) { showLabel(objArea, false, labelColors[Math.min(wrongClicks, 3)], true); } else { showLabel(objArea, 3000, labelColors[Math.min(wrongClicks, 3)], false); }
        }

        if (wrongClicks >= 3) { paintLabel(objQ.id, "white") }

        var removeIndex;
        removeIndex = -1;
        $.grep(objCountry, function (n, idx) {
            if (n.id == objQ.id) {
                removeIndex = idx;
            }
        })
        if (removeIndex != -1) objCountry.splice(removeIndex, 1);
        if (objCountry.length >= 1) {
            playCorrectAnswerSound(1);
            updateScore();
            $(objArea).attr("onclick", "showText2(this)");
            setTimeout(function () { nextMulti(); }, 50);
        } else {
            playCorrectAnswerSound(1);
            if (totalClicks == correctClicks) {
                playCorrectAnswerSound(3);
            } else {
                playCorrectAnswerSound(2);
            }
            $('#currQuestion').html(" ");
            $("#imgQuestionFlag").hide();
            $("#imgInFlag").hide()
            $("#imgOutFlag").hide()
            gameReset2();
            updateScore();
            setupCompletion();
            showCompletion();
            hideMultiInputForm();
        }

    } else {
        $("#btnAnswer" + n).addClass("strike")
        totalClicks++;
        wrongClicks++;
        playWrongAnswerSound();
        updateScore();
    }
}

function checkTypeAnswer() {

    var guess = $("#inpCountry").val().toLowerCase();

    if (guess != "" && objCountry.length > 0) {
        var thisCountry = objQ.qText.toLowerCase();
        var elemCountry = $("#" + objQ.id);
        var objArea = document.getElementById(objQ.id)
        var cleanGuess = cleanUpSpecialChars(guess)
        $(".ui-autocomplete").hide()
        wrongClicks = elemCountry.attr("data-errors") ? elemCountry.attr("data-errors") : 0;

        if (cleanGuess == cleanUpSpecialChars(thisCountry) || cleanUpSpecialChars(getReplacement(cleanGuess)) == cleanUpSpecialChars(thisCountry)) {
            animateCircle($("#typeInputForm").position().left + 65, $("#typeInputForm").position().top - 50, "#anicircle")
            playLocation(lang, objQ.id, objArea.getAttribute('data-sayAfter'));

            if (wrongClicks == 0) setCorrect(objQ.id)
            thisCountry = '';
            $("#inpCountry").css("color", "#669933")

            if (showInfoText == 1) {
                showInfoText2(objArea);
            };

            objArea.setAttribute("onclick", "showText2(this);");

            $(".qImgWrapper").remove();
            correctClicks++;
            totalClicks++;

            var removeIndex;
            removeIndex = -1;
            $.grep(objCountry, function (n, idx) {
                if (n.id == objQ.id) {
                    removeIndex = idx;
                }
            })
            if (removeIndex != -1) objCountry.splice(removeIndex, 1);

            objArea.setAttribute("class", "q answered");
            paintGroup(objArea, guessColors[Math.min(wrongClicks, 3)]);

            if (objArea.querySelectorAll(".city,.city1").length > 0) {
                if (showLabels == 1) { showLabel(objArea, false, labelColors[Math.min(wrongClicks, 3)], true) } else { showLabel(objArea, 3000, labelColors[Math.min(wrongClicks, 3)], false) };

                showDot(objArea);

            } else {
                if (keepAreaLabels == 1) { showLabel(objArea, false, labelColors[Math.min(wrongClicks, 3)], true); } else { showLabel(objArea, 3000, labelColors[Math.min(wrongClicks, 3)], false); }

            }
            if (wrongClicks >= 3) { paintLabel(objQ.id, "white") }

            if (objCountry.length > 0) {

                playCorrectAnswerSound(1);
                setTimeout(function () { nextTypeQuestion(); }, 50);
            } else {
                playCorrectAnswerSound(1);
                if (totalClicks == correctClicks) {
                    playCorrectAnswerSound(3);
                } else {
                    playCorrectAnswerSound(2);
                }
                hideTypeInputForm();
                // game over
                $('#currQuestion').html(" ");
                $("#imgQuestionFlag").hide();
                $("#imgInFlag").hide()
                $("#imgOutFlag").hide()
                gameReset2();
                updateScore();
                setupCompletion();
                showCompletion();
                q = "";
            }
        } else {
            $("#inpCountry").css("color", "#990000");
            totalClicks++;
            wrongClicks++;
            playWrongAnswerSound();

            if (wrongClicks < 3) {
                paintGroup(objArea, guessColors[wrongClicks]);
            } else {
                paintGroup(objArea, guessColors[3]);
            }
            //writeToLogFile("Error: " + guess + " | " + thisCountry + " " + lang + " " + gameID + " " + gameMode)
        }
        elemCountry.attr("data-errors", wrongClicks);
        updateScore();
    }
    $("#inpCountry").focus();
}

function checkTypeEasyAnswer() {
    var guess = $("#inpC2").val().toLowerCase();
    var cleanGuess = cleanUpSpecialChars(guess)
    var cleanGuess2 = cleanUpSpecialChars(getReplacement(cleanGuess))
    var i
    var e
    for (i = 0; i < objCountry.length; i++) {
        if (cleanGuess.length < objCountry[i].cleanText.length + 4 || cleanGuess2.length > 0) {
            if (cleanGuess.substring(0, objCountry[i].cleanText.length) == objCountry[i].cleanText || cleanGuess2 == objCountry[i].cleanText) {
                correctClicks++;
                totalClicks++;

                var myLength
                if (cleanGuess2 == objCountry[i].cleanText) {
                    myLength = cleanGuess2.length

                } else {
                    myLength = cleanGuess.length
                }
                $("#inpC2").val(cleanGuess.substring(objCountry[i].cleanText.length, myLength))

                e = document.getElementById(objCountry[i].id)
                if (lang == "en-an" || lang == "sv-an" || lang == "de-an") {
                    paintGroup(e, "#ffffff");
                } else {
                    paintGroup(e, "#114c29");
                }
                if (e.querySelectorAll(".city, .city1").length > 0) {
                    showDot(e);
                }

                //-------
                var svg = document.getElementById("svgpoint");
                var p = getCenterpoint(e);
                var pnt = svg.createSVGPoint();
                pnt.x = p.x;
                pnt.y = p.y;

                var ctm = svg.getScreenCTM();
                var ipnt = pnt.matrixTransform(ctm);

                var aniX = ipnt.x + window.pageXOffset;
                var aniY = ipnt.y + window.pageYOffset;
                animateCircle(aniX, aniY, "#anicircle");
                //-------f

                var cid = objCountry[i].id
                playLocation(lang, cid);

                $("#inpC2").focus();
                playCorrectAnswerSound(1);
                if (showInfoText == 1) {
                    showInfoText2(e);
                }
                showLabel(e, false, '#14592f', true);
                paintLabel(cid, 'white')
                $(e).attr("onclick", "showTypeEasyLabel(this)");

                e.removeClass("q")
                updateScore();
                objCountry.splice(i, 1);
                if (objCountry.length == 0) {
                    playCorrectAnswerSound(3);
                    hideTypeInputForm();
                    gameReset2();
                    updateScore();
                    setupCompletion();
                    showCompletion();
                }
                break;
            }
        }
    }
}

function showTypeEasyLabel(obj) {
    showLabelToggle2(obj, false, '#14592f', true);
    playLocation(lang, obj.id, obj.getAttribute('data-sayAfter'));
    if (showInfoText == 1) {
        showInfoText2(obj);
    }
    paintLabel(obj.id, 'white')
}

function typeEasyGiveUp() {
    var i
    for (i = 0; i < objCountry.length; i++) {
        e = document.getElementById(objCountry[i].id)
        //paintGroup(e, "#114c29");
        if (e.querySelectorAll(".city, .city1").length > 0) {
            showDot(e);
        }

        var cid = objCountry[i].id

        showLabel(e, false, guessColors[3], false);
        paintLabel(cid, 'white');
        e.removeClass("q")

        $(e).attr("onclick", "showLabelToggle2(this,false, guessColors[3], false);playLocation(lang,this.id,this.getAttribute('data-sayAfter'));showInfoText2(this);paintLabel(this.id,'white')");
    }

    totalClicks = questionCount
    updateScore()
    setupCompletion();
    showCompletion();
    hideTypeInputForm();
    gameReset2();
}

function paintLabel(cid, myColor) {
    if (document.getElementById("TEXT_" + cid)) {
        document.getElementById("TEXT_" + cid).setAttributeNS(null, 'fill', myColor);
        if (document.getElementById("TEXT_" + cid + "_sayafter")) {
            document.getElementById("TEXT_" + cid + "_sayafter").setAttributeNS(null, 'fill', myColor);
        }
    }
}

function showDot(objArea) {
    var radius
    if (objArea.querySelectorAll(".city, .city1")[0].getAttribute("r") > 1 || objArea.querySelectorAll(".city, .city1")[0].getAttribute("rx") > 1) {
        if (objArea.querySelectorAll(".city, .city1")[0].hasAttribute("r")) { radius = objArea.querySelectorAll(".city, .city1")[0].getAttribute("r") } else { objArea.querySelectorAll(".city, .city1")[0].getAttribute("rx") }
        var xmlns = "http://www.w3.org/2000/svg";
        var elem = document.createElementNS(xmlns, "circle");

        if (radius.parseInt < 3) { radius = 3 }
        objArea.querySelectorAll(".city,.city1")[0].setAttribute("stroke-width", 0.1)
        elem.setAttributeNS(null, "cx", objArea.querySelectorAll(".city,.city1")[0].getAttribute("cx"));
        elem.setAttributeNS(null, "cy", objArea.querySelectorAll(".city,.city1")[0].getAttribute("cy"));
        elem.setAttributeNS(null, "r", radius / 2.5);
        elem.setAttributeNS(null, "opacity", 0.5);
        elem.setAttributeNS(null, "fill", "#000000");
        elem.setAttribute("class", "city3")
        //e.insertBefore(elem, e.firstChild);
        objArea.appendChild(elem);
    }
}

function getQuizLabeltext(objQ, objCountry) {
    if (gameMode == 'pinhard' || gameMode == 'pin' || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') {
        qText = objQ.qText;
    } else {
        qText = ""
    }
    if (window.location.href.indexOf("shownext=1") != -1) {
        if (objCountry.length > 1) {
            qText = qText + " | " + objCountry[1].qText;
        }
    }

    if (gameMode == 'pinhard' || gameMode == 'pinhardnoborders') {
        qText = qText + " (" + (questionCount - objCountry.length + 1) + "/" + questionCount + ")"
    }

    return qText
    label_quizLabel
}

function makeQuizLabel(fImage, value, imageURL) {
    if (window.location.href.indexOf("nocursor=1") == -1) {
        var labelID = "label_quizLabel";
        $("#" + labelID).remove()

        if (fImage == 0 || imageURL == "" || flagHidden == true) {
            $("body").prepend("<div id='" + labelID + "' class='label'  ><div class='labelText' >" + clickOnText + ' ' + value + "</div></div>");
        } else {
            $("body").prepend("<div id='" + labelID + "' class='label'  ><div class='labelText' >" + clickOnText + ' ' + value + " &nbsp; <img alt='' id='imgCursorFlag' src='/seterra/images/system/flags/" + imageURL + "'  /></div></div>");
        }

        $("#" + labelID).offset({ left: lastLeft + 5, top: lastTop + 20 });
        $("#" + labelID).show();
        $("#" + labelID).fadeOut(5000);
    }
}

function scaleDragLabel() {
    $(".dragItem").each(function () {
        var thisLabel = $(this);//$("#label_" + labelID);

        var f = 0.9 * scale;
        if (f < 0.7) { f = 0.7 }
        if (f > 1.2) { f = 1.2 }
        thisLabel.css("font-size", f + "em");
    });
}

function animateCircle(x, y, type) {
    if (anim == true) {

        $(type).show
        $(type).css("opacity", 1)
        //var off = Math.round(parseInt($(type).css("width")) / 2)
        var off = 150;
        $(type).css({ width: 300, height: 300 });

        if (bDoAnimate == 1 || type == "#anicircle") {
            clearTimeout(myAniTimeout3)
            clearTimeout(myAniTimeout)
            $(type).css({ top: y - off, left: x - off, position: 'absolute' });
            $(type).show();
            //$(type).offset({ top: y - off, left: x - off });
            var el = $(type),
                newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();
            myAniTimeout3 = setTimeout(function () { $("." + el.attr("class")).hide() }, 2000)
        }
    }
}

function checkQuestion(e, myEvent) {
    if (myPreventClick == true || ctrlKeyDown == true) { return }
    stopFlashing();
    var clickedOn = e.id
    lastLeft = myEvent.pageX;
    lastTop = myEvent.pageY;

    if (q == clickedOn) {
        animateCircle(myEvent.pageX, myEvent.pageY, "#anicircle")

        if (wrongClicks == 0) setCorrect(q);

        addSVGAttribute(e, "answered");
        clearCenterpoint(e);
        removeSVGAttribute(e, "flashing");
        correctClicks++;
        totalClicks++;
        qid++;

        var removeIndex;
        removeIndex = -1;
        $.grep(objCountry, function (n, idx) {

            if (n.id == clickedOn) {
                removeIndex = idx;
            }
        })
        if (removeIndex != -1) objCountry.splice(removeIndex, 1);

        $(".label").remove();

        //if (objQ.imageFile != null || objQ.infoText != "") {
        //    makeInfoLabel(objQ.id, objQ.infoText, objQ.imageFile);
        //}

        e.setAttribute("data-errors", wrongClicks);
        if (showInfoText == 1) {
            showInfoText2(e);
        };

        if (wrongClicks < 3) {
            paintGroup(e, guessColors[wrongClicks]);

        } else {
            paintGroup(e, guessColors[3]);
        }
        var timeoutid;
        if (gameMode == 'pinhard' || gameMode == 'pinhardnoborders') {
            (function (e) {
                timeoutid = setTimeout(function () {
                    unPaintGroup(e);
                    playOtherSound();
                }, 1000);
            }(e));
            e.setAttribute("data-timeoutid", timeoutid);
        }

        if (gameMode == 'pin' || gameMode == 'pinhard' || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders') {

            if (e.querySelectorAll(".city, .city1").length > 0) {
                if (showLabels == 1 && (gameMode == 'pin' || gameMode == 'pinnoborders' || gameMode == 'pinhardnoborders')) { showLabel(e, false, labelColors[Math.min(wrongClicks, 3)], true) } else { showLabel(e, 3000, labelColors[Math.min(wrongClicks, 3)], false) };

                if ((gameMode == 'pin' || gameMode == 'pinnoborders') && e.querySelectorAll(".city, .city1").length > 0) {
                    showDot(e);
                }
            } else {
                if (keepAreaLabels == 1 && (gameMode == 'pin' || gameMode == 'pinnoborders')) { showLabel(e, false, labelColors[Math.min(wrongClicks, 3)], true); } else { showLabel(e, 1000, labelColors[Math.min(wrongClicks, 3)], false); }
            }
        } else {
            len = getTextLength(e);
            if (len >= 5) {
                showLabel(e, false, "white", true)
            } else {
                showLines(e);
                showLabel(obj, 3001, "white", false)
            }
        }

        if (wrongClicks >= 3) { paintLabel(e.getAttribute("id"), "white") }

        wrongClicks = 0;
        if (objCountry.length > 0) {
            nextQuestion();
            playCorrectAnswerSound(1);
        } else {
            playCorrectAnswerSound(1);
            if (totalClicks == correctClicks) {
                playCorrectAnswerSound(3);
            } else {
                playCorrectAnswerSound(2);
            }
            
            // game over
            $('#currQuestion').html(" ");
            $("#imgQuestionFlag").hide();
            $("#imgInFlag").hide()
            $("#imgOutFlag").hide()
            if (gameMode == 'pinhard' || gameMode == 'pinhardnoborders') {
                $(".noq").attr("class", "noq"); // remove q class
                $(".q").each(function () {
                    clearTimeout(this.getAttribute("data-timeoutid"));
                    repaintGroup(this);
                });
                $(".q").attr("class", ""); // remove q class
            }
            $(".gamewindow").unbind('mouseenter mouseleave');
            gameReset2();
            updateScore();
            setupCompletion();
            showCompletion();
            q = "";
        }
    } else {
        if ((objCountry.length > 0) && (($(e)[0].hasClass("answered") == false || (gameMode == 'pinhard' || gameMode == 'pinhardnoborders')))) {
            if (gameMode == 'pinhard' || gameMode == 'pinhardnoborders') {
                showLabel(e, 2000, "#c75352", "X");
            } else {
                showLabel(e, 2000, "#3b965f", false);
            }
            paintLabel(e.getAttribute("id"), "white")
            if (wrongClicks >= 2) {
                flashCorrect(q)
            }
            wrongClicks++;
            totalClicks++;
            playWrongAnswerSound();
        }
        else {
            showText2(e);
        }

        // Needed for touch devices, do not delete.
        if (objCountry.length > 0) {
            qText = getQuizLabeltext(objQ, objCountry)
            $("#label_quizLabel").offset({ left: myEvent.pageX + 20, top: myEvent.pageY + 20 });
            makeQuizLabel(showInfoImageTop, qText, objQ.imageFile);
        }
        //hideLabel = setTimeout(function () { $("#label_quizLabel").fadeOut(1000, function () { $("#label_quizLabel").remove() }) }, 2000);
    }
    updateScore();
}

function unPaintGroup(e) {
    paintGroup(e, selectedAreaColor);
    removeSVGAttribute(e, "answered");
    var o = e.getElementsByClassName("semitransparent");
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "opacity", 0);
    }

    var o = e.getElementsByClassName("semitransparent semitransparentvisible");
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "opacity", 1);
        o[i].setAttributeNS(null, "fill-opacity", semitransparentOpacity);
        o[i].setAttributeNS(null, "fill", semitransparentColor);
    }

    var o = e.getElementsByClassName("semitransparent2");
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "opacity", 0);
    }

    var o = e.querySelectorAll('.city,.city1');
    for (var i = 0; i < o.length; i++) {
        o[i].setAttributeNS(null, "fill", cityFill);
    };
}

function checkDragQuestion(e, evt) {
    stopFlashing();
    var dropLabel = $("#LABEL_" + q);
    if (typeof dropLabel === "undefined") {
        return;
    }
    dragX = evt.pageX - window.pageXOffset;
    dragY = evt.pageY - window.pageYOffset;

    if ($(e).hasClass("answered") == false && e != undefined) {
        $(".q").attr('disabled', true);

        var clickedOn = e.id

        if (q == clickedOn) {
            $("#imgQuestionFlag").hide()
            animateCircle(evt.pageX, evt.pageY, "#anicircle");
            $('#currQuestion').html(" | ");
            $(e).attr("class", "q answered");
            clearCenterpoint(e);
            $("#LABEL_" + q).css('pointer-events', 'none');

            if (gameMode == "placeflags") {
                playLocation(lang, q);
            }

            isDragChecking = false;
            wrongClicks = parseInt(dropLabel.attr("data-errors"));

            if (wrongClicks == 0) setCorrect(q);

            setTimeout(function () {
                if (window.location.href.indexOf("hoverclick=1") == -1) {
                    e.setAttribute("onclick", "showText2(this);")
                } else {
                    e.setAttribute("onmouseover", "showText2(this);");
                }
            },
                3000);

            if (showInfoText == 1) {
                showInfoText2(e);
            }

            correctClicks++;
            totalClicks++;
            qid++;

            var removeIndex;
            removeIndex = -1;
            arrObjQ = $.grep(objCountry, function (n, idx) {
                if (n.id == clickedOn) {
                    removeIndex = idx;
                    return n;
                }
            })
            if (removeIndex != -1) objCountry.splice(removeIndex, 1);

            if (wrongClicks < 3) {
                paintGroup(e, guessColors[wrongClicks]);
                moveToLabel(e, dropLabel, labelColors[wrongClicks]);
            } else {
                paintGroup(e, guessColors[3]);
                moveToLabel(e, dropLabel, labelColors[3]);
                setTimeout(function () { paintGroup(e, guessColors[3]); }, 1000)
            }

            if (e.querySelectorAll(".city, .city1").length > 0) {
                showDot(e);
            }

            if (gameMode == 'placelabels') { $("#currQuestion").html("| " + dragDropText1) } else { $("#currQuestion").html("| " + dragDropTextFlags1) }
            q = "";

            if (objCountry.length > 0) {
                playCorrectAnswerSound(1);
                // nextQuestion();
            } else {
                playCorrectAnswerSound(1);
                if (totalClicks == correctClicks) {
                    playCorrectAnswerSound(3);
                } else {
                    playCorrectAnswerSound(2);
                }
                // game over
                $("#currQuestion").html("");
                $("#imgQuestionFlag").hide();
                gameReset2();
                updateScore();
                setupCompletion();
                showCompletion();
            }
        } else {
            if (q == "" && dragDropText != "") {
                clearTimeout(hideRect);
                clearTimeout(hideText);

                $("#RECT_INFO").remove();
                $("#TEXT_INFO").remove();

                var svg = document.getElementById("svgpoint");
                var pnt = svg.createSVGPoint();

                if (gameMode == 'placelabels') {
                    addText(getCenterpoint(e).x, getCenterpoint(e).y - 20, dragDropText, "INFO", "#FFFFFF", true);
                } else {
                    addText(getCenterpoint(e).x, getCenterpoint(e).y - 30, dragDropTextFlags, "INFO", "#FFFFFF", true);
                }

                hideRect = setTimeout(function () { $("#RECT_INFO").remove() }, 5000);
                hideText = setTimeout(function () { $("#TEXT_INFO").remove() }, 5000);

            } else {
                var labelErrors = parseInt(dropLabel.attr("data-errors"));

                if ($(e)[0].hasClass("answered") == false) {
                    dropLabel.attr("data-errors", labelErrors + 1)
                    //showThisLabel(e, true, labelColors[Math.min(e.getAttribute("data-errors"), 3)], false);
                    wrongClicks = labelErrors + 1;
                    dropLabel.css("background-color", guessColors[Math.min(wrongClicks, 3)]);
                    if (darkmode == 1) {
                        dropLabel.css("color", "black")
                    }
                    totalClicks++;
                    if (wrongClicks > 2) { flashCorrect(q) }
                    playWrongAnswerSound();
                }
            }
        }
        $(".q").removeAttr('disabled');
    } else {
        return false;
    }

    //calculate score
    updateScore();
}

function clearScore() {
    score = 0;
    correctClicks = 0;
    totalClicks = 0;
    $("#score").html("0%");
}

function updateScore() {
    score = Math.round(correctClicks / totalClicks * 100)

    if (score == 100 && correctClicks != totalClicks) { score = 99 }
    if (gameMode == 'typeeasy') {
        $("#score").html(correctClicks + "/" + questionCount)
    }
    else {
        if (!isNaN(score) && score >= 0) {
            $("#score").html(score + "%");
        } else {
            $("#score").html("-");
        }
    }
}

function flashCorrect(q) {

    $(".q").each(function () {
        if (this.id == q) {
            setTimeout(function () { playSwoosh() }, 100);
            var corrAreaObj = this;

            this.setAttribute("class", "q flashing");
            isFlashing = true;
            flashObj(corrAreaObj);
            flasher = setInterval(function () { flashObj(corrAreaObj) }, 1200);

            circleTimeout = setTimeout(function () { showCircle(corrAreaObj, "#anicircle2"); }, 20);
            var iter = 0
            if (typeof (panZoom) != "undefined") {
                var vBox = panZoom.getViewBox()
                cPoint = getCenterpoint(corrAreaObj)
                while ((pointInViewbox(cPoint, panZoom.getViewBox(), Math.round(vBox.width / 30)) == false) && iter < 200) {
                    var newX1, newX2, newY1, newY2
                    newX1 = Math.max(vBox.x - 50 * iter, 0)
                    newX2 = Math.min(vBox.x + vBox.width + 50 * iter, 900)
                    newY1 = Math.max(vBox.y - 50 * iter, 0)
                    newY2 = newY1 + (newX2 - newX1) / aspectRatio

                    panZoom.setViewBox(newX1, newY1, newX2 - newX1, newY2 - newY1, 200)
                    clearTimeout(circleTimeout)
                    circleTimeout = setTimeout(function () { showCircle(corrAreaObj, "#anicircle2"); }, 250);
                    iter++;
                }
            }
        }
    });
}

function pointInViewbox(p, v, padding) {
    var r = true
    if (v.x > 0 || v.width < 900) {
        if (p.x - padding < v.x) { r = false }
        if (p.x + padding > v.x + v.width) { r = false }
        if (p.y - padding < v.y) { r = false }
        if (p.y + padding > v.y + v.height) { r = false }
    }
    return r
}

function showCircle(obj, type) {
    var b = getBBox2(obj)

    var svg = document.getElementById("svgpoint");
    var pnt = svg.createSVGPoint();
    pnt.x = Math.round(b.x + b.width / 2);
    pnt.y = Math.round(b.y + b.height / 2);

    var ctm = svg.getScreenCTM();
    var ipnt = pnt.matrixTransform(ctm);
    var aniX = ipnt.x + window.pageXOffset - 8;
    var aniY = ipnt.y + window.pageYOffset - 8;

    animateCircle(Math.round(aniX), Math.round(aniY), type);
    if (bDoAnimate == 1) {
        bDoAnimate = 0;
        myAniTimeout = setTimeout(function () {
            bDoAnimate = 1;
        }, 3000);
    }
}

function flashObj(obj) {
    var correctArea = obj;
    if (isFlashing == true) {
        paintGroup(correctArea, guessColors[3]);
        var col2
        if (obj.querySelectorAll(".city").length > 0 || obj.querySelectorAll(".city1").length > 0) { col2 = "#FFFFFF" } else { col2 = "#dddddd" }
        flasher2 = setTimeout(function () { paintGroup(correctArea, col2) }, 600);
    }
}

function stopFlashing() {
    clearTimeout(circleTimeout)
    clearInterval(flasher);
    clearTimeout(flasher2);
    isFlashing = false;

    if (document.getElementById(q)) {
        document.getElementById(q).classList.remove("flashing")
    }
}

function setGameMode() {

    gameMode = $("#drpGameMode :selected").val();
    if (gameMode == "video") {
        //selectedAreaColor = "#249753";
        //unSelectedAreaColor = "#1e8346";
        cityFill = "#70b089"
        if (gameID == "3003") {
            //document.getElementById("svgpoint").setAttribute("viewBox", "0 20 900 700");
        }
        //$('#cbVoice').prop('checked', true);
        $('#imgVideo').prop("src", "/seterra/images/system/youtube_1.png");
    } else {
        cityFill = "#ffffff"
        $('#imgVideo').hide();
    }
    initGame();
}

function startTimer() {
    start = new Date;
    newTime = "0:00";

    if (reviewMode == 0 && window.location.href.indexOf("notimer=1") == -1) {
        $('#timer').html(" | 0:00");
        gameDuration = 0;
        gameDuration2 = 0;
        gameTime = setInterval(function () {
            //scaleSVG();
            if (gameMode != "typeeasy" || typingStarted == 1) {
                gameDuration = Math.round((new Date - start) / 100) * 100;
                gameDuration2 = gameDuration2 + 100;
            } else {
                gameDuration = 0;
            }
            totalSeconds = Math.round(gameDuration / 1000);
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            var csec = Math.round((gameDuration % 1000) / 100);
            var pad = "00";
            pad = pad.toString();
            seconds = seconds.toString();
            seconds = pad.substring(0, pad.length - seconds.length) + seconds;
            var cseconds = csec.toString();
            //cseconds = pad.substring(0, pad.length - cseconds.length) + cseconds;
            newTime = minutes + ":" + seconds;
            $('#timer').html(' | ' + newTime);
        }, 100);
    } else {
        if (reviewMode != 0) { $('#timer').html(" | (" + reviewingText + ")"); }
    }
}

function gameReset2() {
    end = new Date;
    clearTimeout(gameTime);
}

function setupCompletion() {

    mutationObserver.disconnect();

    if (score > 59) {
        $("#lblFinalScore1").text(txtScore1 + " " + txtScore2);
    } else {
        $("#lblFinalScore1").text(txtScore2);
    }

    if (window.location.href.indexOf("notimer=1") != -1) {
        gameDuration = Math.round((new Date - start) / 100) * 100;
    }

    //if (gameMode != "typeeasy") { $("#lblFinalScore2").text(score + "%"); } else { $("#lblFinalScore2").text("") }
    $('#lblFinalScore2').css("color", "")
    $("#lblFinalScore2").text(score + "%");
    if (reviewMode == 0) {
        $("#lblFinalScore2").text($("#lblFinalScore2").text() + "    " + newTime)
        var cps = correctClicks / gameDuration * 1000
        $("#lblFinalScore2").prop('title', getFriendlyFormattedTime(gameDuration) + " (CPS: " + cps.toFixed(3) + ")")
    } else {
    }

    rs = $("#lblFinalScore2").text()
    rg = $("#ltrGameName").text()
    $("#btnComplete").attr("value", btnText);
    $("#btnSaveHighScore").attr("value", btnText);

    if ((window.isProUser() || isChallenge == true) && reviewMode == 0 && window.location.href.indexOf("shownext=1") == -1) {
        $("#saveScoreOptions").show();
        $("#btnSaveHighScore").prop("disabled", false);
        $("#noAcctOptions").hide();
        $("#patreon").hide();
        $(".tblTop10").show();
        $("#panTop10").show();
    } else {
        $("#saveScoreOptions").hide();
        $("#noAcctOptions").show();
        $(".tblTop10").hide();
        $("#panTop10").hide();
        $("#patreon").hide();
    }

    if (isChallenge == true) { $("#nickname").attr('maxlength', '12'); }

    if (customID == '') {
        $("#ltrGameName").html("<span class='finalgamename'>" + gameName + "</span>");
    } else {
        $("#ltrGameName").html(gameName2);
    }
    var currentdate = new Date();

    $("#ltrGameName").html($("#ltrGameName").html() + "<br>" + $("#lblGameMode").html() + ' ' + $("#drpGameMode option:selected").text());

    if (window.location.href.indexOf("shownext=1") != -1) {
        $("#ltrGameName").html($("#ltrGameName").html() + " (shownext)");
    }

    if (window.location.href.indexOf("hoverclick=1") != -1) {
        $("#ltrGameName").html($("#ltrGameName").html() + " (hoverclick)");
    }

    if (window.location.href.indexOf("noborders=1") != -1) {
        $("#ltrGameName").html($("#ltrGameName").html() + " (no borders)");
    }
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    $("#ltrGameName").html($("#ltrGameName").html() + "<br>" + currentdate.toLocaleDateString(lang, options) + ' &nbsp;' + currentdate.toLocaleTimeString(lang));

    var compPanel = $("#completion");
    var completeX = ($(".gamewindow").width() - compPanel.width()) / 2;
    var completeY = 0;

    compPanel.css("left", completeX + "px");
    compPanel.css("top", completeY + "px");
}

function hideCompletion() {
    $("#completion").fadeOut();
    $("#cmdRestart").prop('disabled', false);
    $("#drpGameMode").prop('disabled', false);
    $("#btnSaveHighScore").prop("disabled", false);

    mutationObserver.disconnect();

    $('#ltrGameName').css("color", "")
    $('#lblFinalScore1').css("color", "")
}

function showCompletion() {

    if (mouseDetected == true) {
        $("#completion").draggable();
    }
    $('#divSkip').hide()
    $("#completion").css("opacity", "0")
    $("#completion").show()
    $('#completion').css("background-color", "")
    $("#completion").animate({
        opacity: 0.9,
        top: "+=70px",
    }, 500);

    mutationObserver.observe(document.getElementById('lblFinalScore2'), mutationObserverConfig);
    gMode = getGameModeAbbreviation(gameMode)

    $("#cmdRestart").prop('disabled', true);
    $("#drpGameMode").prop('disabled', true);

    if (window.isProUser() && reviewMode == 0 || isChallenge == true && reviewMode == 0) {
        $("#nickname").val($.cookie("nickname"))
    }

    updateReviewLink();

    var data = {};
    data.GameID = gameID;
    data.UserID = '-';
    data.EventID = 'GameEnd';
    data.Score = score;
    data.GameMode = gMode;
    data.LanguageID = lang;
    if (customID != '') { data.CustomID = customID; } else { data.CustomID = "-"; }

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/seterra/services/services.aspx/InsertGameEvent',
        data: JSON.stringify(data),
        async: true,
        success: function (response) {
            $.cookie("ip", (response.d))
        },
        error: function (error) {
            console.log(error)
        }

    })
}

function saveHighScore() {

    hideCompletion();
    $("#btnSaveHighScore").prop("disabled", true);

    $.cookie("nickname", $("#nickname").val());
    if (customID == '') {
        saveScore(gameID, customID, window.getNickName(), window.getUserId(), score, start, end, gameDuration, correctClicks, totalClicks - correctClicks, gMode, gameDuration2.toString(), lang, $.cookie("sessionId"), $("#nickname").val())
        displayTop10()
        sessionStorage.removeItem("ohs");
        getHighScores(window.getUserId())
    }

    if (customID != '' && isChallenge == true) {
        var membid
        if (typeof window.getUserId() === 'undefined') {
            membid = "-"
        } else {
            membid = window.getUserId()
        }
        if (membid == "") { membid = "-" }
        saveScore(gameID, customID, "-", membid, score, start, end, gameDuration, correctClicks, totalClicks - correctClicks, gMode, gameDuration2.toString(), lang, "-", $("#nickname").val())
        displayTop10()
    }
}

function playWrongAnswerSound() {
    var s = $("#WrongAnswerSound")[0];
    try {

        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}

function playCorrectAnswerSound(n) {

    if (n == 1) {
        var s = $("#CorrectAnswerSound")[0];
    }

    if (n == 2) {
        var s = $("#CorrectAnswerSoundEnd")[0];
    }

    if (n == 3) {
        var s = $("#CorrectAnswerSoundEnd100")[0];
    }

    try {
        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}

function playOtherSound() {
    var s = $("#OtherSound")[0];
    try {
        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}

function playSwoosh() {
    try {
        var s = $("#SwooshSound")[0];
        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}

function preloadImages() {
    $(objCountry2).each(function () {
        if (this.imageFile != '') {
            $('#divGameText').append("<img style='width:2px' src='/seterra/images/system/flags/" + this.imageFile + "'>")
        }
    });
}

function getDisplayName(cleanText) {
    var displayText = cleanText.replace("_", " ");
    return displayText;
}

if (SVGElement && SVGElement.prototype) {

    SVGElement.prototype.hasClass = function (className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
    };

    SVGElement.prototype.addClass = function (className) {
        if (!this.hasClass(className)) {
            this.setAttribute('class', this.getAttribute('class') + ' ' + className);
        }
    };

    SVGElement.prototype.removeClass = function (className) {
        var removedClass = this.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
        if (this.hasClass(className)) {
            this.setAttribute('class', removedClass);
        }
    };

    SVGElement.prototype.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    };
}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.removeFirst = function () {
    var what, a = arguments, L = a.length, ax;

    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
            return this;
        }
    }
    return this;
};

function HTMLClean(s) {
    var r = s;

    r = r.replace("ł", "&#322;");
    r = r.replace("Ł", "&#321;");
    r = r.replace("ś", "&#347;");
    r = r.replace("ę", "&#281;");

    return r;
}

var sourceUrlSayAfter2

function playLocation(lang, sourceUrl, sourceUrlSayAfter) {
    var audio = $("#location");
    sourceUrlSayAfter2 = sourceUrlSayAfter;
    var _listener = function () {
        playLocation(lang, sourceUrlSayAfter2, '')
        audio[0].removeEventListener("ended", _listener);
    }

    if (typeof sourceUrl == 'undefined') {
        return;
    }
    if (sourceUrl == '') {
        audio[0].removeEventListener("ended", _listener);
        return;
    }

    if ($("#cbVoice").prop("checked") == true) {

        $("#mp3_src").attr("src", '/seterra/audio/' + lang + '/' + sourceUrl + ".mp3");
        $("#ogg_src").attr("src", '/seterra/audio/' + lang + '/' + sourceUrl + ".ogg");

        /****************/
        audio[0].pause();
        audio[0].load(); //suspends and restores all audio element

        audio[0].play(); //changed based on Sprachprofi's comment below
        /*audio[0].oncanplaythrough = audio[0].play();*/

        /****************/

        audio[0].addEventListener("ended", _listener)
    }
}

function downloadPDF() {
    var style;
    style = "<style>@page {size: US-Letter landscape;margin:10mm;}</style>"
    var host = window.location.hostname;
    var imgUrl = 'xlink:href="' + host + '/seterra/svg/png'
    DocRaptor.createAndDownloadDoc("K8O374KGK3w6bwEeZdY", {
        test: false, // test documents are free, but watermarked
        type: "pdf",
        document_content: style + document.querySelector('#printdiv').outerHTML.replace('xlink:href="/seterra/svg/png', imgUrl), // use this page's HTML
        name: gameName2,
        prince_options: {
            "css_dpi": "65"
        }
    })
    return false;
}

