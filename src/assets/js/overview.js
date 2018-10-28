var reservationData = [{"ID": "1", "name": "laura", "boxID": "101"},{"ID": "2", "name": "finchen", "boxID": "102"}];

$(function () {
    init();
});

const init = async () => {
    await setBoxsizes();
    await fillCardsWithReservations();
    await fillCardsWithEmptySlots();
    await setDragzoneHandlers();
    await setDropzoneHandlers();
}

const setBoxsizes = async () => {
    var boxes = await database.getBoxes();

    for(var i=0; i<boxes.length; i++){
        $('#boxlist' + boxes[i]._id).data('size', boxes[i].size);
    }
}

const fillCardsWithReservations = () => {
    var dropzones = $('.dropzone');

    dropzones.empty();

    for(var i=0; i<reservationData.length; i++){
        var reservation = reservationData[i];
        var catSlot = '<li class="list-group-item">' + reservationSlot(reservation) + '</li>';
        $('#boxlist' + reservation.boxID).append(catSlot);
    }
}

const fillCardsWithEmptySlots = () => {
    var emptyslot = '<li class="list-group-item"><div class="emptyslot">leer</div></li>';

    $('.dropzone').each(function(){
        for(var j=$(this).children('li').length; j<$(this).data('size'); j++){
            $(this).append(emptyslot)
        }
    });
}

const setDragzoneHandlers = () => {
    $(".dragzone").on("dragstart", function(ev) {
        ev.originalEvent.dataTransfer.setData("text", ev.originalEvent.target.id);
        $('.emptyslot').parent().css("background-color", "lightgreen");
        //$('.emptyslot').parent().addClass("bg-success");
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
    $('.emptyslot').parent().css("background-color", "");

    //ev.originalEvent.target.appendChild(document.getElementById(data));

    var dragID = ev.originalEvent.dataTransfer.getData("text");

    if(!$('#' + dragID).hasClass('dragzone')){
        console.log("no valid drag");
        return;
    }

    var targetDropUL = $(ev.originalEvent.target).closest('ul');
    $('#' + dragID).parent().append('<div class="emptyslot">leer</div>');
    $('#' + dragID).parent().appendTo($('#' + dragID).parent().parent());
    $('#' + dragID).appendTo(targetDropUL.find('li').has('.emptyslot').first());
    targetDropUL.find('div.emptyslot').first().remove();

    return;

    if($(ev.originalEvent.target).hasClass('dropzone')){
        console.log("JOO");
        $('#' + dragID).appendTo($('#' + dropID));
    }else {
        //$('#' + dragID).appendTo($('.dropzone li').has('.emptyslot').first());
        $('#' + dragID).parent().append('<div class="emptyslot">leer</div>');
        $('#' + dragID).parent().appendTo($('#' + dragID).parent().parent());
        $('#' + dragID).appendTo($('#' + dropID).parent().parent().find('li').has('.emptyslot').first());
        $('#' + dropID).parent().parent().find('div.emptyslot').first().remove();
        //$('.dropzone li .e').has('.emptyslot').first().remove();
        //$('#' + dragID).appendTo($('.dropzone').has('#' + dropID));
    }


};

const onDragOver = function(ev) {
    ev.preventDefault(); 
};

const onDragEnter = function(ev) {
    ev.preventDefault();
};

const onDragLeave = function(ev) {
    ev.preventDefault();
    //$(ev.originalEvent.target).closest('ul').find('.emptyslot').parent().removeClass("border-success");
    //$('.emptyslot').parent().removeClass("bg-success");
};
const reservationSlot = (reservation) => {
    return '<div id="' + reservation.ID + '" class="dragzone" draggable="true">' + reservation.name + '</div>';
}