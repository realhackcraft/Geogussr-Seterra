var selectedAreaColor = "#1e8346";
var unSelectedAreaColor = "#166c38";
var backgroundColor = "#deded7";
var semitransparentColor = "#000000";
var semitransparentOpacity = "0.1";
var backgroundColor2 = "#b6b6bf";
var cityFill = "#ffffff";
var waterColor = "#a4d1dc";
var waterColor2 = "#95bec8";
var borderColor;
var borderColor2 = "#2e7d54";
var guessColors = ["#f3f3f3", "#ffd970", "#e2b22d", "#bf4140"];
var labelColors = ["#f4f4f4", "#ffd05e", "#dba323", "#c75352"];
var printStrokeWidth = 1;
var printStrokeColor = "#eeeeee";
var printLandColor1 = "#ffffff";
var printLandColor2 = "#eeeeee";
var printWaterColor = "#ffffff";
var hoverTimeout;

function isDescendantOf(node, nodeID) {
    var f;
    f = false;

    if (node == undefined) { return false }
    if (node.hasAttribute('id') == true) {
        id = node.getAttribute('id');
        if (id.substring(0, nodeID.length) == nodeID) {
            f = true;
        }
    }

    while (node = node.parentNode) {
        if (node.id != null) {
            if (node.id.substring(0, nodeID.length) == nodeID) {
                f = true;
            }
        }
    }

    return f;
}

function initMap(svgImg) {
    var n2;
    var i;


    if (typeof lang === 'undefined') { lang = 'en' }
    if (lang.substr(lang.length - 3) == "-sl") {
        semitransparentOpacity = "0.05";
    } else {
        semitransparentOpacity = "0.1";
    }

    borderColor = waterColor2;
    n2 = svgImg.getElementsByTagName("rect");
    for (i = 0; i < n2.length; i++) {
        if (n2[i].getAttribute("id") != null) {
            if (n2[i].getAttribute("id").substring(0, 5) == "WATER") {
                waterElement([n2[i]]);
            }
            if (n2[i].getAttribute("id").substring(0, 10) == "BACKGROUND") {
                n2[i].setAttribute("fill", backgroundColor);
                n2[i].setAttribute("stroke", backgroundColor);
                n2[i].setAttribute("class", "background");
                borderColor = "#7eb08e"
            }
        }
    }
}

function initGroups(n) {
    var i;
    $(".river").attr("class", ""); // remove river class 

    for (i = 0; i < n.length; i++) {
        if (n[i].getAttribute("id") != null) {
            if (n[i].getAttribute("id").substring(0, 9) == 'SHOWAFTER') {
                n[i].setAttribute("class", "showafter");
            }
        }

        if (n[i].getAttribute("id") != null) {
            if (n[i].getAttribute("id").substring(0, 4) == 'MISC') {
                n[i].setAttribute("class", "misc");
            }
        }

        if (isDescendantOf(n[i], "MISC") == false && isDescendantOf(n[i], "SHOWAFTER") == false && isDescendantOf(n[i], "SEMITRANSPARENT") == false && n[i].getAttribute("id") != null) {
            var areaId = n[i].getAttribute("id");
            var currC;
            if (gameMode == 'pinhard') {
                currC = jQuery.grep(objCountry2, function (n, i) { return (n.id == areaId) });
            } else {
                currC = jQuery.grep(objCountry, function (n, i) { return (n.id == areaId) });
            }

            n[i].setAttribute("data-errors", 0);
            n[i].setAttribute("hint-index", 0)
            if (n[i].getAttribute("id") != null && currC.length > 0) {

                if (jQuery.grep(objCountry, function (n) { return (n.id == areaId) }).length == 0) {
                    n[i].setAttribute("class", "noq q");
                } else {
                    n[i].setAttribute("class", "q");
                }
                n[i].setAttribute("data-qText", currC[0].qText);
                n[i].setAttribute("data-wikipediaLink", currC[0].wikipediaLink);
                n[i].setAttribute("data-infoText", currC[0].infoText);
                n[i].setAttribute("data-imageFile", currC[0].imageFile);
                n[i].setAttribute("data-sayAfter", currC[0].sayAfter);
                n[i].setAttribute("data-sayAfterTrans", currC[0].sayAfterTrans);

                var n1 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("circle");
                initObjects(n1);

                var n1 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("ellipse");
                initObjects(n1);

                var n2 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("polygon");
                initObjects(n2);

                var n3 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("path");
                initObjects(n3);

                var n4 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("rect");
                initObjects(n4);

                var n4 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("line");
                initObjects(n4);

                var n5 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("polyline");
                initObjects(n5);

                var n6 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("image");
                initObjects(n6);


            } else {
                n[i].setAttribute("class", "");

                var n1 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("circle");
                lockElement(n1);

                var n2 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("polygon");
                lockElement(n2);

                var n2 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("polyline");
                lockElement(n2);

                var n3 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("path");
                lockElement(n3);

                var n4 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("rect");
                lockElement(n4);

                var n5 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("line");
                lockElement(n5);

                var n6 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("ellipse");
                lockElement(n6);

                var n7 = document.getElementById(n[i].getAttribute("id")).getElementsByTagName("image");
                lockElement(n7);
            }

            removeSVGAttribute(n[i], "answered");
        }

        if (n[i].getAttribute("id") != null) {
            if (isDescendantOf(n[i], "WATER")) {
                var n1 = document.getElementById(n[i].getAttribute("id")).childNodes;
                waterElement(n1);
            }
            if (isDescendantOf(n[i], "HIGHLIGHT")) {
                var n1 = document.getElementById(n[i].getAttribute("id")).childNodes;
                highlightElement(n1);
            }
        }

        if (isDescendantOf(n[i], "SEMITRANSPARENT")) {
            n[i].setAttribute("opacity", "1")
        }
    }

    $(".svgMap").show();
}

function addFlag(x, y, imgFile, myId) {
    var myWidth;

    var myHeight = 18;
    if (gameMode == 'video') {
        myHeight = 50
    }

    var myImg = $("#IMG_" + myId).get(0)

    if (myImg != undefined) {
        myWidth = myHeight * myImg.naturalWidth / myImg.naturalHeight

        var newImage = document.createElementNS(svgNS, "image");
        newImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/seterra/images/system/flags/' + imgFile);
        newImage.setAttributeNS(null, "x", x - myWidth / 2);
        newImage.setAttributeNS(null, "y", y - myHeight / 2 - 5);
        newImage.setAttributeNS(null, 'width', myWidth);
        newImage.setAttributeNS(null, 'id', 'FLAG_' + myId);
        newImage.setAttributeNS(null, 'class', 'flagImage');

        var rect = document.createElementNS(svgNS, 'rect');
        rect.setAttributeNS(null, 'x', x - myWidth / 2);
        rect.setAttributeNS(null, 'y', y - myHeight / 2 - 5);
        rect.setAttributeNS(null, 'height', myHeight);
        rect.setAttributeNS(null, 'width', myWidth);
        rect.setAttributeNS(null, 'fill', 'none');
        rect.setAttributeNS(null, "stroke", "#dddddd");
        rect.setAttributeNS(null, "stroke-width", "1");
        rect.setAttributeNS(null, 'id', 'FLAGRECT_' + myId);
        rect.setAttributeNS(null, 'class', 'flagRect');

        var myElem;
        myElem = document.getElementById('labelpoint');
        if (myElem === null) {
            myElem = document.getElementById("svgpoint");
        } else {
        }
        myElem.appendChild(newImage);
        myElem.appendChild(rect);
    }
}

function addText(x, y, myText, myId, labelColor) {
    var padding = labelPadding;

    if (myText == "") { return }

    if (gameMode == "video") {
        padding = 12;
    }
    var newText = document.createElementNS(svgNS, "text");
    newText.setAttributeNS(null, "text-anchor", "middle");
    newText.setAttributeNS(null, "font-size", fontsize + "px");
    newText.setAttributeNS(null, "font-family", "Verdana");
    newText.setAttributeNS(null, "x", x);
    newText.setAttributeNS(null, "y", y);
    newText.setAttributeNS(null, 'id', 'TEXT_' + myId);

    if (gameMode == "video") {
        newText.setAttributeNS(null, 'class', 'svgLabelTextVideo');
        newText.setAttributeNS(null, 'class', 'svgLabelTextVideo');
    } else {
        newText.setAttributeNS(null, 'class', 'svgLabelText');
        newText.setAttributeNS(null, 'class', 'svgLabelText');
    }

    if (labelColor == guessColors[3]) {
        newText.setAttributeNS(null, "color", "#ffffff");
    }

    newText.setAttributeNS(null, "font-family", "Verdana");
    var textNode = document.createTextNode(myText);
    newText.appendChild(textNode);

    var myElem;
    myElem = document.getElementById('labelpoint');
    if (myElem === null) {
        myElem = document.getElementById("svgpoint");

    } else {

    }

    myElem.appendChild(newText);

    var newBox = document.createElementNS(svgNS, "rect");

    newBox.setAttributeNS(null, 'x', x - (newText.getBBox().width + padding) / 2);
    newBox.setAttributeNS(null, 'y', y - (newText.getBBox().height + padding) / 2 - 1);
    newBox.setAttributeNS(null, 'height', newText.getBBox().height + padding * 0.7 - 5);
    newBox.setAttributeNS(null, 'width', newText.getBBox().width + padding);
    newBox.setAttributeNS(null, 'id', 'RECT_' + myId);
    newBox.setAttributeNS(null, 'class', 'labelBkgrd');
    newBox.setAttributeNS(null, 'fill', labelColor);
    newBox.setAttributeNS(null, 'opacity', '0.5');

    myElem.appendChild(newBox);
    myElem.appendChild(newText);
    positionAndResizeLabel(myId)

    $('#RECT_' + myId).hover(
        function () {
            $(this).fadeTo(500, 0.5);
        }, function () {
            $(this).fadeTo(1000, 1);
        });
}

function fitBoxToText(newBox, newText) {
    var extraHeight = 0
    var labelPadding = 6
    var padding, paddingTop, paddingBottom
    if (labelPadding == 6) { extraHeight = 3 }
    padding = 3;
    var x, y

    switch (currentZoomLevel()) {
        case 1:
            padding = 4;
            paddingTop = 1.5;
            paddingBottom = 2;
            break
        case 2:
            padding = 3;
            paddingTop = 1.5;
            paddingBottom = 1.5;

            break
        case 3:
            padding = 3;
            paddingTop = 1;
            paddingBottom = 1.3;
            break

        case 4:
            padding = 2.5;
            paddingTop = 1.0
            paddingBottom = 1.0;
            break
        default:
            padding = 3;
            paddingTop = 2;
            paddingBottom = 2;
    }

    bb = newText.getBBox()

    x = bb.x + bb.width / 2
    y = bb.y + bb.height / 2

    newBox.setAttributeNS(null, 'x', x - (bb.width + padding * 2) / 2);
    newBox.setAttributeNS(null, 'y', y - (bb.height) / 2 - paddingTop);
    newBox.setAttributeNS(null, 'height', bb.height + paddingTop + paddingBottom);
    newBox.setAttributeNS(null, 'width', bb.width + padding * 2);
}

function positionAndResizeLabel(strID) {
    var prevZoomLevel
    var currZoomLevel
    var maxYDist = 1000
    var maxXDist = 1000
    var strokeWidth = 1

    currZoomLevel = currentZoomLevel()
    prevZoomLevel = parseInt($("#TEXT_" + strID).data("zoomLevel"))
    if (prevZoomLevel == currZoomLevel) { return }
    switch (currZoomLevel) {
        case 1:
            myfontsize = fontsize
            strokeWidth = 1
            break
        case 2:
            myfontsize = 7
            maxXDist = 17
            strokeWidth = 0.5
            break
        case 3:
            myfontsize = 4.5
            maxYDist = 6
            maxXDist = 10
            strokeWidth = 0
            snapLabelToLine(strID.replace("_sayafter", ""))
            strokeWidth = 0
            break
        case 4:
            myfontsize = 2.5
            maxYDist = 3
            maxXDist = 0
            strokeWidth = 0
            break
        default:
            myfontsize = fontsize
    }

    $("#" + strID).find("line").attr("stroke-width", strokeWidth)
    $("#TEXT_" + strID).data("zoomLevel", currZoomLevel)

    theText = document.getElementById("TEXT_" + strID)
    theRect = document.getElementById("RECT_" + strID)
    theText.setAttributeNS(null, "font-size", myfontsize + "px");
    var p = getCenterpoint(document.getElementById(strID.replace("_sayafter", "")));

    if (($("#" + strID.replace("_sayafter", "")).find("line").length == 0 || currZoomLevel >= 3) && $("#" + strID.replace("_sayafter", "")).find(".city, .city1").length != 0) {
        $("#" + strID).find("line").attr("stroke-width", 0)
        var city = $("#" + strID.replace("_sayafter", "")).find(".city, .city1").first()
        var pc = { x: 0, y: 0 }
        var radius
        pc.x = parseFloat(city.attr("cx"))
        pc.y = parseFloat(city.attr("cy"))
        radius = parseInt(city.attr("rx"))
        if (pc.y > p.y) {
            p.y = Math.max(p.y, pc.y - maxYDist - radius + 1)
        }

        if (pc.y < p.y) {
            p.y = Math.min(p.y, pc.y + maxYDist + radius + 1)
        }

        if (pc.x > p.x) {
            p.x = Math.max(p.x, pc.x - maxXDist)
        }

        if (pc.x < p.x) {
            p.x = Math.min(p.x, pc.x + maxXDist)
        }
    }

    if (($("#" + strID.replace("_sayafter", "")).find("line").length == 1 && currZoomLevel >= 3 && $("#" + strID.replace("_sayafter", "")).find(".city, .city1").length == 0)) {
        p.x = $("#" + strID.replace("_sayafter", "")).data("x2")
        p.y = $("#" + strID.replace("_sayafter", "")).data("y2")
    }

    if (strID.indexOf("_sayafter") != -1) {
        var newY = p.y + 2 + 18 * (1 / currZoomLevel)
        p.y = newY
    }
    if (typeof (p.x) != 'undefined') {
        theText.setAttributeNS(null, "x", p.x);
        theText.setAttributeNS(null, "y", p.y);
        fitBoxToText(theRect, theText)
    }
}

function snapLabelToLine(strID) {
    if (typeof ($("#" + strID).data("labelsSnapped")) == 'undefined') {
        if ($("#" + strID).find("line").length != 1) { return }
        var p = getCenterpoint(document.getElementById(strID.replace("_sayafter", "")));
        var l = $("#" + strID).find("line").first()

        var p1 = { x: 0, y: 0 }
        var p2 = { x: 0, y: 0 }

        var dist1, dist2

        p1.x = l.attr("x1")
        p1.y = l.attr("y1")

        p2.x = l.attr("x2")
        p2.y = l.attr("y2")

        dist1 = Math.hypot(p.x - p1.x, p.y - p1.y)
        dist2 = Math.hypot(p.x - p2.x, p.y - p2.y)

        if (dist1 < dist2) {
            setCenterpoint($("#" + strID), p1.x, p1.y)
            $("#" + strID).data("x2", p2.x)
            $("#" + strID).data("y2", p2.y)
        } else {
            setCenterpoint($("#" + strID), p2.x, p2.y)
            $("#" + strID).data("x2", p1.x)
            $("#" + strID).data("y2", p1.y)
        }
        $("#" + strID).data("labelsSnapped", 1)
    }
}

function currentZoomLevel() {

    if (typeof (panZoom) == 'undefined') {
        return 1
    } else {
        if (panZoom.getViewBox().width > 650) {
            return 1
        }

        if (panZoom.getViewBox().width > 400) {
            return 2
        }

        if (panZoom.getViewBox().width > 200) {
            return 3
        } else {
            return 4
        }
    }
}

function showTypeAt(x, y) {
    if (y > 720) { y = 720 };

    var svg = document.getElementById("svgpoint");

    var pnt = svg.createSVGPoint();
    pnt.x = x;
    pnt.y = y;

    var ctm = svg.getScreenCTM();
    var ipnt = pnt.matrixTransform(ctm);

    imgX = ipnt.x + window.pageXOffset;
    imgY = ipnt.y + window.pageYOffset;

    var myForm = $('#typeInputForm');
    myForm.css("left", (imgX - 72) + "px");
    myForm.css("top", (imgY + 20) + "px");
    $("#typeInputForm").draggable();
}

function showMultiAt(x, y) {
    if (y > 720) { y = 720 };

    var svg = document.getElementById("svgpoint");

    var pnt = svg.createSVGPoint();
    pnt.x = x;
    pnt.y = y;

    var ctm = svg.getScreenCTM();
    var ipnt = pnt.matrixTransform(ctm);

    imgX = ipnt.x + window.pageXOffset;
    imgY = ipnt.y + window.pageYOffset;

    var myForm = $('#multiInputForm');
    myForm.css("left", (imgX - 120) + "px");
    myForm.css("top", (imgY + 20) + "px");
    myForm.css("top", (imgY + 20) + "px");
}

function initObjects(n) {
    var i;

    for (i = 0; i < n.length; i++) {
        n[i].setAttributeNS(null, "pointer-events", "auto");
        var id

        id = n[i].getAttribute('id');
        if (id != null) {

            if (id.substring(0, 9) == 'SHOWAFTER') {
                n[i].setAttribute("class", "showafter");
                continue;
            }

            if (id.substring(0, 10) == 'SHOWBEFORE') {
                n[i].setAttribute("class", "showbefore");
                continue;
            }

            if (id.substring(0, 4) == 'SHOW') {
                n[i].setAttribute("class", "show");
                break;
            }

            if (id.substring(0, 4) == 'LINE') {  // New 2021-08-05. Needed for compatibality with Inkscape, that can  not create <line> objects in svg files.
                n[i].classList.add("line");
                n[i].setAttribute("fill-opacity", "0");
                n[i].setAttribute("opacity", "0");
                continue;
            }
        }
        if (isDescendantOf(n[i], "SHOWAFTER") == true) {
            continue
        }

        if (isDescendantOf(n[i], "MISC") == true) {
            n[i].setAttribute("class", "misc");
            continue
        }

        if (isDescendantOf(n[i], "SHOWBEFORE") == true) {
            continue
        }
        if (isDescendantOf(n[i], "SHOW") == true) {
            continue
        }

        if (n[i].nodeName == 'polygon' || n[i].nodeName == 'path' || n[i].nodeName == 'circle' || n[i].nodeName == 'ellipse' || n[i].nodeName == 'line' || n[i].nodeName == 'image') {

            if (n[i].getAttribute("fill") != "#000099" && n[i].getAttribute("fill") != "none") {
                n[i].setAttribute("fill", selectedAreaColor)
            };

            if (n[i].getAttribute("fill") == "none") {

                n[i].setAttribute("fill", "#1e8346");
                n[i].setAttribute("opacity", "0.001");
                if (n[i].classList.contains("city2") == false) {
                    n[i].setAttribute("class", "clickarea");
                }
            };

            if (n[i].nodeName != 'line') {
                n[i].setAttribute("stroke", borderColor);
                n[i].setAttribute("stroke-width", "0.5");
                n[i].classList.add("landarea");
            }
        }

        if (n[i].nodeName == 'rect') {
            n[i].setAttribute("opacity", "0");
            n[i].setAttribute("visibility", "hidden");
        }


        if (n[i].nodeName == 'line') {
            n[i].setAttribute("opacity", "0")
            n[i].classList.add("line");
        }

        if (isDescendantOf(n[i], "SEMITRANSPARENT")) {
            n[i].setAttribute("class", "semitransparent")
            n[i].setAttribute("opacity", "1")
            n[i].setAttribute("fill-opacity", "0")
            n[i].setAttribute("stroke-opacity", "0")
        }


        if (isDescendantOf(n[i], "SEMITRANSPARENTVISIBLE")) {
            n[i].setAttribute("class", "semitransparent semitransparentvisible")
            n[i].setAttribute("fill-opacity", semitransparentOpacity)
            n[i].setAttribute("fill", semitransparentColor)
            n[i].setAttribute("stroke-opacity", semitransparentOpacity)
            n[i].setAttribute("stroke", semitransparentColor)
            n[i].setAttribute("visibility", "visible");
        }


        if (isDescendantOf(n[i], "SEMITRANSPARENT2")) {
            n[i].setAttribute("class", "semitransparent2")
            n[i].setAttribute("fill-opacity", "0.001")
            n[i].setAttribute("stroke-opacity", "0")
        }

        if (id != null) {
            var id2
            id2 = id.substring(0, 4);
            if (id2 == 'CITY') {
                var ra = "6";
                n[i].setAttribute("opacity", "1")
                n[i].setAttribute("fill", cityFill)
                n[i].setAttribute("stroke", "#000000")


                if (id.substring(4, 5) == "R") {
                    n[i].setAttribute("class", "city1")
                    ra = id.substring(5, 6);
                    n[i].setAttribute("r", ra)
                    n[i].setAttribute("rx", ra)
                    n[i].setAttribute("ry", ra)
                    n[i].setAttribute("stroke-width", "1px")
                    n[i].setAttribute("stroke-opacity", "0.9")
                } else {
                    n[i].setAttribute("class", "city")
                    n[i].setAttribute("r", ra)
                    n[i].setAttribute("rx", ra)
                    n[i].setAttribute("ry", ra)
                    n[i].setAttribute("stroke-width", "0.7px")
                    n[i].setAttribute("stroke-opacity", "0.9")
                }
                if (parseInt(ra) >= 4) {
                    var xmlns = "http://www.w3.org/2000/svg";
                    var elem = document.createElementNS(xmlns, "circle");

                    elem.setAttributeNS(null, "cx", n[i].getAttribute("cx"));
                    elem.setAttributeNS(null, "cy", n[i].getAttribute("cy"));
                    elem.setAttributeNS(null, "r", parseInt(ra) + 6);
                    elem.setAttributeNS(null, "fill", "none");
                    elem.setAttributeNS(null, "pointer-events", "none");
                    elem.setAttributeNS(null, "opacity", "0");
                    elem.setAttribute("class", "city2")

                    n[i].parentNode.appendChild(elem);
                }
            }

            if (id2 == 'RIVE') {
                n[i].setAttribute("class", "river")
            }
        }
    }
}

function lockElement(svgObj) {
    var i;
    var id;

    for (i = 0; i < svgObj.length; i++) {
        svgObj[i].setAttributeNS(null, "pointer-events", "none");
        if (isDescendantOf(svgObj[i], "SHOWAFTER") == true) {
            svgObj[i].setAttribute("class", "showafter");
            svgObj[i].setAttribute("opacity", "0");
            svgObj[i].setAttribute("border-opacity", "0");
            continue;
        }
        if (isDescendantOf(svgObj[i], "SHOW") == true || isDescendantOf(svgObj[i], "MISC") == true) {

            svgObj[i].setAttribute("class", "show");
            //svgObj[i].setAttribute("opacity", "0");
            continue;
        }

        if (svgObj[i].nodeName == 'polygon' || svgObj[i].nodeName == 'polyline' || svgObj[i].nodeName == 'path' || svgObj[i].nodeName == 'circle' || svgObj[i].nodeName == 'ellipse' || svgObj[i].nodeName == 'image') {
            if (svgObj[i].getAttribute("fill") != "none") { svgObj[i].setAttribute("fill", unSelectedAreaColor) } else { svgObj[i].setAttribute("opacity", "0") }
            if (isDescendantOf(svgObj[i], "LANDDARK") == true) {

                svgObj[i].setAttribute("fill", "#0b602d");
                svgObj[i].setAttribute("stroke", "#546b70")
                svgObj[i].setAttribute("stroke-opacity", "1")
                svgObj[i].setAttribute("stroke-width", "0.25px");
            }

            else if (isDescendantOf(svgObj[i], "LANDDARK2") == true) {
                svgObj[i].setAttribute("fill", selectedAreaColor);
                svgObj[i].setAttribute("stroke", "#2f915b")
                svgObj[i].setAttribute("stroke-opacity", "1")
                svgObj[i].setAttribute("stroke-width", "1px");

            } else {
                svgObj[i].setAttribute("stroke", borderColor)
                svgObj[i].setAttribute("stroke-width", "0.5px");
                svgObj[i].classList.add("landarea");
            }
        }
        if (svgObj[i].nodeName == 'circle' || svgObj[i].nodeName == 'ellipse') {
            if (svgObj[i].getAttribute("r") > 1 || svgObj[i].getAttribute("rx") > 1) {
                svgObj[i].setAttribute("opacity", "0");
            }
        }
        if (svgObj[i].nodeName == 'rect') {

            id = svgObj[i].getAttribute('id');
            if (id != null) {

                if (id.substring(0, 15) != "SEMITRANSPARENT") {
                    svgObj[i].setAttribute("opacity", "0");
                } else {
                    svgObj[i].setAttribute("fill-opacity", semitransparentOpacity)
                    svgObj[i].setAttribute("fill", semitransparentColor)
                    svgObj[i].setAttribute("stroke-opacity", semitransparentOpacity)
                    svgObj[i].setAttribute("stroke", semitransparentColor)
                    svgObj[i].setAttribute("visibility", "visible");
                }

            } else {
                svgObj[i].setAttribute("opacity", "0");
            }
        }

        if (svgObj[i].nodeName == 'line') {
            svgObj[i].setAttribute("opacity", "0")
        }
        id = svgObj[i].getAttribute('id');
        if (id != null) {

            if (id.substring(0, 15) == "SEMITRANSPARENT" && lang.substr(lang.length - 3) != "-sl") {
                $(svgObj[i]).attr("opacity", "0");
                $(svgObj[i]).attr("stroke-opacity", "0");
            }

        }

    }
}

function waterElement(svgObj) {
    var i;
    for (i = 0; i < svgObj.length; i++) {

        if (svgObj[i].nodeName == 'polygon' || svgObj[i].nodeName == 'path' || svgObj[i].nodeName == 'rect') {
            svgObj[i].setAttribute("fill", waterColor)

            svgObj[i].setAttribute("stroke", waterColor2);
            svgObj[i].setAttribute("stroke-width", "0.1");
            svgObj[i].setAttribute("opacity", "1");
            svgObj[i].setAttribute("class", "water");
        }
        if (svgObj[i].nodeName == 'circle') {
            svgObj[i].setAttribute("opacity", "0");
        }
        if (svgObj[i].nodeName == 'g') {
            waterElement(svgObj[i].childNodes);
        }
    }
}

function highlightElement(svgObj) {

    var i;

    for (i = 0; i < svgObj.length; i++) {

        if (svgObj[i].nodeName == 'polygon' || svgObj[i].nodeName == 'path' || svgObj[i].nodeName == 'rect' || svgObj[i].nodeName == 'polyline') {
            svgObj[i].setAttribute("fill", "#1e8346");

            svgObj[i].setAttribute("stroke", borderColor);
            svgObj[i].setAttribute("stroke-width", "0.7");
            svgObj[i].classList.add("landarea");

        }

        if (svgObj[i].nodeName == 'g') {

            highlightElement(svgObj[i].childNodes);
        }
    }

}

function paintObject(t, col) {

    if (isDescendantOf(t, "SHOWAFTER") == true) {

        return
    }

    if (isDescendantOf(t, "MISC") == true) {
        return
    }

    if (isDescendantOf(t, "SHOWBEFORE") == true) {
        return
    }
    if (isDescendantOf(t, "SHOW") == true) {
        return
    }


    if ($(t).attr("class") != "showbefore" && $(t).parent().attr("class") != "showbefore" && $(t).parent().attr("class") != "showafter" && $(t).attr("class") != "showafter" && $(t).attr("class") != "show") {

        $(t).attr("fill", col);
        if (lang.substr(lang.length - 3) == "-sl") { $(t).attr("stroke", col) };
        if ($(t).attr("class") == "semitransparent") {
            $(t).attr("fill-opacity", "0.1");
        }

        if ($(t).attr("class") == "semitransparent semitransparentvisible") {
            $(t).attr("fill-opacity", "0.1");
            $(t).attr("stroke-opacity", "0.3");
        }

        if ($(t).attr("class") == "semitransparent2") {
            if (col == "#ffffff") { $(t).attr("fill-opacity", "0.5"); } else { $(t).attr("fill-opacity", "0.3"); }

        }
    }
}

function paintGroup(g, col) {
    var n = g.getElementsByTagName("polygon");

    for (i = 0; i < n.length; i++) {
        paintObject(n[i], col);
    }
    var n = g.getElementsByTagName("rect");

    for (i = 0; i < n.length; i++) {
        paintObject(n[i], col);
    }

    var n = g.getElementsByTagName("polyline");

    for (i = 0; i < n.length; i++) {
        paintObject(n[i], col);
    }

    var n = g.getElementsByTagName("path");

    for (i = 0; i < n.length; i++) {
        paintObject(n[i], col);
    }

    var n = g.getElementsByTagName("circle");

    for (i = 0; i < n.length; i++) {
        paintObject(n[i], col);
    }

    var n = g.getElementsByTagName("ellipse");

    for (i = 0; i < n.length; i++) {
        paintObject(n[i], col);
    }
}

function showLabelToggle(obj, fadeout, labelColor, abbreviate) {
    if (obj.getAttribute('data-toggle') == "1") {
        showLabel(obj, fadeout, labelColor, !abbreviate);
        obj.setAttribute('data-toggle', "0")
    } else {
        showLabel(obj, fadeout, labelColor, abbreviate);
        obj.setAttribute('data-toggle', "1")
    }
}

function showLabelToggle2(obj, fadeout, labelColor, abbreviate) {
    if (obj.getAttribute('data-toggle') == "1") {
        showLabel(obj, fadeout, labelColor, abbreviate);
        obj.setAttribute('data-toggle', "0")
    } else {
        var strID;

        strID = getCleanName(obj.getAttribute("id"));

        removeLabel(strID)
        obj.setAttribute('data-toggle', "1")

        hideLines(obj)
    }

}

function showAFlag(obj, fadeout) {
    var strID;

    strID = getCleanName(obj.getAttribute("id"));

    var p = getCenterpoint(obj);
    var imgFile;

    imgFile = obj.getAttribute('data-imageFile')

    addFlag(p.x, p.y, imgFile, strID)

    if (fadeout == false) {
        document.getElementById("FLAG_" + strID).addEventListener('mouseover', function (event) { hoverTimeout = setTimeout(function () { hoverdiv2(strID) }, 500) })
        document.getElementById("FLAG_" + strID).addEventListener('mouseout', function (event) { clearTimeout(hoverTimeout); document.getElementById("divFlagZoom").style.visibility = 'hidden' })
    }
    if (fadeout != false) {
        $("#FLAG_" + strID).fadeOut(fadeout);
        $("#FLAGRECT_" + strID).fadeOut(fadeout);
    }
}

function removeAllLabels() {
    $(".svgLabelTextVideo").remove();
    $(".svgLabelText").remove();
    $(".labelBkgrd").remove();
}

function removeLabel(strID) {
    $("#RECT_" + strID + "_sayafter").remove();
    $("#TEXT_" + strID + "_sayafter").remove();
    $("#RECT_" + strID).remove();
    $("#TEXT_" + strID).remove();
}

function showLabel(obj, fadeout, labelColor, abbreviate) {

    var strID;
    strID = getCleanName(obj.getAttribute("id"));

    removeLabel(strID)

    var p = getCenterpoint(obj);
    var len;
    var str, str3;
    var imgFile;
    
    str3 = obj.getAttribute('data-sayAfterTrans')
    str = obj.getAttribute("data-qText");
    str2 = obj.getAttribute("data-qText");
    len = 1;

    if ((gameMode == "pinhard" || gameMode == "pinhardnoborders") && abbreviate == "X") {
        str = "✖"
        str2 = "✖"
        str3 = ""
    }

    if (fadeout == false) {
        str = str.replace(" (Czechia)", ""); // Very special case
    }

    if (abbreviate == true) {
        len = getTextLength(obj);

        if (defaultAbbreviationLength != -1 && len == 100) {
            len = defaultAbbreviationLength
        }
        if (len == 0) {
            fadeout = 2000;
        }
        if (len != 0) {
            if (str.length > len) {
                str = str.substring(0, len);

                if (str.substring(len, len + 1) != ' ') { str = str + '.' }
            };
        }
    }
    addText(p.x, p.y, str, strID, labelColor);
    addText(p.x, p.y + 20, str3, strID + "_sayafter", labelColor);

    if (gameMode != "video") {
        showLines(obj, fadeout);
    }

    if (fadeout != false) {
        $("#RECT_" + strID).fadeOut(fadeout);
        $("#TEXT_" + strID).fadeOut(fadeout);
    }

    $("#RECT_" + strID + "_sayafter").fadeOut(1500);
    $("#TEXT_" + strID + "_sayafter").fadeOut(1500);
}

function showThisTypeQuestion() {
    var area = $("#" + q)[0];
    if (typeof (area) != 'undefined') {
        var p = getTypeCenterpoint(area);
        showTypeAt(p.x, p.y)
    }
}

function showThisMulti() {
    var area = $("#" + q)[0];
    if (typeof (area) != 'undefined') {
        var p = getTypeCenterpoint(area);
        showMultiAt(p.x, p.y)
    }
}

function moveToLabel(obj, dropObj, labelColor) {

    var p = getCenterpoint(obj);
    var svg = document.getElementById("svgpoint");
    //var svg = document.getElementById("Country_teritory");
    var pnt = svg.createSVGPoint();

    pnt.x = p.x;
    pnt.y = p.y;

    var ctm = svg.getScreenCTM();
    var ipnt = pnt.matrixTransform(ctm);

    offY = dropObj.offset().top - window.pageYOffset;
    offX = dropObj.offset().left - window.pageXOffset;


    dX = ipnt.x - offX - dropObj.width() / 2;
    dY = ipnt.y - offY - dropObj.height() / 2;

    dropObj.animate({ top: dY, left: dX }, 250, function () {

        var str;
        var len;

        len = getTextLength(obj);
        str = obj.getAttribute("data-qText");

        if (gameMode == 'placelabels' || obj.getAttribute("data-imageFile") == "") {
            if (len > 0) {
                showLabel(obj, false, labelColor, true)
            } else {
                showLines(obj);
                showLabel(obj, 3001, labelColor, false)
            }

        } else {
            if (gameMode == 'placeflags') {
                if (len >= 5) {
                    showLines(obj);
                    showAFlag(obj, false)
                } else {
                    showAFlag(obj, 3001)
                }
            }
        }
        if (labelColor == labelColors[3]) { paintLabel(obj.getAttribute("id"), "white") }
        $(dropObj).remove();

        objQ = arrObjQ[0];

    });
}

function hideText(id) {
    document.getElementById('TEXT_' + id).setAttribute('opacity', 0)
    document.getElementById('RECT' + id).setAttribute('opacity', 0)
}
function showText(id) {

    document.getElementById('TEXT_' + id).setAttribute('opacity', 1)
    document.getElementById('RECT' + id).setAttribute('opacity', 1)
}

//Gets the centerpoint where the label should be
function getCenterpoint(g) {
    if (g == null) { return }

    var i;
    var x, y;
    var myRect = null;
    var myCity = null;

    if (typeof ($(g).data("centerpointx")) != 'undefined' && typeof ($(g).data("centerpointy") != 'undefined')) {
        return { x: parseInt($(g).data("centerpointx")), y: parseInt($(g).data("centerpointy")) }
    }

    var n = g.getElementsByTagName('rect');
    var lines = g.getElementsByTagName("line");
    var c = g.querySelectorAll('.city');
    myCity = c[0];

    for (i = 0; i < n.length; i++) {
        var str
        var str2
        if (n[i].getAttribute("id") != null) {
            str = n[i].getAttribute("id").substring(0, 10)
            str2 = n[i].getAttribute("id").substring(0, 4)
        } else {
            str = ""
            str2 = ""
        }
        if (str != "UNANSWERED" && str2 != "FLAG") { myRect = n[i] };
    }
    for (i = 0; i < n.length; i++) {
        var str
        if (n[i].getAttribute("id") != null) {
            str = n[i].getAttribute("id").substring(0, 10)
        } else {
            str = ""
        }
        if (g.hasClass("answered") == false && str == "UNANSWERED") { myRect = n[i]; }
        if (gameMode == 'placeflags' && str2 == "FLAG") { myRect = n[i]; }

    }
    if (myRect != null) {
        if (gameMode == "video" && lines.length > 0) {
            x = g.getBBox().x + g.getBBox().width / 2;
            y = g.getBBox().y + g.getBBox().height / 2;
        } else {
            x = myRect.getBBox().x + myRect.getBBox().width / 2;
            y = myRect.getBBox().y + myRect.getBBox().height - 3;
        }
    } else {

        if (myCity != null) {

            x = myCity.getBBox().x + myCity.getBBox().width / 2;
            y = myCity.getBBox().y + myCity.getBBox().height / 2 + 20;
        }
        else {
            x = g.getBBox().x + g.getBBox().width / 2;
            y = g.getBBox().y + g.getBBox().height / 2;
        }
    }

    if (gameMode == "video" && myCity != null) {
        x = myCity.getBBox().x + myCity.getBBox().width / 2;
        y = myCity.getBBox().y + myCity.getBBox().height / 2 + 30;
    }
    setCenterpoint(g, x, y)
    return { x: x, y: y }
}

function clearCenterpoint(g) {
    $(g).removeData("centerpointx")
    $(g).removeData("centerpointy")
}


function clearAllCenterpoints(g) {
    $("g").removeData("centerpointx")
    $("g").removeData("centerpointy")
}

function setCenterpoint(g, x, y) {
    $(g).data("centerpointx", x);
    $(g).data("centerpointy", y);
}


// Gets the visual centerpoint 
function getBBox2(g) {
    var i;
    var x1, x2, y1, y2
    var myCity = null;
    var c = g.querySelectorAll('.city, .city1');

    myCity = c[0];

    if (myCity != null) {
        var b = myCity.getBBox()

        x1 = b.x
        y1 = b.y
        x2 = x1 + b.width
        y2 = y1 + b.height

    } else {
        var r = g.querySelectorAll('rect');
        for (i = 0; i < r.length; i++) {
            if (isDescendantOf(r[i], "UNANSWERED") == true) {
                var b = r[i].getBBox()
                x1 = b.x
                x2 = b.x + b.width
                y1 = b.y
                y2 = b.y + b.height
                return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }

            }
        }

        var p = g.querySelectorAll('path, polygon, polyline');

        for (i = 0; i < p.length; i++) {
            if (isDescendantOf(p[i], "SHOWAFTER") == false && isDescendantOf(p[i], "SHOWBEFORE") == false) {
                var b = p[i].getBBox()
                if (i == 0) {

                    x1 = b.x
                    x2 = b.x + b.width
                    y1 = b.y
                    y2 = b.y + b.height

                } else {
                    if (b.x < x1) { x1 = b.x }
                    if (b.y < y1) { y1 = b.y }
                    if (b.x + b.width > x2) { x2 = b.x + b.width }
                    if (b.y + b.heigth > y2) { y2 = b.y + b.height }
                }
            }
        }
    }

    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
}

function getTypeCenterpoint(g) {
    var x, y;
    var myRect = null;
    var myLine = null;
    var minX = 100000;
    var maxY = -100000;
    var maxX = -100000;

    var children = g.querySelectorAll('path, line, circle, polygon, polyline, ellipse');

    for (var j = 0; j < children.length; j++) {
        var child = children[j];


        if (child.getAttribute("opacity") > 0.5 || child.hasAttribute("opacity") == false) {
            if (isDescendantOf(child, "MISC") == false) {
                if (child.nodeName != 'line') {
                    var box = child.getBBox();


                    if (box.x < minX) { minX = box.x };
                    if ((box.x + box.width) > maxX) { maxX = box.x + box.width };
                    if ((box.y + box.height > maxY)) { maxY = box.y + box.height };
                } else {
                    child.setAttribute("opacity", 0);
                }
            }
        }
    }
    x = (minX + maxX) / 2;
    y = maxY;
    return { x: x, y: y }
}

function getTextLength(g) {
    var i;
    var len;
    var str;
    var myRect = null;

    var n = g.getElementsByTagName('rect');
    for (i = 0; i < n.length; i++) {
        var str
        if (n[i].getAttribute("id") != null) {
            str = n[i].getAttribute("id").substring(0, 10)
        } else {
            str = ""
        }
        if (str != "UNANSWERED") { myRect = n[i] };
    }
    if (myRect != null) {
        str = myRect.getAttribute("id");
        if (str != null && str.substring(0, 1) == "C") {
            len = parseInt(str.substring(1));
        } else {
            len = 100;
        }

    } else {
        x = g.getBBox().x + g.getBBox().width / 2;
        len = 100;
    }
    return len;
}



function showLines(g, fadeout) {
    var l;

    l = g.getElementsByClassName("line");
    for (i = 0; i < l.length; ++i) {
        if (l[i].getAttribute("class") != "showbefore") {
            $(l[i]).stop(true, true);
            $(l[i]).show();
            //$(l[i]).attr("stroke", "white")
            $(l[i]).attr("opacity", "0.4")
            if (fadeout > 0) {
                $(l[i]).fadeOut(fadeout);
            }
        }
    }
}

function hideLines(g) {
    var l;

    l = g.getElementsByClassName("line");
    for (i = 0; i < l.length; ++i) {
        if (l[i].getAttribute("class") != "showbefore") {
            l[i].setAttribute("opacity", 0)

        }
    }
}

function addSVGAttribute(elem, attr) {

    var currClasses = $(elem).attr("class");
    $(elem).attr("class", currClasses + " " + attr);
}

function removeSVGAttribute(elem, attr) {

    var currClasses = $(elem).attr("class");
    if (currClasses) {
        currClasses = currClasses.replace(attr, "");
        $(elem).attr("class", currClasses);
    }
}

function makePrintable() {
    var p, i;
    if ($("#borderStyle").val() == "none") {
        printStrokeColor = "#aaaaaa";
        printStrokeWidth = "0";

    } else if ($("#borderStyle").val() == "verythin") {
        printStrokeColor = "#444444";
        printStrokeWidth = "0.2";
    } else if ($("#borderStyle").val() == "thin") {
        printStrokeColor = "#666666";
        printStrokeWidth = "0.4";
    } else if ($("#borderStyle").val() == "medium") {
        printStrokeColor = "#444444";
        printStrokeWidth = "1";
    } else if ($("#borderStyle").val() == "thick") {
        printStrokeColor = "#111111";
        printStrokeWidth = "2";
    } else if ($("#borderStyle").val() == "verythick") {
        printStrokeColor = "#000000";
        printStrokeWidth = "3";
    }
    if ($("#landColor1").val() == "white") {
        printLandColor1 = "#ffffff";
    } else if ($("#landColor1").val() == "verylightgray") {
        printLandColor1 = "#f7f6f0";
    } else if ($("#landColor1").val() == "lightgray") {
        printLandColor1 = "#edece6";

    } else if ($("#landColor1").val() == "lightgreen") {
        printLandColor1 = "#b2d5c0";
    } else if ($("#landColor1").val() == "gray") {
        printLandColor1 = "#d9d8d2";
    } else if ($("#landColor1").val() == "green") {
        printLandColor1 = "#1e8346";
    }
    if ($("#landColor2").val() == "white") {
        printLandColor2 = "#ffffff";
    } else if ($("#landColor2").val() == "verylightgray") {
        printLandColor2 = "#f7f6f0";
    } else if ($("#landColor2").val() == "lightgray") {
        printLandColor2 = "#edece6";
    } else if ($("#landColor2").val() == "lightgreen") {
        printLandColor2 = "#b2d5c0";
    } else if ($("#landColor2").val() == "gray") {
        printLandColor2 = "#d9d8d2";
    } else if ($("#landColor2").val() == "green") {
        printLandColor2 = "#1e8346";
    }
    if ($("#waterColor").val() == "white") {
        printWaterColor = "#ffffff";
    } else if ($("#waterColor").val() == "verylightgray") {
        printWaterColor = "#f7f6f0";
    } else if ($("#waterColor").val() == "lightgray") {
        printWaterColor = "#edece6";
    } else if ($("#waterColor").val() == "lightblue") {
        printWaterColor = "#dbf3fa";
    } else if ($("#waterColor").val() == "blue") {
        printWaterColor = "#a4d1dc";
    }
    var svg = document.getElementById("svgpointprint");
    p = svg.getElementsByTagName("g");

    for (i = 0; i < p.length; i++) {
        p[i].onclick = null;
        if (p[i].classList.contains("q")) {
            p[i].classList.add("q2")
            p[i].classList.remove("q")
        }
        paintGroupPrint(p[i])
    }

    n2 = svg.getElementsByTagName("rect");
    for (i = 0; i < n2.length; i++) {
        if (n2[i].getAttribute("id") != null) {
            if (n2[i].getAttribute("id").substring(0, 5) == "WATER" || n2[i].getAttribute("id").substring(0, 10) == "BACKGROUND") {
                n2[i].setAttribute("fill", printWaterColor);
                n2[i].setAttribute("stroke-width", "0");
            }
        }
    }

    $("#svgpointprint .labelBkgrd").css('opacity', '0.2');
    $("#svgpointprint .river").css("style", "stroke-width:2px  !important");
    $("#svgpointprint .river").attr("stroke-opacity", "1");
    $("#svgpointprint .river").css("opacity", "1");
    $("#svgpointprint .river").css("fill", "none");
    $("#svgpointprint .river").css("stroke", "#59a1b3");
    $("#svgpointprint path polygon circle ellipse").css("pointer-events", "none");

    $("#svgpointprint .showafter").css("opacity", "1")
}

function paintGroupPrint(g) {
    var col;

    if ($(g).attr("data-colors") != "0") {
        return
    }
    if (g.hasClass("answered") == false) {
        if (g.hasClass("q2")) {
            col = printLandColor1

        } else {
            col = printLandColor2
        }
    }

    var n = g.getElementsByTagName("polygon");

    for (i = 0; i < n.length; i++) {
        paintObjectPrint(n[i], col);
    }

    var n = g.getElementsByTagName("rect");
    for (i = 0; i < n.length; i++) {
        paintObjectPrint(n[i], col);
        n[i].setAttribute("stroke-width", "0");
    }

    var n = g.getElementsByTagName("polyline");
    for (i = 0; i < n.length; i++) {
        paintObjectPrint(n[i], col);
    }

    var n = g.getElementsByTagName("path");
    for (i = 0; i < n.length; i++) {
        paintObjectPrint(n[i], col);
    }

    var n = g.getElementsByTagName("circle");
    for (i = 0; i < n.length; i++) {
        paintObjectPrint(n[i], col);
    }

    var n = g.getElementsByTagName("ellipse");
    for (i = 0; i < n.length; i++) {
        paintObjectPrint(n[i], col);
    }

    var n = g.getElementsByClassName("line");
    for (i = 0; i < n.length; i++) {
        n[i].setAttribute("style", "stroke:#555555 !important; stroke-opacity:0.7; stroke-width:1px !important")
    }
}


function paintObjectPrint(t, col) {

    if (isDescendantOf(t, "SHOWAFTER") == true) {
        return;
    }

    if (isDescendantOf(t, "MISC") == true) {
        return
    }

    if (isDescendantOf(t, "SHOWBEFORE") == true) {
        $(t).attr("opacity", "0")
    }
    if (isDescendantOf(t, "SHOW") == true) {
        return
    }

    if (isDescendantOf(t, "WATER")) {
        col = printWaterColor  //"#ecf5f8"
    }

    $(t).attr("fill", col);

    $(t).attr("stroke", printStrokeColor);
    $(t).attr("stroke-width", printStrokeWidth);
    $(t).attr("stroke-opacity", "0.8");

    if ($(t).attr("class") == "semitransparent") {
        $(t).attr("fill-opacity", "0.01");

        $(t).attr("stroke-opacity", "0.01");
    }

    if ($(t).attr("class") == "semitransparent semitransparentvisible") {
        $(t).attr("fill-opacity", "0.05");
        $(t).attr("stroke-opacity", "0.05");
        $(t).attr("fill", "#000000");
    }

    if ($(t).attr("class") == "semitransparent2") {
        $(t).attr("fill-opacity", "0.01");

        $(t).attr("stroke-opacity", "0.01");
    }
}