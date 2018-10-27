//var reservationData;
//var boxesData;
var maxDates = 10;

$(function () {
    init();
});

const init = async () => {
    fillCardsWithEmptySlots();
    setDragzoneHandlers();
    setDropzoneHandlers();
}

const fillCardsWithEmptySlots = () => {
    var dropzones = $('.dropzone');

    console.log(dropzones);
}

const setDragzoneHandlers = () => {
    $(".dragzone").on("dragstart", function(ev) {
        ev.originalEvent.dataTransfer.setData("text", ev.originalEvent.target.id);
    });
}

const setDropzoneHandlers = () => {
    $(".dropzone")
        .on("dragenter", onDragEnter)
        .on("dragover", onDragOver)
        .on("dragleave", onDragLeave)
        .on("drop", onDrop);
}

const onDrop = function(ev) {
    ev.preventDefault();
    $(this).removeClass("border-success");
    var data = ev.originalEvent.dataTransfer.getData("text");
    //ev.originalEvent.target.appendChild(document.getElementById(data));

    var dragID = ev.originalEvent.dataTransfer.getData("text");
    var dropID =  ev.originalEvent.target.id;

    console.log(dragID);
    console.log(dropID);

    if($(ev.originalEvent.target).hasClass('dropzone')){
        console.log("JOO");
        $('#' + dragID).appendTo($('#' + dropID));
    }else {
        //$('#' + dragID).appendTo($('.dropzone li').has('.emptyslot').first());
        $('#' + dragID).appendTo($('#' + dropID).parent().parent().find('li').has('.emptyslot').first());
        $('#' + dropID).parent().parent().find('div.emptyslot').first().remove();
        //$('.dropzone li .e').has('.emptyslot').first().remove();
        //$('#' + dragID).appendTo($('.dropzone').has('#' + dropID));
    }


};

const onDragOver = function(ev) {
    ev.preventDefault(); 
    if(!$(this).hasClass("border-success")) 
        $(this).addClass("border-success");
};

const onDragEnter = function(ev) {
    ev.preventDefault();
    $(this).addClass("border-success");
};

const onDragLeave = function(ev) {
    ev.preventDefault();
    $(this).removeClass("border-success");
};
