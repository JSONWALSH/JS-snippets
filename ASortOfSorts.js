                    function sortResults(prop, asc) {
                        data.standing = data.standing.sort(function (a, b) {
                            if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                            else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                        });
                    }
                    sortResults("teamName", true);

                    var data = [];
                    $.each(data.data, function () { total += this[1]; });  data.standing.length

                    jQuery.each(data.standing, function (i, elm) {
                        data2.push(elm.position-1);
                    });

										jQuery.each(data, function (i, elm) {
                        if (i > 0 && i <= data.length)
                        {
                            if (elm == data[i - 1])
                            {
                                var thenum = data[i - 1];
                                jQuery.each(data2, function (x, el) {
                                   
                                    if (el == thenum)
                                    {
                                        data2[x] = x;
                                    }
                                });
                            }
                        }
                    });

