import Phaser from 'phaser'
import Player from './Player'
import MyPlayer from './MyPlayer'
import { sittingShiftData } from './Player'
import WebRTC from '../web/WebRTC'
import { GameEvent } from '../events/EventCenter'
import { phaserEvents } from '../PhaserGame'
import Game from '../scenes/Game'

export default class OtherPlayer extends Player {
  private targetPosition: [number, number]
  private lastUpdateTimestamp?: number
  private connectionBufferTime = 0
  private connected = false
  private playContainerBody: Phaser.Physics.Arcade.Body
  private myPlayer?: MyPlayer

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    playerName: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, id, frame)
    this.targetPosition = [x, y]
    this.x = x
    this.y = y

    this.playerNameText.setText(playerName)
    this.playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
  }

  setConnected(connected: boolean) {
    console.log(`set connected of player ${this.playerId} to ${connected}`)
    this.connected = connected
    if (!this.connected) this.connectionBufferTime = 0
  }

  resetConnectionBufferTime() {
    this.connectionBufferTime = 0
  }

  makeCall(myPlayer: MyPlayer, webRTC: WebRTC) {
    this.myPlayer = myPlayer
    //   console.log('Checking conditions:', {
    //     connected: this.connected,
    //     connectionBufferTime: this.connectionBufferTime,
    //     myPlayerReadyToConnect: myPlayer.readyToConnect,
    //     thisReadyToConnect: this.readyToConnect,
    //     myPlayerMediaConnected: myPlayer.mediaConnected,
    //     thisMediaConnected: this.mediaConnected,
    //     myPlayerIsPlayerInMeeting: myPlayer.isPlayerInMeeting(),
    //     thisIsInMeeting: this.isInMeeting,
    //     myPlayerId: myPlayer.getPlayerId(),
    //     thisPlayerId: this.playerId
    // });
    if (
      !this.connected &&
      this.connectionBufferTime >= 750 &&
      myPlayer.readyToConnect &&
      this.readyToConnect &&
      myPlayer.mediaConnected &&
      this.mediaConnected &&
      !myPlayer.isPlayerInMeeting() &&
      !this.isInMeeting &&
      myPlayer.getPlayerId()! > this.playerId
    ) {
      // console.log(myPlayer.getPlayerId() + " ------- " + this.playerId)
      console.log(
        'OtherPlayer::makeCall ' +
        myPlayer.playerNameText.text +
        ' connect ' +
        this.playerNameText.text
      )
      // console.log(`OtherPlayer::makeCall myplayer id: ${myPlayer.getPlayerId()}, otherPlayerID: ${this.playerId}`)
      webRTC.connectToNewUser(this.playerId, this.playerNameText.text)
      this.connected = true
      this.connectionBufferTime = 0
    }
  }

  updateOtherPlayer(field: string, value: number | string | boolean) {
    switch (field) {
      case 'playerName':
        if (typeof value === 'string') {
          this.playerNameText.setText(value)
        }
        break

      case 'x':
        if (typeof value === 'number') {
          this.targetPosition[0] = value
        }
        break

      case 'y':
        if (typeof value === 'number') {
          this.targetPosition[1] = value
        }
        break

      case 'anim':
        if (typeof value === 'string') {
          this.anims.play(value, true)
        }
        break

      case 'readyToConnect':
        if (typeof value === 'boolean') {
          this.readyToConnect = value
        }
        break

      case 'changeMediaStream':
        // console.log(`player ${this.playerId} change media stream1`)
        const check = WebRTC.getInstance()?.removeIfUserIsInPeers(this.playerId)
        WebRTC.getInstance()?.removeIfUserIsInOnCalledPeers(this.playerId)
        // console.log(check)
        if (typeof value === 'number' && check) {
          this.connected = false
          this.connectionBufferTime = 0
          // console.log(`player ${this.playerId} change media stream2`)
          // WebRTC.getInstance()?.deleteVideoStream(this.playerId)
          // WebRTC.getInstance()?.deleteOnCalledVideoStream(this.playerId)
        }
        if (WebRTC.getInstance()?.getPeers.length == 0) {
          Game.getInstance()?.resetAllOtherPlayerWaitBuffer()
        }
        break

      case 'mediaConnected':
        if (typeof value === 'boolean') {
          console.log(
            `OtherPlayer::updateOtherPlayer user ${this.playerId} change mediaConnected to ${value}`
          )
          this.mediaConnected = value
          if (this.mediaConnected) {
            this.connectionBufferTime = 0
          }
          if (!this.mediaConnected) {
            if (this.connected) this.connected = false
            WebRTC.getInstance()?.deleteVideoStream(this.playerId)
            WebRTC.getInstance()?.deleteOnCalledVideoStream(this.playerId)
          }
        }
        break
      case 'isInMeeting':
        if (typeof value === 'boolean') {
          this.isInMeeting = value
        }
        break
      case 'playerTexture':
        if (typeof value === 'string') {
          this.playerTexture = value
        }
    }
  }

  destroy(fromScene?: boolean) {
    this.playerContainer.destroy()

    super.destroy(fromScene)
  }

  /** preUpdate is called every frame for every game object. */
  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    // if Phaser has not updated the canvas (when the game tab is not active) for more than 1 sec
    // directly snap player to their current locations
    if (this.lastUpdateTimestamp && t - this.lastUpdateTimestamp > 750) {
      this.lastUpdateTimestamp = t
      this.x = this.targetPosition[0]
      this.y = this.targetPosition[1]
      this.playerContainer.x = this.targetPosition[0]
      this.playerContainer.y = this.targetPosition[1] - 30
      return
    }

    this.lastUpdateTimestamp = t
    this.setDepth(this.y) // change player.depth based on player.y
    const animParts = this.anims.currentAnim!.key.split('_')
    const animState = animParts[1]
    if (animState === 'sit') {
      const animDir = animParts[2]
      const sittingShift = sittingShiftData[animDir]
      if (sittingShift) {
        // set hardcoded depth (differs between directions) if player sits down
        this.setDepth(this.depth + sittingShiftData[animDir][2])
      }
    }

    const speed = 200 // speed is in unit of pixels per second
    const delta = (speed / 1000) * dt // minimum distance that a player can move in a frame (dt is in unit of ms)
    const maxDistance = 100 // prevent user is too far from target position
    let dx = this.targetPosition[0] - this.x
    let dy = this.targetPosition[1] - this.y

    if (dx > maxDistance || dy > maxDistance) {
      this.x = this.targetPosition[0]
      this.y = this.targetPosition[1]
      this.playerContainer.x = this.targetPosition[0]
      dx = 0
      this.playerContainer.y = this.targetPosition[1] - 30
      dy = 0
    } else {
      // if the player is close enough to the target position, directly snap the player to that position
      if (Math.abs(dx) < delta) {
        this.x = this.targetPosition[0]
        this.playerContainer.x = this.targetPosition[0]
        dx = 0
      }
      if (Math.abs(dy) < delta) {
        this.y = this.targetPosition[1]
        this.playerContainer.y = this.targetPosition[1] - 30
        dy = 0
      }
    }

    // if the player is still far from target position, impose a constant velocity towards it
    let vx = 0
    let vy = 0
    if (dx > 0) vx += speed
    else if (dx < 0) vx -= speed
    if (dy > 0) vy += speed
    else if (dy < 0) vy -= speed

    // update character velocity
    this.setVelocity(vx, vy)
    this.body!.velocity.setLength(speed)
    // also update playerNameContainer velocity
    this.playContainerBody.setVelocity(vx, vy)
    this.playContainerBody.velocity.setLength(speed)

    // while currently connected with myPlayer
    // if myPlayer and the otherPlayer stop overlapping, delete video stream
    if (this.connectionBufferTime < 750) this.connectionBufferTime += dt
    if (this.connected) {
      if (!this.body!.embedded && this.body!.touching.none && this.connectionBufferTime >= 750) {
        // if (this.x < 610 && this.y > 515 && this.myPlayer!.x < 610 && this.myPlayer!.y > 515) return
        phaserEvents?.emit(GameEvent.PLAYER_DISCONNECTED, this.playerId)
        this.connectionBufferTime = 0
        this.connected = false
        // } else if (!this.mediaConnected && this.connectionBufferTime >= 750) {
        //   phaserEvents?.emit(GameEvent.PLAYER_DISCONNECTED, this.playerId)
        //   this.connectionBufferTime = 0
        //   this.connected = false
      } else if (this.isInMeeting) {
        phaserEvents?.emit(GameEvent.PLAYER_DISCONNECTED, this.playerId)
        this.connectionBufferTime = 0
        this.connected = false
      }
    }
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      otherPlayer(
        x: number,
        y: number,
        texture: string,
        id: string,
        playerName: string,
        frame?: string | number
      ): OtherPlayer
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'otherPlayer',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    playerName: string,
    frame?: string | number
  ) {
    const sprite = new OtherPlayer(this.scene, x, y, texture, id, playerName, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    const collisionScale = [6, 4]
    sprite
      .body!.setSize(sprite.width * collisionScale[0], sprite.height * collisionScale[1])
      .setOffset(
        sprite.width * (1 - collisionScale[0]) * 0.5,
        sprite.height * (1 - collisionScale[1]) * 0.5 + 17
      )

    return sprite
  }
)
