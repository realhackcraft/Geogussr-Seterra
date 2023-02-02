
var objHighScores;
var objGlobalHighScores;
var scoreListIdx = 0;
var recentGameScoreID = 0;
var recentGameScoreID2 = 0;

$(document).ready(function () {
    if (typeof isChallenge === 'undefined') { isChallenge = false }
    sessionStorage.currentPage = location.href;
    if (typeof (lang) != "undefined") {
        if (lang == 'en' && location.href.indexOf("?c") == -1 && false) { getGlobalHighScores(gameID) }  //Not used due to performance issues
    }

    if (window.isSignedIn()) {
        if ($.cookie("GDPR") != "true" && location.href.indexOf("consent") == -1) {
            location.href = "/seterra/consent.aspx";
        }

        if (window.isProUser()) {
            hideAds();
            if (typeof (lang) != "undefined") {
                $("#rtcol").prepend("<div id='membermenu'><a href='/seterra/" + lang + "/myaccount.aspx'>My Account</a><br><a href='/seterra/" + lang + "/myaccount.aspx#mycustomgames'>My Custom Quizzes</a><br><a href='/seterra/" + lang + "/myrecentscores.aspx'>My Recent Scores</a></div>")
            }
            getHighScores(window.getUserId())
        }

        $(".linkLogin").hide();
        $("#text-login").hide();
        $(".linkLogout").hide();

        if (window.isSignedInWithPatreon()) {
            $(".linkLogoutPatreon").show();
        } else if (window.isSignedInWithGeoGuessr()) {
            $(".linkLogoutGeoGuessr").show();
        }

        $("#divBecomePatron").hide();
        $("#divGoogleClassroom").show()
        $("#loginName").html("<a style='color:#bbbbbb'  href='/seterra/myaccount.aspx'>" + window.getNickName() + "</a>")
    }
    else {
        $(".linkLogin").show();
        $("#text-login").show();
        $(".linkLogout").hide();
        $("#loginName").text("")
        $("#divBecomePatron").show();
    }
    var period = getParameterByName("period")
    if (period != '') {
        $('#drpPeriod').val(period)
    }
    displayTop10()
})

function displayTop10() {
    var period = ''
    var gameMode = '-'
    if ($('#drpPeriod').length > 0) {
        period = $('#drpPeriod').val();
    }

    if ($('#drpScoreGameMode').length > 0) {
        gameMode = $('#drpScoreGameMode').val();
    }
    $("#tblTop10").fadeTo(500, 0.2)
    if (period == '') { period = "alltime" }
    if (typeof gameID != 'undefined') {
        if (isChallenge == true) {
            updateTop10(gameID, customID, "", period, "-")
        } else {
            if (window.isProUser()) {
                updateTop10(gameID, "", window.getUserId(), period, gameMode)
            }
        }

        if (period != 'alltime' || gameMode != '-') {
            //writeToLogFile("Leaderboard " + period + " " + gameMode + ". Page: " + window.location.href + ". Game mode: " + gameMode)
        }
    }
}

function updateTop10(gameID, customID, userID, period, gameMode) {
    var ds;
    var highScores;
    var data = {};
    data.GameID = gameID;
    data.CustomID = customID;
    data.UserID = userID;
    data.count = 100;
    data.GameMode = gameMode;
    data.Period = period;

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/seterra/services/services.aspx/GetGlobalHighScores',
        data: JSON.stringify(data),
        success: function (data) {
            var myObj = JSON.parse(data.d)
            showTop10(myObj)
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function showTop10(myObj) {
    var scoreCount;
    var top10Table = $('#tblTop10 tbody');
    var prevGameTime = 0
    var topScore=false
    top10Table.empty();
    scoreCount = myObj.length;
    if (scoreCount > 100) { scoreCount = 100 }
    for (var i = 0; i < scoreCount; i++) {
        var n = i + 1;
        var nstring
        if (myObj[i].GameTime == prevGameTime) {
            nstring = ""
        } else {
            nstring = n.toString() + "."
        } 
        prevGameTime = myObj[i].GameTime
        var datDate = new Date(myObj[i].GameEndTime)
        
        if (i > 4) { strMore = "trMore" } else { strMore = "" }
        if (myObj[i].GameScoreID == recentGameScoreID) {
            strMore = strMore + " recentScore"
            if (n == 1) {
                topScore=true
            }
        }

        if (myObj[i].GameScoreID == recentGameScoreID2) {
            strMore = strMore + " recentScore2"
        }

        var cps = myObj[i].CorrectClicks / myObj[i].GameTime * 1000
        var nickNameA
        var nickN = unicodeToChar(htmlEncode(myObj[i].Nickname))
        if (anonymizeNames == true && nickN != '(unknown)') {
            nickNameA = new Array(nickN.length + 1).join('-')
        } else {
            nickNameA = nickN
        }

        var datLocalDate = convertUTCDateToLocalDate(datDate)
        //var datLocalDate = datDate
        top10Table.append('<tr class="border_bottom ' + strMore + '" title="Game mode: ' + GameModeName(myObj[i].GameMode) + ' \nDate: ' + datLocalDate.toLocaleDateString() + ' ' + datLocalDate.toLocaleTimeString() + ' \nCPS: ' + cps.toFixed(3) + '"><td style="padding-left:8px;">' + nstring + '</td><td>' + nickNameA + '</td><td style="text-align:right">' + myObj[i].GameScore + '%</td><td style="text-align:right;padding-right:8px;">' + getFormattedTime(myObj[i].GameTime) + '</td></tr>')
    }

    if (topScore) {
        //$(".recentScore").addClass("newTopScore")
        //setTimeout(function () { $(".recentScore").removeClass("newTopScore") }, 1000)
    }

    if ($('#tblTop10 tr').length > 6 && $("#divDown").is(":hidden") && $("#divUp").is(":hidden")) {
        $("#divDown").show();
    }
    if ($("#divDown").is(":visible")) {
        $(".trMore").hide();
    }
    $("#divDown").bind('click', function () {
        $(".trMore").show(); $("#divDown").hide(); $("#divPadlock").hide(); $("#divUp").show();
    })

    $("#divUp").bind('click', function () {
        $(".trMore").hide(); $("#divUp").hide(); $("#divDown").show();
    })

    $("#tblTop10").stop(true, true).fadeTo(500, 1)
}

function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out. The div never exists on the page.
    return $('<div/>').text(value).html();
}


var getHighScores = function (UserID) {
    var highScores;
    var data = {};

    if (sessionStorage.getItem('ohs') === null) {
        data.UserID = UserID;
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: '/seterra/services/services.aspx/GetHighScores',
            data: JSON.stringify(data),
            async: true,
            success: function (response) {
                objHighScores = JSON.parse(response.d)
                sessionStorage.setItem("ohs", response.d);

                updateExList();
            },
            error: function (error) {
                console.log(error);
            }
        })
    } else {
        objHighScores = JSON.parse(sessionStorage.getItem('ohs'));
        updateExList(objHighScores);
    }
}

var getGlobalHighScores = function (GameID) {
    var highScores;
    var data = {};
    data.GameID = GameID;
    data.CustomID = "-";
    data.UserID = "-";
    data.count = 1;
    data.GameMode = "p";
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/seterra/services/services.aspx/GetGlobalHighScores',
        data: JSON.stringify(data),
        async: true,
        success: function (response) {
            objGlobalHighScores = JSON.parse(response.d)
            var datDate = new Date(objGlobalHighScores[0].GameStartTime)
            var strHTML
            strHTML = "The best score ever recorded for this game (in Pin mode) is <b>" + objGlobalHighScores[0].GameScore.toString() + "% in " + getFriendlyFormattedTime(objGlobalHighScores[0].GameTime) + " (" + datDate.toLocaleDateString('en-US') + ")</b>. Can you beat that?"
            if (!window.isProUser()) {
                strHTML = strHTML + " If you want your scores to be recorded, you can sign up for a <a href = '/seterra/pro' >Pro account</a > "
            }
            $("#ltrGlobalHighScore").html(strHTML)
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function emojiToUnicode(str) {
    return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, function (e) {
        return "\\u" + e.charCodeAt(0).toString(16) + "\\u" + e.charCodeAt(1).toString(16);
    });
}

function stringToUnicode(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
        // Assumption: all characters are < 0xffff
        result += "\\u" + ("000" + str[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
}

function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

var saveScore = function (GameID, CustomID, UserName, UserID, GameScore, GameStartTime, GameEndTime, GameTime, CorrectClicks, WrongClicks, GameMode, IPAddress, LanguageID, SessionID, Nickname) {

    var data = {};
    data.GameID = GameID;
    data.CustomID = CustomID;
    data.UserName = UserName;
    data.UserID = UserID;
    data.GameScore = GameScore;
    data.GameStartTime = GameStartTime;
    data.GameEndTime = GameEndTime;
    data.GameTime = GameTime;
    data.CorrectClicks = CorrectClicks;
    data.WrongClicks = WrongClicks;
    data.GameMode = GameMode;
    data.IPAddress = IPAddress;
    data.LanguageID = LanguageID;
    data.SessionID = SessionID;
    data.Nickname = Nickname;

    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: '/seterra/services/services.aspx/zpwdf',
        data: JSON.stringify(data),
        async: true,
        success: function (response) {
            recentGameScoreID2 = recentGameScoreID
            recentGameScoreID = response.d;
        },
        error: function (error) {
            console.log(error);
        }
    })
    var data2 = {};
    data2.strMessage = Nickname + " " + GameScore.toString() + " " + GameTime.toString()
}

if (!window.isProUser()) {
    $("#topScoreInfo").hide();
}

function hideAds() {
    $("#sidebar").hide();
    $("#panVideoPlayer").hide();
    $("#divVideo").hide();
    $("#playbuzz").hide();
    $("#divAd_Panorama1").hide();
    $("#divAd_Panorama1").css("display", "none !important");
    $("#divAd_Skyscraper1").hide();
    $("#divAd_Skyscraper1").css("display", "none !important");
    $("#divAd_Skyscraper2").hide();
    $("#divAd_Skyscraper2").css("display", "none !important");
    $("#panVideoPlayer").css("display", "none !important");
    $(".ad").hide();
    $("#divPatreon").css("display", "none !important");
    $("#divPatreon").hide();
}

function GameModeName(gameMode) {

    switch (gameMode) {
        case "m":
            return "Multiple choice"
        case "p":
            return "Pin"
        case "h":
            return "Pin (hard)"
        case "b":
            return "Pin (no borders)"
        case "o":
            return "Pin (hard, no borders)"
        case "t":
            return "Type"
        case "y":
            return "Type (easy)"
        case "d":
            return "Place the labels"
        case "f":
            return "Place the flags"
        case "a":
            return "Type (autocomplete)"
        default:
            return "?"
    }
}

function getHighScoreByGameID(gameID) {
    var i
    for (i = 0; i < objHighScores.length; i++) {
        if (objHighScores[i].GameID == gameID) {
            return objHighScores[i]
        }
    }
}

var updateExList = function () {
    $(".circle-score").remove();
    if (window.isProUser() && ($(".exitem").length > 0) || $(".exitemHoriz").length > 0) {
        if (false) {
            $.each($(".exitem .textlink"), function (idx, item) {

                var href = $(item).find("a").attr("href");
                var gameIDx = href.lastIndexOf("/") + 1;
                var ex = href.substring(gameIDx)
                var dataItem;
                dataItem = getHighScoreByGameID(ex)

                if (dataItem != undefined) {
                    var colorclass = "red";
                    var intScore = parseInt(dataItem.GameScore);
                    if (intScore < 50) { colorclass = "red" }
                    if (intScore > 49 && intScore < 75) { colorclass = "darkyellow" }
                    if (intScore > 74 && intScore < 100) { colorclass = "yellow" }
                    if (intScore == 100) { colorclass = "green" }

                    $(item).parent().find(".exicon").append("<div data-ex='" + dataItem.GameID + "' data-name='" + dataItem.Nickname + "' data-time='" + dataItem.GameTime + "'  data-score='" + dataItem.GameScore + "'  data-gamemode='" + dataItem.GameMode + "'  class='circle-score " + colorclass + "' title='Hej hopp ostkaka är gott. Och kakor.'>" + dataItem.GameScore + "</div>")
                    var o = $(item).parent().find(".exicon").find(".circle-score")  //.title()
                    $(o).attr("title", " Score: " + dataItem.GameScore + "%" + "\nTime: " + getFormattedTime(dataItem.GameTime) + "\nUser: " + dataItem.Nickname + "\nGame mode: " + GameModeName(dataItem.GameMode))
                }
            })
        }
        if (true) {
            var n
            for (n = 0; n < objHighScores.length; n++) {
                var flagImages = $(".game" + objHighScores[n].GameID)
                if (flagImages.length > 0) {
                    if (flagImages.parent().find(".circle-score").length == 0) {
                        var colorclass = "red";
                        var intScore = parseInt(objHighScores[n].GameScore);
                        if (intScore < 50) { colorclass = "red" }
                        if (intScore > 49 && intScore < 75) { colorclass = "darkyellow" }
                        if (intScore > 74 && intScore < 100) { colorclass = "yellow" }
                        if (intScore == 100) { colorclass = "green" }
                        var strHTML = "<div data-ex='" + objHighScores[n].GameID + "' data-name='" + objHighScores[n].Nickname + "' data-time='" + objHighScores[n].GameTime + "'  data-score='" + objHighScores[n].GameScore + "'  data-gamemode='" + objHighScores[n].GameMode + "'  class='circle-score " + colorclass + "' title=''>" + objHighScores[n].GameScore + "</div>"

                        $(strHTML).insertAfter(flagImages.first())
                        var o = flagImages.parent().find(".circle-score")  //.title()
                        $(o).attr("title", " Score: " + objHighScores[n].GameScore + "%" + "\nTime: " + getFormattedTime(objHighScores[n].GameTime) + "\nUser: " + objHighScores[n].Nickname + "\nGame mode: " + GameModeName(objHighScores[n].GameMode))
                    }
                }
            }
        }
    }
}

function logTime(str) {
    datetime = new Date();
}

var getFormattedTime = function (ms) {

    totalSeconds = Math.floor(ms / 1000);

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    var dsec = Math.floor(ms / 100) % 10;
    var pad = "00";
    pad = pad.toString();
    seconds = seconds.toString();
    seconds = pad.substring(0, pad.length - seconds.length) + seconds;
    var dseconds = dsec.toString();
    //cseconds = pad.substring(0, pad.length - cseconds.length) + cseconds;

    var formattedTime = minutes + ":" + seconds + "." + dseconds;
    return formattedTime;
}

var getFriendlyFormattedTime = function (ms) {
    totalSeconds = Math.floor(ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    var dsec = Math.floor(ms / 100) % 10;
    if (minutes !== 0) {
        return minutes + " minutes and " + seconds + "." + dsec + " seconds";
    } else {
        return seconds + "." + dsec + " seconds";
    }
}

var paddedNumber = function (i) {
    if (i > 9) {
        return '' + i;
    } else {
        return '0' + i;
    }
}