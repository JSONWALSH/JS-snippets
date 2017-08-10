
function showAverage(data) {
    // Return a new graph.
    var data2 = [];
    var sum = 1, avg = 0, total = 0;
    $.each(data.data, function () { total += this[1]; });
    avg = total / data.data.length;
    alert('avg'+avg);
    //push the average value for each datapoint
    for (var x = 0; x <= data.data.length; x++) {
        data2.push([data.data[0][x], avg]);
    }
    //draw for 2 datasets
    return data2;
}

function fillLeaderBoard(data) {

    document.getElementById("brandFilter").innerHTML = "";
    var x = document.createElement('a');
    var y = document.createElement('i');
    var z = document.createElement('b');

    var todaysTotal, yesterdaysTotal, yesterdayCurrentTime, lastWeekCurrentTime, oobBookings, oobBookingsPtage;
    switch (parseInt(currentSubGrouping)) {
        case 0:
            todaysTotal = data[data.length - 1].allBookingTotals.today;
            yesterdayCurrentTime = data[data.length - 1].allBookingTotals.yesterdayCurrentTime;
            yesterdaysTotal = data[data.length - 1].allBookingTotals.yesterday;
            lastWeekCurrentTime = data[data.length - 1].allBookingTotals.lastWeekCurrentTime;
            oobBookings = data[data.length - 1].allBookingTotals.todayOOBBookings;
            if (data[data.length - 1].allBookingTotals.todayOOBBookings > 0 && todaysTotal > 0)
                oobBookingsPtage = (data[data.length - 1].allBookingTotals.todayOOBBookings / todaysTotal * 100).toFixed(2);
            else
                oobBookingsPtage = 0;
            break;
        case 1:
            todaysTotal = data[data.length - 1].directBookingTotals.today;
            yesterdayCurrentTime = data[data.length - 1].directBookingTotals.yesterdayCurrentTime;
            yesterdaysTotal = data[data.length - 1].directBookingTotals.yesterday;
            lastWeekCurrentTime = data[data.length - 1].directBookingTotals.lastWeekCurrentTime;
            oobBookings = data[data.length - 1].directBookingTotals.todayOOBBookings;
            if (data[data.length - 1].directBookingTotals.todayOOBBookings > 0 && todaysTotal > 0)
                oobBookingsPtage = (data[data.length - 1].directBookingTotals.todayOOBBookings / todaysTotal * 100).toFixed(2);
            else
                oobBookingsPtage = 0;
            break;
        case 2:
            todaysTotal = data[data.length - 1].metaBookingTotals.today;
            yesterdayCurrentTime = data[data.length - 1].metaBookingTotals.yesterdayCurrentTime;
            yesterdaysTotal = data[data.length - 1].metaBookingTotals.yesterday;
            lastWeekCurrentTime = data[data.length - 1].metaBookingTotals.lastWeekCurrentTime;
            oobBookings = data[data.length - 1].metaBookingTotals.todayOOBBookings;
            if (data[data.length - 1].metaBookingTotals.todayOOBBookings > 0 && todaysTotal > 0)
                oobBookingsPtage = (data[data.length - 1].metaBookingTotals.todayOOBBookings / todaysTotal * 100).toFixed(2);
            else
                oobBookingsPtage = 0;
            break;

    }
    $(x).addClass('flag companyabc active')
        .attr('id', '0')
        .appendTo($("#brandFilter")) //main div
        .css('margin-bottom', '5px')
        .click(function () {
            brandClick(this.id);
        });

    var lastItem = data.length;

    $(z).text("Today / Yesterday")
    .css('width', '105px')
    .appendTo($(x));

    var colorClass = "greencolor light";
    if (todaysTotal < yesterdayCurrentTime) {
        colorClass = "redcolor light";
    }

    $(y).text("" + todaysTotal + " / " + yesterdayCurrentTime)
        .css('width', '80px')
    .appendTo($(x)).addClass(colorClass);

    addBookingTotalsDetails($(x), todaysTotal, yesterdayCurrentTime, yesterdaysTotal, lastWeekCurrentTime, oobBookings, oobBookingsPtage);

    for (var i = 0; (i < data.length - 1) ; i++) {
        if (data[i].brand) {
            ShowLeaderBoard(data, i);
        }
    }

    $('#brandFilter a.flag').each(function () {
        $(this).qtip({
            position: {
                my: 'left bottom', // Use the corner...
                at: 'right bottom' // ...and opposite corner
            },
            content: {
                text: $(this).next(".bookingtotalsdetails").html()
            }
        });
    });
    
    //Normalize if checked by default
    if ($('#chk_Normalize').is(':checked') == true) {
        // alert('called');
        normalizeCHK(true);
    }
}




function ShowLeaderBoard(data, i) {

    var a = document.createElement('a');
    var b = document.createElement('b');
    var c = document.createElement('i');
    var d = document.createElement('div');

    var bar = document.createElement('div');
    var percent = document.createElement('div');

    var colorClass = "greencolor";
    if (brandTotalToday < brandYesterdayCurrentTime) {
        colorClass = "redcolor";
    }


    $(a).addClass('flag ' + (data[i].brand == 'companyabc' ? 'companyabc' : (getCountry(data[i].brand) == 'ES' ? 'companyabc' : getBrand(data[i].brand))))
    .attr('id', data[i].siteId)
		.appendTo($("#brandFilter")) //main div
		.click(function () {
		    brandClick(this.id);
		})
        .dblclick(function () { brandDblClick(this.id); });

    $(b).addClass(getCountry(data[i].brand))
		.appendTo($(a));

    $(c).text("" + brandTotalToday + " / " + brandYesterdayCurrentTime)
		.appendTo($(a)).addClass(colorClass);

    $(bar).addClass('bar')
    .appendTo($(a));

    $(percent).css('width', ((brandTotalToday / brandYesterdayCurrentTime) * 100) + '%')
        .addClass('percent')
        .appendTo($(bar));

    if (parseInt(currentSubGrouping) !== 1) {
        //Add meta data dynamically
        var metaList = data[i].metas;

        if (metaList.length > 0) {

            $(a).after($(d).attr('id', "meta" + data[i].siteId).addClass("metas"));

            for (var j = 0; (j < metaList.length) ; j++) {

                var e = document.createElement('div');
                $(e).attr('id', 'm' + metaList[j].id)
                    .css('background', '#fff url("' + metaList[j].metaGroupImage + '") no-repeat')
                    .addClass(metaList[j].name + ' metalogostyle' +
                        '')
                    .click(function () {
                        metaClick(this.id, this);
                    })
                    .appendTo($(d));

                //Display meta data totals of today and Yesterday
                var colorClass = "greencolor";
                if (metaList[j].bookingTotals.today < metaList[j].bookingTotals.yesterdayCurrentTime) {
                    colorClass = "redcolor";
                }

                var f = document.createElement('f');
                $(f).text("" + metaList[j].bookingTotals.today + " / " + metaList[j].bookingTotals.yesterdayCurrentTime)
                    .appendTo($(e)).addClass(colorClass);

                if (metaList[j].bookingTotals.todayOOBBookings > 0 && metaList[j].bookingTotals.today > 0)
                    metaOOBBookingsPtage = (metaList[j].bookingTotals.todayOOBBookings / metaList[j].bookingTotals.today * 100).toFixed(2);
                else
                    metaOOBBookingsPtage = 0;

                var bookingTotalsDetails = addBookingTotalsDetails($(e), metaList[j].bookingTotals.today, metaList[j].bookingTotals.yesterdayCurrentTime, metaList[j].bookingTotals.yesterday, metaList[j].bookingTotals.lastWeekCurrentTime, metaList[j].bookingTotals.todayOOBBookings, metaOOBBookingsPtage);

                $(e).qtip({
                    position: {
                        my: 'left bottom', // Use the corner...
                        at: 'right bottom' // ...and opposite corner
                    },
                    content: {
                        text: $(bookingTotalsDetails).html()
                    }
                });
            }
            $(d).hide();//Hide all meta data, until clicked on specific brand
        }
    }

    addBookingTotalsDetails($(a), brandTotalToday, brandYesterdayCurrentTime, brandTotalYesterday, brandLastWeekCurrentTime, brandOOBBookings, brandOOBBookingsPtage);

    function getCountry(brand) {
        var countryCode = brand.substr(brand.length - 2, 2);
        if (countryCode == countryCode.toUpperCase()) {
            return countryCode;
        }
        else {
            return "NL";
        }
    }

    function getBrand(brand) {
        var itemBrand = brand.substr(0, brand.length - 2);
        if (brand.substr(brand.length - 2, 2) == brand.substr(brand.length - 2, 2).toUpperCase()) {
            return itemBrand.toLowerCase();
        }
        else {
            return brand.toLowerCase();
        }
    }
}


function getChannelData(cat, ele) {
    getStatistics(currentStartDate, currentEndDate, currentGrouping, currentSubGrouping, currentBrand, currentMeta, currentTimeInterval, cat, seasonality);
    getLeaderBoardData(cat);
}


function initOverlay() {
    var mockJSONObject = [{
        xaxis: [1377302400000, 1377306000000, 1377309600000, 1377313200000, 1377316800000, 1377320400000, 1377324000000, 1377327600000, 1377331200000, 1377334800000, 1377338400000, 1377342000000, 1377345600000, 1377349200000, 1377352800000, 1377356400000, 1377360000000, 1377363600000, 1377367200000, 1377370800000, 1377374400000, 1377378000000, 1377381600000, 1377385200000, 1377388800000, 1377392400000, 1377396000000, 1377399600000, 1377403200000, 1377406800000, 1377410400000, 1377414000000, 1377417600000, 1377421200000, 1377424800000, 1377428400000, 1377432000000, 1377435600000, 1377439200000, 1377442800000, 1377446400000, 1377450000000, 1377453600000, 1377457200000, 1377460800000, 1377464400000, 1377468000000, 1377471600000, 1377475200000, 1377478800000, 1377482400000, 1377486000000, 1377489600000, 1377493200000, 1377496800000, 1377500400000, 1377504000000, 1377507600000, 1377511200000, 1377514800000, 1377518400000, 1377522000000, 1377525600000, 1377529200000, 1377532800000, 1377536400000, 1377540000000, 1377543600000, 1377547200000, 1377550800000, 1377554400000, 1377558000000],
        optinTrend: {
            trendCollection: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46], trendCollectionMeta: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46]
        },
        paymentTrend: { trendCollection: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46], trendCollectionMeta: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46] },
        searchTrend: { trendCollection: [9755, 6678, 3298, 1918, 1598, 1669, 2471, 4715, 9052, 13555, 17321, 20063, 20217, 18965, 19249, 18068, 18273, 18536, 17870, 17853, 17772, 18750, 18535, 14055, 9529, 7087, 3838, 2202, 1880, 1989, 2139, 4427, 8062, 14418, 22267, 27479, 30049, 29985, 28348, 28133, 29657, 30015, 30535, 31367, 31203, 31622, 27414, 18804, 10160, 6627, 3968, 2498, 1980, 2236, 3410, 7315, 13395, 20527, 25123, 29309, 27885, 28265, 28757, 28073, 27985, 27638, 26662, 28623, 31457, 34440, 30548, 19598], "trendCollectionMeta": [84062, 56671, 36287, 34813, 30421, 29544, 35471, 49207, 72440, 100904, 127175, 142185, 146973, 145157, 140512, 137651, 140437, 141596, 141262, 134206, 130897, 133085, 128206, 109446, 81882, 58204, 36322, 35848, 30861, 28551, 34249, 45345, 64839, 102473, 144626, 174486, 184781, 182157, 176973, 176461, 179742, 185635, 187905, 191987, 193243, 193100, 183652, 143293, 94785, 60762, 43591, 43352, 37134, 40429, 50229, 69171, 101674, 142534, 174700, 204560, 202349, 203571, 201315, 193998, 195047, 193249, 190240, 195635, 205572, 212082, 200855, 156155] },
        visitorTrend: { trendCollection: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "trendCollectionMeta": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        checkOutTrend: { trendCollection: [436, 602, 219, 95, 109, 51, 127, 309, 385, 590, 601, 704, 772, 669, 752, 798, 807, 874, 662, 705, 647, 643, 734, 532, 408, 621, 302, 88, 100, 216, 102, 181, 301, 511, 763, 845, 1114, 1027, 938, 859, 966, 1027, 940, 938, 1088, 1032, 988, 756, 426, 465, 360, 205, 96, 71, 116, 230, 573, 679, 938, 982, 1001, 885, 893, 945, 890, 929, 908, 1114, 1097, 1248, 1176, 780], "trendCollectionMeta": [364, 178, 168, 90, 82, 81, 108, 161, 251, 378, 509, 667, 605, 598, 538, 529, 554, 612, 586, 564, 496, 497, 512, 435, 239, 186, 150, 113, 73, 74, 53, 129, 216, 382, 589, 744, 774, 827, 754, 758, 832, 818, 864, 820, 771, 799, 678, 586, 299, 156, 139, 106, 99, 91, 125, 159, 342, 528, 676, 791, 807, 919, 846, 807, 832, 758, 758, 844, 861, 869, 904, 618] },
        checkoutToConfirmed: { baseAverageCollection: [4.71, 3.66, 3.27, 3.49, 3.0300000000000002, 4.65, 3.17, 2.8899999999999997, 3.94, 4.35, 4.54, 5.36, 5.27, 5.9499999999999993, 5.91, 5.72, 5.48, 5.3900000000000006, 5.2, 5.63, 5.7, 6.2700000000000005, 6.41, 6.87, 5.72, 3.11, 2.42, 2.41, 3.26, 2.3800000000000003, 3.4000000000000004, 4.0, 4.75, 5.4399999999999995, 6.0, 6.38, 5.82, 6.49, 6.29, 5.82, 5.94, 5.12, 5.83, 6.41, 6.370000000000001, 7.3800000000000008, 7.7, 7.1800000000000006], "upperValueCollection": [5.86, 4.72, 4.72, 4.83, 4.21, 6.34, 4.77, 4.4799999999999995, 5.2899999999999991, 5.4999999999999991, 5.53, 6.2799999999999994, 6.5599999999999987, 7.37, 7.1400000000000006, 6.8599999999999994, 6.620000000000001, 6.4600000000000009, 6.27, 6.910000000000001, 7.02, 7.4000000000000012, 7.9399999999999995, 8.42, 6.9500000000000011, 4.02, 3.2799999999999994, 3.1300000000000003, 4.43, 3.2300000000000004, 4.79, 4.78, 6.4600000000000009, 6.64, 7.2499999999999991, 7.7299999999999995, 6.8199999999999994, 7.8100000000000005, 7.39, 6.8900000000000006, 7.5399999999999991, 7.55, 6.9499999999999993, 7.6499999999999995, 7.53, 8.82, 9.04, 8.7099999999999991], "lowerValueCollection": [3.5600000000000005, 2.6, 1.82, 2.15, 1.8500000000000003, 2.96, 1.5699999999999998, 1.2999999999999998, 2.59, 3.2, 3.5500000000000003, 4.44, 3.9799999999999995, 4.5299999999999994, 4.68, 4.58, 4.34, 4.32, 4.13, 4.3500000000000005, 4.3800000000000008, 5.1400000000000006, 4.88, 5.3199999999999994, 4.49, 2.1999999999999997, 1.5599999999999998, 1.69, 2.0899999999999994, 1.53, 2.0100000000000002, 3.2199999999999998, 3.04, 4.2399999999999993, 4.75, 5.0299999999999994, 4.82, 5.17, 5.19, 4.75, 4.34, 2.6900000000000004, 4.71, 5.17, 5.2100000000000009, 5.9400000000000013, 6.36, 5.65] },
    }];

    var numOutput = "0";
    for (var i = 1; i <= 72; i++) {
        numOutput = numOutput + ", " +i;
    }

    var jsonResponse = {
        "xaxis": [1377302400000, 1377306000000, 1377309600000, 1377313200000, 1377316800000, 1377320400000, 1377324000000, 1377327600000, 1377331200000, 1377334800000, 1377338400000, 1377342000000, 1377345600000, 1377349200000, 1377352800000, 1377356400000, 1377360000000, 1377363600000, 1377367200000, 1377370800000, 1377374400000, 1377378000000, 1377381600000, 1377385200000, 1377388800000, 1377392400000, 1377396000000, 1377399600000, 1377403200000, 1377406800000, 1377410400000, 1377414000000, 1377417600000, 1377421200000, 1377424800000, 1377428400000, 1377432000000, 1377435600000, 1377439200000, 1377442800000, 1377446400000, 1377450000000, 1377453600000, 1377457200000, 1377460800000, 1377464400000, 1377468000000, 1377471600000, 1377475200000, 1377478800000, 1377482400000, 1377486000000, 1377489600000, 1377493200000, 1377496800000, 1377500400000, 1377504000000, 1377507600000, 1377511200000, 1377514800000, 1377518400000, 1377522000000, 1377525600000, 1377529200000, 1377532800000, 1377536400000, 1377540000000, 1377543600000, 1377547200000, 1377550800000, 1377554400000, 1377558000000],
        "optinTrend": { "trendCollection": [22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 21, 20], "trendCollectionMeta": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72] }, //38, 18, 15, 5, 7, 3, 6, 7, 19, 33, 29, 58, 67, 61, 43, 49, 50, 45, 56, 43, 47, 44, 39, 31, 19, 5, 11, 11, 4, 6, 4, 8, 8, 21, 36, 46, 55, 71, 46, 68, 57, 58, 62, 79, 68, 75, 68, 42, 20, 13, 13, 6, 3, 6, 7, 6, 24, 44, 49, 65, 61, 78, 76, 67, 58, 69, 60, 73, 79, 90, 78, 80] },
        "paymentTrend": { "trendCollection": [56, 36, 26, 6, 18, 18, 8, 6, 31, 40, 64, 97, 87, 104, 106, 100, 122, 72, 75, 84, 73, 72, 79, 73, 37, 36, 22, 12, 10, 15, 11, 6, 31, 32, 61, 111, 105, 109, 82, 83, 91, 101, 112, 90, 100, 132, 84, 78, 59, 18, 7, 6, 7, 7, 11, 14, 52, 57, 72, 112, 105, 119, 111, 140, 115, 141, 130, 138, 149, 155, 178, 156], "trendCollectionMeta": [60, 32, 26, 10, 20, 12, 12, 11, 26, 41, 61, 84, 90, 82, 85, 96, 99, 81, 77, 81, 57, 62, 56, 59, 43, 20, 26, 17, 3, 24, 8, 14, 20, 36, 74, 86, 121, 132, 101, 123, 70, 97, 92, 107, 86, 101, 132, 49, 40, 27, 29, 12, 4, 13, 4, 18, 44, 60, 75, 105, 104, 130, 115, 146, 137, 123, 115, 134, 135, 155, 142, 137] },
        "searchTrend": { "trendCollection": [9755, 6678, 3298, 1918, 1598, 1669, 2471, 4715, 9052, 13555, 17321, 20063, 20217, 18965, 19249, 18068, 18273, 18536, 17870, 17853, 17772, 18750, 18535, 14055, 9529, 7087, 3838, 2202, 1880, 1989, 2139, 4427, 8062, 14418, 22267, 27479, 30049, 29985, 28348, 28133, 29657, 30015, 30535, 31367, 31203, 31622, 27414, 18804, 10160, 6627, 3968, 2498, 1980, 2236, 3410, 7315, 13395, 20527, 25123, 29309, 27885, 28265, 28757, 28073, 27985, 27638, 26662, 28623, 31457, 34440, 30548, 19598], "trendCollectionMeta": [84062, 56671, 36287, 34813, 30421, 29544, 35471, 49207, 72440, 100904, 127175, 142185, 146973, 145157, 140512, 137651, 140437, 141596, 141262, 134206, 130897, 133085, 128206, 109446, 81882, 58204, 36322, 35848, 30861, 28551, 34249, 45345, 64839, 102473, 144626, 174486, 184781, 182157, 176973, 176461, 179742, 185635, 187905, 191987, 193243, 193100, 183652, 143293, 94785, 60762, 43591, 43352, 37134, 40429, 50229, 69171, 101674, 142534, 174700, 204560, 202349, 203571, 201315, 193998, 195047, 193249, 190240, 195635, 205572, 212082, 200855, 156155] },
        "visitorTrend": { "trendCollection": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "trendCollectionMeta": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        "checkOutTrend": { "trendCollection": [436, 602, 219, 95, 109, 51, 127, 309, 385, 590, 601, 704, 772, 669, 752, 798, 807, 874, 662, 705, 647, 643, 734, 532, 408, 621, 302, 88, 100, 216, 102, 181, 301, 511, 763, 845, 1114, 1027, 938, 859, 966, 1027, 940, 938, 1088, 1032, 988, 756, 426, 465, 360, 205, 96, 71, 116, 230, 573, 679, 938, 982, 1001, 885, 893, 945, 890, 929, 908, 1114, 1097, 1248, 1176, 780], "trendCollectionMeta": [364, 178, 168, 90, 82, 81, 108, 161, 251, 378, 509, 667, 605, 598, 538, 529, 554, 612, 586, 564, 496, 497, 512, 435, 239, 186, 150, 113, 73, 74, 53, 129, 216, 382, 589, 744, 774, 827, 754, 758, 832, 818, 864, 820, 771, 799, 678, 586, 299, 156, 139, 106, 99, 91, 125, 159, 342, 528, 676, 791, 807, 919, 846, 807, 832, 758, 758, 844, 861, 869, 904, 618] },
        "checkoutToConfirmed": { "baseAverageCollection": [], "upperValueCollection": [], "lowerValueCollection": [] },
        "paymentToConfirmed": { "baseAverageCollection": [], "upperValueCollection": [], "lowerValueCollection": [] },
        "checkoutToPayment": { "baseAverageCollection": [], "upperValueCollection": [], "lowerValueCollection": [] },
        "searchToCheckout": { "baseAverageCollection": [], "upperValueCollection": [], "lowerValueCollection": [] },
        "searchToConfirmed": { "baseAverageCollection": [], "upperValueCollection": [], "lowerValueCollection": [] }
    };
    

    for (var x = 0; x <= myJSONObject.length - 1; x++) {
        ShowGraphs(jsonResponse, 99);
    }
}
