//var reservationData;
//var customerData;
//var boxesData;
let currentReservation;
let reservationData;
let customerData;
let catData;
let boxesData;
const deleteReservationButtonIcon = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"red\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59   L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59z\"/></svg>";
const backgroundColors = ["#b1b1d5", "#abe1fd", "#f0e0a2", "#fed1b"];

$(function () {
    init();
});

const refreshPage = async() => {
    reservationData = await database.getReservations();
    customerData = await database.getCustomers();
    catData = await database.getCats();
    boxesData = await database.getBoxes();

    printAllReservations();
    setDeleteButtonHandlers();
}

const init = async () => {
    reservationData = await database.getReservations();
    customerData = await database.getCustomers();
    catData = await database.getCats();
    boxesData = await database.getBoxes();
    
    printAllReservations();
    setDeleteButtonHandlers();
    setButtonHandlers();
    setSelectionHandlers();
    setDateHandlers();
    $("#new-reservation").hide();
}

// function loadCustomerData() {
//     dataHandler.getAllCustomers(loadCustomerDataCallback);
// }

// function loadCustomerDataCallback(error, data) {
//     if (error) throw error;
//     customerData = data;
//     loadBoxesData();
// }

// function loadBoxesData() {
//     dataHandler.getAllBoxes(loadBoxesDataCallback);
// }

// function loadBoxesDataCallback(error, data) {
//     if (error) throw error;
//     boxesData = data;
//     printAllReservations();
//     setDeleteButtonHandlers();
// }

function setButtonHandlers(){
    $("#btn-new-reservation").on("click", function () {
        $("#new-reservation form")[0].reset();
        loadCustomerSelection();
        $("#new-reservation-cat").html("<option selected>Katze wählen</option>")
        $("#new-reservation-box").html("<option selected>Box wählen</option>")
        loadDates();
        $("#reservation-table").hide();
        $("#new-reservation").show();
    });
    $("#new-reservation-save").on("click", function () {
        if(saveNewReservation()){
            $("#reservation-table").show();
            $("#new-reservation").hide();
        }
    });
    $("#new-reservation-cancel").on("click", function () {
        $("#new-reservation form")[0].reset();
        $("#reservation-table").show();
        $("#new-reservation").hide();
    });
}

function setSelectionHandlers(){
    $("#new-reservation-cust").on("change", function(){
        loadCatSelection($("#new-reservation-cust").val());
    });
}

function setDateHandlers(){
    $("#new-reservation-from, #new-reservation-until").on("change", function(){
        loadAvailableBoxes();
    });
}

async function saveNewReservation(){
    currentReservation = {};
    // currentReservation["_id"] = getNewReservationID();
    currentReservation["ownerid"] = $("#new-reservation-cust").val();
    currentReservation["catid"] = $("#new-reservation-cat").val();
    currentReservation["dateCheckin"] = $("#new-reservation-from").val();
    currentReservation["dateCheckout"] = $("#new-reservation-until").val();
    currentReservation["boxid"] = $("#new-reservation-box").val();

    if(currentReservation.boxid === 'Box wählen' || currentReservation.catid === 'Katze wählen' || currentReservation.customerid === 'Besitzer wählen'){
        alert("Eingaben fehlerhaft");
        return false;
    }

    await database.insertReservation(currentReservation);
    await refreshPage();

    return true;
}

function printAllReservations(){
    $('#reservation-td-body').html("");
    reservationData = (reservationData || []);
    for (var i = 0; i < reservationData.length; i++) {
        let currentCat = getCatByID(reservationData[i].catid)
        let currentCustomer = getCustomerByID(currentCat.ownerid);
        $('#reservation-td-body').append("<tr>" //<td>" + data[i].ID
            +
            "<td>" + reservationData[i]._id +
            "</td><td>" + currentCustomer.lastname + ", " + currentCustomer.prename +
            "</td><td>" + currentCat.name +
            "</td><td>" + reservationData[i].dateCheckin +
            "</td><td>" + reservationData[i].dateCheckout +
            "</td><td>" + getBoxByID(reservationData[i].boxid).number +
            "</td><td><button class=\"btn btn-outline-danger btn-delete\" data-id=\"" + reservationData[i]._id + "\">" + deleteReservationButtonIcon + "</button>" +
            "</td></tr>");
    }
}

function setDeleteButtonHandlers(){
    $("#reservation-td-body .btn-delete").each(function () {
        $(this).on("click", function () {
            deleteReservation($(this).attr("data-id"));
        });
    });
}

function getNewReservationID(){
    var newID = 0;

    for(var i=0; i<reservationData.lengt; i++){
        if(res.ID>newID){
            newID = res.ID;
        }
    }
    return (newID+1);
}

function loadCustomerSelection(){
    var options = ["<option selected>Besitzer wählen</option>"];
    var cust = {};

    for(var i=0; i<customerData.length; i++){
        cust = customerData[i];
        options.push("<option value='" + cust._id + "'>" + cust.prename + " " + cust.lastname + "</option>");
    }
    $("#new-reservation-cust").html(options);
}

function loadCatSelection(custID){
    var cats = [];
    var options = ["<option selected>Katze wählen</option>"];
    
    $("#new-reservation-cat").html("");

    for(var i=0; i<catData.length; i++){
        if(catData[i].ownerid === custID){
            options.push("<option value='" + catData[i]._id + "'>" + catData[i].name + "</option>");
        }
    }
    $("#new-reservation-cat").html(options);
}

function loadDates(){
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

    $('#new-reservation-from').val(today);
    $('#new-reservation-until').val(today);
}

function loadAvailableBoxes(){
    var checkin = new Date($("#new-reservation-from").val());
    var checkout = new Date($("#new-reservation-until").val());

    var occupiedBoxes = [];
    var availableBoxes = ["<option selected>Box wählen</option>"];

    $("#new-reservation-box").html("");

    for(var i=0; i<boxesData.length; i++){
        occupiedBoxes.push(0);
    }

    if(checkout.getTime()<checkin.getTime())
        return;

    date = checkin;

    /*
    while(!(date.getDate()==checkout.getDate() && date.getMonth()==checkout.getMonth())){
        console.log(date);
        date.setTime(date.getTime() + 86400000);
    }
    */

    for(var i=0; i<reservationData.length; i++){
        var resCheckin = new Date(reservationData[i].dateCheckin).getTime();
        var resCheckout = new Date(reservationData[i].dateCheckout).getTime();

        //Reservierung fällt in gewählten Zeitraum
        if((resCheckin >= checkin.getTime() && resCheckin <= checkout.getTime()) || (resCheckout >= checkin.getTime() && resCheckout <= checkout.getTime())){
            occupiedBoxes[reservationData[i].boxID - 1] = occupiedBoxes[reservationData[i].boxID - 1] + 1;
        }
    }

    for(var i=0; i<occupiedBoxes.length; i++){
        if(occupiedBoxes[i] < boxesData[i].size){
            availableBoxes.push("<option value='" + boxesData[i]._id + "'>Box " + (i+1) + "</option>");

            $("#new-reservation-box").html(availableBoxes);
        }
    }
}

function getCustomerByID(id){
    for(var i=0; i<customerData.length; i++){
        if(customerData[i]._id === id){
            return customerData[i];
        }
    }
}

function getCatByID(id){
    for(var i=0; i<catData.length; i++){
        if(catData[i]._id === id){
            return catData[i];
        }
    }
}

function getBoxByID(id){
    for(var i=0; i<boxesData.length; i++){
        if(boxesData[i]._id === id){
            return boxesData[i];
        }
    }
}

async function deleteReservation(id){
    // for(var i=0; i<reservationData.length; i++){
    //     if(reservationData[i]._id === id){
    //         reservationData.splice(i, 1);
    //         database.setAllBookings(reservationData, function(){
    //             printAllReservations();
    //             setDeleteButtonHandlers();
    //         });
    //     }
    // }
    await database.deleteReservation(id);
    await refreshPage();
}