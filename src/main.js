import Phaser from 'phaser'

   var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);
    var platforms;
    var cursors;
    var music;
    //const BPM = 57.6;
    //const beatDuration = 60000 / BPM; // Duration of one beat in milliseconds
    //const thirdBeatOffset = beatDuration * 2; // Offset for the 3rd beat (2 beats after the first beat)
    var leftStick;
    var rightStick;
    var resultText;
    var time;
    const halfWindow = 150;
    var perfectWindow = 63;
    var okWindow = 100;
    var goodWindow = 85;
    var remainder;
    const hitDisplayDuration = 200;
    var rightStickState = { lastHitTime: -Infinity, hit: false };
    var leftStickState = { lastHitTime: -Infinity, hit: false };

    function preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.audio('tinikling', 'assets/tinikling.mp3');

        
    }

    function create ()
    {

        this.add.image(400, 300, 'sky');
        rightStick = this.add.rectangle(400, 300, 100, 100, 0x000000, 0.5);
        leftStick = this.add.rectangle(100, 300, 100, 100, 0x000000, 0.5);


        music = this.sound.add('tinikling');

        cursors = this.input.keyboard.createCursorKeys();

        resultText = this.add.text(400, 200, '', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);


        //platforms = this.physics.add.staticGroup();


       


      
    }
    function update ()
    {
        const now = Date.now();

        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            music.play();
        }

        const rightJustDown = Phaser.Input.Keyboard.JustDown(cursors.right);
        const leftJustDown = Phaser.Input.Keyboard.JustDown(cursors.left);
        const rightDown = cursors.right.isDown;
        const leftDown = cursors.left.isDown;
        const bothPressed = (rightJustDown && leftDown) || (leftJustDown && rightDown) || (rightJustDown && leftJustDown);
        const rightOnly = rightJustDown && !leftDown;

        if (music.isPlaying) {
            const musicTime = Math.floor(music.seek * 1000);

            if (bothPressed) {
                // full counts — both keys
                const closestBeat = getNearestBeat(musicTime, "fullCounts");
                const diff = Math.abs(musicTime - closestBeat);
                const hit = (diff <= okWindow);
                rightStickState = { lastHitTime: now, hit };
                leftStickState = { lastHitTime: now, hit };
                if (hit) {
                    if (diff <= perfectWindow) {
                        resultText.setText('Perfect');
                    }
                    else if (diff <= goodWindow) {
                        resultText.setText('Good');
                    }
                    else {
                        resultText.setText('Ok');
                    }
                } else {
                    resultText.setText('Miss');
                }
            } else if (rightOnly) {
                // and-a counts — right key only
                const closestBeat = getNearestBeat(musicTime, "rightKey");
                const diff = Math.abs(musicTime - closestBeat);
                const hit = (diff <= okWindow);
                rightStickState = { lastHitTime: now, hit };
                if (hit) {
                    if (diff <= perfectWindow) {
                        resultText.setText('Perfect');
                    }
                    else if (diff <= goodWindow) {
                        resultText.setText('Good');
                    }
                    else {
                        resultText.setText('Ok');
                    }
                } else {
                    resultText.setText('Miss');
                }
            }
        }

        // Update right stick color — stays visible for hitDisplayDuration ms
        if (now - rightStickState.lastHitTime < hitDisplayDuration) {
            rightStick.setFillStyle(rightStickState.hit ? 0x008000 : 0xff0000, 0.5);
            rightStick.setVisible(true);
        } else {
            rightStick.setFillStyle(0x000000, 0.5);
            rightStick.setVisible(false);
        }

        // Clear result text when display duration expires
        const lastHit = Math.max(rightStickState.lastHitTime, leftStickState.lastHitTime);
        if (now - lastHit >= hitDisplayDuration) {
            resultText.setText('');
        }

        // Update left stick color
        if (now - leftStickState.lastHitTime < hitDisplayDuration) {
            leftStick.setFillStyle(leftStickState.hit ? 0x008000 : 0xff0000, 0.5);
            leftStick.setVisible(true);
        } else {
            leftStick.setFillStyle(0x000000, 0.5);
            leftStick.setVisible(false);
        }
    }
    const fullCountsMap = [
        19332, 20420, 21463, 23557, 24649, 25718, 26797, 27831, 28881, 29918,
        30910, 31941, 32946, 33963, 34959, 35975, 36963, 37961, 38957, 39957,
        40967, 41942, 42980, 43974, 44978, 45967, 46972, 47967, 48964, 49956,
        50936, 51940, 52937, 53882, 54881, 55862, 56831, 57761, 58773, 59740,
        60731, 61697, 62679, 63654, 64608, 65568, 66588, 67586, 68555, 69526,
        70501, 71481, 72436, 73402, 74362, 75327, 76284, 77213, 78157, 79105,
        80030, 80957, 81881, 82837, 83746, 84657, 85568, 86464, 87349, 88234,
        89119, 90014, 90876, 91758, 92605, 93469, 94320, 95175, 96021, 96875,
        97699, 98486, 99278, 100076, 100852, 101641, 102431, 103224, 103994, 104751,
        105504, 106263, 106995, 107736, 108492, 109264, 109994, 110731, 111463, 112201,
        112896, 113616, 114321, 115045, 115747, 116456, 117134, 117811, 118495, 119188,
        119868,
    ];
    const rightKeyMap = [
        22831, 23179, 23889, 24267, 24976, 25349, 26053, 26428, 27118, 27483,
        28155, 28513, 29201, 29560, 30233, 30592, 31256, 31616, 32272, 32608,
        33271, 33609, 34278, 34623, 35288, 35639, 36295, 36638, 37298, 37646,
        38286, 38632, 39284, 39628, 40273, 40630, 41290, 41626, 42281, 42644,
        43316, 43630, 44306, 44654, 45320, 45663, 46304, 46657, 47303, 47639,
        48291, 48629, 49297, 49639, 50268, 50601, 51262, 51598, 52266, 52592,
        53253, 53579, 54208, 54557, 55210, 55545, 56179, 56518, 57154, 57487,
        58071, 58410, 59079, 59389, 60059, 60362, 61031, 61361, 62010, 62332,
        62998, 63327, 63964, 64300, 64928, 65261, 65919, 66251, 66904, 67239,
        67909, 68206, 68880, 69181, 69848, 70166, 70822, 71142, 71796, 72102,
        72741, 73074, 73722, 74050, 74670, 75018, 75649, 75954, 76580, 76897,
        77522, 77843, 78461, 78771, 79399, 79700, 80320, 80639, 81268, 81569,
        82190, 82511, 83142, 83459, 84040, 84346, 84945, 85258, 85862, 86154,
        86736, 87039, 87627, 87923, 88512, 88817, 89408, 89705, 90296, 90577,
        91157, 91454, 92026, 92303, 92893, 93183, 93751, 94036, 94597, 94891,
        95456, 95739, 96288, 96578, 97147, 97408, 97929, 98215, 98738, 99027,
        99534, 99810, 100344, 100613, 101123, 101404, 101910, 102182, 102688, 102973,
        103475, 103746, 104244, 104495, 105000, 105259, 105754, 106003, 106508, 106751,
        107240, 107495, 107989, 108242, 108739, 109002, 109488, 109712, 110237, 110469,
        110971, 111198, 111697, 111942, 112428, 112652, 113139, 113369, 113851, 114072,
        114566, 114796, 115278, 115529, 115995, 116218, 116674, 116909, 117364, 117592,
        118039, 118273, 118719, 118953, 119401, 119634,
    ];
    function getNearestBeat(time, beatType) {
        
        let map;
        if (beatType === "fullCounts") {
            map = fullCountsMap;
        }
        else if (beatType === "rightKey") {
            map = rightKeyMap;
        }
        let left = 0;
        let right = map.length - 1;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (map[mid] < time) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        const previousBeat = map[Math.max(0, left - 1)];
        const nextBeat = map[left];
        return Math.abs(time - previousBeat) <= Math.abs(time - nextBeat) ? previousBeat : nextBeat;
    }
