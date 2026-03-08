jQuery(document).ready(function ($) {
    const resultsList = [];

    showHideQuestionnaire();
    uncheckInput();
    clickAccordion();
    displayCheckmark();
    togglePopup();
    useAverageValue();
    initCalculator(resultsList);
    displayInsights(resultsList);
});

// Display one question at a time
function showHideQuestionnaire() {
    let currentQuestion = 1;

    // Check if at least one option is selected before enabling the next button
    $(".question").each(function () {
        $(this).find(":input").change(function () {
            let isValid = $(this).closest(".question").find(":input:checked").length > 0;
            $("#nextButton").prop("disabled", !isValid);
        });
    });

    // Next button click event
    $("#nextButton").click(function () {
        $("#question" + currentQuestion).hide();
        currentQuestion++;
        if (currentQuestion <= 4) {
            $("#question" + currentQuestion).show();
            $("#backButton").show();
        }
        if (currentQuestion === 4) {
            $("#nextButton").hide();
            $("#submitButton").show();
        }
        // Disable next button if no option is selected
        $("#nextButton").prop("disabled", true);

        if ($("#question" + currentQuestion).find(":input:checked").length > 0) {
            $("#nextButton").prop("disabled", false);
        }
    });

    // Back button click event
    $("#backButton").click(function () {
        $("#question" + currentQuestion).hide();
        currentQuestion--;
        if (currentQuestion >= 1) {
            $("#question" + currentQuestion).show();
            if (currentQuestion === 1) {
                $("#backButton").hide();
            }
            if (currentQuestion < 4) {
                $("#nextButton").show();
                $("#submitButton").hide();
            }
        }

        $("#nextButton").prop("disabled", false);
    });
}

// Uncheck inputs if the none of the above input is selected
function uncheckInput() {
    $('#noneOfTheAbove').change(function () {
        if ($(this).is(':checked')) {
            $('input[name="utilityBill"]').prop('checked', false);
            $('#noneOfTheAbove').prop('checked', true);
        }
    });

    $('input[name="utilityBill"]').not('#noneOfTheAbove').change(function () {
        if ($(this).is(':checked')) {
            $('#noneOfTheAbove').prop('checked', false);
        }
    });

    $('#noneOfTheAboveConcession').change(function () {
        if ($(this).is(':checked')) {
            $('input[name="concessionCards"]').prop('checked', false);
            $('#noneOfTheAboveConcession').prop('checked', true);
        }
    });

    $('input[name="concessionCards"]').not('#noneOfTheAboveConcession').change(function () {
        if ($(this).is(':checked')) {
            $('#noneOfTheAboveConcession').prop('checked', false);
        }
    });
}

// Open and close accordion
function clickAccordion() {
    $.each($(".accordion-container"), function (i) {
        $(this).addClass("_" + (i + 1));
    });

    let moduleCount = $(".accordion-container").length;

    for (let j = 1; j <= moduleCount; j++) {
        let currentModule = ".accordion-container._" + j + " ";

        $(currentModule + '.questionnaire-accordion-head').click(function (e) {
            $(currentModule + ".questionnaire-accordion-head-icon").toggleClass("accordion-no-rotate accordion-rotate");
            $(currentModule + ".questionnaire-accordion-tail").toggleClass("accordion-open accordion-close");
        });
    }
}

function displayCheckmark() {
    $.each($(".form-checkbox-image"), function (i) {
        $(this).addClass("_" + (i + 1));
    });

    let moduleCount = $(".form-checkbox-image").length;

    for (let j = 1; j <= moduleCount; j++) {
        let currentModule = ".form-checkbox-image._" + j + " ";

        $(currentModule + ".form-input").click(function (e) {
            if($(currentModule + ".checkmark").hasClass("display")) {
                $(currentModule + ".checkmark").addClass("hide");
                $(currentModule + ".checkmark").removeClass("display");
            }
            else {
                $(currentModule + ".checkmark").addClass("display");
                $(currentModule + ".checkmark").removeClass("hide");
            }
        });
    }
}

function togglePopup() {
    $.each($(".question"), function (i) {
        $(this).addClass("_" + (i + 1));
    });

    let moduleCount = $(".question").length;

    for (let j = 1; j <= moduleCount; j++) {
        let currentModule = ".question._" + j + " ";

        $(currentModule + ".calculator-icon.questionmark-svg").click(function (e) {
            if($(currentModule + ".notice-overlay").hasClass("display")) {
                $(currentModule + ".notice-overlay").addClass("hide");
                $(currentModule + ".notice-overlay").removeClass("display");
            }
            else {
                $(currentModule + ".notice-overlay").addClass("display");
                $(currentModule + ".notice-overlay").removeClass("hide");
            }
        });
    }
}

function useAverageValue() {
    if ($('#cb-calculator').length) {
        fetch('/api/consumption')
            .then(response => response.json())
            .then(data => {
                $("#calculator-electricity .calculator-average").click(function (e) {
                    let obj = data.find(item => item.energyId === 1 && item.year === "2019");
                    $('.form-input-number[name="electricity"]').val(((obj.emissionAmount / obj.householdNum) * 278 * Math.pow(10, 6)).toFixed(3));
                    $('.form-input-number[name="electricity"]').trigger('input');
                    $(".next-btn").prop("disabled", false);
                    $(".submit-btn").prop("disabled", false);
                });
                $("#calculator-gas .calculator-average").click(function (e) {
                    let obj = data.find(item => item.energyId === 2 && item.year === "2019");
                    $('.form-input-number[name="gas"]').val(((obj.emissionAmount / obj.householdNum) * Math.pow(10, 9)).toFixed(3));
                    $('.form-input-number[name="gas"]').trigger('input');
                    $(".next-btn").prop("disabled", false);
                    $(".submit-btn").prop("disabled", false);

                });
        }).catch(error => console.error('Error fetching energy consumption data:', error));
    }
}

function initCalculator(resultsList) {
    $('#calculator-intro').show();
    
    $('#calculator-intro-button').click(function (e) {
        $('#calculator-intro').hide();
        handleCalculator(resultsList);
    });
}

function handleCalculator(resultsList) {
    var subPageIndex = 0;
    var pageList = ['main']
    var main = $('#calculator-main');
    var subOptions = [];
    var inputValueMap = {};

    main.show();
    $('.btn.btn-primary.next-btn').show();

    main.find(":input").change(function () {
        var checkedList = $(this).closest(".question").find(":input:checked");
        var isValid = checkedList.length > 0;
        subOptions = [];
        checkedList.each(function () {
            subOptions.push($(this).val());
        });
        $(".next-btn").prop("disabled", !isValid);
    });

    $('#cb-calculator input').on('input', function () {
        if (/^\s*\d+(\.\d+)?\s*$/.test($(this).val())) {
            var key = $(this).attr('name')
            var target = inputValueMap[key] = inputValueMap[key] || [];
            var val = $(this).val();

            if ($(this).attr('type') === 'checkbox') {
                if ($(this).is(':checked')) {
                    target.push(val)
                } else {
                    target = target.filter(function (value) {
                        return value !== val
                    })
                }
            } else {
                inputValueMap[key] = [val]
            }

            var currentPage = pageList[pageList.length - 1];
            if (inputValueMap[currentPage]) {
                var hasVal = inputValueMap[currentPage].length > 0
                $('.next-btn').prop("disabled", !hasVal);
                $('.submit-btn').prop("disabled", subPageIndex >= subOptions.length && !hasVal);
            }
        }
    })

    $('#cb-calculator button').click(function () {
        var isNext = $(this).hasClass("next-btn");
        var isPrev = $(this).hasClass("back-btn");
        var isSubmit = $(this).hasClass("submit-btn");
        // console.log(isNext, pageList, subPageIndex, subOptions);

        $('.question').hide();
        if (isNext) {
            var nextPage = subOptions[subPageIndex]
            $('#calculator-' + nextPage).show();
            subPageIndex++;
            pageList.push(nextPage);
        }
        else if (isPrev) {
            if (subPageIndex > 0) {
                subPageIndex--;
            }
            pageList.pop();
            $('#calculator-' + pageList[pageList.length - 1]).show();
        }
        else {
            calculateAll(inputValueMap, resultsList);
            $('#calculator-result').show();
            pageList.push('result');
        }

        var currentPage = pageList[pageList.length - 1];
        var hasVal = !!inputValueMap[currentPage] && inputValueMap[currentPage].length > 0
        $('.next-btn').prop("disabled", !hasVal);
        $('.submit-btn').prop("disabled", !hasVal);
        // console.log('hasVal: ', hasVal, currentPage);

        if (pageList.length > 1) {
            $('.back-btn').show();
        }
        else {
            $('.back-btn').hide();
        }

        var len = subOptions.length;
        len = isPrev ? len - 1 : len;
        if (subPageIndex >= len) {
            $('.next-btn').hide();
            if (currentPage === 'result') {
                $('.submit-btn').hide();
            }
            else {
                $('.submit-btn').show();
            }
        }
        else if (isSubmit) {
            $('.submit-btn').hide();
        }
        else {
            $('.next-btn').show();
            $('.submit-btn').hide();
        }
    });
}

function calculateAll(map, resultsList) {
    var total = BigNumber(0);
    var result = $('#calculator-result-num');

    var keyMap = {
        'Electricity': 'electricity',
        'Natural Gas': 'gas',
        'LPG': 'lpg',
        'Firewood': 'firewood',
    }

    jQuery.getJSON('/api/energy', function(data) {
        for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            var key = keyMap[ele['energyName']];
            var inputValue = map[key]
            if (!inputValue) {
                continue;
            }
            var Q = inputValue[0];
            var EC = BigNumber(ele['energyContentFactor'] || 1);

            if(key === "gas") {
                Q = Q / 1000;
                EC = 1;
            }
            else if(key === "lpg" || key === "firewood") {
                Q = Q / 1000;
            }

            var EF_SUM = BigNumber(ele['scopeOneEmission'] || 0).plus(ele['scopeTwoEmission'] || 0).plus(ele['scopeThreeEmission'] || 0);
            var resultNum = EF_SUM.times(EC).times(Q).div(1000);
            //console.log('resultNum: ', resultNum, "key: ", key, "ele: ", ele, "Q: ", Q, "EC: ", EC, "EF_SUM: ", EF_SUM);
            total = total.plus(resultNum);
            resultsList.push({"type": key, "input": inputValue[0], "emission": resultNum.toFixed(3)});
        }
        var totalResult = total.toFixed(3)
        //console.log('total: ', totalResult);
        result.text(totalResult).trigger("input");
    })
}

function displayInsights(results) {
    $("#calculator-result-num").on("input", function() {
        let total = 0;

        for(let i=0; i<results.length; i++) {
            category = results[i].type;

            if(category === "electricity") {
                $(".electricity-insight .insights-left-bottom-input").text(results[i].input + " kWh");
                $(".electricity-insight .insights-top-result").text(results[i].emission);
                $(".electricity-insight .insights-right-intro").text("Your household used " + results[i].input + " kWh of electricity");
                $(".electricity-insight.insights-left-item-container").show();
                $(".insights-right.electricity-insight").show();
            }
            else if(category === "gas") {
                $(".natural-gas-insight .insights-left-bottom-input").text(results[i].input + " MJ");
                $(".natural-gas-insight .insights-top-result").text(results[i].emission);
                $(".natural-gas-insight .insights-right-intro").text("Your household used " + results[i].input + " MJ of natural gas");
                $(".natural-gas-insight.insights-left-item-container").show();
                $(".insights-right.natural-gas-insight").show();
            }
            else if(category === "lpg") {
                $(".lpg-insight .insights-left-bottom-input").text(results[i].input + " kg");
                $(".lpg-insight .insights-top-result").text(results[i].emission);
                $(".lpg-insight .insights-right-intro").text("Your household used " + results[i].input + " kg of LPG");
                $(".lpg-insight.insights-left-item-container").show();
                $(".insights-right.lpg-insight").show();
            }
            else if(category === "firewood") {
                $(".firewood-insight .insights-left-bottom-input").text(results[i].input + " kg");
                $(".firewood-insight .insights-top-result").text(results[i].emission);
                $(".firewood-insight .insights-right-intro").text("Your household used " + results[i].input + " kg of firewood");
                $(".firewood-insight.insights-left-item-container").show();
                $(".insights-right.firewood-insight").show();
            }
            total += parseFloat(results[i].emission);
        }
        $(".insights-left-total-value").text(total);
        $(".calculator-insights-container").show();
        $(".recommendations-container").show();
        $(".action-container").show();
    });
}
