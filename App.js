import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {StatusBar, SafeAreaView} from 'react-native';

class UFE extends Component {
  onLoadSDKEnd = () => {
    this.webView.injectJavaScript(`
            if (typeof window.WemapSDK === 'undefined') {
                window.origin = document.location.origin;
                var options = {
                  routingmode: 'walking',
                  dist: 'ufe',
                  initialbearing: 0,
                  pitch: 0,
                  allowgeolocationprompt: false,
                  width: '100%',
                  height: '100%',
                  arviewenabled: true,
                };
                window.livemap = wemap.v1.createLivemap(document.getElementById('map_container'), options, false);
                window.livemap.waitForReady().then(function() {
                  window.ReactNativeWebView.postMessage('Ready');
                  window.livemap.addEventListener('pinpointClick', function(e) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'CLICK', data: e}));
                      window.livemap.setCenter({lat: e.pinpoint.latitude, lng: e.pinpoint.longitude});
                  });
                  // window.livemap.forceARViewMode("ON");
                  
                });
                
                window.WemapSDK = {
                  enableCamera: function() {
                      window.ReactNativeWebView.postMessage('ENABLE_CAMERA');
                  },
                  disableCamera: function() {
                      window.ReactNativeWebView.postMessage('DISABLE_CAMERA');
                  },
                };
                // fix unsupported return type issue
                true;

                
                // window.location.reload();
    
            }
        `);
  };

  _onCameraEnabled = () => {
    this.webView.injectJavaScript(`
            window.wemap.v1.onCameraEnabled();
            true;
        `);
  };

  _onCameraDisabled = () => {
    this.webView.injectJavaScript(`
            window.wemap.v1.onCameraDisabled();
            true;
        `);
  };

  _onMessage = event => {
    if (event.nativeEvent.data) {
      if (event.nativeEvent.data === 'ENABLE_CAMERA') {
        this._onCameraEnabled();
      }

      if (event.nativeEvent.data === 'DISABLE_CAMERA') {
        this._onCameraDisabled();
      }
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          position: 'absolute',
          top: 0,
          bottom: 0,
        }}>
        <StatusBar hidden />

        <WebView
          ref={view => {
            this.webView = view;
          }}
          source={{uri: 'https://livemap.getwemap.com/embed.html'}}
          onLoadEnd={this.onLoadSDKEnd}
          originWhitelist={['*']}
          javaScriptEnabled
          allowUniversalAccessFromFileURLs
          allowFileAccess
          mixedContentMode="always"
          domStorageEnabled
          useWebKit
          XXXgeolocationEnabled={false}
          style={{backgroundColor: 'transparent'}}
          allowsFullscreenVideo
          onMessage={this._onMessage}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          //sourceUri={this.website}
          allowFileAccessFromFileURLs={true}
          // injectedJavaScript={`window.localStorage.setItem('wemap_token', '${UFEToken.access_token}'); window.localStorage.setItem('wemap_refresh', '${UFEToken.refresh_token}')`}
          //onLoad={this.webView.injectJavaScript(`alert('hello')`)}
        />
      </SafeAreaView>
    );
  }
}

export default UFE;
