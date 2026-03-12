let audioBlob=null;
let recorder;
let chunks=[];

const uploadBtn=document.getElementById("uploadBtn");
const fileInput=document.getElementById("fileInput");
const micBtn=document.getElementById("micBtn");
const preview=document.getElementById("audioPreview");

uploadBtn.onclick=()=>fileInput.click();

fileInput.onchange=(e)=>{

audioBlob=e.target.files[0];

preview.src=URL.createObjectURL(audioBlob);

};

micBtn.onclick=async()=>{

const stream=await navigator.mediaDevices.getUserMedia({audio:true});

recorder=new MediaRecorder(stream);

recorder.start();

chunks=[];

recorder.ondataavailable=e=>{
chunks.push(e.data);
};

recorder.onstop=()=>{

audioBlob=new Blob(chunks,{type:"audio/wav"});

preview.src=URL.createObjectURL(audioBlob);

};

setTimeout(()=>{
recorder.stop();
},5000);

};

document.getElementById("transcribeBtn").onclick=async()=>{

if(!audioBlob){
alert("Upload or record audio first");
return;
}

document.getElementById("loader").style.display="block";

const formData=new FormData();

formData.append("audio",audioBlob,"audio.wav");

const response=await fetch("/transcribe",{
method:"POST",
body:formData
});

const data=await response.json();

document.getElementById("loader").style.display="none";

document.getElementById("output").innerText=data.text;

};