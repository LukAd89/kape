//var reservationData = [{"ID": "1", "name": "laura", "boxID": "101", "color": "#b1b1d5"},{"ID": "2", "name": "finchen", "boxID": "102", "color": "#b1b1d5"}];
let reservationData;

$(function () {
    init();
});

const init = async () => {
    await setBoxsizes();
    reservationData = await database.getCurrentReservations();
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

const fillCardsWithReservations = async () => {
    var dropzones = $('.dropzone');

    dropzones.empty();

    for(var i=0; i<reservationData.length; i++){
        console.log("RES", JSON.stringify(reservationData))
        var reservation = reservationData[i];
        var catSlot = '<li class="list-group-item">' + await reservationSlot(reservation) + '</li>';
        console.log("CATSLOT", catSlot)
        $('#boxlist' + reservation.boxid).append(catSlot);
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
    console.log("MOVE", $item.prop('id'));
    $item.parent().addClass('emptyslot');
    $item.parent().appendTo($item.parent().parent())
    
    if(id === 'boxlist0'){
        $('#' + id).append(emptyslot);
    }
    $item.appendTo($('#' + id + ' li.emptyslot').first());
    
    //$('#' + id).find('div.emptyslot').first().remove();
    $item.parent().removeClass('emptyslot');
    $('#boxlist0 li.emptyslot').remove();

    database.updateReservationBox($item.prop('id'), id.replace("boxlist",""));
}

const emptyslot = '<li class="list-group-item emptyslot"></li>';

const reservationSlot = async (reservation) => {
    let resCat = (await database.getCats(reservation.catid))[0];
    let returnString = '<div id="' + reservation._id + '" class="dragzone alert" style="background-color:blue;"><b>' + resCat.name + '</b><br>' + convertDateFormat(reservation.dateCheckin) + ' - ' + convertDateFormat(reservation.dateCheckout) + '</div>';
    console.log("RESCAT", returnString);
    return returnString;
}

const convertDateFormat = (dateString) => {
    let date = new Date(dateString);
    let d = date.getDate();
    let m = date.getMonth()+1;
    let y = date.getFullYear();

    return d + "." + m + "." + y;
}