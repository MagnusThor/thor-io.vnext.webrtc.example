var WebRTCApp = (function () {
    function WebRTCApp(url) {
        var _this = this;
        this.url = url;
        // create a WebRTC config
        var config = {
            iceTransports: 'all',
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };
        // connect to the backend ( signal protocol )
        var factory = new ThorIO.Client.Factory(url, ["contextBroker"]);
        // when connected , hook up things..
        factory.OnOpen = function (proxy) {
            _this.proxy = proxy;
            _this.proxy.OnOpen = function () {
                _this.onReady();
            };
            _this.webRTC = new ThorIO.Client.WebRTC(_this.proxy, null);
            _this.webRTC.OnLocalSteam = function (stream) {
                _this.onLocalStream(stream);
            };
            _this.webRTC.OnRemoteStreamlost = function (streamId, peerId) {
                _this.onRemoteStreamLost(streamId);
            };
            _this.webRTC.OnRemoteStream = function (stream, rtcConnection) {
                _this.onRemoteStream(stream, rtcConnection);
            };
            _this.webRTC.OnContextChanged = function (context) {
                _this.webRTC.Context = context;
                _this.webRTC.ConnectContext();
            };
            _this.proxy.Connect();
        };
    }
    WebRTCApp.prototype.getParticipants = function () {
        return this.webRTC.Peers;
    };
    WebRTCApp.prototype.joinConference = function (room) {
        this.webRTC.ChangeContext(room);
    };
    WebRTCApp.prototype.addMediaStream = function (stream) {
        this.webRTC.AddLocalStream(stream);
    };
    return WebRTCApp;
}());
//# sourceMappingURL=app.js.map