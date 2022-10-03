const baseUrl ="http://localhost:8080/qrbell/";

var otpBlock = document.getElementById('otpBlock');
var registerBlock = document.getElementById('registerBlock');
var submitButton = document.getElementById('submitButton');

var phoneNumber;
var apiResponse;

function callApi(method, endPoint, data){

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var request = {
            method: method,
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };

    fetch("http://localhost:8080/qrbell/"+endPoint, request)
            .then(response => response.text())
            .then(result => {
                apiResponse = result;
                console.log(result);
                })
                .catch(error => console.log('error', error));

    return apiResponse;
}

function requestOtp(){

    phoneNumber = $("#phoneNumber").val();

    var data = JSON.stringify({
        "phoneNumber": phoneNumber
    });

    //apiResponse = callApi('POST','getOtp',data); //TODO:Uncomment

    otpBlock.style.display = 'block';
}


function submitOtp(){

    var otp = $("#otp").val();

    var data = JSON.stringify({
        "phoneNumber": phoneNumber,
        "otp": otp
    });

    //apiResponse = callApi('POST','validate',data);//TODO:Uncomment
    apiResponse = 'EXISTING';//TODO: Comment this line

    console.log("Response for Validate OTP: "+apiResponse);

    if(apiResponse=='INVALID'){
            alert('Invalid OTP ! Please enter correct phone number and OTP.');
        }

    if(apiResponse=='NEW'){
        registerBlock.style.display ='block';
        submitButton.style.display ='block';
    }

    if(apiResponse == 'EXISTING'){
        location.replace("/thankYou?phone="+phoneNumber);
    }
}

function registerUser(){

    var name = $("#name").val();
    var emailId = $("#email").val();
    var door = $("#door").val();

    var data = JSON.stringify({
        "name": name,
        "emailId": emailId,
        "phoneNumber": phoneNumber,
        "doorName": door
    });

    apiResponse = callApi('POST','register',data);

    console.log("Register response: "+apiResponse);

    location.replace("/thankYou?firstname="+name+"&phone="+phoneNumber);
}

function hideDisplay(){
    otpBlock.style.display = 'none';
    registerBlock.style.display ='none';
    submitButton.style.display = 'none';
}
