var powerManagement = {
  acquireWakeLock: function(callback) {
    //alert(device.platform);
    try{
      //alert(wakelocked === false && device.platform.match(/^android/gi) != null);
      if(wakelocked === false && device.platform.match(/^android/gi) != null){
        //alert("executing");
        cordova.exec(
          function(){
            //alert("wakelock!");
            if(typeof(callback) == "function"){
              callback();

            }
          },
          function(err) {
            //do nothing
          },
          "PowerManagement",
          "acquireWakeLock",
          []
        );
      }
      else{
        //alert("damnit");
      }
    } catch(e){
      // catch the error to prevent breakage, though we don't do anything
      alert(e);
      alert("this is an error");
    }
  },
  releaseWakeLock: function() {
    try {
      if(wakelocked === true && device.platform.match(/^android/gi)){
        cordova.exec(
          function(){
            if(typeof(callback) == "function"){
              callback();
            }
          },
          function(err) {
            // Do nothing....
          },
          "PowerManagement",
          "releaseWakeLock",
          []
        );
      }
    } catch(e){
     // catch the error to prevent breakage, though we don't do anything
    }
  }
};

module.exports = powerManagement;