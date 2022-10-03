
const qrBellHost = 'http://localhost:8080/qrbell/';
var name;
var phone;
var apiResponse;

var callBlock = document.getElementById('callBlock');
var qrCodeBlock = document.getElementById('qrCodeBlock');
var thankYouBlock = document.getElementById('thankYouBlock');

/*function callApi(method, endPoint, data){

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
}*/

function hideBlock(){
    callBlock.style.display = 'none';
}

function getUrlParams(){
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get('firstname');
    phone = urlParams.get('phone');
}

function getName(){
    if(window.location.search){
        $("#qr_bell_owner").html(name);
    }
}

function getQrCode(){

console.log('QR Code Requesting for number '+phone);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "phoneNumber": phone
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    var img = document.getElementById('qrCodeImage');

    fetch(qrBellHost+"generateQrCode", requestOptions)
        .then(response => response.text())
        .then(result => {
            var imgSrc = "data:image/png;base64, "+result;
            img.src = imgSrc;
            //console.log(result);
            })
        .catch(error => console.log('error', error));

}

var navigator = navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
var myStream;
var myCall;

function answer(){
    Android.answerCall();
    if(myCall){
        myCall.answer(myStream);
        myCall.on("stream",connectCall);
        $("#call_notification_popup").modal("hide");
    }
}

function disconnect(){
    if(myCall){
        myCall.close();
        //myCall.on("stream",connectCall);
        $("#call_notification_popup").modal("hide");
    }
    qrCodeBlock.style.display = 'block';
    thankYouBlock.style.display = 'block';
}

function connectCall(remoteStream){
    $("#my_local_video").removeClass("before_call").addClass("after_call");
    $("#my_remote_video").removeClass("after_call").addClass("before_call");
    let video = document.getElementById("my_remote_video");
    if("srcObject" in video){
        video.srcObject = remoteStream;
    }else{
        video.src = URL.createObjectURL(remoteStream);
    }
}

function peerSetup(){

   const peer = new Peer(phone);

   console.log('Peer set up for number '+phone);

   peer.on("call",(call)=>{
    callBlock.style.display = 'block';
    let scope = {audio:true, video:true};
    navigator.mediaDevices.getUserMedia(scope).then((stream)=>{
        let video = document.getElementById("my_local_video");
        myStream = stream;
        if("srcObject" in video){
            video.srcObject = stream;
        }else{
            video.src = URL.createObjectURL(stream);
        }
    }).catch((err)=>{
    console.log(err)
    })
    $("#call_notification_popup").modal("show");
    myCall = call;
    qrCodeBlock.style.display = 'none';
    thankYouBlock.style.display = 'none';
  })
}

