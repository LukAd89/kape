//var boxesData;
$(function () {
    init();
});

const init = async () => {
    var boxesData = await database.getBoxes();
    printAllBoxes(boxesData);
};

const loadBoxesData = () => {
    database.getBoxes();
};

function printAllBoxes(boxesData){
    $('#boxes-td-body').html("");
    boxesData = (boxesData || []);
    for (var i = 0; i < boxesData.length; i++) {
        $('#boxes-td-body').append("<tr>"
            + "<td>" + boxesData[i].number
            + "</td><td>" + boxesData[i].size
            + "</td></tr>");
    }
}