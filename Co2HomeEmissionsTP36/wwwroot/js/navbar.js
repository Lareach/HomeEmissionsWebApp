jQuery(document).ready(function ($) {
    const mobileWidth = 576;

    $(".nav-item").click(function () {
        let subMenuContainer = $(this).find(".nav-sub-menu-container");
        
        if(subMenuContainer.hasClass("display"))
        {
            subMenuContainer.removeClass("display");
        }
        else
        {
            subMenuContainer.addClass("display");
        }
    });

    clickNavbarAccordion();

    $(window).resize(function() {
        if($(window).width() < mobileWidth)
        {
            
        }
    });
});

// Open and close accordion
function clickNavbarAccordion() {
    $.each($(".nav-sub-menu-title"), function (i) {
        $(this).addClass("_" + (i + 1));
    });

    let moduleCount = $(".nav-sub-menu-title").length;

    for (let j = 1; j <= moduleCount; j++) {
        let currentModule = ".nav-sub-menu-title._" + j + " ";

        $(currentModule).click(function (e) {
            $(currentModule + ".navbar-accordion-icon").toggleClass("accordion-no-rotate accordion-rotate");
        });
    }
}
