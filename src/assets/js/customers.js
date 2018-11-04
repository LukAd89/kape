//var customerData;
var currentCustomer;

var deleteUserButtonIcon = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"red\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59   L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59z\"/></svg>";
var editUserButtonIcon = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"grey\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"14.5,5.5 3,17 3,21 7,21 18.5,9.5   \"/><path d=\"M21.707,4.879l-2.586-2.586c-0.391-0.391-1.024-0.391-1.414,0L16,4l4,4l1.707-1.707    C22.098,5.902,22.098,5.269,21.707,4.879z\"/></svg>";

$(function () {
    init();
});

const init = async () => {
    $("#customer-edit").hide();
    var customerData = await database.getCustomers();
    //var customerData = [{_id:0, prename:'lukas', lastname:'adrian'},{_id:1, prename:'bianca', lastname:'mielach'}]
    await printCustomers(customerData);
    setButtonHandlers();

    /*
    printAllCustomers();
    setEditButtonHandlers();
    setButtonHandlers();
    */
};

const printCustomers = async (customerData) => {
    $('#customer-table tbody').html("");
    var tableBody = "";
    for(var i=0; i<customerData.length; i++){
        var tempCustomer = customerData[i];
        var tempCats = await database.getCats(tempCustomer._id);

        var catString = "";
        for(var j=0; j<tempCats.length; j++){
            catString += (tempCats[j].name || "");
        }

        tableBody += '<tr class="customer-table-row" data-id="' +  tempCustomer._id + '"><td>' + (tempCustomer.prename || "") +
            "</td><td>" + (tempCustomer.lastname || "") + 
            "</td><td>" + (tempCustomer.adress || "") +  (tempCustomer.zip || "") +  (tempCustomer.city || "") + 
            "</td><td>" + catString + 
            "</td></tr>";
    }
    $('#customer-table tbody').html(tableBody);
};

const saveCustomerData = async () => {
    var formData = await $('#form-customer').serializeArray();
    var newCustomerData = {};
    var newCatData = [];

    $(formData).each(function(index, obj){
        if(obj.name !== "_id" || obj.value !== "")
            newCustomerData[obj.name] = obj.value;
    });

    $('#customer-edit-cat .form-cat').each(function(catindex){
        formData = $(this).serializeArray();
        newCatData.push({});
        $(formData).each(function(attrindex, obj){
            if(obj.name !== "_id" || obj.value !== "")
                newCatData[catindex][obj.name] = obj.value;
        });
    });
    
    if(newCustomerData._id){
        await database.updateCustomer(newCustomerData);
        $.each(newCatData, async function(index, obj){
            newCatData[index].ownerid = newCustomerData._id;
            if(newCatData[index]._id){
                await database.updateCat(obj);
            } else{
                await database.insertCat(obj);
            }
        });
    } else {
        var newID = (await database.insertCustomer(newCustomerData))._id;
        $.each(newCatData, async function(index, obj){
            newCatData[index].ownerid = newID;
            await database.insertCat(newCatData[index]);
        });
    }
    
}

const selectCatForm = (id) => {
    $('#btn-group-cats .active').removeClass('active');
    $('#btn-group-cats button[data-id="' + id + '"]').addClass('active');
}

const setButtonHandlers = () => {
    //New Customer
    $("#btn-newcustomer").on("click", function () {
        $('#cust-table').hide();
        $('#customer-edit-cat .card-body').append(catFormTemplate(0));
        $('#customer-edit').show();
        setFormHandlers();
    });

    //Edit customer
    $('.customer-table-row').on("click", function () {
        //alert($(this).data('id'))
        $('#cust-table').hide();
        fillCustomerForm($(this).data('id'));
        $('#customer-edit').show();
    });

    $('#btn-form-save').on("click", function () {
        saveCustomerData();
    });

    $('#btn-form-cancel').on("click", function () {
        $('#customer-edit').hide();
        $('#cust-table').show();
    });

    $("#btn-cat-delete").on("click", function () {
        if (confirm('Katze "' + $('#btn-group-cats .active').text() + '" löschen?')) {
            if($('#btn-group-cats').children().length > 1){
                $('#btn-group-cats .active').remove();
                selectCatForm($('#btn-group-cats').children().first().data("id"));
            }
        }
    });

    $("#btn-cat-add").on("click", function () {
        if($('#btn-group-cats').children().length > 6 || $('#btn-group-cats').children().last().data('id') == 0){
            return;
        }
        $('#btn-group-cats').append($('<button/>',
            {
                text: 'Neue Katze',
                type: 'button',
                class: 'btn btn-outline-dark',
                click: function () {
                        selectCatForm($(this).data('id'));
                    },
                attr: {"data-id": 0},
                data: {id: 0}
            }
        ));
        selectCatForm(0);
    });

    $('#btn-group-cats button').on("click", function () {
        selectCatForm($(this).data('id'));
    });
}

const fillCustomerForm = async (id) => {
    var tempCustomerData = (await database.getCustomers(id))[0];
    var tempCatData = await database.getCatsByOwnerid(tempCustomerData._id);

    populateForm($('#form-customer'), tempCustomerData);

    for(var i=0; i<tempCatData.length; i++){
        populateForm($('#'), tempCatData[i]);
    }
}

const populateForm = (frm, data) => {  
    $.each(data, function(key, value) {  
        console.log(key);
        console.log(value);
        var ctrl = $('[name='+key+']', frm); 
        switch(ctrl.prop("type")) { 
            case "radio": case "checkbox":   
                ctrl.each(function() {
                    if($(this).attr('value') == value) $(this).attr("checked",value);
                });   
                break;  
            default:
                ctrl.val(value); 
        } 
    });  
}

const catFormTemplate = (id) => {
    var $item = $($('script[data-template="catform"]').html());
    $item.children('form').prop('id', 'form-cat-' + id);
    return $item.children('form').first();
    return $('script[data-template="catform"]').prop('id', 'form-cat-' + id).html();
}

const setFormHandlers = () => {
    $('#frm-cust-phone').mask('(00000) #');
    $('#frm-cust-mobile').mask('0000 - #');
    $('#frm-cust-zip').mask('00000');
    $('#frm-cat-birthday').mask('00.00.0000');
    $('#frm-cat-birthday').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: "dd.mm.yy"
    });
}

//////////////////////////////////////////////// OLD /////////////////////////////////////////////

/*function printAllCustomers(data) {
    document.getElementById("div1").innerHTML += data.customers[0];
    getCustomerData(data.customers[0]);
}*/

/*
function loadSingleCustomer(id) {
    /*
    // ALT: Ab jetzt steht alles in customerDATA drin
    var temp;
    for (var i = 0; i < customerData.length; i++) {
        if (customerData[i].ID == id) {
            temp = id + "-" + customerData[i].lastname + "-" + customerData[i].prename;
        }
    }
    dataHandler.getSingleCustomer(temp, loadSingleCustomerCallback);
}
*/

/*
function loadSingleCustomerCallback(error, data) {
    if (error) throw error;
    currentCustomer = data;
    printSingleCustomer();
}
*/

function sortData(data, key) {
    data.sort(function (a, b) {
        return a[key].localeCompare(b[key]);
    });
    return data;
}

function printAllCustomers() {
    $('#cust-td-body').html("");
    customerData = (customerData || []);
    for (var i = 0; i < customerData.length; i++) {
        $('#cust-td-body').append("<tr>" //<td>" + data[i].ID
            +
            "<td>" + customerData[i].prename +
            "</td><td>" + customerData[i].lastname +
            "</td><td>" + customerData[i].street + ", " + customerData[i].zip + " " + customerData[i].city +
            "</td><td>" + customerData[i].cats[0].name +
            "</td><td>" + customerData[i].cats[1].name +
            "</td><td>" + customerData[i].cats[2].name +
            "</td><td><button class=\"btn btn-outline-secondary btn-edit\" data-id=\"" + customerData[i].ID + "\">" + editUserButtonIcon + "</button>" +
            "</td><td><button class=\"btn btn-outline-danger btn-delete\" data-id=\"" + customerData[i].ID + "\">" + deleteUserButtonIcon + "</button>" +
            "</td></tr>");
    }
}

function printSingleCustomer() {
    //PERSÖNLICHE DATEN
    $("#frm-cust-prename").val(currentCustomer.prename);
    $("#frm-cust-lastname").val(currentCustomer.lastname);
    $("#frm-cust-email").val(currentCustomer.email);
    $("#frm-cust-street").val(currentCustomer.street);
    $("#frm-cust-phone").val(currentCustomer.phone);
    $("#frm-cust-zip").val(currentCustomer.zip);
    $("#frm-cust-city").val(currentCustomer.city);
    $("#frm-cust-mobile").val(currentCustomer.mobile);
    $("#frm-cust-misc").val(currentCustomer.misc);

    //KATZE 1
    $("#collapseTwo #frm-cat-name").val(currentCustomer.cats[0].name);
    $("#collapseTwo #frm-cat-race").val(currentCustomer.cats[0].race);
    $("#collapseTwo #frm-cat-birthday").val(currentCustomer.cats[0].birthday);
    $('#collapseTwo input:radio[name="radio-gender"]').filter('[value="' + currentCustomer.cats[0].gender + '"]').attr('checked', true);
    $("#collapseTwo #frm-cat-cast").attr('checked', currentCustomer.cats[0].cast);
    $("#collapseTwo #frm-cat-single").attr('checked', currentCustomer.cats[0].single);
    $("#collapseTwo #frm-cat-medics").val(currentCustomer.cats[0].medics);
    $("#collapseTwo #frm-cat-misc").val(currentCustomer.cats[0].misc);

    //KATZE 2
    $("#collapseThree #frm-cat-name").val(currentCustomer.cats[1].name);
    $("#collapseThree #frm-cat-race").val(currentCustomer.cats[1].race);
    $("#collapseThree #frm-cat-birthday").val(currentCustomer.cats[1].birthday);
    $('#collapseThree input:radio[name="radio-gender"]').filter('[value="' + currentCustomer.cats[1].gender + '"]').attr('checked', true);
    $("#collapseThree #frm-cat-cast").attr('checked', currentCustomer.cats[1].cast);
    $("#collapseThree #frm-cat-single").attr('checked', currentCustomer.cats[1].single);
    $("#collapseThree #frm-cat-medics").val(currentCustomer.cats[1].medics);
    $("#collapseThree #frm-cat-misc").val(currentCustomer.cats[1].misc);

    //KATZE 3
    $("#collapseFour #frm-cat-name").val(currentCustomer.cats[2].name);
    $("#collapseFour #frm-cat-race").val(currentCustomer.cats[2].race);
    $("#collapseFour #frm-cat-birthday").val(currentCustomer.cats[2].birthday);
    $('#collapseFour input:radio[name="radio-gender"]').filter('[value="' + currentCustomer.cats[2].gender + '"]').attr('checked', true);
    $("#collapseFour #frm-cat-cast").attr('checked', currentCustomer.cats[2].cast);
    $("#collapseFour #frm-cat-single").attr('checked', currentCustomer.cats[2].single);
    $("#collapseFour #frm-cat-medics").val(currentCustomer.cats[2].medics);
    $("#collapseFour #frm-cat-misc").val(currentCustomer.cats[2].misc);
}

function deleteCustomer(id){
    for (var i = 0; i < customerData.length; i++) {
        if (customerData[i].ID == id) {
            customerData.splice(i, 1);
            dataHandler.setAllCustomers(customerData, saveCustomerDataCallback)
        }
    }
    loadCustomerData();
}

function setEditButtonHandlers() {
    $("#cust-td-body .btn-edit").each(function () {
        $(this).on("click", function () {
            showEditModal($(this).attr("data-id"));
        });
    });
    $("#cust-td-body .btn-delete").each(function () {
        $(this).on("click", function () {
            deleteCustomer($(this).attr("data-id"));
        });
    });
}

function setButtonHandlersOld() {
    $("#btn-newcustomer").on("click", function () {
        //showEditModal(-1);
        saveCustomerData();
    });
    $("#btn-cust-edit").on("click", function () {
        toggleEditMode(-1);
    });
    $("#btn-cust-save").on("click", function () {
        saveCustomerData();
        showCustomersTable();
    });
    $("#btn-cust-cancel").on("click", function () {
        for (var i = 0; i < 4; i++) {
            $("#cust-edit form")[i].reset();
        }
        currentCustomer = null;
        showCustomersTable();
    });
}

function showCustomersTable() {
    $("#cust-edit").hide();
    $("#cust-table").show();
}

function showEditModal(id) {
    $("#cust-table").hide();

    if (!($("#collapseOne").hasClass("show"))) {
        $("#headingOne").click(); //Show First Accordion Page
    }
    $("#cust-edit").show();

    if (id == -1) {
        toggleEditMode(1);
        $("#btn-cust-edit").hide();
    } else {
        currentCustomer = getCustomerByID(id);
        printSingleCustomer();
        toggleEditMode(0);
    }
}

function toggleEditMode(value) {
    if ($("#frm-cust-prename").prop("readonly") || value == 1) {
        $(".card-body form input, .card-body form textarea").prop("readonly", false);
    } else {
        $(".card-body form input, .card-body form textarea").prop("readonly", true);
    }
}

function saveCustomerDataOld() {
    if (currentCustomer == null) {
        currentCustomer = {};
        currentCustomer.ID = "" + (getMaxCustomerID() + 1);
    } else {
        for (var i = 0; i < customerData.length; i++) {
            if (customerData[i].ID == currentCustomer.ID) {
                customerData.splice(i, 1);
            }
        }
    }
    
    currentCustomer["prename"] = $("#frm-cust-prename").val();
    currentCustomer["lastname"] = $("#frm-cust-lastname").val();
    currentCustomer["street"] = $("#frm-cust-street").val();
    currentCustomer["zip"] = $("#frm-cust-zip").val();
    currentCustomer["city"] = $("#frm-cust-city").val();
    currentCustomer["email"] = $("#frm-cust-email").val();
    currentCustomer["phone"] = $("#frm-cust-phone").val();
    currentCustomer["mobile"] = $("#frm-cust-mobile").val();
    currentCustomer["misc"] = $("#frm-cust-misc").val();
    currentCustomer["cats"] = new Array();

    //KATZE 1
    var currentCat = {ID: 1};
    currentCat["name"] = $("#collapseTwo #frm-cat-name").val();
    currentCat["race"] = $("#collapseTwo #frm-cat-race").val();
    currentCat["birthday"] = $("#collapseTwo #frm-cat-birthday").val();
    currentCat["gender"] = $("#collapseTwo input[name=radio-gender]:checked").val();
    currentCat["cast"] = $("#collapseTwo #frm-cat-cast").is(":checked");
    currentCat["single"] = $("#collapseTwo #frm-cat-single").is(":checked");
    currentCat["medics"] = $("#collapseTwo #frm-cat-medics").val();
    currentCat["misc"] = $("#collapseTwo #frm-cat-misc").val();
    currentCustomer["cats"].push(currentCat);

    //KATZE 2
    currentCat = {ID: 2};
    currentCat["name"] = $("#collapseThree #frm-cat-name").val();
    currentCat["race"] = $("#collapseThree #frm-cat-race").val();
    currentCat["birthday"] = $("#collapseThree #frm-cat-birthday").val();
    currentCat["gender"] = $("#collapseThree input[name=radio-gender]:checked").val();
    currentCat["cast"] = $("#collapseThree #frm-cat-cast").is(":checked");
    currentCat["single"] = $("#collapseThree #frm-cat-single").is(":checked");
    currentCat["medics"] = $("#collapseThree #frm-cat-medics").val();
    currentCat["misc"] = $("#collapseThree #frm-cat-misc").val();
    currentCustomer["cats"].push(currentCat);

    //KATZE 3
    currentCat = {ID: 3};
    currentCat["name"] = $("#collapseFour #frm-cat-name").val();
    currentCat["race"] = $("#collapseFour #frm-cat-race").val();
    currentCat["birthday"] = $("#collapseFour #frm-cat-birthday").val();
    currentCat["gender"] = $("#collapseFour input[name=radio-gender]:checked").val();
    currentCat["cast"] = $("#collapseFour #frm-cat-cast").is(":checked");
    currentCat["single"] = $("#collapseFour #frm-cat-single").is(":checked");
    currentCat["medics"] = $("#collapseFour #frm-cat-medics").val();
    currentCat["misc"] = $("#collapseFour #frm-cat-misc").val();
    currentCustomer["cats"].push(currentCat);

    customerData.push(currentCustomer);

    //dataHandler.setSingleCustomer(currentCustomer.ID + "-" + currentCustomer.lastname + "-" + currentCustomer.prename, currentCustomer,
    dataHandler.setAllCustomers(customerData, saveCustomerDataCallback)
    //);
}

function saveCustomerDataCallback(error) {
    if (error) throw error;
    //Customer neu laden
    loadCustomerData();
}

function getCustomerByID(id) {
    for (var i = 0; i < customerData.length; i++) {
        if (customerData[i].ID == id) {
            return customerData[i];
        }
    }
}

function getMaxCustomerID() {
    var maxID = 0;
    for (var i = 0; i < customerData.length; i++) {
        if (parseInt(customerData[i].ID) > maxID) {
            maxID = parseInt(customerData[i].ID);
        }
    }
    return maxID;
}