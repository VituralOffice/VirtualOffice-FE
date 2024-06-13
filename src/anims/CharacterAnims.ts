import Phaser from 'phaser'

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    const animsFrameRate = 15;

    // Mảng chứa dữ liệu về animation
    const animationsData = [
        { key: 'idle_right', frames: { start: 0, end: 5 }, frameRate: animsFrameRate * 0.6 },
        { key: 'idle_up', frames: { start: 6, end: 11 }, frameRate: animsFrameRate * 0.6 },
        { key: 'idle_left', frames: { start: 12, end: 17 }, frameRate: animsFrameRate * 0.6 },
        { key: 'idle_down', frames: { start: 18, end: 23 }, frameRate: animsFrameRate * 0.6 },
        { key: 'run_right', frames: { start: 24, end: 29 }, frameRate: animsFrameRate },
        { key: 'run_up', frames: { start: 30, end: 35 }, frameRate: animsFrameRate },
        { key: 'run_left', frames: { start: 36, end: 41 }, frameRate: animsFrameRate },
        { key: 'run_down', frames: { start: 42, end: 47 }, frameRate: animsFrameRate },
        { key: 'sit_down', frames: { start: 48, end: 48 }, frameRate: animsFrameRate },
        { key: 'sit_left', frames: { start: 49, end: 49 }, frameRate: animsFrameRate },
        { key: 'sit_right', frames: { start: 50, end: 50 }, frameRate: animsFrameRate },
        { key: 'sit_up', frames: { start: 51, end: 51 }, frameRate: animsFrameRate },
    ];

    const characterNames = ['nancy', 'lucy', 'ash', 'adam']

    characterNames.forEach(characterName => {
        // Lặp qua từng phần tử trong mảng animation data
        animationsData.forEach(animationData => {
            const { key: animKey, frames, frameRate } = animationData;
            let key = characterName + "_" + animKey;

            // Kiểm tra nếu animation key đã tồn tại, thì tiếp tục với phần tử tiếp theo
            if (anims.exists(key)) {
                return;
            }

            // Tạo animation nếu animation key chưa tồn tại
            anims.create({
                key: key,
                frames: anims.generateFrameNames(characterName, frames),
                repeat: -1,
                frameRate: frameRate
            });
        });
    });
}