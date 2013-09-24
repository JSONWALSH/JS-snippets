

function showAverage(data) {
    // Return a new graph.
    var data2 = [];
    alert('init data'+data.data);
    var sum = 1;
    var avg = 0;
    //get the average
    var total = 0;
    $.each(data.data, function () { total += this[1]; });
    avg = total / data.data.length;
    alert('avg'+avg);
    //push the average value for each datapoint
    for (var x = 0; x <= data.data.length; x++) {
        data2.push([data.data[0][x], avg]);
    }
    alert('dt set:'+data2[1]);
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
    $(x).addClass('flag travix active')
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


    $(a).addClass('flag ' + (data[i].brand == 'BudgetairDE' ? 'flugladen' : (getCountry(data[i].brand) == 'ES' ? 'budgetair' : getBrand(data[i].brand))))
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
   // alert('currentStartDate:' + currentStartDate + ', currentEndDate:' + currentEndDate + ', currentGrouping:' + currentGrouping + ', currentSubGrouping:' + currentSubGrouping + ', currentBrand:' + currentBrand + ', currentMeta:' + currentMeta + ', currentTimeInterval:' + currentTimeInterval + ', cat:' + cat + ', seasonality:' + seasonality);

    getStatistics(currentStartDate, currentEndDate, currentGrouping, currentSubGrouping, currentBrand, currentMeta, currentTimeInterval, cat, seasonality);
    getLeaderBoardData(cat);
    //getStatistics(startDate, endDate, grouping, subgrouping, brand, meta, interval, cat);
}


function initOverlay() {
  //  ShowStatistics();
   // initializeFilters();

    //Show random data for leaderboard Temporary
    var myJSONObject = [{
        xaxis: [1377302400000, 1377306000000, 1377309600000, 1377313200000, 1377316800000, 1377320400000, 1377324000000, 1377327600000, 1377331200000, 1377334800000, 1377338400000, 1377342000000, 1377345600000, 1377349200000, 1377352800000, 1377356400000, 1377360000000, 1377363600000, 1377367200000, 1377370800000, 1377374400000, 1377378000000, 1377381600000, 1377385200000, 1377388800000, 1377392400000, 1377396000000, 1377399600000, 1377403200000, 1377406800000, 1377410400000, 1377414000000, 1377417600000, 1377421200000, 1377424800000, 1377428400000, 1377432000000, 1377435600000, 1377439200000, 1377442800000, 1377446400000, 1377450000000, 1377453600000, 1377457200000, 1377460800000, 1377464400000, 1377468000000, 1377471600000, 1377475200000, 1377478800000, 1377482400000, 1377486000000, 1377489600000, 1377493200000, 1377496800000, 1377500400000, 1377504000000, 1377507600000, 1377511200000, 1377514800000, 1377518400000, 1377522000000, 1377525600000, 1377529200000, 1377532800000, 1377536400000, 1377540000000, 1377543600000, 1377547200000, 1377550800000, 1377554400000, 1377558000000],
        optinTrend: {
            trendCollection: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46], trendCollectionMeta: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46]
        },
        paymentTrend: { trendCollection: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46], trendCollectionMeta: [17, 7, 8, 1, 4, 3, 4, 2, 11, 9, 28, 41, 40, 36, 40, 30, 33, 25, 31, 29, 25, 28, 28, 23, 13, 6, 3, 1, 2, 2, 4, 3, 8, 18, 32, 42, 48, 49, 45, 55, 44, 42, 47, 39, 55, 58, 42, 29, 12, 6, 4, 6, 1, 0, 2, 5, 13, 25, 38, 50, 43, 46, 42, 58, 58, 62, 52, 39, 58, 60, 72, 46] },
        searchTrend: { trendCollection: [9755, 6678, 3298, 1918, 1598, 1669, 2471, 4715, 9052, 13555, 17321, 20063, 20217, 18965, 19249, 18068, 18273, 18536, 17870, 17853, 17772, 18750, 18535, 14055, 9529, 7087, 3838, 2202, 1880, 1989, 2139, 4427, 8062, 14418, 22267, 27479, 30049, 29985, 28348, 28133, 29657, 30015, 30535, 31367, 31203, 31622, 27414, 18804, 10160, 6627, 3968, 2498, 1980, 2236, 3410, 7315, 13395, 20527, 25123, 29309, 27885, 28265, 28757, 28073, 27985, 27638, 26662, 28623, 31457, 34440, 30548, 19598], "trendCollectionMeta": [84062, 56671, 36287, 34813, 30421, 29544, 35471, 49207, 72440, 100904, 127175, 142185, 146973, 145157, 140512, 137651, 140437, 141596, 141262, 134206, 130897, 133085, 128206, 109446, 81882, 58204, 36322, 35848, 30861, 28551, 34249, 45345, 64839, 102473, 144626, 174486, 184781, 182157, 176973, 176461, 179742, 185635, 187905, 191987, 193243, 193100, 183652, 143293, 94785, 60762, 43591, 43352, 37134, 40429, 50229, 69171, 101674, 142534, 174700, 204560, 202349, 203571, 201315, 193998, 195047, 193249, 190240, 195635, 205572, 212082, 200855, 156155] },
        visitorTrend: { trendCollection: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "trendCollectionMeta": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        checkOutTrend: { trendCollection: [436, 602, 219, 95, 109, 51, 127, 309, 385, 590, 601, 704, 772, 669, 752, 798, 807, 874, 662, 705, 647, 643, 734, 532, 408, 621, 302, 88, 100, 216, 102, 181, 301, 511, 763, 845, 1114, 1027, 938, 859, 966, 1027, 940, 938, 1088, 1032, 988, 756, 426, 465, 360, 205, 96, 71, 116, 230, 573, 679, 938, 982, 1001, 885, 893, 945, 890, 929, 908, 1114, 1097, 1248, 1176, 780], "trendCollectionMeta": [364, 178, 168, 90, 82, 81, 108, 161, 251, 378, 509, 667, 605, 598, 538, 529, 554, 612, 586, 564, 496, 497, 512, 435, 239, 186, 150, 113, 73, 74, 53, 129, 216, 382, 589, 744, 774, 827, 754, 758, 832, 818, 864, 820, 771, 799, 678, 586, 299, 156, 139, 106, 99, 91, 125, 159, 342, 528, 676, 791, 807, 919, 846, 807, 832, 758, 758, 844, 861, 869, 904, 618] },
        checkoutToConfirmed: { baseAverageCollection: [4.71, 3.66, 3.27, 3.49, 3.0300000000000002, 4.65, 3.17, 2.8899999999999997, 3.94, 4.35, 4.54, 5.36, 5.27, 5.9499999999999993, 5.91, 5.72, 5.48, 5.3900000000000006, 5.2, 5.63, 5.7, 6.2700000000000005, 6.41, 6.87, 5.72, 3.11, 2.42, 2.41, 3.26, 2.3800000000000003, 3.4000000000000004, 4.0, 4.75, 5.4399999999999995, 6.0, 6.38, 5.82, 6.49, 6.29, 5.82, 5.94, 5.12, 5.83, 6.41, 6.370000000000001, 7.3800000000000008, 7.7, 7.1800000000000006], "upperValueCollection": [5.86, 4.72, 4.72, 4.83, 4.21, 6.34, 4.77, 4.4799999999999995, 5.2899999999999991, 5.4999999999999991, 5.53, 6.2799999999999994, 6.5599999999999987, 7.37, 7.1400000000000006, 6.8599999999999994, 6.620000000000001, 6.4600000000000009, 6.27, 6.910000000000001, 7.02, 7.4000000000000012, 7.9399999999999995, 8.42, 6.9500000000000011, 4.02, 3.2799999999999994, 3.1300000000000003, 4.43, 3.2300000000000004, 4.79, 4.78, 6.4600000000000009, 6.64, 7.2499999999999991, 7.7299999999999995, 6.8199999999999994, 7.8100000000000005, 7.39, 6.8900000000000006, 7.5399999999999991, 7.55, 6.9499999999999993, 7.6499999999999995, 7.53, 8.82, 9.04, 8.7099999999999991], "lowerValueCollection": [3.5600000000000005, 2.6, 1.82, 2.15, 1.8500000000000003, 2.96, 1.5699999999999998, 1.2999999999999998, 2.59, 3.2, 3.5500000000000003, 4.44, 3.9799999999999995, 4.5299999999999994, 4.68, 4.58, 4.34, 4.32, 4.13, 4.3500000000000005, 4.3800000000000008, 5.1400000000000006, 4.88, 5.3199999999999994, 4.49, 2.1999999999999997, 1.5599999999999998, 1.69, 2.0899999999999994, 1.53, 2.0100000000000002, 3.2199999999999998, 3.04, 4.2399999999999993, 4.75, 5.0299999999999994, 4.82, 5.17, 5.19, 4.75, 4.34, 2.6900000000000004, 4.71, 5.17, 5.2100000000000009, 5.9400000000000013, 6.36, 5.65] },
   //     paymentToConfirmed: { "baseAverageCollection": [31.09, 31.86, 32.67, 30.53, 27.02, 40.11, 32.190000000000005, 22.939999999999998, 35.64, 41.510000000000005, 37.16, 37.61, 36.28, 38.629999999999995, 35.07, 36.43, 37.41, 37.71, 35.3, 36.7, 37.74, 38.54, 40.0, 36.33, 37.64, 29.81, 27.900000000000002, 29.68, 25.97, 24.8, 30.97, 32.46, 41.0, 35.52, 37.480000000000004, 40.68, 35.39, 40.75, 38.15, 37.18, 35.76, 38.190000000000005, 38.129999999999995, 39.739999999999995, 40.87, 42.59, 42.02, 44.41], "upperValueCollection": [39.72, 39.04, 51.190000000000005, 40.54, 38.879999999999995, 54.31, 48.49, 29.43, 43.730000000000004, 57.04, 47.22, 45.9, 44.04, 47.68, 42.14, 45.930000000000007, 44.86, 47.88, 41.879999999999995, 44.55, 45.72, 46.22, 51.150000000000006, 44.41, 46.489999999999995, 38.5, 39.940000000000005, 38.74, 31.75, 32.629999999999995, 41.75, 40.2, 56.08, 42.13, 45.96, 48.78, 42.069999999999993, 48.15, 46.160000000000004, 43.78, 44.279999999999994, 51.740000000000009, 47.699999999999996, 49.71, 54.86, 53.82, 53.05, 55.489999999999995], "lowerValueCollection": [22.46, 24.68, 14.149999999999999, 20.520000000000003, 15.160000000000002, 25.91, 15.89, 16.45, 27.549999999999997, 25.980000000000004, 27.1, 29.32, 28.52, 29.579999999999995, 28.000000000000004, 26.93, 29.959999999999997, 27.54, 28.720000000000002, 28.849999999999998, 29.76, 30.860000000000003, 28.850000000000005, 28.250000000000004, 28.790000000000006, 21.119999999999997, 15.860000000000001, 20.62, 20.19, 16.970000000000002, 20.189999999999998, 24.72, 25.919999999999998, 28.910000000000004, 29.000000000000004, 32.58, 28.71, 33.349999999999994, 30.14, 30.580000000000002, 27.24, 24.64, 28.559999999999995, 29.769999999999996, 26.880000000000003, 31.36, 30.990000000000002, 33.33] },
   //     checkoutToPayment: { "baseAverageCollection": [13.209999999999999, 10.12, 9.62, 10.11, 10.440000000000001, 10.08, 8.72, 10.59, 9.629999999999999, 9.370000000000001, 10.61, 12.4, 12.58, 13.350000000000001, 14.48, 13.850000000000001, 12.72, 12.590000000000002, 12.64, 13.22, 12.97, 14.01, 14.2, 16.35, 13.23, 9.11, 7.82, 7.24, 11.110000000000001, 8.25, 10.14, 10.879999999999999, 10.190000000000001, 13.170000000000002, 13.780000000000001, 13.48, 14.19, 13.639999999999999, 14.249999999999998, 13.450000000000001, 14.2, 11.66, 13.54, 14.23, 14.19, 15.25, 16.23, 14.37], "upperValueCollection": [16.65, 13.8, 14.029999999999998, 14.04, 15.920000000000002, 13.459999999999999, 12.17, 15.120000000000001, 12.950000000000001, 12.010000000000002, 12.68, 15.17, 15.839999999999998, 16.49, 17.3, 17.700000000000003, 15.920000000000002, 16.03, 15.130000000000003, 16.02, 15.610000000000001, 16.650000000000002, 18.5, 20.14, 16.45, 11.41, 10.600000000000001, 10.03, 15.68, 10.459999999999999, 15.35, 14.2, 12.9, 16.07, 16.23, 16.220000000000002, 17.03, 16.189999999999998, 17.049999999999997, 15.990000000000002, 17.27, 17.759999999999998, 17.54, 18.2, 18.73, 19.119999999999997, 20.75, 18.83], "lowerValueCollection": [9.77, 6.4399999999999995, 5.2099999999999991, 6.18, 4.9600000000000009, 6.7, 5.27, 6.06, 6.3099999999999987, 6.7299999999999995, 8.5400000000000009, 9.629999999999999, 9.32, 10.21, 11.66, 10.0, 9.5200000000000014, 9.15, 10.15, 10.420000000000002, 10.33, 11.37, 9.8999999999999986, 12.559999999999999, 10.01, 6.81, 5.0400000000000009, 4.45, 6.5400000000000009, 6.04, 4.9300000000000006, 7.5600000000000005, 7.48, 10.270000000000001, 11.330000000000002, 10.74, 11.35, 11.09, 11.45, 10.91, 11.129999999999999, 5.56, 9.54, 10.260000000000002, 9.65, 11.379999999999999, 11.71, 9.91] },
   //     searchToCheckout: { "baseAverageCollection": [6.11, 6.4, 6.9500000000000011, 6.8500000000000005, 0.59, 0.44, 0.6, 0.6, 0.71000000000000008, 5.99, 6.34, 5.9499999999999993, 6.25, 6.01, 6.17, 5.82, 5.65, 6.02, 5.7, 5.75, 5.72, 5.83, 5.84, 6.49, 6.03, 9.7000000000000011, 12.46, 16.189999999999998, 8.64, 6.8599999999999994, 17.46, 15.939999999999998, 11.379999999999999, 5.8000000000000007, 1.06, 0.85000000000000009, 0.82000000000000006, 0.85000000000000009, 0.89, 0.85000000000000009, 0.77, 0.80999999999999994, 0.83, 0.89, 0.95, 0.95, 0.95, 0.83], "upperValueCollection": [20.200000000000003, 20.52, 22.830000000000002, 23.24, 0.79, 0.54, 0.82000000000000006, 0.80999999999999994, 0.96000000000000008, 19.69, 20.900000000000002, 19.25, 20.45, 19.490000000000002, 20.07, 18.88, 18.240000000000002, 19.48, 18.52, 18.65, 18.47, 18.9, 19.01, 21.48, 19.25, 24.779999999999998, 31.46, 41.54, 29.610000000000003, 23.41, 46.56, 41.51, 31.319999999999997, 17.54, 1.8500000000000003, 1.1600000000000001, 1.06, 1.2, 1.31, 1.12, 1.03, 1.0699999999999998, 1.0999999999999999, 1.1400000000000001, 1.23, 1.24, 1.24, 1.05], "lowerValueCollection": [0.0, 0.0, 0.0, 0.0, 0.38999999999999996, 0.34, 0.38, 0.39, 0.45999999999999996, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.26999999999999991, 0.54, 0.58000000000000018, 0.50000000000000011, 0.47000000000000003, 0.58000000000000007, 0.51, 0.54999999999999993, 0.55999999999999994, 0.6399999999999999, 0.66999999999999993, 0.66, 0.66, 0.61] },
   //     searchToConfirmed: { "baseAverageCollection": [0.26, 0.33999999999999997, 0.16999999999999998, 0.16, 0.02, 0.02, 0.02, 0.02, 0.03, 0.3, 0.36, 0.36, 0.35000000000000003, 0.5, 0.36, 0.33999999999999997, 0.32, 0.38, 0.38, 0.32, 0.38, 0.38999999999999996, 0.45999999999999996, 0.53, 0.38999999999999996, 0.32, 0.29, 0.54999999999999993, 0.37, 0.24, 0.65, 0.77999999999999992, 0.51, 0.31, 0.069999999999999993, 0.06, 0.06, 0.06, 0.06, 0.06, 0.05, 0.05, 0.06, 0.069999999999999993, 0.069999999999999993, 0.08, 0.08, 0.069999999999999993], "upperValueCollection": [0.84, 1.1300000000000001, 0.5099999999999999, 0.51, 0.030000000000000002, 0.030000000000000002, 0.030000000000000002, 0.030000000000000002, 0.039999999999999994, 0.98, 1.2, 1.16, 1.1199999999999999, 1.67, 1.1400000000000001, 1.0699999999999998, 1.01, 1.24, 1.26, 1.01, 1.23, 1.26, 1.5, 1.76, 1.2299999999999998, 0.84, 0.76, 1.44, 1.27, 0.83, 1.92, 2.04, 1.38, 0.89999999999999991, 0.12000000000000001, 0.079999999999999988, 0.079999999999999988, 0.09, 0.09, 0.079999999999999988, 0.060000000000000005, 0.069999999999999993, 0.079999999999999988, 0.09, 0.09, 0.1, 0.11, 0.09], "lowerValueCollection": [0.0, 0.0, 0.0, 0.0, 0.01, 0.01, 0.01, 0.01, 0.019999999999999997, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.019999999999999997, 0.039999999999999994, 0.039999999999999994, 0.03, 0.03, 0.039999999999999994, 0.04, 0.030000000000000002, 0.039999999999999994, 0.05, 0.05, 0.060000000000000005, 0.05, 0.05] }
    }];
    
//        { "brand": "CheapTicketsCH", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetAir", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetairAT", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetairBE", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetairDE", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetairFR", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetairIE", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "BudgetairUK", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "CheapticketsES", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) },
//        { "brand": "ThomasCookBE", "yesterdaysTotal": Math.round(Math.random() * 100), "todaysTotal": Math.round(Math.random() * 100) }
    //};
    var numOutput = "0";
    for (var i = 1; i <= 72; i++) {
        numOutput = numOutput + ", " +i;
    }
    //alert(numOutput);

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
    
    // Update the data every 5 minutes
    //window.setInterval(function () {
    //    ShowStatistics();
    //}, 300000);
}
