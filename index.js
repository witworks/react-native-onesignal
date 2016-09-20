/**
 * @providesModule RNOneSignal
 */

'use strict';

import { NativeModules, NativeEventEmitter, NetInfo, Platform } from 'react-native';
import invariant from 'invariant';

const { RNOneSignal } = NativeModules;
const OneSignalEmitter = new NativeEventEmitter(RNOneSignal);
const _notifHandlers = new Map();

var DEVICE_NOTIF_RECEIVED_EVENT = 'remoteNotificationReceived';
var DEVICE_NOTIF_OPENED_EVENT = 'remoteNotificationOpened';
var DEVICE_NOTIF_REG_EVENT = 'remoteNotificationsRegistered';
var DEVICE_IDS_AVAILABLE = 'idsAvailable';

class OneSignal	{

	static addEventListener(type, handler) {
		invariant(
			type === 'received' || type === 'opened' || type === 'registered' || type === 'ids',
			'OneSignal only supports `notification`, `register`, `open`, and `ids` events'
		);

		var listener;
		if (type === 'received') {
			listener = OneSignalEmitter.addListener(DEVICE_NOTIF_RECEIVED_EVENT, (receivedResult) => { 
				if (OneSignal.onNotificationReceived) {
					const notification = JSON.parse(receivedResult.notification);
					OneSignal.onNotificationReceived(notification);
				}
			});
		} else if (type === 'opened') {
			listener = OneSignalEmitter.addListener(DEVICE_NOTIF_OPENED_EVENT, (openResult) => { 
				if (OneSignal.onNotificationOpened) {
					const result = JSON.parse(openResult.result);
					OneSignal.onNotificationOpened(result.notification);
				}
			});
		} else if (type === 'registered') {
			listener = OneSignalEmitter.addListener(DEVICE_NOTIF_REG_EVENT, (notifData) => { 
				if (OneSignal.onNotificationsRegistered)
					OneSignal.onNotificationsRegistered(notifData)
			});
		} else if (type === 'ids') {
			listener = OneSignalEmitter.addListener(DEVICE_IDS_AVAILABLE, (idsAvailable) => {
				if (OneSignal.onIdsAvailable)
					OneSignal.onIdsAvailable(idsAvailable)
			});
		}
		_notifHandlers.set(handler, listener);
	}

	static removeEventListener(type, handler) {
		invariant(
			type === 'received' || type === 'opened' || type === 'registered' || type === 'ids',
			'PushNotificationIOS only supports `notification`, `register`, `open`, and `ids` events'
		);
		var listener = _notifHandlers.get(handler);
		if (!listener) {
		return;
		}
		listener.remove();
		_notifHandlers.delete(handler);
	}

	static requestPermissions(permissions) {
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
	}

	static configure() {
		NetInfo.isConnected.fetch().then(isConnected => {
			if(isConnected) return RNOneSignal.configure();
		}).catch((args)=>console.log(args));
	}

	static registerForPushNotifications() {
		if (Platform.OS == 'ios') {
			RNOneSignal.registerForPushNotifications();
		} else {
			console.log("This function is not supported on Android");
		}
	}

	static checkPermissions(callback) {
		if (Platform.OS == 'ios') {
			invariant(
				typeof callback === 'function',
				'Must provide a valid callback'
			);
			RNOneSignal.checkPermissions(callback);
		} else {
			console.log("This function is not supported on Android");
		}
	}

	static sendTag(key, value) {
		RNOneSignal.sendTag(key, value);
	}

	static sendTags(tags) {
		RNOneSignal.sendTags(tags || {});
	}

	static getTags(next) {
		RNOneSignal.getTags(next);
	}

	static deleteTag(key) {
		RNOneSignal.deleteTag(key);
	}

	static enableVibrate(enable) {
		if (Platform.OS == 'android') {
			RNOneSignal.enableVibrate(enable);
		} else {
			console.log("This function is not supported on iOS");
		}
	}

	static enableSound(enable) {
		if (Platform.OS == 'android') {
			RNOneSignal.enableSound(enable);
		} else {
			console.log("This function is not supported on iOS");
		}
	};


	static setSubscription(enable) {
		RNOneSignal.setSubscription(enable);
	};

	static promptLocation() {
		//Supported in both iOS & Android
		RNOneSignal.promptLocation();
	};

	//Android only: Set Display option of the notifications. displayOption is of type OSInFocusDisplayOption
	// 0 -> None, 1 -> InAppAlert, 2 -> Notification
	static inFocusDisplaying(displayOption) {
		if (Platform.OS == 'android') {
			RNOneSignal.inFocusDisplaying(displayOption);
		}
	}

	static postNotification(contents, data, player_id) {
		if (Platform.OS == 'android') {
			RNOneSignal.postNotification(JSON.stringify(contents), JSON.stringify(data), player_id);
		} else {
			RNOneSignal.postNotification(contents, data, player_id);
		}
	}

	static clearOneSignalNotifications() {
		if (Platform.OS == 'android') {
			RNOneSignal.clearOneSignalNotifications();
		} else {
			console.log("This function is not supported on iOS");
		}
	}

	static cancelNotification(id) {
		if (Platform.OS == 'android') {
			RNOneSignal.cancelNotification(id);
		} else {
			console.log("This function is not supported on iOS");
		}
	}

	static idsAvailable(idsAvailable) {
		console.log('Please use the onIdsAvailable event instead, it can be defined in the register options');
	}

	//Sends MD5 and SHA1 hashes of the user's email address (https://documentation.onesignal.com/docs/ios-sdk-api#section-synchashedemail)
	static syncHashedEmail(email) {
		RNOneSignal.syncHashedEmail(email);
	}

	static setLogLevel(nsLogLevel, visualLogLevel) {
		RNOneSignal.setLogLevel(nsLogLevel, visualLogLevel);
	}

}

module.exports = OneSignal;
