//var reservationData;
//var customerData;
//var boxesData;
var currentReservation;

var deleteReservationButtonIcon = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"red\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59   L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59z\"/></svg>";


$(function () {
    init();
});

function init() {
    //loadReservationData();
    //loadCustomerData();
    //loadBoxesData();
    printAllReservations();
    setDeleteButtonHandlers();
    setButtonHandlers();
    setSelectionHandlers();
    setDateHandlers();
    $("#new-reservation").hide();
}

function loadReservationData(){
    dataHandler.getAllBookings(loadReservationDataCallback);
}

function loadReservationDataCallback(error, data){
    if (error) throw error;
    reservationData = data;
    loadCustomerData();
}

function loadCustomerData() {
    dataHandler.getAllCustomers(loadCustomerDataCallback);
}

function loadCustomerDataCallback(error, data) {
    if (error) throw error;
    customerData = data;
    loadBoxesData();
}

function loadBoxesData() {
    dataHandler.getAllBoxes(loadBoxesDataCallback);
}

function loadBoxesDataCallback(error, data) {
    if (error) throw error;
    boxesData = data;
    printAllReservations();
    setDeleteButtonHandlers();
}

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

function saveNewReservation(){
    currentReservation = {};
    currentReservation["ID"] = getNewReservationID();
    currentReservation["customerID"] = $("#new-reservation-cust").val();
    currentReservation["catID"] = $("#new-reservation-cat").val();
    currentReservation["dateCheckin"] = $("#new-reservation-from").val();
    currentReservation["dateCheckout"] = $("#new-reservation-until").val();
    currentReservation["boxID"] = $("#new-reservation-box").val();

    if(currentReservation.boxID === 'Box wählen' || currentReservation.catID === 'Katze wählen' || currentReservation.customerID === 'Besitzer wählen'){
        alert("Eingaben fehlerhaft");
        return false;
    }

    reservationData.push(currentReservation);

    dataHandler.setAllBookings(reservationData, function(){
        printAllReservations();
        setDeleteButtonHandlers();
    });

    return true;
}

function printAllReservations(){
    $('#reservation-td-body').html("");
    reservationData = (reservationData || []);
    for (var i = 0; i < reservationData.length; i++) {
        var currentCustomer = getCustomerByID(reservationData[i].customerID);
        $('#reservation-td-body').append("<tr>" //<td>" + data[i].ID
            +
            "<td>" + reservationData[i].ID +
            "</td><td>" + currentCustomer.prename +
            "</td><td>" + currentCustomer.cats[(reservationData[i].catID-1)].name +
            "</td><td>" + reservationData[i].dateCheckin +
            "</td><td>" + reservationData[i].dateCheckout +
            "</td><td>" + reservationData[i].boxID +
            "</td><td><button class=\"btn btn-outline-danger btn-delete\" data-id=\"" + reservationData[i].ID + "\">" + deleteReservationButtonIcon + "</button>" +
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
        options.push("<option value='" + cust.ID + "'>" + cust.prename + " " + cust.lastname + "</option>");
    }
    $("#new-reservation-cust").html(options);
}

function loadCatSelection(custID){
    var cats = [];
    var options = ["<option selected>Katze wählen</option>"];
    
    $("#new-reservation-cat").html("");

    for(var i=0; i<customerData.length; i++){
        if(customerData[i].ID == custID){
            cats = customerData[i].cats;
            for(var j=0; j<cats.length; j++){
                cat = cats[j];
                if(cat.name !== "")
                    options.push("<option value='" + cat.ID + "'>" + cat.name + "</option>");
            }
            $("#new-reservation-cat").html(options);
        }
    }
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
            availableBoxes.push("<option value='" + (i+1) + "'>Box " + (i+1) + "</option>");

            $("#new-reservation-box").html(availableBoxes);
        }
    }
}

function getCustomerByID(id){
    for(var i=0; i<customerData.length; i++){
        if(customerData[i].ID == id){
            return customerData[i];
        }
    }
}

function deleteReservation(id){
    for(var i=0; i<reservationData.length; i++){
        if(reservationData[i].ID == id){
            reservationData.splice(i, 1);
            dataHandler.setAllBookings(reservationData, function(){
                printAllReservations();
                setDeleteButtonHandlers();
            });
        }
    }
}