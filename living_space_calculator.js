const valueInput_livingArea = document.getElementById('valueInput_livingArea');
const min_LivingArea = 1;
const max_LivingArea = 100000;
valueInput_livingArea.value = min_LivingArea.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const valueInput_sizeCoOwnerShare = document.getElementById('valueInput_sizeCoOwnerShare');
const min_sizeCoOwnerShare = 0;
const max_sizeCoOwnerShare = 1;
valueInput_sizeCoOwnerShare.value = '1 / 10';

let prev_livingArea = valueInput_livingArea.value;
let prev_sizeCoOwnerShare = valueInput_sizeCoOwnerShare.value;

valueInput_livingArea.addEventListener('focusin', clearFormattingInput);
valueInput_livingArea.addEventListener('change', onChangingInput_livingArea);
valueInput_livingArea.addEventListener('focusout', onChangingInput_livingArea);

valueInput_sizeCoOwnerShare.addEventListener('focusin', clearFormattingInput);
valueInput_sizeCoOwnerShare.addEventListener('change', onChangingInput_sizeCoOwnerShare);
valueInput_sizeCoOwnerShare.addEventListener('focusout', onChangingInput_sizeCoOwnerShare);

const result = document.getElementById('result');

function clearFormattingInput(e){
    e.target.value = e.target.value.replace(/\s/g, '');
}

function setValueInput(value, valueInput) {
    const inputValue = value.replace(/\D/g, "");
    valueInput.value = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function onChangingInput_livingArea(e) {
    const value = Number(e.target.value.replace(/\s/g, ''));
    if (value < min_LivingArea || value > max_LivingArea) {
        valueInput_livingArea.value = prev_livingArea;
        return;
    }
    setValueInput(value.toString(), valueInput_livingArea);
    prev_livingArea = e.target.value;
    updateResult();
}

function onChangingInput_sizeCoOwnerShare(e) {
    const value = e.target.value.replace(/\s/g, '');
    const valueArray = value.split('/');
    if (valueArray.length !== 2) {
        valueInput_sizeCoOwnerShare.value = prev_sizeCoOwnerShare;
        return;
    }
    const numerator = Number(valueArray[0]);
    const denominator = Number(valueArray[1]);
    const division = numerator / denominator;
    if (division < min_sizeCoOwnerShare || division >= max_sizeCoOwnerShare) {
        valueInput_sizeCoOwnerShare.value = prev_sizeCoOwnerShare;
        return;
    }
    valueInput_sizeCoOwnerShare.value = numerator + ' / ' + denominator;
    prev_sizeCoOwnerShare = e.target.value;
    updateResult();
}

function updateResult() {
    const livingArea = Number(valueInput_livingArea.value.replace(/\s/g, ''));
    const sizeCoOwnerShareArray = valueInput_sizeCoOwnerShare.value.replace(/\s/g, '').split('/');
    const sizeCoOwnerShare = Number(sizeCoOwnerShareArray[0]) / Number(sizeCoOwnerShareArray[1]);

    const resultValue = (livingArea * sizeCoOwnerShare).toFixed(2);

    result.innerHTML = resultValue.toString();
    if (resultValue >= 6) {
        result.classList.add('acceptValue');
        result.classList.remove('declineValue');
    } else {
        result.classList.remove('acceptValue');
        result.classList.add('declineValue');
    }
}