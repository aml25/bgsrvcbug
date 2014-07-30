/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 /*
    TODO:
        1) shuffle the prompts
        2) add interval warnings for the study (halfway warning)
        3) got error code: 3 (this is resolved, the phone didn't have internet connection)
        4) need to make the prompts an array of objects, not strings.  I need to keep track of the order of each prompt even after they are shuffled... this should be saved in the filename

 */

var wakelocked = false;

var counter;
var count;
var startTime;
var intervalTime;
var promptWaitTime = 60; //in seconds

var UID = parseInt((Math.random()*10) + (Math.random()*100) + (Math.random()*1000) + (Math.random()*10000) + (Math.random()*Math.random()*1000));
console.log("user ID = " + UID);

var promptIndex = 0;
var promptSetIndex = 0;

var failedUploads = [];

var prompts = [ 
                {
                    "type":"average_speed",
                    "prompt":[ "You want to know your average speed for this workout",
                                "You want to know how fast you have been going on average",
                                "You want to know your average mile pace" ]
                }, 
                {
                    "type":"power",
                    "prompt":[ "You want to know how much power you are generating",
                                "You want to know how hard you are pedaling",
                                "You want to know how many watts you are generating" ]
                },
                {
                    "type":"cadence",
                    "prompt":[ "You want to know your RPM's",
                                "You want to know about your current cadence",
                                "You want to know what your cadence is" ]
                },
                {
                    "type":"stride_rate",
                    "prompt":[ "You want to know if you should be taking fewer steps",
                                "You want to know about your stride rate",
                                "You want to know if you should turn your legs over faster" ]
                },
                {
                    "type":"stride_length",
                    "prompt":[ "You want to know if you are taking long enough steps",
                                "You want to know if you should be taking shorter steps",
                                "You want to know about your stride length" ]
                },
                {
                    "type":"distance",
                    "prompt":[ "You want to know how far you have travelled",
                                "You want to know how many miles you have covered",
                                "You want to know your distance" ]
                },
                {
                    "type":"time",
                    "prompt":[ "You want to know how long you have been working out",
                                "You want to know how long you have been going",
                                "You want to know how much time you have spent exercising" ]
                },
                {
                    "type":"heart_rate",
                    "prompt":[ "You want to know your heart rate",
                                "You want to know how fast your heart is beating",
                                "You want to know how hard your heart is working" ]
                },
                {
                    "type":"stats",
                    "prompt":[ "You want an overview of all the relevant coaching information",
                                "You want a summary of all your data",
                                "You want a summary of all your stats" ]
                },
                {
                    "type":"answer_phone",
                    "prompt":[ "You have an incoming call from someone you want to talk to",
                                "You have an incoming call and you want to answer",
                                "You have an phone call coming in that you want to take" ]
                },
                {
                    "type":"ignore_phone",
                    "prompt":[ "You have an incoming call from someone you don’t want to talk to right now",
                                "You have an incoming call you do not want to answer",
                                "You have an incoming call you don’t want to take" ]
                },
                {
                    "type":"volume_control",
                    "prompt":[ "You want to make the system louder",
                                "You want to make the system quieter",
                                "You want to change the music volume" ]
                },
                {
                    "type":"battery",
                    "prompt":[ "You want to know how much battery life you have remaining",
                                "You want to know how much battery you have left",
                                "You want to know how much power you have left" ]
                },
                {
                    "type":"help",
                    "prompt":[ "You want to know what you can say to the system",
                                "You want to know what you can ask the system to do",
                                "You want to know what the system can do" ]
                }
            ];

//just run through the prompts array to make each prompt an object with "prompt" and "id"
for(var i in prompts){
    var myPromptsArray = []; // each index will be { "id": someID, "prompt" : "a prompt string" }
    for(var u in prompts[i].prompt){
        var newPromptObject = {};
        newPromptObject.id = u;
        newPromptObject.prompt = prompts[i].prompt[u];
        myPromptsArray.push(newPromptObject);
    }
    prompts[i].prompt = myPromptsArray;
}

//shuffle the prompts array
for(var i in prompts){
    shuffle(prompts[i].prompt);
}
shuffle(prompts);

function stopwatch(){
    count++;
    intervalTime = new Date();
    var timeDiff = (intervalTime - startTime)/1000;
    var seconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60); //remove seconds from the timDiff
    var minutes = Math.round(timeDiff % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    $("#time").text(minutes+":"+seconds);

    if(count % 2 == 0){
        speak(count);
    }

    if(count % promptWaitTime == 0){ //wait the time equal to "promptWaitTime" before speaking an utterance
        if(promptIndex < prompts.length){
            speak(prompts[promptIndex].prompt[promptSetIndex].prompt, function(){
                recordAudio(UID+"_utterance_"+promptSetIndex+"_"+prompts[promptIndex].type+"_"+prompts[promptIndex].prompt[promptSetIndex].id+".aac",8000);
                promptIndex++;
            });
        }
        else{
            if(promptSetIndex >= 2){ //end of session
                speak("Workout is over.  Thank you.", function(){
                    $("#toggleRecord").click();
                });
            }
            else{ // a prompt set has finished...
                var semanticPromptSetIndex = { 0:"first",1:"second",2:"third" };
                speak(semanticPromptSetIndex[promptSetIndex] + " round is over.  You can relax for about 5 minutes.", function(){
                    //clearInterval(counter);
                    disableTimer();
                    $("#time").addClass("restTime"); //visually indicate a rest
                    setTimeout(function(){
                        //counter = setInterval(stopwatch,1000);
                        go();
                        promptIndex = 0;
                        shuffle(prompts); //shuffle them up
                        promptSetIndex++; //add 1 to the prompt SET index, these are not shuffled, so each set for a single prompt will never repeat
                        var x = ((prompts.length - promptIndex) *  (3-promptSetIndex)) + ((2-promptSetIndex)*5);
                        speak("starting the " + semanticPromptSetIndex[promptSetIndex] + " round.  You have about " + x + " minutes left.");
                        $("#time").removeClass("restTime"); //remove the visual
                    }, 5 * 60 * 1000); //5 minutes
                });
            }
        }
    }
}

function speak(text,_callback){
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = "en_US";
    u.volume = "0.5";
    u.onend = _callback;
    //u.voiceURI = "Google UK English Male";
    //u.voiceURI = "English United Kingdom";

    console.log(u.lang);
    speechSynthesis.speak(u);
}

function uploadToServer(fileURL){
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }

    var fail = function (error) {
        //alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
        console.log(error);

        console.log("printing the error object");

        var keys = Object.keys(error);
        for(var i in keys){
            console.log(keys[i] + ": " + error[keys[i]]);
        }

        failedUploads.push(error.source);
        console.log("failed to upload, pushing it to the queue");
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "audio/mpeg";

    options.chunkedMode = false;

    var params = { 'uid': UID};
    options.params = params;

    var headers = { 'Authorization': 'Basic ' + btoa('uxndg:uxndgf00bar') };
    options.headers = headers;
    console.log(headers.Authorization);

    var ft = new FileTransfer();
    ft.upload(fileURL, encodeURI("https://ux-ndg.com/fightclub/prototypes/utterances/upload.php"), win, fail, options);
}

//monitor internet connection


// Record audio
//
function recordAudio(filename,duration) { //add a _callback paramter here (this will be a speak function likely)
    var src = filename;
    $("#time").toggleClass("recording");
    var mediaRec = new Media(src,
        // success callback
        function() {
            console.log("recordAudio():Audio Success");
            uploadToServer("file://127.0.0.1/sdcard/"+src);
        },

        // error callback
        function(err) {
            console.log("recordAudio():Audio Error: "+ err.code);
        }
    );

    // Record audio
    mediaRec.startRecord();

    // Stop recording after 3 seconds
    setTimeout(function() {
        mediaRec.stopRecord();
        $("#time").toggleClass("recording");
    }, duration);
}

function initialize(){
    bindEvents();
}

function bindEvents(){
    window.addEventListener("orientationchange", orientationChange, true);
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('online', onOnline, false);
}

function onOnline(){
    var myFailedUploads = failedUploads;
    failedUploads = [];

    for(var i in myFailedUploads){
        console.log("uploaded a failed file: " + myFailedUploads[i]);
        uploadToServer(myFailedUploads[i]);
    }
}

function orientationChange(){
    fullSizeImage($("#bg"));
}

/*var onShake = function(){
    console.log("shake occurred");

    if(promptIndex < prompts.length && $("#toggleRecord").hasClass("active") ){
        speak(prompts[promptIndex].prompt[promptSetIndex].prompt, function(){
            recordAudio(UID+"_utterance_"+promptSetIndex+"_"+prompts[promptIndex].type+"_"+prompts[promptIndex].prompt[promptSetIndex].id+".aac",8000);
            promptIndex++;
        });
    }
    else{
        if(promptSetIndex >= 2){
                speak("Workout is over.  Thank you.", function(){
                    $("#toggleRecord").click();
                });
        }
        else{
            promptIndex = 0;
            shuffle(prompts); //shuffle them up
            promptSetIndex++; //add 1 to the prompt SET index, these are not shuffled, so each set for a single prompt will never repeat
        }
    }
}*/

function onDeviceReady(){
    console.log("ready");

    /*window.plugins.insomnia.keepAwake();
    console.log("keeping awake")*/


    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false );


    $("#toggleRecord").click(function(){
        $(this).toggleClass("active");
        $("#counter").toggleClass("fadeIn");

        if($(this).hasClass("active")){
            $(this).text("end session");
            startTime = new Date();

            speak("workout is starting now.");
            count = 0;
            promptIndex = 0;
            //clearInterval(counter);
            //counter = setInterval(stopwatch,1000);
            disableTimer(); //stop the timer just to kick things off
            go();
        }
        else{
            $(this).text("begin session");
            //clearInterval(counter);
            disableTimer();
            $("#time").text("00:00");
        }
    })

    fullSizeImage($("#bg"));

    //shake.startWatch(onShake);

    //set the user id on the screen for us to see
    $("#userID").text(UID);

    /***BACKGROUND SERVICE***************************/
    var serviceName = 'com.red_folder.phonegap.plugin.backgroundservice.MyService';
    var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');
    myService = factory.create(serviceName);

    //go();
    /***************************BACKGROUND SERVICE***/

}

/***BACKGROUND SERVICE******************************/
function getStatus() {
    myService.getStatus(function(r){displayResult(r)}, function(e){displayError(e)});
}

function displayResult(data) {
    alert("Is service running: " + data.ServiceRunning);
}

function displayError(data) {
    alert("We have an error");
}

function updateHandler(data){
    if (data.LatestResult != null && data.LatestResult.Message != undefined) {
        try {
            /*console.log(data.LatestResult.Message);*/
            
            //setTimeout(function(){
            //    speak(secondsCounter++);
                console.log(data.LatestResult.Message);
                stopwatch();
            //},3000);
        } catch (err) {
        }
    }
}

var secondsCounter = 0;

function go() {
    myService.getStatus(function(r){startService(r)}, function(e){handleError(e)});
};

function startService(data) {
    if (data.ServiceRunning) {
        enableTimer(data);
    } else {
        myService.startService(function(r){enableTimer(r)}, function(e){handleError(e)});
    }
}

function enableTimer(data) {
    /*if (data.TimerEnabled) {
        console.log("timer is already enabled");
        registerForUpdates(data);
    } else {*/
        console.log("timer not enabled, starting it");
        myService.enableTimer(1000, function(r){registerForUpdates(r)}, function(e){handleError(e)});
    //}
}

function disableTimer() {
    myService.disableTimer( function(r){updateHandler(r)}, function(e){handleError(e)});
};

function registerForUpdates(data) {
    if (!data.RegisteredForUpdates) {
        myService.registerForUpdates(function(r){updateHandler(r)}, function(e){handleError(e)});
    }
}

function handleError(err){
    console.log(err);
}
/******************************BACKGROUND SERVICE***/



//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};



//resize the background image
function fullSizeImage($selection){
    //get the ratio of the image
    var imageRatio = $selection.width() / $selection.height();
    console.log("imageRatio = " + imageRatio);

    //get the screen ratio
    var screenRatio = $(window).width() / $(window).height();
    console.log("screenRatio = " + screenRatio);

    //if the image is wider than the screen
    if(imageRatio > screenRatio){
        $selection.height($(window).height()); //set image height to screen height
        $selection.width($(window).height()*imageRatio); //set the correct width based on image ratio
    }

    //if the screen is wider than the image
    else{
        $selection.width($(window).width()); //set the image width to the screen width
        $selection.height($(window).width()/imageRatio); //set the correct image height based on the image ratio
    }
}
