import Peer, { MediaConnection } from 'peerjs'
import Network from '../services/Network'
import store from '../stores'
import { setCameraON, setMediaConnected, setMicrophoneON } from '../stores/UserStore'
import { PEER_CONNECT_OPTIONS } from '../constant'
import Game from '../scenes/Game'

export default class WebRTC {
  private static instance: WebRTC | null = null; // Biến static instance

  private myPeer: Peer
  private peers = new Map<string, { call: MediaConnection; uiBlock: HTMLElement; video: HTMLVideoElement }>()
  private onCalledPeers = new Map<string, { call: MediaConnection; uiBlock: HTMLElement; video: HTMLVideoElement }>()
  private myVideoGrid = document.querySelector('.my-video-grid')
  private othersVideoGrid = document.querySelector('.others-video-grid')
  // private buttonGrid = document.querySelector('.button-grid')
  private myVideo = document.createElement('video')
  private myStream?: MediaStream
  private network: Network

  constructor(userId: string, network: Network) {
    console.log("Construct WebRTC")
    WebRTC.instance = this;
    const sanitizedId = this.replaceInvalidId(userId)
    this.myPeer = new Peer(sanitizedId, PEER_CONNECT_OPTIONS)
    this.network = network
    console.log('userId:', userId)
    console.log('sanitizedId:', sanitizedId)
    this.myPeer.on('error', (err) => {
      console.log(err.type)
      console.error(err)
    })

    // mute your own video stream (you don't want to hear yourself)
    this.myVideo.muted = true

    // config peerJS
    this.initialize()
  }

  static getInstance(): WebRTC | null {
    return WebRTC.instance;
  }

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id
  private replaceInvalidId(userId: string) {
    return userId.replace(/[^0-9a-z]/gi, 'G')
  }

  initialize() {
    this.myPeer.on('call', (call) => {
      if (!this.onCalledPeers.has(call.peer)) {
        console.log('answer call from ', call.metadata?.username)
        call.answer(this.myStream)

        // Access username from call metadata
        const username = call.metadata?.username || 'Unknown User';

        // Create elements
        const uiBlock = document.createElement('div');
        const video = document.createElement('video');
        const p = document.createElement('p');
        p.textContent = username;
        uiBlock.appendChild(video);
        uiBlock.appendChild(p);
        this.onCalledPeers.set(call.peer, { call, uiBlock, video })

        call.on('stream', (userVideoStream) => {
          this.addVideoStream(uiBlock, video, userVideoStream, false)
        })
      }
      // on close is triggered manually with deleteOnCalledVideoStream()
    })
  }

  disconnect() {
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
  }

  // check if permission has been granted before
  checkPreviousPermission() {
    const permissionName = 'microphone' as PermissionName
    navigator.permissions?.query({ name: permissionName }).then((result) => {
      if (result.state === 'granted') this.getUserMedia(false)
    })
  }

  getUserMedia(alertOnError = true) {
    // ask the browser to get user media
    navigator.mediaDevices
      ?.getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.myStream = stream
        this.addVideoStream(this.myVideo, this.myVideo, this.myStream, true)
        store.dispatch(setMicrophoneON(stream.getAudioTracks().length > 0))
        store.dispatch(setCameraON(stream.getVideoTracks().length > 0))
        store.dispatch(setMediaConnected(true))
        this.network.mediaConnected()
      })
      .catch((error) => {
        if (alertOnError) window.alert('No webcam or microphone found, or permission is blocked')
      })
  }

  // method to call a peer
  connectToNewUser(userId: string, username: string) {
    if (this.myStream) {
      const sanitizedId = this.replaceInvalidId(userId)
      if (!this.peers.has(sanitizedId)) {
        console.log('calling', username)
        const call = this.myPeer.call(sanitizedId, this.myStream, { metadata: { username: store.getState().user.playerName } })
        // Create elements
        const uiBlock = document.createElement('div');
        const video = document.createElement('video');
        const p = document.createElement('p');
        p.textContent = username;
        uiBlock.appendChild(video);
        uiBlock.appendChild(p);
        this.peers.set(sanitizedId, { call, uiBlock, video })

        call.on('stream', (userVideoStream) => {
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

  turnMic(isOn: boolean): boolean {
    if (!this.myStream) return false;
    let tracks = this.myStream.getAudioTracks()
    if (tracks.length == 0) return false;
    tracks.forEach((track) => track.enabled = isOn)
    return true;
  }
  turnCam(isOn: boolean): boolean {
    if (!this.myStream) return false;
    let tracks = this.myStream.getVideoTracks()
    if (tracks.length == 0) return false;
    tracks.forEach((track) => track.enabled = isOn)
    return true;
  }

  // // method to set up mute/unmute and video on/off buttons
  // setUpButtons() {
  //   const audioButton = document.createElement('button')
  //   audioButton.innerText = 'Mute'
  //   audioButton.addEventListener('click', () => {
  //     if (this.myStream) {
  //       const audioTrack = this.myStream.getAudioTracks()[0]
  //       if (audioTrack.enabled) {
  //         audioTrack.enabled = false
  //         audioButton.innerText = 'Unmute'
  //       } else {
  //         audioTrack.enabled = true
  //         audioButton.innerText = 'Mute'
  //       }
  //     }
  //   })
  //   const videoButton = document.createElement('button')
  //   videoButton.innerText = 'Video off'
  //   videoButton.addEventListener('click', () => {
  //     if (this.myStream) {
  //       const audioTrack = this.myStream.getVideoTracks()[0]
  //       if (audioTrack.enabled) {
  //         audioTrack.enabled = false
  //         videoButton.innerText = 'Video on'
  //       } else {
  //         audioTrack.enabled = true
  //         videoButton.innerText = 'Video off'
  //       }
  //     }
  //   })
  //   this.buttonGrid?.append(audioButton)
  //   this.buttonGrid?.append(videoButton)
  // }
}
