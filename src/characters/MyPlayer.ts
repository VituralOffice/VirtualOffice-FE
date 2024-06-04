import Phaser from 'phaser'
import PlayerSelector from './PlayerSelector'
import { sittingShiftData } from './Player'
import Player from './Player'
import Network from '../services/Network'
import Chair from '../items/Chair'

import { phaserEvents, GameEvent } from '../events/EventCenter'
import store from '../stores'
import { NavKeys } from '../types/KeyboardState'
import { ItemType } from '../types/Items'
// import Meeting from '../items/Meeting'
import { PlayerBehavior } from '../types/PlayerBehaviour'
import Game from '../scenes/Game'
import { Meeting } from '../web/meeting/Meeting'

export default class MyPlayer extends Player {
  private playContainerBody: Phaser.Physics.Arcade.Body
  private chairOnSit?: Chair
  private forceLeaveCurrentChair?: boolean
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, id, frame)
    this.playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
  }

  getPlayerId() {
    if (this.playerId) return this.playerId
    return Network.getInstance()?.mySessionId
  }

  setPlayerName(name: string) {
    this.playerNameText.setText(name)
    phaserEvents.emit(GameEvent.MY_PLAYER_NAME_CHANGE, name)
    // store.dispatch(pushPlayerJoinedMessage(name))
  }

  setPlayerTexture(texture: string) {
    this.playerTexture = texture.toLowerCase()
    this.anims.play(`${this.playerTexture}_idle_down`, true)
    phaserEvents.emit(
      GameEvent.MY_PLAYER_TEXTURE_CHANGE,
      this.x,
      this.y,
      this.anims.currentAnim!.key
    )
  }

  setCharacter(id: string) {
    this.characterId = id
    phaserEvents.emit(GameEvent.MY_PLAYER_CHARACTER_ID_CHANGE, id)
  }

  setPlayerIsInMeeting(isInMeeting: boolean) {
    phaserEvents.emit(GameEvent.MY_PLAYER_MEETING_STATUS_CHANGE, isInMeeting)
  }

  isPlayerInMeeting() {
    return store.getState().meeting.meetingDialogOpen
  }

  update(
    playerSelector: PlayerSelector,
    cursors: NavKeys,
    keyE: Phaser.Input.Keyboard.Key,
    keyR: Phaser.Input.Keyboard.Key,
    network: Network
  ) {
    if (!cursors) return

    //force leave chair
    if (this.forceLeaveCurrentChair) {
      this.leaveCurrentChair(playerSelector, cursors, network)
      return
    }

    const item = playerSelector.selectedItem

    switch (this.playerBehavior) {
      case PlayerBehavior.IDLE:
        // if press E in front of selected chair
        if (Phaser.Input.Keyboard.JustDown(keyE) && item?.itemType === ItemType.CHAIR) {
          const chairItem = item as Chair
          if (!chairItem.connectedUser) {
            /**
             * move player to the chair and play sit animation
             * a delay is called to wait for player movement (from previous velocity) to end
             * as the player tends to move one more frame before sitting down causing player
             * not sitting at the center of the chair
             */
            this.scene.time.addEvent({
              delay: 10,
              callback: () => {
                // update character velocity and position
                this.setVelocity(0, 0)
                if (chairItem.itemDirection) {
                  this.setPosition(
                    chairItem.x + sittingShiftData[chairItem.itemDirection][0],
                    chairItem.y + sittingShiftData[chairItem.itemDirection][1]
                  ).setDepth(chairItem.depth + sittingShiftData[chairItem.itemDirection][2])
                  // also update playerNameContainer velocity and position
                  this.playContainerBody.setVelocity(0, 0)
                  this.playerContainer.setPosition(
                    chairItem.x + sittingShiftData[chairItem.itemDirection][0],
                    chairItem.y + sittingShiftData[chairItem.itemDirection][1] - 30
                  )
                }

                this.play(`${this.playerTexture}_sit_${chairItem.itemDirection}`, true)
                playerSelector.selectedItem = undefined
                if (chairItem.itemDirection === 'up') {
                  playerSelector.setPosition(this.x, this.y - this.height)
                } else {
                  playerSelector.setPosition(0, 0)
                }
                // send new location and anim to server
                network.updatePlayer(this.x, this.y, this.anims.currentAnim!.key)
              },
              loop: false,
            })

            // set up new dialog as player sits down
            chairItem.sit(network)
            this.chairOnSit = chairItem
            this.playerBehavior = PlayerBehavior.SITTING
            return
          }
        }

        // handle movement
        const speed = 200
        let vx = 0
        let vy = 0

        let joystickLeft = false
        let joystickRight = false
        let joystickUp = false
        let joystickDown = false

        if (cursors.left?.isDown || cursors.A?.isDown || joystickLeft) vx -= speed
        if (cursors.right?.isDown || cursors.D?.isDown || joystickRight) vx += speed
        if (cursors.up?.isDown || cursors.W?.isDown || joystickUp) {
          vy -= speed
          this.setDepth(this.y) //change player.depth if player.y changes
        }
        if (cursors.down?.isDown || cursors.S?.isDown || joystickDown) {
          vy += speed
          this.setDepth(this.y) //change player.depth if player.y changes
        }
        // update character velocity
        this.setVelocity(vx, vy)
        this.body!.velocity.setLength(speed)
        // also update playerNameContainer velocity
        this.playContainerBody.setVelocity(vx, vy)
        this.playContainerBody.velocity.setLength(speed)

        // update animation according to velocity and send new location and anim to server
        if (vx !== 0 || vy !== 0) network.updatePlayer(this.x, this.y, this.anims.currentAnim!.key)
        if (vx > 0) {
          this.play(`${this.playerTexture}_run_right`, true)
        } else if (vx < 0) {
          this.play(`${this.playerTexture}_run_left`, true)
        } else if (vy > 0) {
          this.play(`${this.playerTexture}_run_down`, true)
        } else if (vy < 0) {
          this.play(`${this.playerTexture}_run_up`, true)
        } else {
          const parts = this.anims.currentAnim!.key.split('_')
          parts[1] = 'idle'
          const newAnim = parts.join('_')
          // this prevents idle animation keeps getting called
          if (this.anims.currentAnim!.key !== newAnim) {
            this.play(parts.join('_'), true)
            // send new location and anim to server
            network.updatePlayer(this.x, this.y, this.anims.currentAnim!.key)
          }
        }
        break

      case PlayerBehavior.SITTING:
        // back to idle if player press E while sitting
        if (Phaser.Input.Keyboard.JustDown(keyE)) {
          const parts = this.anims.currentAnim!.key.split('_')
          parts[1] = 'idle'
          this.play(parts.join('_'), true)
          this.playerBehavior = PlayerBehavior.IDLE
          this.chairOnSit?.leave(network)
          this.chairOnSit = undefined
          playerSelector.setPosition(this.x, this.y)
          playerSelector.update(this, cursors)
          network.updatePlayer(this.x, this.y, this.anims.currentAnim!.key)
          break
        }

        if (Phaser.Input.Keyboard.JustDown(keyR) && this.chairOnSit) {
          const meeting = Game.getInstance()?.meetingMap.get(this.chairOnSit.groupId!) as Meeting
          if (meeting.isOpen) {
            meeting.openDialog(this.getPlayerId()!, network)
          } else {
            meeting.createMeeting(this.getPlayerId()!, network)
          }
          break
        }

      // if (Phaser.Input.Keyboard.JustDown(keyR)) {
      //   switch (item?.itemType) {
      //     case ItemType.CHAIR:
      //       const chair = item as Chair
      //       console.log(chair.groupId!)
      //       console.log(Game.getInstance()?.meetingMap.get(chair.groupId!))
      //       const meeting = Game.getInstance()?.meetingMap.get(chair.groupId!) as Meeting
      //       meeting.openDialog(this.getPlayerId()!, network)
      //       break
      //   }
      // }
      // break
    }
  }

  setLeaveCurrentChair(leave: boolean) {
    this.forceLeaveCurrentChair = leave
  }

  leaveCurrentChair(playerSelector: PlayerSelector, cursors: NavKeys, network: Network) {
    if (!this.chairOnSit) return
    if (this.playerBehavior === PlayerBehavior.SITTING) {
      // back to idle if player press E while sitting
      const parts = this.anims.currentAnim!.key.split('_')
      parts[1] = 'idle'
      this.play(parts.join('_'), true)
      this.playerBehavior = PlayerBehavior.IDLE
      this.chairOnSit?.leave(Network.getInstance()!)
      this.chairOnSit = undefined
      playerSelector.setPosition(this.x, this.y)
      playerSelector.update(this, cursors)
      network.updatePlayer(this.x, this.y, this.anims.currentAnim!.key)
    }
    this.forceLeaveCurrentChair = false
  }

  // disconnectPlayer(network: Network) {
  //   if (this.chairOnSit) {
  //     network.disconnectFromChair(this.chairOnSit.chairId!);
  //   }
  // }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      myPlayer(x: number, y: number, texture: string, id: string, frame?: string | number): MyPlayer
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'myPlayer',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    const sprite = new MyPlayer(this.scene, x, y, texture, id, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    const collisionScale = [0.5, 0.2]
    sprite
      .body!.setSize(sprite.width * collisionScale[0], sprite.height * collisionScale[1])
      .setOffset(
        sprite.width * (1 - collisionScale[0]) * 0.5,
        sprite.height * (1 - collisionScale[1])
      )

    return sprite
  }
)
