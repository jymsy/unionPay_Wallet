// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

var url = 'https://youhui.95516.com/wm-non-biz-web/restlet/bill/billStatus?billId=D00000000046940&brandId=70557&billTp=1&cityCd=210200&version=1.0&source=1';
var isActivated = false;
var isInitialized=false;

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show(left) {

  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

  var opt = {
    type: "basic",
    title: hour + time[2] + ' ' + period,
    message: "沃尔玛免单开始了 还剩:" + left,
    iconUrl: "48.png",
  };
  chrome.notifications.create((new Date()).valueOf()+"", opt, function(notificationId){
    console.log('show notification');
  });
}

function parseResultList(result) {
    // console.log(result);
    var leftNum = result.data.leftNum;
    // show(leftNum);
    if (leftNum != "0") {
      show(leftNum);
    }    
}

function getData() {

  var xmlhttp = new XMLHttpRequest();
  var result;
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      parseResultList(JSON.parse(xmlhttp.responseText));
    }
  }
  xmlhttp.open("GET",url,true);
  // xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
  xmlhttp.setRequestHeader("accept","application/json");
  xmlhttp.send();
}

function onload() {
    if (window.Notification) {
      // While activated, show notifications at the display frequency.

      var interval = 0; // The display interval, in minutes.

      setInterval(function() {
        interval++;
        console.log(interval);
        if (isActivated) {
            getData();
        }
      }, 10000);
    }  
}

chrome.notifications.onClicked.addListener(function(notificationId){
  chrome.notifications.clear(notificationId);
});

chrome.notifications.onButtonClicked.addListener(function(notificationId,buttonIndex){
  chrome.notifications.clear(notificationId);
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    sendResponse({}); // snub them.
    if (request.cmd == 'start' && !isActivated) {
      isActivated = true;
      if (!isInitialized) {
        isInitialized = true;
        onload();
      }
    } else if (request.cmd == 'stop'){
      isActivated = false;
    }
    console.log('get request:'+request.cmd);
    
    
  }
);


