(function() {
        /**
         * Each key is in the form unit_sword and holds the total amount of the type in the village
         * (own and supporting troops combined)
         */
    var totalUnits = {},
        /**
         * Total population of all units (own + supporting)
         */
         totalFarm = 0,
        /**
         * Own population only (total - supporting)
         */
         ownFarmTotal = 0,
        /**
         * jQuery div with the troops in the village (becomes the own troops only div)
         */
         unitTable = $("#show_units"),
        /**
         * HTML table builder string for the supporting troops div
         */
         supportingTroopsTable = "<table class=vis width='100%'>";

    try {
        $("#show_units > h4").prepend(trans.sp.main.unitsReplacement);

        // calculate current stack
        $("table:first tr.all_unit td", unitTable).each(function () {
            if (!$('img', this)[0]) {
                // Cell containing: "< Eigen/Ander/Alle >" toggles
                return;
            }

            var unit = $('img', this)[0].src,
                unitsSize,
                unitAmount;

            unit = unit.substr(unit.lastIndexOf('/') + 1);
            unit = unit.substr(0, unit.lastIndexOf('.'));
            unitsSize = world_data.unitsSize[unit];
            unitAmount = $('strong', this);
            unitAmount[0].id = "spAmount" + unit;
            unitAmount = unitAmount[0].innerHTML;
            if( unit.match("knight") && !unitAmount ) {
                unitAmount = 1;
            }
            totalUnits[unit] = unitAmount;
            totalFarm += unitsSize * unitAmount;

            if (slowest_unit == null || world_data.unitsSpeed[slowest_unit] < world_data.unitsSpeed[unit]) {
                slowest_unit = unit;
            }
        });

        // fetch own troops
        if (user_data.overview.ajaxSeperateSupport && totalFarm > 0) {
            if (server_settings.ajaxAllowed) {
                ajax("place",
                    function (placeText) {
                        if (placeText.find(".unitsInput").length > 0) {
                            slowest_unit = null;
                            placeText.find(".unitsInput").each(function () {
                                // separate own / supporting troops
                                var unit = 'unit_' + this.id.substr(this.id.lastIndexOf("_") + 1);
                                var unitAmount = $(this).next().text().substr(1);
                                unitAmount = parseInt(unitAmount.substr(0, unitAmount.length - 1), 10);
                                var unitsSize = world_data.unitsSize[unit];
                                ownFarmTotal += unitsSize * unitAmount;

                                var unitLabel = $("#spAmount" + unit);
                                var supportingTroopsAmount = totalUnits[unit] - unitAmount;
                                if (supportingTroopsAmount > 0) {
                                    var unitDesc = $.trim(unitLabel.parent().text());
                                    unitDesc = unitDesc.substr(unitDesc.indexOf(" ") + 1);
                                    supportingTroopsTable +=
                                        "<tr><td>" + unitLabel.prev().outerHTML()
                                            + " <b>" + formatNumber(supportingTroopsAmount)
                                            + "</b> "
                                            + unitDesc + "</td></tr>";
                                }

                                if (unitAmount > 0) {
                                    unitLabel.text(unitAmount);
                                    if (slowest_unit == null || world_data.unitsSpeed[slowest_unit] < world_data.unitsSpeed[unit]) {
                                        slowest_unit = unit;
                                    }
                                } else {
                                    unitLabel.parent().parent().hide();
                                }
                            });

                        } else {
                            ownFarmTotal = totalFarm; // No rally point
                        }
                    }, {async: false});

            } else {
                ownFarmTotal = totalFarm; // No ajax
            }

            if (slowest_unit != null) {
                $("#slowestUnitCell").html("<img title='"+trans.sp.tagger.slowestTip+"' src='graphic/unit/" + slowest_unit + ".png'>").attr("slowestUnit", slowest_unit);
            }

            if (ownFarmTotal > 0 && user_data.overview.ajaxSeperateSupportStacks) {
                // stack in the village
                unitTable.find("table tfoot").append("<tr><td><span class='icon header population' title='" + trans.sp.main.ownStackTitle + "'></span>" + stackDisplay(ownFarmTotal).desc + "</td></tr>");
            }
            if (totalFarm - ownFarmTotal > 0) {
                // stack from other villages
                supportingTroopsTable += "<tr><td><a href='" + getUrlString("screen=place&mode=units") + "'>&raquo; " + trans.sp.main.rallyPointTroops + "</a></td></tr>";
                if (user_data.overview.ajaxSeperateSupportStacks) {
                    (function() {
                        var supportDisplay = stackDisplay(totalFarm - ownFarmTotal, { showFarmLimit: true });
                        supportingTroopsTable +=
                            '<tr><td style="border-top: 1px solid #85550d ;background-color: ' + supportDisplay.color + '">'
                                + '<span class="icon header population" title="' + trans.sp.main.supportingStackTitle
                                + '"></span>'
                                + '<b>' + supportDisplay.desc + '</b>' + '</td></tr>';
                    }());
                }

                unitTable.after(createMoveableWidget("os_units", trans.sp.main.unitsOther, supportingTroopsTable + "</table>"));
            }

            // total stack
            (function() {
                var cell = $("#order_level_farm"),
                    isClassicOverview = cell.length !== 0,
                    percentage,
                    stackDetails,
                    cellContent;

                if (isClassicOverview) {
                    cell = cell.parent();
                    if (game_data.features.Premium.active) {
                        cell = cell.next();
                    }
                    percentage = world_config.farmLimit == 0 ? "" : cell.children().html();
                    stackDisplay(
                        totalFarm, {
                            showFarmLimit: true,
                            percentage: percentage ? percentage.substr(0, percentage.indexOf('%') + 1) : "",
                            cell: cell,
                            appendToCell: !game_data.features.Premium.active
                        });

                } else {
                    stackDetails = stackDisplay(
                        totalFarm, {
                            showFarmLimit: true,
                            percentage: $("#l_farm .building_extra").html()
                        });

                    //cellContent = '<tr><td style="border-top: 1px solid #85550d ;background-color: ' + stackDetails.color + '">' + '<b>' + trans.tw.all.farm + ': ' + stackDetails.desc + '</b>' + '</td></tr>';
                    cellContent = ' | <b>' + trans.tw.all.farm + ': ' + stackDetails.desc + '</b>';
                    $("#show_units tfoot:first td:last").append(cellContent).css("border-top", "1px solid #85550d").css("background-color", stackDetails.color);
                }
            }());
        }
    }
    catch (e) {
        handleException(e, "supportingunits");
    }
}());
