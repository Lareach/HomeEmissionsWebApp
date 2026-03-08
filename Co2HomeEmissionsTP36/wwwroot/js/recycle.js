jQuery(document).ready(function ($) {
    handleImageUploadForm();

    const mobileWidth = 1023;
    const dictionary = 
    {
        '#battery': 1,
        '#cardboard': 2,
        '#clothes': 3,
        '#glass': 4,
        '#metal': 5,
        '#Organic Waste': 6,
        '#paper': 7,
        '#plastic': 8,
        '#shoes': 9,
        '#styrofoam': 10,
        '#trash': 11,
        '#Wood': 12
    }

    $.each($(".module-two-panel-selector-container"), function(i) {
        $(this).addClass("_" + (i + 1));
    });

    let previousWidth = $(window).width();
    if(previousWidth > mobileWidth) {
        $(".right-panel").css("display", "none");
        defaultSelected(dictionary[window.location.hash]);
    }

    updateTwoPanelContainer(previousWidth, mobileWidth);

    $(window).resize(function() {
        previousWidth = updateTwoPanelContainer(previousWidth, mobileWidth);
    });
});

function handleImageUploadForm() {
    $('#image-upload').on('change', function() {
        let fileName = $(this).val().split('\\').pop();
        $('#image-name-display').text('Selected Image: ' + fileName);
    });

    $('#image-uploader').on('submit', function(event) {
        if($('#image-upload').get(0).files.length === 0)
        {
            event.preventDefault(); // Prevent form submission
        }
        else
        {
            let fileSize = $('#image-upload').get(0).files[0].size; // Size in bytes
            let maxSize = 4 * 1024 * 1024; // 4MB in bytes
    
            if(fileSize > maxSize) {
                event.preventDefault(); // Prevent form submission
            }
            else {
                $('.loading-spinner').show();
            }
        }
    });
}

function updateTwoPanelContainer(previousWidth, mobileWidth) {
    let moduleCount = $(".module-two-panel-selector-container").length;
    let currentWidth = $(window).width();

    for(let j = 1; j <= moduleCount; j++)
    {
        let currentModule = ".module-two-panel-selector-container._" + j + " ";
        let panelCount = $(currentModule + ".left-panel-container .left-panel-heading").length;

        if(currentWidth <= mobileWidth) { // mobile
            if(previousWidth > mobileWidth) // run when resizing from desktop width to mobile width
            {
                for(let i = 1; i <= panelCount; i++) {
                    clearSelected(i, j, currentModule);
                }
                $(currentModule + ".right-panel").css("display", "block");
                $(currentModule + ".right-panel").removeClass("right-panel-active");
                $(currentModule + ".right-panel").removeClass("right-panel-inactive");
            }

            let top = $(currentModule + ".two-panel-selector").offset().top;
            let leftPanelWidth = $(currentModule + ".left-panel-container").height();

            $(currentModule + ".left-panel-title").css("width", String(currentWidth - 98)+"px");

            $(currentModule + ".right-panel").addClass("right-panel-mobile");
            $(currentModule + ".right-panel").addClass("right-panel-inactive");
            $(currentModule + ".right-panel").addClass("left-panel-container-active");
            $(currentModule + ".left-panel-heading-inner._" + String(panelCount)).css("border-bottom", "1px solid transparent");
    
            $(currentModule + '.left-panel-heading').off('click');
            $(currentModule + '.left-panel-heading').click(function(e) {
                let className = this.className;
                
                for(let i = 1; i <= panelCount; i++) {
                    $(currentModule + ".mobile-return-label").css("display", "block");
                    if(className === "left-panel-heading _" + String(i)) {
                        $(currentModule + ".right-panel._" + String(i)).removeClass("right-panel-inactive");
                        $(currentModule + ".right-panel._" + String(i)).addClass("right-panel-active");
                        
                        $(currentModule + ".left-panel-container").addClass("left-panel-container-mobile");
                        $(currentModule + ".left-panel-container").addClass("left-panel-container-inactive");
                        $(currentModule + ".left-panel-container").removeClass("left-panel-container-active");
                        $(currentModule + ".right-panel-container").css("min-height", String(leftPanelWidth)+"px");
                        
                    }
                }
                $("html, body").scrollTop($(currentModule + ".mobile-return-label").offset().top);
            });

            $(currentModule + '.mobile-return-label').click(function(e) {
                $(currentModule + ".mobile-return-label").css("display", "none");
                $(currentModule + ".right-panel").addClass("right-panel-inactive");
                $(currentModule + ".right-panel").removeClass("right-panel-active");
                
                $(currentModule + ".left-panel-container").removeClass("left-panel-container-mobile");
                $(currentModule + ".left-panel-container").addClass("left-panel-container-active");
                $(currentModule + ".left-panel-container").removeClass("left-panel-container-inactive");
                $(currentModule + ".right-panel-container").css("min-height", "fit-content");
                $(currentModule + ".right-panel-inactive").css("top", "52px");
                $("html, body").scrollTop(top);
            });
            $(currentModule + ".right-panel").removeClass("right-panel-inactive");
        }
        else { // desktop
            if(previousWidth <= mobileWidth) { // run when resizing from mobile width to desktop width
                $(currentModule + ".right-panel").css("display", "none");
                $(currentModule + ".left-panel-container").css("display", "block");
                $(currentModule + ".right-panel").removeClass("right-panel-mobile");
                $(currentModule + ".left-panel-container").removeClass("left-panel-container-mobile");
                $(currentModule + ".left-panel-title").css("width", "466px");
                $(currentModule + ".right-panel-container").css("min-height", "fit-content");
                $(currentModule + ".left-panel-container").removeClass("left-panel-container-inactive")
                $(currentModule + ".right-panel").removeClass("right-panel-inactive");
                defaultSelected(1);
            }

            $(currentModule + ".mobile-return-label").css("display", "none");
            $(currentModule + ".left-panel-heading-inner._" + String(panelCount)).css("border-bottom", "1px solid transparent");

            $(currentModule + '.left-panel-heading').off('click');
            $(currentModule + '.left-panel-heading').click(function(e) {
                let className = this.className;

                for(let i = 1; i <= panelCount; i++) {
                    if(className === "left-panel-heading _" + String(i)) {
                        selected(i, currentModule);
                    }
                    else {
                        clearSelected(i, j, currentModule);
                    }
                }
                $(currentModule + ".left-panel-heading-inner._" + String(panelCount)).css("border-bottom", "1px solid transparent");
            });
        }
    }
    return previousWidth = currentWidth;
}

function defaultSelected(i=1, anchor="") {
    $(".right-panel._" + String(i)).css("display", "block");
    $(".left-panel-heading._" + String(i)).css("background-color", "#309f762b");
    $(".left-panel-heading._" + String(i)).css("border-top-right-radius", "32px");
    $(".left-panel-heading._" + String(i)).css("border-bottom-right-radius", "32px");
    $(".left-panel-heading-inner._" + String(i)).css("border-bottom", "1px solid transparent");
}

function selected(i, currentModule) {
    $(currentModule + ".right-panel._" + String(i)).css("display", "block");
    $(currentModule + ".left-panel-heading._" + String(i)).css("background-color", "#309f762b");
    $(currentModule + ".left-panel-heading._" + String(i)).css("border-top-right-radius", "32px");
    $(currentModule + ".left-panel-heading._" + String(i)).css("border-bottom-right-radius", "32px");
    $(currentModule + ".left-panel-heading-inner._" + String(i)).css("border-bottom", "1px solid transparent");
    $(currentModule + ".left-panel-heading-inner._" + String(i-1)).css("border-bottom", "1px solid transparent");
}

function clearSelected(i, j, currentModule) {
    $(currentModule + ".right-panel._" + String(i)).css("display", "none");
    $(currentModule + ".left-panel-heading._" + String(i)).css("border-top-right-radius", "0");
    $(currentModule + ".left-panel-heading._" + String(i)).css("border-bottom-right-radius", "0");

    let backgroundColor = $(".module-two-panel-selector-container._" + j).css("background-color");
    $(currentModule + ".left-panel-heading._" + String(i)).css("background-color", backgroundColor);
}
