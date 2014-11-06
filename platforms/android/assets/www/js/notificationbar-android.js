 document.addEventListener("deviceready", appReady, false);

function appReady() {
    if (typeof plugins !== "undefined") {

      var now = new Date();
      now.setSeconds(now.getSeconds() + 10);
      console.log("Alarm Time Set " + now);

      plugins.localNotification.add({
        date : now,
        message : "Phonegap",
        ticker : "Y",
        repeatDaily : false,
        id : 4
      });
    }	
}
