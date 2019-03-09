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
            if(obj.name !== "_id" || obj.value !== ""){
                newCatData[catindex][obj.name] = obj.value;
            }
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
    $('#customer-edit-cat .card-body .form-cat:visible').hide();
    $('#customer-edit-cat .card-body #form-cat-' + id).show();
}

const setButtonHandlers = () => {
    //New Customer
    $("#btn-newcustomer").on("click", function () {
        $('#cust-table').hide();
        $('#form-customer')[0].reset();
        $('#btn-group-cats').empty();
        $('#customer-edit-cat .card-body').empty();
        $('#btn-group-cats').append(catFormNavButtonTemplate(0, "Neue Katze"));
        $('#customer-edit-cat .card-body').append(catFormTemplate(0));
        $('#customer-edit').show();
        $('#btn-form-delete').hide();
        setFormHandlers();
    });

    $('#btn-form-delete').on("click", function(){
        if (confirm('Katze "' + $('#btn-group-cats .active').text() + '" löschen?')) {
            database.deleteCustomer($("input[name=_id]").val());
            database.deleteCatsFromOwner($("input[name=_id]").val());
            $('#customer-edit').hide();
            $('#cust-table').show();
        }
    });

    //Edit customer
    $('.customer-table-row').on("click", async function () {
        //alert($(this).data('id'))
        await $('#cust-table').hide();
        await $('#form-customer')[0].reset();
        await $('#btn-group-cats').empty();
        await $('#customer-edit-cat .card-body').empty();
        await fillCustomerForm($(this).data('id'));
        $('#customer-edit-header').val("Kunde bearbeiten");
        await $('#customer-edit').show();
        await setFormHandlers();
        selectCatForm($('#btn-group-cats').children().first().data("id"));
    });

    $('#btn-form-save').on("click", function () {
        saveCustomerData();
        $('#customer-edit').hide();
        $('#cust-table').show();
    });

    $('#btn-form-cancel').on("click", function () {
        $('#customer-edit').hide();
        $('#cust-table').show();
    });

    $("#btn-cat-delete").on("click", function () {
        if (confirm('Katze "' + $('#btn-group-cats .active').text() + '" löschen?')) {
            if($('#btn-group-cats').children().length > 1){
                var catid = $('#btn-group-cats .active').data("id");
                database.deleteCat(catid);
                $('#btn-group-cats .active').remove();
                selectCatForm($('#btn-group-cats').children().first().data("id"));
                $('#form-cat-' + catid).remove();
            }
        }
    });

    $("#btn-cat-add").on("click", function () {
        if($('#btn-group-cats').children().length > 6 || $('#btn-group-cats').children().last().data('id') == 0){
            return;
        }
        $('#btn-group-cats').append(catFormNavButtonTemplate(0, "Neue Katze"));
        $('#customer-edit-cat .card-body').append(catFormTemplate(0));
        selectCatForm(0);
    });

    $('#btn-group-cats button').on("click", function () {
        selectCatForm($(this).data('id'));
    });
}

const fillCustomerForm = async (id) => {
    var tempCustomerData = (await database.getCustomers(id))[0];
    var tempCatData = await database.getCatsByOwnerid(tempCustomerData._id);

    await populateForm($('#form-customer'), tempCustomerData);

    for(var i=0; i<tempCatData.length; i++){
        await $('#btn-group-cats').append(catFormNavButtonTemplate(tempCatData[i]._id, tempCatData[i].name));
        await $('#customer-edit-cat .card-body').append(catFormTemplate(tempCatData[i]._id));
        await populateForm($('#form-cat-' + tempCatData[i]._id), tempCatData[i]);
    }
}

const populateForm = (frm, data) => {  
    $.each(data, function(key, value) {  
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
}

const catFormNavButtonTemplate = (catid, name) => {
    //return '<button type="button" class="btn btn-outline-dark" data-id="' + id + '">' + name + '</button>';
    return $('<button/>',
            {
                text: name,
                type: 'button',
                class: 'btn btn-outline-dark',
                click: function () {
                        selectCatForm($(this).data('id'));
                    },
                attr: {"data-id": catid},
                data: {id: catid}
            }
        )
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