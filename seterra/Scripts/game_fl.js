
var flagDir = "/seterra/images/system/flags/";
var dataDir = "/seterra/webfiles/";
var guessColors = ["#ebebeb", "#ebebeb", "#ebebeb", "#ebebeb"];
var rowSize = 7; // default used if no value is in the xml file
var secretHeight = 0; // default used if no value is in the xml file
var imageHeight = 60;
var fadeDelay = 300;
var hintFadeDelay = 800

var hintCount = 0
var anim = false;


var arrFlagData = [];
var arrQuestions = [];
var arrInfoTranslations = [];
var arrTranslations = [];
var imgsLoaded = 0;
var cellWidth;
var cellPadding = 5;
var maxImgHeight = [10];
var correctClicks = 0;
var wrongClicks = 0;
var totalClicks = 0;
var questionCount;
var totalQuestionCount;
var score;
var gameTime;
var gameDuration;
var gMode;
var newTime = 0;
var start;
var end;
var totalSeconds;
var flasher;
var qid = 0;
var q;
var clickTrans;
var prevX = 0;
var prevY = 0;
var prevCard;
var usingTouch;
var isScrolling;
var isTouching = false;
var GameID;

var mutationObserverConfig;
var mutationObserverCallback;
var mutationObserver;

function setLayoutValues() {
    if (true) {
        var gw = $("#gameWrapper").width();

        if (gw < 850) {
            rowSize = 6;
        }

        if (gw < 755) {
            rowSize = 5;
        }

        if (gw < 600) {
            rowSize = 4;
        }

        if (gw < 500) {
            rowSize = 3;
        }
        if (gw < 400) {
            rowSize = 3;
        }
    }

    cellWidth = 111;
    if (darkmode == 1) {
        cellWidth = 122;
    }
}

$(document).ready(function () {

    usingTouch = isTouchDevice();
    setupGame(gameID);
    $('#cbSoundOn').prop('checked', (typeof sessionStorage.cbSoundOn !== 'undefined') ? (sessionStorage.cbSoundOn == 'true') : true);
    //when checkbox is updated, update stored value
    $('#cbSoundOn').change(function () { sessionStorage.cbSoundOn = $(this).prop('checked'); });

    //$('#cbVoice').prop('checked', false);
    //when checkbox is updated, update stored value
    $('#cbVoice').change(function () { sessionStorage.cbVoice = $(this).prop('checked'); if (gameMode == "pin" || gameMode == "pinhard") { playLocation(lang, q.id) } });

    $(document).keyup(function (event) {
        if (event.keyCode == 82) { //r
            if (event.altKey) {
                $('#cmdRestart').click();
            }
        }

        if (event.keyCode == 87) { //w
            if (event.altKey) {
                var n
                n = parseInt($('#contentwrapper').css("max-width")) + 160
                $('#contentwrapper').css("max-width", n.toString() + "px");

                n = parseInt($('#leftcol.gg-item-left').css("max-width")) + 160
                $('#leftcol.gg-item-left').css("max-width", n.toString() + "px");
                $('#bannerImg').css("max-width", "950px");
            }
        }

        if (event.keyCode == 81) { //q
            if (event.altKey) {
                var n
                n = parseInt($('#contentwrapper').css("max-width")) - 160
                if (n < 1200) { return }
                $('#contentwrapper').css("max-width", n.toString() + "px");

                n = parseInt($('#leftcol.gg-item-left').css("max-width")) - 160
                $('#leftcol.gg-item-left').css("max-width", n.toString() + "px");
                $('#bannerImg').css("max-width", "950px");

            }
        }
    })

    if (isChallenge == true) {
        $("#divScoreGameMode").hide()
        if (darkmode != '1') {
            $(".top10-wrapper").css('background-color', '#fdf6e2');
        } else {
            $(".top10-wrapper").css('background-color', '#1f2b47');
        }
        setTimeout(function () { if ($("#divDown").is(":visible") == true) { $("#divDown").trigger("click"); } }, 1000);
    }
})


function isTouchDevice() {
    if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
        return true
    } else {
        return false
    }
};


function setupGame(gameID) {

    mutationObserverConfig = { attributes: false, childList: true, subtree: true, characterData: true, };

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

    if ($.cookie('darkmode') == "1") {
        guessColors = ["#252f37", "#252f37", "#252f37", "#252f37"];
    }

    $('#cmdRestart').attr("disabled", true);

    anim = detectAnimation()
    gameMode = $("#drpGameMode :selected").val();
    hideCompletion();
    stopTimer();
    clearScore();

    $("#gameWrapper").html("");
    arrFlagData = [];
    arrQuestions = [];
    imgsLoaded = 0;
    wrongClicks = 0;

    // load data file based on exercise id
    xmlDataFile = dataDir + "GAME_" + gameID + ".xml"
    var compPanel = $("#completion");

    // get xml data
    $("#qlabel2").html("Loading xml...")
    $.ajax({
        type: "GET",
        url: xmlDataFile,
        dataType: "xml",
        success: function (xmlData) {
            loadFlagData(xmlData);
            $('#cmdRestart').attr("disabled", false);
        },
        error: function () {
            alert("Sorry, there was a problem accessing the quiz data.");
        }
    });
    setupCompletion()
}

function loadFlagData(xmlData) {

    arrFlagData = [];
    arrTranslations = strTranslations.split(",");
    arrInfoTranslations = strInfoTranslations.split(",");

    var transdx = arrTranslations.indexOf("LANG_9");
    clickTrans = arrTranslations[transdx + 1];
    var newSecretHeight = $(xmlData).find("SecretHeight").text();

    if (newSecretHeight > 0) {
        secretHeight = newSecretHeight 
    }

    $("#qlabel2").html("Loading flags...")
    $(xmlData).find("Flag").each(function () {
        var transNameIdx = arrTranslations.indexOf($(this).attr("country"));
        var infoIdx = arrInfoTranslations.indexOf($(this).attr("info"));

        if (transNameIdx >= 0) {
            var objFlag = {};
            objFlag.img = flagDir + $(this).text();
            objFlag.id = arrTranslations[transNameIdx];
            objFlag.country = htmlDecode(arrTranslations[transNameIdx + 1]);
            //objFlag.info = arrInfoTranslations[infoIdx + 1];
            objFlag.info = "";
            arrFlagData.push(objFlag);
            arrQuestions.push(objFlag);
        }
    });

    arrFlagData = shuffle(arrFlagData);

    setLayoutValues();
    showImgs();

    var timer;
    var delay = 1500;

    if (isTouchDevice() == false) {

        $('.flag').hover(function (d) {
            // on mouse in, start a timeout

            timer = setTimeout(function () {
                hoverdiv(d.target.id)

            }, delay);
        }, function () {
            // on mouse out, cancel the timer
            $("#divFlagZoom").hide();
            clearTimeout(timer);
        });
    }
}


function hoverdiv(id) {

    var div2 = document.getElementById(id)
    var pos
    pos = div2.getBoundingClientRect();

    $("#divFlagZoom").css({ top: Math.round(window.scrollY + pos.top - 160) + "px" });
    $("#divFlagZoom").html("<img src='" + div2.getAttribute("src") + "' style='border:1px solid #cccccc'>")
    $("#divFlagZoom").css({ left: (Math.round(pos.left + pos.width / 2) - $("#divFlagZoom").width() / 2) + "px" });
    $("#divFlagZoom").fadeIn(500);

    return false;
}

function objEventBinding() {
    $("#qlabel2").hide();
    $(".cell").removeAttr("onclick");
    $(".cell").removeAttr("touchend");

    if (gameMode == "show") {

        $(".cell").each(function () {
            $(this).find(".label span").eq(0).text($(this).data("country"))
        })

        $(".cell").on("click", function () {
            playLocation(lang, $(this).data("id"))
        })
    }
    if (gameMode == "learn") {

        $(".cell").on("click", function () {
            if ($(this).find(".label span").eq(0).text() == $(this).data("country")) {
                $(this).find(".label span").eq(0).text("")
            } else {
                $(this).find(".label span").eq(0).text($(this).data("country")); playLocation(lang, $(this).data("id"))
            }

        })
    }
    if (gameMode == "pin" || gameMode == "pinhard") {
        if (window.location.href.indexOf("fastclick=1") == -1) {
            $(".cell").on("click", function () {
                checkAnswer($(this), event);
            });
        } else {
            $(".cell").on("mousedown", function () {
                prevX = event.pageX; prevY = event.pageY;
                checkAnswer($(this), event);
            });
        }

        if (usingTouch == true && false) {
            $(".cell").on("touchend", function () {

                if (isTouching == false) {

                    setTimeout(function () {
                        isTouching = false;

                        if (isScrolling != true) {
                            checkAnswer($(this));
                        }
                        isTouching = true;
                    }, 50);
                }

            });
        }
    }

    if (gameMode == "pin") {
        $("body").keyup(function (e) {
            if (event.altKey == true) {


                if (event.keyCode == 83) { //s
                    if (gameMode == "pin" || gameMode=="type" || gameMode=="typeauto" || gameMode=="multi") {
                        event.preventDefault();
                        skipQuestion();
                    }
                }
            }
        })
    }

    if (gameMode == "type" || gameMode == "typeauto") {
        $("body").unbind("keypress");
        $("body").keypress(function (e) {
            if (e.which == 13) {
                checkTypeAnswer();
                e.preventDefault();
            }
        });
    }

    if (gameMode == 'multi') {
        $("body").unbind("keypress");
        $("body").keypress(function (e) {

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
    }
}

function checkTypeAnswer() {

    var guess = $("#inpCountry").val().toLowerCase();
    var cleanGuess = cleanUpSpecialChars(guess)

    if (guess != "" && arrQuestions.length > 0) {
        if (cleanGuess == cleanUpSpecialChars(q.country) || cleanUpSpecialChars(getReplacement(cleanGuess)) == cleanUpSpecialChars(q.country)) {

            $("#inpCountry").val("")

            correctClicks = correctClicks + 1
            totalClicks = totalClicks + 1
            $(".cell").each(function () {
                if ($(this).data("id") == q.id) {
                    $(this).find(".label span").eq(0).text($(this).data("country"))
                    $(this).on("click", function () {
                        playLocation(lang, $(this).data("id"))
                    })
                    $(this).find("img").fadeTo("fast", 1);

                    anim = true;
                    animateCircle($(this).offset().left + 65, $(this).offset().top + 30, "#anicircle")
                }
            })
            playLocation(lang, q.id);
            arrQuestions.remove(0);

            if (arrQuestions.length > 0) {
                playCorrectAnswerSound(1)
                nextQuestion();
            } else {
                playCorrectAnswerSound(1);
                if (totalClicks == correctClicks) {
                    playCorrectAnswerSound(3);
                } else {
                    playCorrectAnswerSound(2);

                }
                hideTypeInputForm();
                stopTimer();
                updateScore();

                setupCompletion();
                showCompletion();

            }

        } else {
            wrongClicks = wrongClicks + 1
            totalClicks = totalClicks + 1
            playWrongAnswerSound()
        }
        updateScore();
    }
}

function showImgs() {
    $("#gameWrapper").html("");
    if (gameMode == "show") {
        arrFlagData.sort(sortByCountry)
    }
    for (i = 0; i < arrFlagData.length; i++) {

        $("#gameWrapper").append("<div class='cell' ><div class='card' ><div class='face front' style='align:center'> <img class='flag' draggable='false' /><div class='label'><span></span><div class='secret'><span></span></div></div></div></div>");

        var newObj = $("#gameWrapper .cell").last();
        $(newObj).attr("id", "obj" + i);
        newImg = $(newObj).find("img");
        newImg.attr("src", arrFlagData[i].img);
        newImg.attr("id", "img_" + arrFlagData[i].id);

        newImg.on("load", function () { setMaxH($(this).height()); });
        $(newObj).data("id", arrFlagData[i].id);
        $(newObj).data("country", arrFlagData[i].country);
        $(newObj).data("info", arrFlagData[i].info);
        $(newObj).find(".secret span").text(arrFlagData[i].info);
        
        $(window).scroll(function () {
            isScrolling = true;
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function () {
                isScrolling = false;
            }, 200));
        });
    }

    if (rowSize == 4) {
        imageHeight = 70;
        $(".flag").css("height", imageHeight + "px");
    }

    if (rowSize <= 3 && extraHeight==0) {
        imageHeight = 70;

        $(".flag").css("height", imageHeight + "px");
        $(".flag").css("max-width", (cellWidth - 5) + "px");
    }


    $(".cell").css("width", cellWidth + "px");
    var intHeight = 85 + extraHeight;
    $(".cell").css("height", intHeight.toString() + "px");
    $(".cell").css("padding-top", cellPadding + "px");
    $(".cell").css("padding-bottom", cellPadding + "px");
    $(".label").css("width", cellWidth - 2 + "px");
    intHeight = 58 + extraHeight * 0.8;
    if (extraHeight > 100) {
        $(".cell img").css("max-height","85%");
    }
    $(".label").css("top", intHeight.toString() + "px");
    $(".secret").css("width", cellWidth - 2 + "px");
}


function setMaxH(h) {

    maxImgHeight.push(h);
    imgsLoaded++;

    if (maxImgHeight.length >= arrFlagData.length) {
        var maxH = Math.max.apply(null, maxImgHeight);
        // set cell height
        //$(".cell").css("height", newH + "px");

        // start game once images have loaded
    }

    $("#qlabel2").html("Loading " + imgsLoaded + "/" + arrFlagData.length)
    if (imgsLoaded >= arrFlagData.length) {

        startGame();
    }
}


// question handling

function sortByCountry(a, b) {
    var aName = a.country.toLowerCase();
    var bName = b.country.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
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

function clearHints() {
    hintCount = 0;
    $("#hints2").empty();
}

function startGame() {

    hideTimer();
    hideQuestion();
    questionCount = 0;
    objEventBinding();
    clearHints();
    $("#typeControls").hide()
    if (gameMode == "type" || gameMode == "typeauto") {
        $("#controls").hide()
        $("#typeControls").show()
        showTypeInputForm();
        $(".flag").fadeTo("slow", 0.3);
    } else if (gameMode == 'multi') {
        $("#controls").hide()
        $("#typeControls").show()
        showMultiInputForm();
        $(".flag").fadeTo("slow", 0.3);

    } else {
        $(".flag").css("opacity", "");
        $("#controls").show()
        if (gameMode == "show" || gameMode == "learn") {

            $("#typeControls").hide()
            $("#score").html("")
            $("#timer").html("")

        }
    }
    if (gameMode == "pin" || gameMode == "pinhard" || gameMode == "type" || gameMode == "typeauto" || gameMode == "multi") {
        startTimer();
        totalQuestionCount = arrQuestions.length
        nextQuestion();
        updateScore();
    }

}

function hideQuestion() {
    $("#qlabel2").hide();
    $(".qLabel").remove();
}
function nextQuestion() {

    wrongClicks = 0;
    stopFlashing()
    quickShuffle(arrQuestions); //December 3 2020
    arrQuestions = shuffle(arrQuestions);
    clearHints()
    questionCount++;
    updateScore()
    //q = arrFlagData[qid].country;
    q = arrQuestions[0];
    $(".qLabel").remove();
    if (gameMode == "pin" || gameMode == "pinhard") {
        makeQuizLabel(q.country);
        playLocation(lang, q.id);
    }
    if (gameMode == "type" || gameMode == "typeauto") {
        $("#imgTypeFlag").attr("src", q.img);
        $("#inpCountry").focus();
        $("#hints2").hide();
    }

    if (gameMode == "multi") {
        nextMulti()
    }

    if (extraHeight > 20 && q.img.substring(q.img.length - 3) == "svg") {
        $("#imgTypeFlag").css("height", "250px");
    } else {
        $("#imgTypeFlag").css("height", "");
    }
}

function nextMulti() {

    wrongClicks = 0;
    objQ = arrQuestions[0];

    var n
    var n2
    var arr = new Array(4);
    var obj
    for (n = 0; n < 3; n++) {
        var fOK
        do {
            fOK = true
            obj = arrFlagData[Math.floor(Math.random() * arrFlagData.length)];

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
    $("#btnAnswer1").attr("value", "1. " + arr[0].country);
    $("#btnAnswer2").attr("value", "2. " + arr[1].country);
    $("#btnAnswer3").attr("value", "3. " + arr[2].country);
    $("#btnAnswer4").attr("value", "4. " + arr[3].country);
    $("input").removeClass("strike")
    $("#imgTypeFlag").attr("src", objQ.img);

    $("#btnAnswer1").focus();
    $("#btnAnswer1").blur();

}


function getHint() {

    if (hintCount <= q.country.length) {
        $("#hints2").show();
        wrongClicks = wrongClicks + 1
        totalClicks = totalClicks + 1
        updateScore();
        if (hintCount == 0) {
            $("#hints2").html(mask(q.country));
        }
        if (hintCount > 0) {
            $("#hints2").html(q.country.substring(0, hintCount) + mask(q.country).substring(hintCount));
        }

        hintCount++;
    }
    $("#inpCountry").focus();
}

function mask(s) {
    var result = ""
    for (i = 0; i < s.length; i++) {
        if (s.substring(i, i + 1) == " ") {
            result = result + " "
        } else {
            result = result + "*"
        }
    }
    return result;
}



function checkAnswer(e, myEvent) {
    if (prevCard != null) { prevCard.css("background-color", guessColors[3]) }
    stopFlashing();
    if (e.hasClass("answered") == false) {
        var clickedOn = e.data("country");
        if (q.country == clickedOn) {
            animateCircle(myEvent.pageX, myEvent.pageY, "#anicircle")

            correctClicks++;
            totalClicks++;
            e.find(".label span").eq(0).text(e.data("country"))
            e.addClass("answered");
            qid++;

            arrQuestions.remove(0);

            $(".qLabel").remove();
            //.delay(150).queue(function () {
            //  e.find('.card').toggleClass('flipped');
            //});

            e.find('.card .secret span').fadeIn();

            if (wrongClicks <= 3) {
                e.css("background-color", guessColors[wrongClicks]);
            } else {
                //var cLabel = e.find(".label");
                //cLabel.css("background-color", "transparent" );
                e.delay(1000).queue(function () { e.css("background-color", guessColors[3]).dequeue; });
                prevCard = e;
            }
            if (gameMode == "pinhard") {
                setTimeout(function () { if (arrQuestions.length > 0) { e.removeClass("answered"); e.removeClass("wrong"); e.find(".label span").eq(0).text("") } }, 2000)
            }
            wrongClicks = 0;
            if (arrQuestions.length > 0) {
                playCorrectAnswerSound(1);
                nextQuestion();
            } else {
                playCorrectAnswerSound(1);
                if (totalClicks == correctClicks) {
                    playCorrectAnswerSound(3);
                } else {
                    playCorrectAnswerSound(2);

                }
                // game over
                $("#qlabel2").html("-");

                $(".cell").each(function () {
                    $(this).find(".label span").eq(0).text($(this).data("country"))
                })

                $(".flag").css("opacity", "1");
                $(".cell").removeAttr("onclick");
                stopTimer();
                updateScore();
                setupCompletion();
                showCompletion();
            }
        } else {

            if (e.hasClass("wrong") == false) {
                playWrongAnswerSound();

                if (wrongClicks >= 2) {
                    flashCorrect(q.country)
                }
                wrongClicks++;
                totalClicks++;
                if (gameMode == "pinhard") {
                    e.find(".label span").eq(0).text("✖"); } else { e.find(".label span").eq(0).text(e.data("country"));}
                
                e.addClass("wrong");

                setTimeout(function () {

                    if (arrQuestions.length > 0) {
                        e.find(".label span").eq(0).text("");
                        e.removeClass("wrong").dequeue();
                    }
                }, hintFadeDelay);
            }
        }
    } else {
        return false;
    }
    updateScore();
}

function checkMultiAnswer(n) {

    if (arrQuestions.length == 0) return;

    if (objQ.country == $("#btnAnswer" + n).attr("value").substring(3)) {

        playLocation(lang, objQ.id);

        correctClicks++;
        totalClicks++;
        $(".cell").each(function () {

            if ($(this).data("id") == q.id) {

                $(this).find(".label span").eq(0).text($(this).data("country"))
                $(this).on("click", function () {
                    playLocation(lang, $(this).data("id"))
                })

                $(this).find("img").fadeTo("fast", 1);
                anim = true;
                animateCircle($(this).offset().left + 65, $(this).offset().top + 30, "#anicircle")
            }
        })

        var removeIndex;
        removeIndex = -1;
        $.grep(arrQuestions, function (n, idx) {

            if (n.id == objQ.id) {
                removeIndex = idx;
            }
        })
        if (removeIndex != -1) arrQuestions.splice(removeIndex, 1);
        if (arrQuestions.length >= 1) {
            playCorrectAnswerSound(1);
            updateScore();
            setTimeout(function () { nextQuestion(); }, 50);
        } else {
            playCorrectAnswerSound(1);
            if (totalClicks == correctClicks) {
                playCorrectAnswerSound(3);
            } else {
                playCorrectAnswerSound(2);

            }
            stopTimer();
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

function flashCorrect(q) {
    $(".cell").each(function () {
        if ($(this).data("country") == q) {
            playSwoosh()
            var thisLabel = $(this);
            $(this).css("background-color", "#cb7777")
            setTimeout(function () { thisLabel.css("background-color", guessColors[3]) }, 500)
            flasher = setInterval(function () { flashLabel(thisLabel) }, 1000);
        } else $(this).css("background-color", guessColors[3])
    })
}

function flashLabel(corLabel) {
    $(corLabel).css("background-color", "#aa0000").delay(500).queue(
        function () {
            $(corLabel).css("background-color", guessColors[3]).dequeue();
        }
    );
}

function stopFlashing() {
    clearInterval(flasher);
    $(".cell").each(function () {
        $(this).css("background-color", guessColors[3]);
    })
}

function animateCircle(x, y, type) {

    if (anim == true) {
        $(type).show
        $(type).css("opacity", 1)
        var off = Math.round(parseInt($(type).css("width")) / 2)
        if (type == "#anicircle") {
            $(type).css({ top: y - off, left: x - off, position: 'absolute' });
            $(type).show()
            var el = $(type),
            newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();
        }
    }
}

function makeQuizLabel(value) {
    var value2
    if (gameMode == "pinhard") {
        value2 = value + " (" + (totalQuestionCount - arrQuestions.length + 1) + "/" + totalQuestionCount + ")"
    } else {
        value2 = value
    }
    $("#qlabel2").show();
    $("#qlabel2").html(clickTrans + " " + value2);
    if (gameMode == "pin" & arrQuestions.length > 1) {

        $("#qlabel2").append("<span id='divSkip' onclick='skipQuestion()'> &nbsp; ></span>")
        $("#divSkip").attr("title", skipValue + " (Alt+S)");
    }
    if (window.location.href.indexOf("nocursor=1") == -1) {
        var labelID = "quizLabel";
        $("body").prepend("<div id='label_" + labelID + "' class='qLabel'  ><div class='labelText' >" + clickTrans + " " + value2 + "</div></div>");

        if ($(".gamewindow").is(':hover') == true) {
            $(".qLabel").show();
        }
        if (prevX != 0) {

            $(".qLabel").show();
            $("#label_" + labelID).offset({ top: prevY, left: prevX + 20 });
        }

        $(".gamewindow").hover(function () { $(".qLabel").fadeIn() }, function () { $(".qLabel").fadeOut() });

        $(window).mousemove(function (event) {
            $("#label_" + labelID).offset({ top: event.pageY, left: event.pageX + 20 })
        });

        $(window).mousedown(function (event) {
            prevX = event.pageX; prevY = event.pageY;
        });
    }

}

function clearScore() {
    score = 0;
    correctClicks = 0;
    totalClicks = 0;
    $("#score").html("");
}

function updateScore() {
    score = Math.round(correctClicks / totalClicks * 100)
    if (isNaN(score)) { score = 100 }
    if (score == 100 && correctClicks != totalClicks) { score = 99 }
    if (!isNaN(score) && score >= 0) {
        $("#score").html(score + "%");
        $("#score2").html(score + "%");
        $("#score2").html(questionCount + "/" + totalQuestionCount + " &nbsp; " + $("#score2").html())
    } else {
        $("#score").html("");
        $("#score2").html("");
    }
}

// utilities

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

function getDisplayName(cleanText) {
    var displayText = cleanText.replace("_", " ");
    return displayText;
}

function hideTimer() {
    $('#timer').html("");
}

function startTimer() {

    start = new Date;
    gameTime = setInterval(function () {
        gameDuration = Math.round((new Date - start) / 100) * 100;
        var totalSeconds = Math.round(gameDuration / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        var csec = gameDuration % 100;
        var pad = "00";
        pad = pad.toString();
        seconds = seconds.toString();
        seconds = pad.substring(0, pad.length - seconds.length) + seconds;
        var cseconds = csec.toString();
        cseconds = pad.substring(0, pad.length - cseconds.length) + cseconds;

        newTime = minutes + ":" + seconds;

        $('#timer').html(newTime);
        $('#timer2').html(newTime);
    }, 100);
}

function stopTimer() {
    end = new Date;
    clearTimeout(gameTime);
}

function hideCompletion() {
    $("#completion").fadeOut();
    mutationObserver.disconnect();
}

function setupCompletion() {
    mutationObserver.disconnect();

    if (window.location.href.indexOf("notimer=1") != -1) {
        gameDuration = Math.round((new Date - start) / 100) * 100;
    }

    if (score > 59) {
        $("#lblFinalScore1").text(txtScore1 + " " + txtScore2);
    } else {
        $("#lblFinalScore1").text(txtScore2);
    }
    $("#lblFinalScore2").text(score + "%   " + newTime);
    var cps = correctClicks / gameDuration * 1000
    $("#lblFinalScore2").prop('title', getFriendlyFormattedTime(gameDuration) + " (CPS: " + cps.toFixed(3) + ")")
    $("#btnComplete").attr("value", btnText);
    $("#btnSaveHighScore").attr("value", btnText);
    if (isChallenge == true) { $("#nickname").attr('maxlength', '12'); }

    if (window.isProUser() || isChallenge == true) {
        $("#btnSaveHighScore").prop("disabled", false);
        $("#saveScoreOptions").show();
        $("#noAcctOptions").hide();
        $(".top10-wrapper").show();

    } else {
        $("#saveScoreOptions").hide();
        $("#noAcctOptions").show();
        $(".top10-wrapper").hide();
    }

    if (c == '') {
        $("#ltrGameName").html("<span class='finalgamename'>" + gameName2 + "</span>");
    } else {
        $("#ltrGameName").html(gameName2);
    }

    $("#ltrGameName").html($("#ltrGameName").html() + "<br>" + $("#lblGameMode").html() + ' ' + $("#drpGameMode option:selected").text());

    var currentdate = new Date();

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $("#ltrGameName").html($("#ltrGameName").html() + "<br>" + currentdate.toLocaleDateString(lang, options) + ' &nbsp;' + currentdate.toLocaleTimeString(lang));


    var compPanel = $("#completion");
    var completeX = ($(".gamewindow").width() - compPanel.width()) / 2;
    var completeY = -50;
    compPanel.css("left", completeX + "px");
    compPanel.css("top", completeY + "px");

}

function showCompletion() {
    $('#completion').css("background-color", "")
    $("#btnSaveHighScore").prop("disabled", false);
    $("#completion").css("opacity", "0")
    $("#completion").show()
    $("#completion").animate({
        opacity: 1,
        top: "+=50px",
    }, 500);

    mutationObserver.observe(document.getElementById('lblFinalScore2'), mutationObserverConfig);
    gMode = getGameModeAbbreviation(gameMode)

    if (window.isProUser() || isChallenge == true) {
        $("#nickname").val($.cookie("nickname"))
    }

    $("#completion").draggable();

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
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function showTypeInputForm() {
    if ($(".type-input-form").length == 0) {
        // if (inputLabel == "") { inputLabel = "Country" };
        var formHtml = '<div id="typeInputForm" class="type-input-form"><input type="text" id="inpCountry" /><input id="btnSubmitAnswer" type="button" value="Submit Answer"  onclick="checkTypeAnswer()" /><input id="btnSkip" type="button" value="Skip"  onclick="skipQuestion()" /><input type="button" id="btnHint" value="Give me a hint!" onclick="getHint()"/><div id="hints2" style="padding-left:8px;" ></div></div>';
        $("#typeSpan").empty();
        $("#typeSpan").append(formHtml)

        setTimeout(function () {

            $("#btnSubmitAnswer").attr("value", submitValue);
            $("#btnSkip").attr("value", skipValue);
            $("#btnHint").attr("value", hintValue);
        }, 0);
    } else {
        $(".type-input-form").show();
    }

    $("#inpCountry").val("")

    if (gameMode == "typeauto") {
        var availableTags = [];
        for (i = 0; i < arrQuestions.length; i++) {

            availableTags.push(arrQuestions[i].country)
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

        var formHtml = '<div id="multiInputForm" class="multi-input-form"><input id="btnAnswer1" type="button" value="" onclick="checkMultiAnswer(\'1\')" /><input id="btnAnswer2" type="button" value="" onclick="checkMultiAnswer(\'2\')" /><input id="btnAnswer3" type="button" value="" onclick="checkMultiAnswer(\'3\')" /><input id="btnAnswer4" type="button" value="" onclick="checkMultiAnswer(\'4\')" /></div>';
        $("#typeSpan").empty();
        $("#typeSpan").append(formHtml)

        setTimeout(function () {

            $("#btnSubmitAnswer").attr("value", submitValue);
            $("#btnSkip").attr("value", skipValue);
            $("#btnHint").attr("value", hintValue);
        }, 0);
    } else {
        $(".multi-input-form").show();
    }

    $("#inpCountry").val("")
}

function skipQuestion() {
    questionCount--;
    nextQuestion();
}

function hideTypeInputForm() {
    if ($(".type-input-form").length != 0) {
        $(".type-input-form").hide();
    }
}

function hideMultiInputForm() {
    if ($(".multi-input-form").length != 0) {
        $(".multi-input-form").hide();
    }
}

function saveHighScore() {
    $("#btnSaveHighScore").prop("disabled", true);
    hideCompletion();
    $.cookie("nickname", $("#nickname").val());
    if (customID == '') {
        saveScore(gameID, customID, window.getNickName(), window.getUserId(), score, start, end, gameDuration, correctClicks, totalClicks - correctClicks, gMode, $.cookie("ip"), lang, $.cookie("sessionId"), $("#nickname").val())
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
        saveScore(gameID, customID, "-", membid, score, start, end, gameDuration, correctClicks, totalClicks - correctClicks, gMode, "-", lang, "-", $("#nickname").val())
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

function playSwoosh() {
    try {
        var s = $("#SwooshSound")[0];
        if ($("#cbSoundOn").prop("checked") == true) { s.pause(); s.currentTime = 0; s.play() };
    } catch (e) { }
}

function playLocation(lang, sourceUrl) {
    if ($("#cbVoice").prop("checked") == true) {
        var audio = $("#location");
        $("#ogg_src").attr("src", '/seterra/audio/' + lang + '/' + sourceUrl + ".ogg");
        $("#mp3_src").attr("src", '/seterra/audio/' + lang + '/' + sourceUrl + ".mp3");
        /****************/
        audio[0].pause();
        audio[0].load(); //suspends and restores all audio element

        audio[0].play(); //changed based on Sprachprofi's comment below
        /*audio[0].oncanplaythrough = audio[0].play();*/
        /****************/
    }
}

Array.prototype.remove = function (index) {
    this.splice(index, 1);
}

function showCheating() {
    $("#divCheating").remove()

    $("#panBlog").after("<div class='featureddiv'  id='divCheating' style='margin-left: -20px;'><div class='featureditem'><a class= featured' href='/seterra/en/p/cheating-in-school'><div class='divFeaturedImage'><img title='Cheating in school' class='featuredimage' src='/seterra/images/system/cheating-in-school_150.jpg' alt='Why Cheating in School Is Wrong' width='150' border='0'></div><b>Cheating in School—There's No Upside!</b></span></h4><p style='margin:0px'><span>Read why cheating is wrong and learn the consequences. </span></p></a></div></div></div><div style='clear:both'></div>")
    blink("#divCheating");
}

function blink(selector) {
    $(selector).fadeOut(2000, function () {
        $(this).fadeIn(2000, function () {
            blink(this);
        });
    });
}

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}