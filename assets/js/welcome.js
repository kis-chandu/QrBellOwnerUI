const baseUrl = "https://qrbell-env.eba-8c7fvwmj.ap-northeast-1.elasticbeanstalk.com/qrbell/";

var otpBlock = document.getElementById('otpBlock');
var registerBlock = document.getElementById('registerBlock');
var submitButton = document.getElementById('submitButton');

var countyName;
var isdCode;
var phoneNumber;
var apiResponse;

function callApi(method, endPoint, data) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var request = {
        method: method,
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    fetch(baseUrl + endPoint, request)
        .then(response => response.text())
        .then(result => {
            apiResponse = result;
            console.log(result);
        })
        .catch(error => console.log('error', error));

    return apiResponse;
}

function requestOtp() {

    countryName = $("#phoneNumber").intlTelInput("getSelectedCountryData").name;
    isdCode = $("#phoneNumber").intlTelInput("getSelectedCountryData").dialCode;
    phoneNumber = $("#phoneNumber").val();

    //alert('Country Code : ' + isdCode + '\nPhone Number : ' + phoneNumber + '\nCountry Name : ' + countyName);

    var data = JSON.stringify({
        "phoneNumber": phoneNumber,
        "isdCode": isdCode,
        "country": countryName
    });

    apiResponse = callApi('POST', 'getOtp', data);

    otpBlock.style.display = 'block';
}


function submitOtp() {

    document.getElementById("phoneNumber").readOnly = true;

    var otp = $("#otp").val();

    var data = JSON.stringify({
        "isdCode": isdCode,
        "phoneNumber": phoneNumber,
        "otp": otp
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var request = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    fetch(baseUrl + 'validate', request)
        .then(response => response.text())
        .then(result => {
            const obj = JSON.parse(result);
            performSubmitOtpAction(obj);

            //apiResponse = result;
            //console.log(result);
        })
        .catch(error => console.log('error', error));

    //apiResponse = callApi('POST','validate',data);//TODO:Uncomment
    // apiResponse = 'NEW';//TODO: Comment this line
    // obj.status = 'EXISTING';
    // performSubmitOtpAction(obj);

    console.log("Response for Validate OTP: " + apiResponse);

    // if(apiResponse=='INVALID'){
    //         alert('Invalid OTP ! Please enter correct phone number and OTP.');
    //     }

    // if(apiResponse=='NEW'){
    //     console.log('NEW User')
    //     registerBlock.style.display ='block';
    //     submitButton.style.display ='block';
    // }

    // if(apiResponse == 'EXISTING'){
    //     location.replace("/thankYou?phone="+isdCode+phoneNumber);
    // }
}

function performSubmitOtpAction(obj) {

    console.log('Inside performSubmitOtpAction ' + obj.status);

    var userStatus = obj.status;

    if (userStatus == 'INVALID') {
        alert('Invalid OTP ! Please enter correct phone number and OTP.');
    }

    if (userStatus == 'NEW') {
        console.log('NEW User')
        registerBlock.style.display = 'block';
        submitButton.style.display = 'block';
    } else if (userStatus == 'EXISTING' || userStatus == 'TRIAL' || userStatus == 'LICENSED') {
        setupLocalStorage(obj);
        location.replace("/thankYou");
    }

    // if(userStatus == 'EXISTING'){
    //     location.replace("/thankYou?phone="+isdCode+phoneNumber);
    // }

}

function registerUser() {

    var name = $("#name").val();
    var emailId = $("#email").val();
    var door = $("#door").val();

    var data = JSON.stringify({
        "name": name,
        "emailId": emailId,
        "phoneNumber": phoneNumber,
        "doorName": door,
        "isdCode": isdCode,
        "country": countryName
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var request = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    };

    fetch(baseUrl + 'register', request)
        .then(response => response.text())
        .then(result => {
            console.log('Register Result', result);
            const obj = JSON.parse(result);

            setupLocalStorage(obj);
            apiResponse = result;
            console.log(result);

            console.log('localStorage', localStorage);
            location.replace("/thankYou");//?firstname="+name+"&phone="+phoneNumber);

        })
        .catch(error => console.log('error', error));

    //apiResponse = callApi('POST','register',data);

    console.log("Register response: " + apiResponse);

}

function setupLocalStorage(obj) {
    localStorage.clear();
    localStorage.setItem('name', obj.name);
    localStorage.setItem('isdCode', obj.isdCode);
    localStorage.setItem('phoneNumber', obj.phoneNumber);
    localStorage.setItem('userStatus', obj.status)
    localStorage.setItem('trialExpiryDate', obj.trialExpiryDate);
}

function hideDisplay() {
    otpBlock.style.display = 'none';
    registerBlock.style.display = 'none';
    submitButton.style.display = 'none';
}

function populateIsdCode() {

    var code = "+91"; // Assigning value from model.
    $('#phoneNumber').val(code);
    $('#phoneNumber').intlTelInput({
        autoHideDialCode: true,
        autoPlaceholder: "ON",
        dropdownContainer: document.body,
        formatOnDisplay: true,
        hiddenInput: "full_number",
        initialCountry: "auto",
        nationalMode: true,
        placeholderNumberType: "MOBILE",
        //preferredCountries: ['US'],
        separateDialCode: true
    });
    /*$('#btnSubmit').on('click', function () {
        var code = $("#phoneNumber").intlTelInput("getSelectedCountryData").dialCode;
        var phoneNumber = $('#phoneNumber').val();
        var name = $("#phoneNumber").intlTelInput("getSelectedCountryData").name;
        alert('Country Code : ' + code + '\nPhone Number : ' + phoneNumber + '\nCountry Name : ' + name);
    });*/

}

function  startUp(){
    hideDisplay();
    populateIsdCode();
}
