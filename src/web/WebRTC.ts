import Peer, { MediaConnection } from 'peerjs'
import Network from '../services/Network'
import store from '../stores'
import { setCameraON, setMediaConnected, setMicrophoneON } from '../stores/UserStore'
import { PEER_CONNECT_OPTIONS } from '../constant'
import Game from '../scenes/Game'

export default class WebRTC {
  private static instance: WebRTC | null = null // Biến static instance

  private myPeer: Peer
  private peers = new Map<
    string,
    { call: MediaConnection; uiBlock: HTMLElement; video: HTMLVideoElement }
  >()
  private onCalledPeers = new Map<
    string,
    { call: MediaConnection; uiBlock: HTMLElement; video: HTMLVideoElement }
  >()
  private myVideoGrid = document.querySelector('.my-video-grid')
  private othersVideoGrid = document.querySelector('.others-video-grid')
  // private buttonGrid = document.querySelector('.button-grid')
  private myVideo
  private myStream?: MediaStream
  private network: Network
  // private isActive: boolean

  constructor(userId: string, network: Network) {
    console.log('WebRTC::constructor Construct WebRTC')
    WebRTC.instance = this
    const sanitizedId = this.replaceInvalidId(userId)
    this.myPeer = new Peer(sanitizedId, PEER_CONNECT_OPTIONS)
    this.network = network
    console.log('WebRTC::constructor userId:', userId)
    console.log('WebRTC::constructor sanitizedId:', sanitizedId)
    this.myPeer.on('error', (err) => {
      console.log(err.type)
      console.error(err)
    })

    // config peerJS
    this.initialize()
    // this.isActive = true
  }

  static getInstance(): WebRTC | null {
    return WebRTC.instance
  }

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id
  private replaceInvalidId(userId: string) {
    return userId.replace(/[^0-9a-z]/gi, 'G')
  }

  initialize() {
    this.myPeer.on('call', (call) => {
      // if (!this.isActive) return
      // console.log(`user mic: ${store.getState().user.microphoneON}, user cam: ${store.getState().user.cameraON}`)
      // console.log(`receive call mic: ${this.myStream?.getAudioTracks().length} video: ${this.myStream?.getVideoTracks().length}`)
      if (!this.onCalledPeers.has(call.peer)) {
        // console.log('WebRTC::initialize answer call from ', call.metadata?.sender.fullname)
        call.answer(this.myStream)

        // Access fullname from call metadata
        const fullname = call.metadata?.sender.fullname || 'Unknown User'

        // Create elements
        const uiBlock = document.createElement('div')
        const video = document.createElement('video')
        const p = document.createElement('p')
        p.textContent = fullname
        uiBlock.appendChild(video)
        uiBlock.appendChild(p)
        this.onCalledPeers.set(call.peer, { call, uiBlock, video })

        call.on('stream', (userVideoStream) => {
          // console.log(`receive call mic: ${userVideoStream.getAudioTracks().length} video: ${userVideoStream.getVideoTracks().length}`)
          this.addVideoStream(uiBlock, video, userVideoStream, false)
        })
      }
      // on close is triggered manually with deleteOnCalledVideoStream()
    })
  }

  getPeers() {
    return this.peers
  }

  disconnect() {
    this.cleanupMyStream()

    this.peers.forEach((peer) => {
      peer.call.close()
      // peer.video.remove()
      peer?.uiBlock.remove()
    })
    this.peers.clear()

    this.onCalledPeers.forEach((onCalledPeer) => {
      onCalledPeer.call.close()
      // onCalledPeer.video.remove()
      onCalledPeer?.uiBlock.remove()
    })
    this.onCalledPeers.clear()

    if (this.myVideo) {
      this.myVideo.remove()
      this.myVideo = undefined
    }
    // this.isActive = false
  }

  // check if permission has been granted before
  checkPreviousPermission() {
    // this.isActive = true
    this.getUserMedia(store.getState().user.cameraON, store.getState().user.microphoneON, false)
  }

  getUserMedia(video: boolean, audio: boolean, alertOnError = true) {
    // ask the browser to get user media
    navigator.mediaDevices
      ?.getUserMedia({
        video: video,
        audio: audio,
      })
      .then((stream) => {
        store.dispatch(setMicrophoneON(audio))
        store.dispatch(setCameraON(video))
        store.dispatch(setMediaConnected(true))
        this.network.mediaConnected(true)

        Network.getInstance()?.resetMyMediaStream(Network.getInstance()?.mySessionId!)
        Game.getInstance()?.resetAllOtherPlayerWaitBuffer()
        this.peers.forEach((peer) => {
          // console.log(`disconnect peer in this.peers: fullname: ${peer.call.metadata.receiver.fullname}, playerId: ${peer.call.metadata.receiver.playerId}`)
          Game.getInstance()?.setOtherPlayerConnected(peer.call.metadata.receiver.playerId, false)
          // Network.getInstance()?.resetMyMediaStream(p.call.metadata.playerId)
          peer.call.close()
          peer?.uiBlock.remove()
        })
        this.peers.clear()
        this.onCalledPeers.forEach((peer) => {
          // console.log(`disconnect peer in this.onCalledPeers: ${peer.call.metadata.sender.fullname}`)
          // Game.getInstance()?.setOtherPlayerConnected(peer.call.metadata.sender.playerId, false)
          peer.call.close()
          peer?.uiBlock.remove()
        })
        this.onCalledPeers.clear()

        this.cleanupMyStream()
        this.myStream = stream

        // mute your own video stream (you don't want to hear yourself)
        if (this.myVideo) {
          this.myVideo.remove()
          this.myVideo = undefined
        }
        this.myVideo = document.createElement('video')
        this.myVideo.muted = true
        this.addVideoStream(this.myVideo, this.myVideo, this.myStream, true)
      })
      .catch((error) => {
        if (video || audio) {
          return
        }
        console.log(`WebRTC:: failed get user media, video: ${video}, audio: ${audio}`)
        // this.cleanupMyStream()
        store.dispatch(setMediaConnected(false))
        this.network.mediaConnected(false)
        store.dispatch(setCameraON(false))
        store.dispatch(setMicrophoneON(false))

        Network.getInstance()?.resetMyMediaStream(Network.getInstance()?.mySessionId!)
        Game.getInstance()?.resetAllOtherPlayerWaitBuffer()
        this.peers.forEach((peer) => {
          // console.log(`disconnect peer in this.peers: ${peer.call.metadata.receiver.fullname}`)
          Game.getInstance()?.setOtherPlayerConnected(peer.call.metadata.receiver.playerId, false)
          // Network.getInstance()?.resetMyMediaStream(p.call.metadata.playerId)
          peer.call.close()
          peer?.uiBlock.remove()
        })
        this.peers.clear()
        this.onCalledPeers.forEach((peer) => {
          // console.log(`disconnect peer in this.onCalledPeers: ${peer.call.metadata.sender.fullname}`)
          // Game.getInstance()?.setOtherPlayerConnected(peer.call.metadata.sender.playerId, false)
          peer.call.close()
          peer?.uiBlock.remove()
        })
        this.onCalledPeers.clear()

        this.cleanupMyStream()

        if (this.myVideo) {
          this.myVideo.remove()
          this.myVideo = undefined
        }

        if (alertOnError) window.alert('No webcam or microphone found, or permission is blocked')
      })
  }

  removeIfUserIsInPeers(playerId: string) {
    // console.log(playerId)
    const sanitizedId = this.replaceInvalidId(playerId)
    // console.log(this.peers.size)
    if (this.peers.has(sanitizedId)) {
      const peer = this.peers.get(sanitizedId)
      peer?.call.close()
      peer?.uiBlock.remove()
      this.peers.delete(sanitizedId)
      return true
    }
    // for (let p of this.peers.values()) {
      // console.log(`player ${p.call.metadata.receiver.playerId}---- ${p.call.metadata.receiver.fullname}`)
      //   if (p.call.metadata.receiver.playerId == playerId) {
      //     p.call.close();
      //     p.uiBlock.remove();
      //     return true
      //   }
    // }
    return false
  }

  removeIfUserIsInOnCalledPeers(playerId: string) {
    // console.log(playerId)
    const sanitizedId = this.replaceInvalidId(playerId)
    // console.log(this.onCalledPeers.size)
    if (this.onCalledPeers.has(sanitizedId)) {
      const peer = this.onCalledPeers.get(sanitizedId)
      peer?.call.close()
      peer?.uiBlock.remove()
      this.onCalledPeers.delete(sanitizedId)
      return true
    }
    // for (let p of this.onCalledPeers.values()) {
    //   console.log(`player ${p.call.metadata.sender.playerId}---- ${p.call.metadata.sender.fullname}`)
      // if (p.call.metadata.sender.playerId == playerId) {
      //   p.call.close();
      //   p.uiBlock.remove();
      //   this.onCalledPeers.delete()
      //   return true
      // }
    // }
    return false
  }

  removeUserVideo() {
    console.log('WebRTC::removeUserVideo remove user video')
    this.myVideo?.remove()
    this.myVideo = undefined
    this.myStream = undefined
  }
  cleanupMyStream() {
    if (this.myStream) {
      // console.log('WebRTC::cleanupStream')
      this.myStream.getTracks().forEach((track) => track.stop())
    }
  }

  // method to call a peer
  connectToNewUser(userId: string, fullname: string) {
    if (this.myStream) {
      const sanitizedId = this.replaceInvalidId(userId)
      if (!this.peers.has(sanitizedId)) {
        console.log('WebRTC::connectToNewUser calling', fullname)
        const call = this.myPeer.call(sanitizedId, this.myStream, {
          metadata: { sender: { fullname: store.getState().user.playerName, playerId: this.network.mySessionId }, receiver: { fullname, playerId: userId } },
        })
        // Create elements
        const uiBlock = document.createElement('div')
        const video = document.createElement('video')
        const p = document.createElement('p')
        p.textContent = fullname
        uiBlock.appendChild(video)
        uiBlock.appendChild(p)
        this.peers.set(sanitizedId, { call, uiBlock, video })

        call.on('stream', (userVideoStream) => {
          // console.log(`receive call mic: ${userVideoStream.getAudioTracks().length} video: ${userVideoStream.getVideoTracks().length}`)
          this.addVideoStream(uiBlock, video, userVideoStream, false)
        })

        // on close is triggered manually with deleteVideoStream()
      }
    }
  }

  // method to add new video stream to videoGrid div
  addVideoStream(block: HTMLElement, video: HTMLVideoElement, stream: MediaStream, isMe: boolean) {
    video.srcObject = stream
    video.playsInline = true
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    if (isMe && this.myVideoGrid) this.myVideoGrid.append(video)
    if (!isMe && this.othersVideoGrid) this.othersVideoGrid.append(block)
  }

  // method to remove video stream (when we are the host of the call)
  deleteVideoStream(userId: string) {
    const sanitizedId = this.replaceInvalidId(userId)
    if (this.peers.has(sanitizedId)) {
      console.log(`peers has id ${sanitizedId}, delete it`)
      const peer = this.peers.get(sanitizedId)
      peer?.call.close()
      // peer?.video.remove()
      peer?.uiBlock.remove()
      this.peers.delete(sanitizedId)
    }
  }

  // method to remove video stream (when we are the guest of the call)
  deleteOnCalledVideoStream(userId: string) {
    const sanitizedId = this.replaceInvalidId(userId)
    if (this.onCalledPeers.has(sanitizedId)) {
      const onCalledPeer = this.onCalledPeers.get(sanitizedId)
      onCalledPeer?.call.close()
      // onCalledPeer?.video.remove()
      onCalledPeer?.uiBlock.remove()
      this.onCalledPeers.delete(sanitizedId)
    }
  }

  public toggleMic() {
    this.getUserMedia(store.getState().user.cameraON, !store.getState().user.microphoneON, false)
  }
  public toggleCam() {
    this.getUserMedia(!store.getState().user.cameraON, store.getState().user.microphoneON, false)
  }
}
