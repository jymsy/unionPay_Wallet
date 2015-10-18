// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

var url = 'https://youhui.95516.com/wm-non-biz-web/restlet/bill/billStatus?billId=D00000000046940&brandId=70557&billTp=1&cityCd=210200&version=1.0&source=1';


/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show(body,id) {

  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  // new Notification(hour + time[2] + ' ' + period, {
  //   icon: '48.png',
  //   body: body
  // });
  var opt = {
    type: "list",
    title: hour + time[2] + ' ' + period,
    message: "Primary message to display",
    iconUrl: "48.png",
    items: body,
    buttons: [{title:'去看看'}]
  };
  chrome.notifications.create((new Date()).valueOf()+':'+id, opt, function(notificationId){
    console.log('show notification');
  });
}

function showNotice(value,date){
  var body = [];
        body.push({title:"ID", message:value['labels'][1]});
        body.push({title:"Summary", message:value['labels'][2]});
        body.push({title:"Priority & Severity", message:value['labels'][5] + ' | '+value['labels'][6]});

        date = new Date(date).toLocaleString();
        body.push({title:"Modified Date", message:date});
        show(body, value['labels'][1]);
}

function parseResultList(result) {
    console.log(result);
    // var lastDate=0;
    // items.forEach(function(value, index) {
    //   var date = parseInt(value['labels'][7]);
    //   if (localStorage.lastItemDate == 1) {
    //     if (date > lastDate) {
    //       lastDate = date;
    //     }
    //     showNotice(value,date);

    //   } else if(date > localStorage.lastItemDate) {
    //     localStorage.lastItemDate = date;
    //     showNotice(value,date);
    //   }


    // });
    // if (localStorage.lastItemDate == 1) {
    //   localStorage.lastItemDate = lastDate;
    // }
    
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
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
  xmlhttp.setRequestHeader("accept","text/json");
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


