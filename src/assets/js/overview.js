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
    $('.dropzone').each(function(){
        for(var j=$(this).children('li').length; j<$(this).data('size'); j++){
            $(this).append(emptyslot)
        }
    });
}

const setDragzoneHandlers = () => {
    $('.dragzone').draggable({
        revert: "invalid", 
        opacity: 0.7,
        helper: "clone", 
        cursor: "move", 
        cursorAt: {  },
        zIndex: 500
        //stack: ".dragzone"
    });
}

const setDropzoneHandlers = () => {
    $(".dropzone").droppable({
        accepts: ".dragzone",
        classes: {
            "ui-droppable-active": "custom-state-active",
            "ui-droppable-hover": "custom-state-hover"
          },
        drop: function(event, ui){
            moveDragItem(ui.draggable, this.id);
        }
    });
}

const moveDragItem = ($item, id) => {
    //$item.parent().parent().append(emptyslot);
    //$item.parent().appendTo($item.parent().parent());
    $item.parent().addClass('emptyslot');
    $item.parent().appendTo($item.parent().parent())
    $item.appendTo($('#' + id + ' li.emptyslot').first());
    //$('#' + id).find('div.emptyslot').first().remove();
    $item.parent().removeClass('emptyslot');
}

const emptyslot = '<li class="list-group-item emptyslot"></li>';

const reservationSlot = (reservation) => {
    return '<div id="' + reservation.ID + '" class="dragzone alert alert-secondary"><b>' + reservation.name + '<b><b>11.05.2018 - 17.05.2018</b></div>';
}