//var customerData;
//var reservationData;
//var boxesData;

$(function(){
    //loadData();
    importSections();
    setMenuButtonHandlers();
    showStartSection();
})

// Import and add each page to the DOM
function importSections(){
    const links = document.querySelectorAll('link[rel="import"]')
    Array.prototype.forEach.call(links, (link) => {
        let template = link.import.querySelector('.section-template')
        let clone = document.importNode(template.content, true)
        if (link.href.match('about.html')) {
            document.querySelector('body').appendChild(clone)
        } else {
            document.querySelector('#main-container').appendChild(clone)
        }
    })
}

function loadData(){
    dataHandler.getAllBookings(function (error, data){
        if (error) throw error;
        reservationData = data;

        dataHandler.getAllCustomers(function (error, data){
            if (error) throw error;
            customerData = data;
            
            dataHandler.getAllBoxes(function(error,data){
                if(error) throw error;
                boxesData = data;
                
                importSections();
                setMenuButtonHandlers();
                showStartSection();
            });
        });
    });
}

function setMenuButtonHandlers(){
    $("#menu-nav .nav-link").each(function() {
        $(this).on("click", function(){
            $("#menu-nav").find(".active").removeClass("active");
            $(this).addClass("active");

            hideAllSections();
            showSection($(this).attr("data-section"));
        });
    });
}

function showStartSection(){
    hideAllSections();
    showSection("overview");
}

function hideAllSections(){
    $("#main-container section").hide();
}

function showSection(section){
    $("#section-" + section).show();
}