import Phaser from 'phaser'
import store from '../stores'
import { setRoomJoined } from '../stores/RoomStore'
import Network from '../services/Network'
import { BackgroundMode } from '../types/BackgroundMode'

export default class Bootstrap extends Phaser.Scene {
    private static instance: Bootstrap | null = null; // Biến static instance

    private preloadComplete = false
    network!: Network

    constructor() {
        super('bootstrap')
        console.log("Bootstrap:: Construct Bootstrap")
        Bootstrap.instance = this;
        // this.network = new Network()
    }

    static getInstance(): Bootstrap | null {
        return Bootstrap.instance;
    }

    preload() {
        console.log("Bootstrap:: Bootstrap preload")
        this.load.atlas(
            'cloud_day',
            '/assets/background/cloud_day.png',
            '/assets/background/cloud_day.json'
        )
        this.load.image('backdrop_day', '/assets/background/backdrop_day.png')
        this.load.atlas(
            'cloud_night',
            '/assets/background/cloud_night.png',
            '/assets/background/cloud_night.json'
        )
        this.load.image('backdrop_night', '/assets/background/backdrop_night.png')
        this.load.image('sun_moon', '/assets/background/sun_moon.png')
        const mapJson = store.getState().room.roomData.map.json
        console.log(`Bootstrap::preload load map json : ${mapJson}`)
        this.load.tilemapTiledJSON('tilemap', mapJson)
        // this.load.tilemapTiledJSON('tilemap', '/assets/map/Summer_30.json')
        this.load.spritesheet('tiles_wall_origin', '/assets/map/FloorAndGround_origin.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('tiles_wall', '/assets/map/FloorAndGround.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        // this.load.tilemapTiledJSON('tilemap', '/assets/map/DefaultMap_10.json')
        this.load.spritesheet('chairs', '/assets/items/chair.png', {
            frameWidth: 32,
            frameHeight: 64,
        })
        this.load.spritesheet('computers', '/assets/items/computer.png', {
            frameWidth: 96,
            frameHeight: 64,
        })
        this.load.spritesheet('whiteboards', '/assets/items/whiteboard.png', {
            frameWidth: 64,
            frameHeight: 64,
        })
        this.load.spritesheet('vendingmachines', '/assets/items/vendingmachine.png', {
            frameWidth: 48,
            frameHeight: 72,
        })
        this.load.spritesheet('office', '/assets/tileset/Modern_Office_Black_Shadow.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('basement', '/assets/tileset/Basement.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('generic', '/assets/tileset/Generic.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('adam', '/assets/character/adam.png', {
            frameWidth: 32,
            frameHeight: 48,
        })
        this.load.spritesheet('ash', '/assets/character/ash.png', {
            frameWidth: 32,
            frameHeight: 48,
        })
        this.load.spritesheet('lucy', '/assets/character/lucy.png', {
            frameWidth: 32,
            frameHeight: 48,
        })
        this.load.spritesheet('nancy', '/assets/character/nancy.png', {
            frameWidth: 32,
            frameHeight: 48,
        })

        this.load.on('complete', () => {
            this.preloadComplete = true
            this.launchBackground(store.getState().user.backgroundMode)
        })
    }

    // loadTileMap() {
    //     this.load.tilemapTiledJSON('tilemap', '/assets/map/DefaultMap_10.json')
    // }

    init() {
        console.log("Bootstrap::init Init bootstrap")
        this.network = new Network()
    }

    private launchBackground(backgroundMode: BackgroundMode) {
        this.scene.launch('background', { backgroundMode })
    }

    // launchBootstrap() {
    //     console.log("Bootstrap::launchBootstrap Launch Bootstrap")
    //     // Check for preload completion before launching game
    // }

    create() {
        this.launchGame();
    }

    launchGame() {
        if (!this.preloadComplete) return;
        this.scene.launch('game', {
            network: this.network,
        })

        // update Redux state
        store.dispatch(setRoomJoined(true))
        console.log("Bootstrap::launchGame Launch Game")
    }

    stop() {
        console.log("Bootstrap::stop Stop Game")
        this.scene.stop('background')
        this.scene.stop('game')
        store.dispatch(setRoomJoined(false))
    }

    changeBackgroundMode(backgroundMode: BackgroundMode) {
        this.scene.stop('background')
        this.launchBackground(backgroundMode)
    }
}
