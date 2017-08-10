function getAirports(letter) {
            var api_url = "/api/values/getAirports";

            var pid = $("#page").val();
            var ignoreCase = ($("#ignoreCase").prop("checked") ? 1 : 0);
            var match = ($("#matchName").prop("checked") ? "?name=" : "?iata=");

            $.ajax({
                type: "GET",
                url: api_url + match + letter + "&pid=" + pid + "&ignoreCase=" + ignoreCase,
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    $("#results").html("");
                    var backBtn = document.createElement('a');
                    $(backBtn).html('&laquo; Back to Index').css("font-weight", "700").css("font-size", "17px")
                        .appendTo((letter != "" || (pid > 0)) ? "#results" : "")
                              .click(function () {
                                  $("#page").val(0);
                                  getAirports("");
                              });
                    var br = document.createElement('br');
                    $(br).appendTo("#results");

                    $.each(data, function (i, elm) {
                        var airport = jQuery.parseJSON(elm).Airport;
                        var ltr = ($("#matchName").prop("checked")) ? airport.Name.charAt(0).toLowerCase() : airport.Code.charAt(0).toLowerCase();      //  ///.attr('href', '#')  " + api_url + "iata=" + letter + " //wrapped object> $("<a></a>");   //.attr('href', '#') //.css('margin-bottom', '5px')  //.text()  //$("<u></u>").text(airport.iata.toUpperCase()).get(0).outerHTML;

                        var icon = document.createElement('span');
                        var a = document.createElement('a');
                        var iata = document.createElement('u');

                        $(icon).addClass('glyphicon glyphicon-plane');
                        $(a).addClass('airport')
                            .appendTo($("#results"))
                            .html(" - " + airport.Name + " &nbsp; (" + airport.Id + ") &nbsp; ")
                            .click(function () {
                                $("#page").val(0);
                                $("#searchAirport").val("");
                                getAirports(ltr);
                            });
                        $(iata).text(airport.Code.toUpperCase()).prependTo(a);
                        $(a).prepend(icon);

                    });
                },
                error: function () {
                    alert("Airports API Failed.");
                }
            });
        }
