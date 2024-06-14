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
  private isActive: boolean

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
    this.isActive = true
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
      if (!this.isActive) return
      if (!this.onCalledPeers.has(call.peer)) {
        console.log('WebRTC::initialize answer call from ', call.metadata?.fullname)
        call.answer(this.myStream)

        // Access fullname from call metadata
        const fullname = call.metadata?.fullname || 'Unknown User'

        // Create elements
        const uiBlock = document.createElement('div')
        const video = document.createElement('video')
        const p = document.createElement('p')
        p.textContent = fullname
        uiBlock.appendChild(video)
        uiBlock.appendChild(p)
        this.onCalledPeers.set(call.peer, { call, uiBlock, video })

        call.on('stream', (userVideoStream) => {
          this.addVideoStream(uiBlock, video, userVideoStream, false)
        })
      }
      // on close is triggered manually with deleteOnCalledVideoStream()
    })
  }

  disconnect() {
    this.cleanupStream()

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

    if (this.myVideo) this.myVideo.remove()
    this.isActive = false
  }

  // check if permission has been granted before
  checkPreviousPermission() {
    this.isActive = true
    // const permissionName = 'microphone' as PermissionName
    // navigator.permissions?.query({ name: permissionName }).then((result) => {
    //   if (result.state === 'granted') this.getUserMedia(false)
    // })
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
        // const hasCam = stream.getVideoTracks().length > 0
        // const hasMic = stream.getAudioTracks().length > 0
        // console.log(`has cam: ${hasCam}, has mic: ${hasMic}`)
        console.log(
          `WebRTC:: success get user media, video: ${video} ${
            stream.getVideoTracks().length
          }, audio: ${audio}`
        )
        store.dispatch(setMicrophoneON(audio))
        store.dispatch(setCameraON(video))
        store.dispatch(setMediaConnected(true))
        this.network.mediaConnected(true)
        this.cleanupStream()
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
        console.log(`WebRTC:: failed get user media, video: ${video}, audio: ${audio}`)
        this.cleanupStream()
        if (this.myVideo) {
          this.myVideo.remove()
          this.myVideo = undefined
        }
        store.dispatch(setMediaConnected(false))
        this.network.mediaConnected(false)
        // if (video && store.getState().user.cameraON) {
        store.dispatch(setCameraON(false))
        // }
        // if (audio && store.getState().user.microphoneON) {
        store.dispatch(setMicrophoneON(false))
        // }
        // if (!video && !audio) {
        //   store.dispatch(setCameraON(false))
        //   store.dispatch(setMicrophoneON(false))
        // }
        if (alertOnError) window.alert('No webcam or microphone found, or permission is blocked')
      })
  }

  removeUserVideo() {
    console.log('WebRTC::removeUserVideo remove user video')
    this.myVideo?.remove()
    this.myVideo = undefined
    this.myStream = undefined
  }
  cleanupStream() {
    if (this.myStream) {
      console.log('WebRTC::cleanupStream')
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
          metadata: { fullname: store.getState().user.playerName },
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

  public turnMic(isOn: boolean) {
    this.getUserMedia(store.getState().user.cameraON, isOn, false)
  }
  public turnCam(isOn: boolean) {
    this.getUserMedia(isOn, store.getState().user.microphoneON, false)
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
