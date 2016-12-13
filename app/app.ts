class WebRTCApp{

    webRTC: ThorIO.Client.WebRTC;
    proxy: ThorIO.Client.Proxy;
    onReady: () =>  void
    
    onLocalStream: (stream:MediaStream) => void
    onRemoteStream: (stream:MediaStream,participant:ThorIO.Client.WebRTCConnection) => void
    onRemoteStreamLost : (id:string) => void
   
    constructor(private url:string){
        // create a WebRTC config
        let config = {
            iceTransports: 'all',
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };
        // connect to the backend ( signal protocol )
        let factory = new ThorIO.Client.Factory(url,["contextBroker"]);
        
        // when connected , hook up things..
        factory.OnOpen = (proxy:ThorIO.Client.Proxy) => {
            this.proxy = proxy;

            this.proxy.OnOpen  = () =>{
                this.onReady();
            }

            this.webRTC = new ThorIO.Client.WebRTC(this.proxy,null);

            this.webRTC.OnLocalSteam = (stream:MediaStream) =>{
                   this.onLocalStream(stream);
            }
            this.webRTC.OnRemoteStreamlost = (streamId:string,peerId:string) => {
                this.onRemoteStreamLost(streamId);
                
            }
            this.webRTC.OnRemoteStream = (stream:MediaStream,rtcConnection:ThorIO.Client.WebRTCConnection) =>{
                this.onRemoteStream(stream,rtcConnection);
            }
            
            this.webRTC.OnContextChanged = (context:string) => {
                this.webRTC.Context = context;
                this.webRTC.ConnectContext();
            }
            
            this.proxy.Connect();

        }
    }
    getParticipants():Array<ThorIO.Client.WebRTCConnection>{
        return this.webRTC.Peers
    }

    joinConference(room:string){
        this.webRTC.ChangeContext(room)
        
    }
    addMediaStream(stream:MediaStream){
            this.webRTC.AddLocalStream(stream);
    }

}