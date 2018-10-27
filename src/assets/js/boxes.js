//var boxesData;
var tempAddedBoxes;

var deleteUserButtonIcon = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"red\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59   L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59z\"/></svg>";
var editUserButtonIcon = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"grey\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"14.5,5.5 3,17 3,21 7,21 18.5,9.5   \"/><path d=\"M21.707,4.879l-2.586-2.586c-0.391-0.391-1.024-0.391-1.414,0L16,4l4,4l1.707-1.707    C22.098,5.902,22.098,5.269,21.707,4.879z\"/></svg>";


$(function () {
    init();
});

function init() {
    tempAddedBoxes = 0;
    //loadBoxesData();
    printAllBoxes();
    setEditButtonHandlers();
    setButtonHandlers();
}

function loadBoxesData() {
    dataHandler.getAllBoxes(loadBoxesDataCallback);
}

function loadBoxesDataCallback(error, data) {
    if (error) throw error;
    sortData(data, "id");
    boxesData = data;
    printAllBoxes();
    setEditButtonHandlers();
}

function sortData(data, key) {
    data.sort(function (a, b) {
        return a[key].localeCompare(b[key]);
    });
    return data;
}

function setButtonHandlers(){
    $('#btn-newbox').on("click", function () {
        tempAddedBoxes += 1;
        $('#boxes-td-body').append("<tr class='new-box'>"
        + "<td class='new-box-id'>" + getNewBoxID()
        + "</td><td class='new-box-size'><input type='number' value='1' min='1'>"
        + "</td><td>"
        + "</td><td>"
        + "</td></tr>");
    });

    $('#btn-boxes-save').on("click", function () {
        $("#boxes-td-body .new-box").each(function (index){
            console.log("ID: " + $(this).children(".new-box-id").text());
            console.log("SI: " + $(this).children(".new-box-size").children("input").val());
        });
    });
}

function getNewBoxID(){
    var newID = parseInt(boxesData[0].ID);
    for (var i = 1; i < boxesData.length; i++) {
        if(parseInt(boxesData[i].ID) > newID)
            newID = parseInt(boxesData[i].ID);
    }

    return newID+tempAddedBoxes;
}

function printAllBoxes(){
    $('#boxes-td-body').html("");
    boxesData = (boxesData || []);
    for (var i = 0; i < boxesData.length; i++) {
        $('#boxes-td-body').append("<tr>"
            + "<td>" + boxesData[i].ID
            + "</td><td>" + boxesData[i].size
            //+ "</td><td><button class=\"btn btn-outline-secondary btn-edit\" data-id=\"" + boxesData[i].ID + "\">" + editUserButtonIcon + "</button>"
            //+ "</td><td><button class=\"btn btn-outline-danger btn-delete\" data-id=\"" + boxesData[i].ID + "\">" + deleteUserButtonIcon + "</button>"
            + "</td></tr>");
    }
}

function setEditButtonHandlers() {
    $("#boxes-td-body .btn-edit").each(function () {
        $(this).on("click", function () {
            alert($(this).attr("data-id"));
        });
    });
    $("#boxes-td-body .btn-delete").each(function () {
        $(this).on("click", function () {
            alert($(this).attr("data-id"));
        });
    });
}