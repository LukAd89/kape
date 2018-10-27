//var reservationData;
//var boxesData;
var maxDates = 10;

$(function () {
    init();
});

function init() {
    document.getElementById("bookings-preview-startdate").valueAsDate = new Date();
    //loadBoxesData();
    //loadreservationData();
    formatTableHeader();
    printBookingsPreview();
    setButtonHandlers();
}

function formatTableHeader() {
    $("#overview-table-head").html("");

    var date = document.getElementById("bookings-preview-startdate").valueAsDate;
    var tableHeader = "<tr><th>Box-Nr.</th>";

    for (var i = 0; i < maxDates; i++) {
        tableHeader += "<th>" + date.getDate() + "." + (date.getMonth() + 1) + ".</th>";
        date.setTime(date.getTime() + 86400000);
    }

    tableHeader += "</tr>";

    $("#overview-table-head").append(tableHeader);
}

function loadreservationData() {
    dataHandler.getAllBookings(loadreservationDataCallback);
}

function loadreservationDataCallback(error, data) {
    if (error) throw error;
    sortData(data, "dateCheckin");
    reservationData = data;
    printBookingsPreview();
}

function loadBoxesData() {
    dataHandler.getAllBoxes(loadBoxesDataCallback);
}

function loadBoxesDataCallback(error, data) {
    if (error) throw error;
    boxesData = data;
    loadreservationData();
}

function sortData(data, key) {
    data.sort(function (a, b) {
        return a[key].localeCompare(b[key]);
    });
    return data;
}

function printBookingsPreview() {
    $("#overview-table-body").html("");

    var tableBody = "";
    /*
    for (var i = 1; i <= boxesData.length; i++) {
        tableBody += "<tr><td>" + (i) + "</td>";
        for (var j = 0; j < maxDates; j++) {
            tableBody += "<td ";
            currentDate = new Date();
            currentDate = new Date($("#bookings-preview-startdate").val());
            currentDate.setTime(currentDate.getTime() + j * 86400000);

            var boxOccupancy = "class='table-success'>";
            for (var k = 0; k < reservationData.length; k++) {
                if (reservationData[k].boxID == i && new Date(reservationData[k].dateCheckin) <= currentDate && new Date(reservationData[k].dateCheckout) >= currentDate) {
                    boxOccupancy = "class='table-danger'>";
                }
            }
            tableBody += boxOccupancy + "</td>";
        }
        tableBody += "</tr>";
    }
    */
    $("#overview-table-body").append(tableBody);
}

function setButtonHandlers() {
    $("#btn-bookings-preview-refresh").on("click", function () {
        var date = document.getElementById("bookings-preview-startdate").valueAsDate;
        if (!(date >= new Date()))
            document.getElementById("bookings-preview-startdate").valueAsDate = new Date();
        formatTableHeader();
        printBookingsPreview();
    });
}