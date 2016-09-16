/**
 * @providesModule OneSignal
 */

'use strict';

import { NativeModules, NativeEventEmitter, NetInfo, Platform } from 'react-native';
import invariant from 'invariant';

//SHOULD remove 'RCT' from the beginning as React omits it from the name
const { RNOneSignal } = NativeModules;

var OneSignal = {
	onError: false,
	onNotificationReceived: false,
	onNotificationOpened: false,
	onNotificationsRegistered: false
};

//Holds an array of stringified OSNotification objects
var _pendingNotificationsReceived = [];

//Holds an array of stringified OSNotificationResult objects
var _pendingNotificationsOpened = [];

var DEVICE_NOTIF_RECEIVED_EVENT = 'remoteNotificationReceived';
var DEVICE_NOTIF_OPENED_EVENT = 'remoteNotificationOpened';
var DEVICE_NOTIF_REG_EVENT = 'remoteNotificationsRegistered';
var DEVICE_IDS_AVAILABLE = 'idsAvailable';

/**
 * Configure local and remote notifications
 * @param {Object}		options
 * @param {function}	options.onNotificationOpened - Fired when a remote notification is received.
 * @param {function} 	options.onError - None
 */             
OneSignal.configure = function(options: Object) {
	if ( typeof options.onError !== 'undefined' ) {
		this.onError = options.onError;
	}

	if ( typeof options.onNotificationReceived !== 'undefined' ) {
		this.onNotificationReceived = options.onNotificationReceived;

		if (_pendingNotificationsReceived.length > 0) {
			var notification = _pendingNotificationsReceived.pop();
			this._onNotificationReceived(JSON.parse(notification));
		}
	}

	if ( typeof options.onNotificationOpened !== 'undefined' ) {
		this.onNotificationOpened = options.onNotificationOpened;

		if (_pendingNotificationsOpened.length > 0) {
			var openResult = _pendingNotificationsOpened.pop();
			this._onNotificationOpened(JSON.parse(openResult));
		}
	}

	if( typeof options.onNotificationsRegistered !== 'undefined' ) {
		this.onNotificationsRegistered = options.onNotificationsRegistered;
	}

	if( typeof options.onIdsAvailable !== 'undefined' ) {
		this.onIdsAvailable = options.onIdsAvailable;
	}

	function handleConnectionStateChange(isConnected) {
    	if(!isConnected) return;
    	RNOneSignal.configure();
    	NetInfo.isConnected.removeEventListener('change', handleConnectionStateChange);
  	}

	NetInfo.isConnected.fetch().then(isConnected => {
		if(isConnected) return RNOneSignal.configure();
		NetInfo.isConnected.addEventListener('change', handleConnectionStateChange);
	}).catch((args)=>this.onError(args));

};

/* Unregister */
OneSignal.unregister = function() {
	this.onNotificationOpened = false;
};

OneSignal.requestPermissions = function(permissions) {
	var requestedPermissions = {};
	if (Platform.OS == 'ios') {
		if (permissions) {
			requestedPermissions = {
				alert: !!permissions.alert,
				badge: !!permissions.badge,
				sound: !!permissions.sound
			};
		} else {
			requestedPermissions = {
				alert: true,
				badge: true,
				sound: true
			};
		}
		RNOneSignal.requestPermissions(requestedPermissions);
	} else {
		console.log("This function is not supported on Android");
	}
};

OneSignal.registerForPushNotifications = function(){
	if (Platform.OS == 'ios') {
		RNOneSignal.registerForPushNotifications();
	} else {
		console.log("This function is not supported on Android");
	}
};

OneSignal.checkPermissions = function(callback: Function) {
	if (Platform.OS == 'ios') {
		invariant(
			typeof callback === 'function',
			'Must provide a valid callback'
		);
		RNOneSignal.checkPermissions(callback);
	} else {
		console.log("This function is not supported on Android");
	}
};

//notification is a stringified JSON object of type OSNotification
OneSignal._onNotificationReceived = function(notification) {
	if ( this.onNotificationReceived === false) {
		_pendingNotificationsReceived.push(notification);
		return;
	}
	this.onNotificationReceived(JSON.parse(notification));
};

//result is a stringified JSON object of type OSNOtificationResult
OneSignal._onNotificationOpened = function(openResult) {
	if ( this.onNotificationOpened === false ) {
		_pendingNotificationsOpened.push(openResult);
		return;
	}
	this.onNotificationOpened(JSON.parse(openResult));
};

OneSignal._onNotificationsRegistered = function(payload) {
	if ( this.onNotificationsRegistered === false ) {
		return;
 	}
 	this.onNotificationsRegistered(payload);
};

OneSignal.sendTag = function(key, value) {
	RNOneSignal.sendTag(key, value);
};

OneSignal.sendTags = function(tags) {
	RNOneSignal.sendTags(tags || {});
};

OneSignal.getTags = function(next) {
	RNOneSignal.getTags(next);
};

OneSignal.deleteTag = function(key) {
	RNOneSignal.deleteTag(key);
};

OneSignal.enableVibrate = function(enable) {
	if (Platform.OS == 'android') {
		RNOneSignal.enableVibrate(enable);
	} else {
		console.log("This function is not supported on iOS");
	}
};

OneSignal.enableSound = function(enable) {
	if (Platform.OS == 'android') {
		RNOneSignal.enableSound(enable);
	} else {
		console.log("This function is not supported on iOS");
	}
};


OneSignal.setSubscription = function(enable) {
	RNOneSignal.setSubscription(enable);
};

OneSignal.promptLocation = function() {
	//Supported in both iOS & Android
	RNOneSignal.promptLocation();
};

//Android only: Set Display option of the notifications. displayOption is of type OSInFocusDisplayOption
// 0 -> None, 1 -> InAppAlert, 2 -> Notification
OneSignal.inFocusDisplaying = function(displayOption) {
	if (Platform.OS == 'android') {
		RNOneSignal.inFocusDisplaying(displayOption);
	}
}

OneSignal.postNotification = function(contents, data, player_id) {
	if (Platform.OS == 'android') {
		RNOneSignal.postNotification(JSON.stringify(contents), JSON.stringify(data), player_id);
	} else {
		RNOneSignal.postNotification(contents, data, player_id);
	}
};

OneSignal.clearOneSignalNotifications = function() {
	if (Platform.OS == 'android') {
		RNOneSignal.clearOneSignalNotifications();
	} else {
		console.log("This function is not supported on iOS");
	}
};

OneSignal.cancelNotification = function(id) {
	if (Platform.OS == 'android') {
		RNOneSignal.cancelNotification(id);
	} else {
		console.log("This function is not supported on iOS");
	}
};

OneSignal.idsAvailable = function(idsAvailable) {
	console.log('Please use the onIdsAvailable event instead, it can be defined in the register options');
};

//Sends MD5 and SHA1 hashes of the user's email address (https://documentation.onesignal.com/docs/ios-sdk-api#section-synchashedemail)
OneSignal.syncHashedEmail = function(email) {
	RNOneSignal.syncHashedEmail(email);
}

OneSignal.setLogLevel = function(nsLogLevel, visualLogLevel) {
	RNOneSignal.setLogLevel(nsLogLevel, visualLogLevel);
}

// Listen to events of notification received, opened, device registered and IDSAvailable.
const OneSignalEvt = new NativeEventEmitter(RNOneSignal);

OneSignalEvt.addListener(DEVICE_NOTIF_RECEIVED_EVENT, (receivedResult) => { 
	if (OneSignal.onNotificationReceived) {
		const notification = JSON.parse(receivedResult.notification);
		OneSignal.onNotificationReceived(notification);
	}
});

OneSignalEvt.addListener(DEVICE_NOTIF_OPENED_EVENT, (openResult) => { 
	if (OneSignal.onNotificationOpened) {
		const result = JSON.parse(openResult.result);
		OneSignal.onNotificationOpened(result.notification);
	}
});

OneSignalEvt.addListener(DEVICE_NOTIF_REG_EVENT, (notifData) => { 
	if (OneSignal.onNotificationsRegistered)
		OneSignal.onNotificationsRegistered(notifData)
});

OneSignalEvt.addListener(DEVICE_IDS_AVAILABLE, (idsAvailable) => {
	if (OneSignal.onIdsAvailable)
		OneSignal.onIdsAvailable(idsAvailable)
});

module.exports = OneSignal;
