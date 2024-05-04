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

// export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
//     const animsFrameRate = 15

//     anims.create({
//         key: 'nancy_idle_right',
//         frames: anims.generateFrameNames('nancy', {
//             start: 0,
//             end: 5,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'nancy_idle_up',
//         frames: anims.generateFrameNames('nancy', {
//             start: 6,
//             end: 11,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'nancy_idle_left',
//         frames: anims.generateFrameNames('nancy', {
//             start: 12,
//             end: 17,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'nancy_idle_down',
//         frames: anims.generateFrameNames('nancy', {
//             start: 18,
//             end: 23,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'nancy_run_right',
//         frames: anims.generateFrameNames('nancy', {
//             start: 24,
//             end: 29,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_run_up',
//         frames: anims.generateFrameNames('nancy', {
//             start: 30,
//             end: 35,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_run_left',
//         frames: anims.generateFrameNames('nancy', {
//             start: 36,
//             end: 41,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_run_down',
//         frames: anims.generateFrameNames('nancy', {
//             start: 42,
//             end: 47,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_sit_down',
//         frames: anims.generateFrameNames('nancy', {
//             start: 48,
//             end: 48,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_sit_left',
//         frames: anims.generateFrameNames('nancy', {
//             start: 49,
//             end: 49,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_sit_right',
//         frames: anims.generateFrameNames('nancy', {
//             start: 50,
//             end: 50,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'nancy_sit_up',
//         frames: anims.generateFrameNames('nancy', {
//             start: 51,
//             end: 51,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_idle_right',
//         frames: anims.generateFrameNames('lucy', {
//             start: 0,
//             end: 5,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'lucy_idle_up',
//         frames: anims.generateFrameNames('lucy', {
//             start: 6,
//             end: 11,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'lucy_idle_left',
//         frames: anims.generateFrameNames('lucy', {
//             start: 12,
//             end: 17,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'lucy_idle_down',
//         frames: anims.generateFrameNames('lucy', {
//             start: 18,
//             end: 23,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'lucy_run_right',
//         frames: anims.generateFrameNames('lucy', {
//             start: 24,
//             end: 29,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_run_up',
//         frames: anims.generateFrameNames('lucy', {
//             start: 30,
//             end: 35,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_run_left',
//         frames: anims.generateFrameNames('lucy', {
//             start: 36,
//             end: 41,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_run_down',
//         frames: anims.generateFrameNames('lucy', {
//             start: 42,
//             end: 47,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_sit_down',
//         frames: anims.generateFrameNames('lucy', {
//             start: 48,
//             end: 48,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_sit_left',
//         frames: anims.generateFrameNames('lucy', {
//             start: 49,
//             end: 49,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_sit_right',
//         frames: anims.generateFrameNames('lucy', {
//             start: 50,
//             end: 50,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'lucy_sit_up',
//         frames: anims.generateFrameNames('lucy', {
//             start: 51,
//             end: 51,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_idle_right',
//         frames: anims.generateFrameNames('ash', {
//             start: 0,
//             end: 5,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'ash_idle_up',
//         frames: anims.generateFrameNames('ash', {
//             start: 6,
//             end: 11,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'ash_idle_left',
//         frames: anims.generateFrameNames('ash', {
//             start: 12,
//             end: 17,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'ash_idle_down',
//         frames: anims.generateFrameNames('ash', {
//             start: 18,
//             end: 23,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'ash_run_right',
//         frames: anims.generateFrameNames('ash', {
//             start: 24,
//             end: 29,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_run_up',
//         frames: anims.generateFrameNames('ash', {
//             start: 30,
//             end: 35,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_run_left',
//         frames: anims.generateFrameNames('ash', {
//             start: 36,
//             end: 41,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_run_down',
//         frames: anims.generateFrameNames('ash', {
//             start: 42,
//             end: 47,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_sit_down',
//         frames: anims.generateFrameNames('ash', {
//             start: 48,
//             end: 48,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_sit_left',
//         frames: anims.generateFrameNames('ash', {
//             start: 49,
//             end: 49,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_sit_right',
//         frames: anims.generateFrameNames('ash', {
//             start: 50,
//             end: 50,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'ash_sit_up',
//         frames: anims.generateFrameNames('ash', {
//             start: 51,
//             end: 51,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_idle_right',
//         frames: anims.generateFrameNames('adam', {
//             start: 0,
//             end: 5,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'adam_idle_up',
//         frames: anims.generateFrameNames('adam', {
//             start: 6,
//             end: 11,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'adam_idle_left',
//         frames: anims.generateFrameNames('adam', {
//             start: 12,
//             end: 17,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'adam_idle_down',
//         frames: anims.generateFrameNames('adam', {
//             start: 18,
//             end: 23,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate * 0.6,
//     })

//     anims.create({
//         key: 'adam_run_right',
//         frames: anims.generateFrameNames('adam', {
//             start: 24,
//             end: 29,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_run_up',
//         frames: anims.generateFrameNames('adam', {
//             start: 30,
//             end: 35,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_run_left',
//         frames: anims.generateFrameNames('adam', {
//             start: 36,
//             end: 41,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_run_down',
//         frames: anims.generateFrameNames('adam', {
//             start: 42,
//             end: 47,
//         }),
//         repeat: -1,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_sit_down',
//         frames: anims.generateFrameNames('adam', {
//             start: 48,
//             end: 48,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_sit_left',
//         frames: anims.generateFrameNames('adam', {
//             start: 49,
//             end: 49,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_sit_right',
//         frames: anims.generateFrameNames('adam', {
//             start: 50,
//             end: 50,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })

//     anims.create({
//         key: 'adam_sit_up',
//         frames: anims.generateFrameNames('adam', {
//             start: 51,
//             end: 51,
//         }),
//         repeat: 0,
//         frameRate: animsFrameRate,
//     })
// }
