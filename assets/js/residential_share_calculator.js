const valueInput_MCF = document.getElementById('valueInput_maternityCapitalFunds');
const slider_MCF = document.getElementById('slider_maternityCapitalFunds');
const sliderFill_MCF = document.getElementById('sliderFill_maternityCapitalFunds');
const min_MCF = 1;
const max_MCF = 1000000;
slider_MCF.min = min_MCF;
slider_MCF.max = max_MCF;
slider_MCF.value = min_MCF;
valueInput_MCF.value = min_MCF.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const valueInput_PP = document.getElementById('valueInput_propertyPrice');
const slider_PP = document.getElementById('slider_propertyPrice');
const sliderFill_PP = document.getElementById('sliderFill_propertyPrice');
const min_PP = 1;
const max_PP = 100000000;
slider_PP.min = min_PP;
slider_PP.max = max_PP;
slider_PP.value = min_PP;
valueInput_PP.value = min_PP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const valueInput_NFM = document.getElementById('valueInput_numberOfFamilyMembers');
const slider_NFM = document.getElementById('slider_numberOfFamilyMembers');
const sliderFill_NFM = document.getElementById('sliderFill_numberOfFamilyMembers');
const min_NFM = 2;
const max_NFM = 20;
slider_NFM.min = min_NFM;
slider_NFM.max = max_NFM;
slider_NFM.value = min_NFM;
valueInput_NFM.value = min_NFM.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const resultProportionMCF = document.getElementById('resultProportionMCF');
const resultRemainingSize = document.getElementById('resultRemainingSize');

let prev_MCF = valueInput_MCF.value;
let prev_PP = valueInput_PP.value;
let prev_NFM = valueInput_NFM.value;

const switchAccuracyButton = document.getElementById('switchAccuracyButton');
const approximate = 'Сменить на точное вычиление';
const exact = 'Сменить на приблеженное вычисление';

let isApproximateCalculation = true;
switchAccuracyButton.innerHTML = approximate;

switchAccuracyButton.addEventListener('click', function () {
    setStatusAccuracyButton(!isApproximateCalculation);
    updateResult();
});

function setStatusAccuracyButton(value) {
    isApproximateCalculation = value;
    if (value) {
        switchAccuracyButton.innerHTML = approximate;
    } else {
        switchAccuracyButton.innerHTML = exact;
    }
}

valueInput_MCF.addEventListener('focusin', clearFormattingInput);

valueInput_MCF.addEventListener('change', onChangingInput_MCF);
valueInput_MCF.addEventListener('focusout', onChangingInput_MCF);

slider_MCF.addEventListener('input', (e) => {
    const step = calculateStep(e.target.value, min_MCF, max_MCF, 2, 5);
    const value = Math.max(Math.round(e.target.value / step) * step, min_MCF);
    setValueInput(value.toString(), valueInput_MCF);
    setSliderFill(value, min_MCF, max_MCF, sliderFill_MCF);
    updateResult();
});

valueInput_PP.addEventListener('focusin', clearFormattingInput);

valueInput_PP.addEventListener('change', onChangingInput_PP);
valueInput_PP.addEventListener('focusout', onChangingInput_PP);

slider_PP.addEventListener('input', (e) => {
    const step = calculateStep(e.target.value, min_PP, max_PP, 2, 6);
    const value = Math.max(Math.round(e.target.value / step) * step, min_PP);
    setValueInput(value.toString(), valueInput_PP);
    setSliderFill(value, min_PP, max_PP, sliderFill_PP);
    updateResult();
});

valueInput_NFM.addEventListener('change', (e) => {
    const value = Number(e.target.value.replace(/\s/g, ''));
    if (value < min_NFM || value > max_NFM) {
        valueInput_NFM.value = prev_NFM;
        return;
    }
    slider_NFM.value = value;
    setSliderFill(value, min_NFM, max_NFM, sliderFill_NFM);
    prev_NFM = e.target.value;
    updateResult();
});

slider_NFM.addEventListener('input', (e) => {
    const value = e.target.value;
    valueInput_NFM.value = value;
    setSliderFill(value, min_NFM, max_NFM, sliderFill_NFM);
    updateResult();
});

function onChangingInput_PP(e) {
    const value = Number(e.target.value.replace(/\s/g, ''));
    if (value < min_PP || value > max_PP) {
        valueInput_PP.value = prev_PP;
        return;
    }
    slider_PP.value = value;
    setSliderFill(value, min_PP, max_PP, sliderFill_PP);
    setValueInput(value.toString(), valueInput_PP);
    prev_PP = e.target.value;
    updateResult();
}

function onChangingInput_MCF(e) {
    const value = Number(e.target.value.replace(/\s/g, ''));
    if (value < min_MCF || value > max_MCF) {
        valueInput_MCF.value = prev_MCF;
        return;
    }
    slider_MCF.value = value
    setValueInput(value.toString(), valueInput_MCF);
    setSliderFill(value, min_MCF, max_MCF, sliderFill_MCF);
    prev_MCF = e.target.value;
    updateResult();
}

function clearFormattingInput(e){
    e.target.value = e.target.value.replace(/\s/g, '');
}

function euclideanAlgorithm(a, b) {
    const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

    const gcdValue = gcd(a, b);

    const reducedNumerator = a / gcdValue;
    const reducedDenominator = b / gcdValue;

    return [reducedNumerator, reducedDenominator];
}

function updateResult() {
    const MCF = Number(valueInput_MCF.value.replace(/\s/g, ''));
    const PP = Number(valueInput_PP.value.replace(/\s/g, ''));
    const NFM = Number(valueInput_NFM.value);

    if(isApproximateCalculation) {
        approximateCalculation(MCF, PP, NFM);
    } else {
        exactCalculation(MCF, PP, NFM)
    }
}

function exactCalculation(MCF, PP, NFM) {
    let numerator = MCF;
    let denominator = PP * NFM;

    [numerator, denominator] = euclideanAlgorithm(numerator, denominator);

    let resultPMCF = numerator + '/' + denominator;
    let resultRS = (denominator - numerator * NFM) + '/' + denominator;

    resultProportionMCF.innerHTML = resultPMCF;
    resultRemainingSize.innerHTML = resultRS;
}

function approximateCalculation(MCF, PP, NFM) {
    const divide = MCF / PP / NFM;

    let power = 2;

    while (Math.trunc(divide * Math.pow(10, power)) === 0) {
        power++;
    }

    let tail = Math.pow(10, power);

    let resultPMCF = Math.round(divide * tail);
    let resultRS = tail - resultPMCF * NFM;

    resultProportionMCF.innerHTML = resultPMCF + '/' + tail;
    resultRemainingSize.innerHTML = resultRS + '/' + tail;
}

function setValueInput(value, valueInput) {
    const inputValue = value.replace(/\D/g, "");
    valueInput.value = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function setSliderFill(value, min, max, sliderFill) {
    const percent = (value - min) / (max - min) * 100;
    sliderFill.style.width = percent + '%';
}

function calculateStep(value, min, max, minPower, maxPower) {
    const range = max - min;
    const proportion = (value - min) / range;
    const power = minPower + proportion * (maxPower - minPower);
    const step = Math.pow(10, Math.floor(power));
    return Math.min(step, max - min);
}