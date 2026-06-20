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
    const BPM = 57.6;
    const beatDuration = 60000 / BPM; // Duration of one beat in milliseconds
    const thirdBeatOffset = beatDuration * 2; // Offset for the 3rd beat (2 beats after the first beat)
    var rectangle;
    var time;
    const halfWindow = 150;
    var remainder;

    function preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.audio('tinikling', 'assets/tinikling.mp3');

        
    }

    function create ()
    {

        this.add.image(400, 300, 'sky');
        rectangle = this.add.rectangle(400, 300, 100, 100, 0x000000, 0.5);


        music = this.sound.add('tinikling');
        
        cursors = this.input.keyboard.createCursorKeys();


        //platforms = this.physics.add.staticGroup();


       


      
    }

    function update ()
    {
        if (cursors.left.isDown){
            music.play();
        }
        
        if (cursors.right.isDown && music.isPlaying) {
            const time = (music.seek * 1000);
            const closestBeat = getNearestBeat(time);
            const high = closestBeat + halfWindow;
            const low = closestBeat - halfWindow;
            
            if (time <= high  && time >= low){
    
                //if (Math.floor(time / beatDuration) % 3 === 0) {
                    //rectangle.setFillStyhle(0x0000ff, 0.5);
                //}
                //else {
                rectangle.setFillStyle(0x008000, 0.5);
                rectangle.setVisible(true);
                //}
            }
            else {
                rectangle.setFillStyle(0xff0000, 0.5);
                rectangle.setVisible(true);
            }
        }
        else {
            rectangle.setFillStyle(0x000000, 0.5);
            rectangle.setVisible(false);
        }
       
    }
    const beatMap = [
        19351, 20394, 21528, 23523, 24612, 25700, 26789, 27832, 28829, 29872,
        30961, 30961, 31959, 32956, 33909, 34997, 35995, 36947, 37990, 38943,
        39986, 40938, 41981, 42979, 43977, 44974, 45927, 46970, 47922, 48920,
        49918, 50916, 51913, 52911, 53909, 54906, 55904, 56811, 57809, 58807,
        59714, 60711, 61755, 62707, 63705, 64657, 65655, 66607, 67560, 68557,
        69510, 70553, 71460, 72457, 73455, 74408, 75405, 76448, 77401, 78399,
        79442, 80394, 81346, 82344, 83342, 84294, 85292, 86335, 87287, 88285,
        89238, 90235, 91233, 92231, 93274, 94272, 95269, 96267, 97265, 98217,
        99260, 100213, 101165, 102163, 103115, 104158, 105111, 106154, 107151, 108149,
        109101, 110054, 111052, 112049, 112956, 113999, 114952, 115950, 116902, 117900,
        118852, 119850, 120802, 121755, 122798, 123795, 124884, 125972, 127015, 127922,
        128965, 129963, 131006, 132004, 133002, 133999, 134997, 136040, 136993, 137990,
        139033, 140031, 140984, 141981, 142979, 143977, 144974, 145972, 146970, 147968,
        148920, 149872, 150825, 151868, 152820, 153863, 154861, 155859, 156811, 157764,
        158716, 159668, 160711, 161618, 162571, 163659, 164657, 165609, 166607, 167560,
        168512, 169464, 170507, 171550, 172503, 173546, 174498, 175541, 176448, 177537,
        178489, 179487, 180485, 181437, 182435, 183433, 184340, 185383, 186426, 187333,
        188376, 189374, 190326, 191414, 192367, 193410, 194408, 195360, 196312, 197310,
        198262, 199260, 200258, 201210, 202163, 203160, 204158, 205111, 206063, 207106,
        208104, 209101, 210054, 211052, 212049, 213047, 213954, 214906, 215904, 216947,
        218036, 219033, 220031, 221120, 222117, 223115, 224067, 225065, 226154, 227151,
        228194, 229147, 230145, 231142, 232095, 233047, 234135, 235088, 236176, 237174,
        238172, 239124, 240077, 241074, 242163, 243070, 244022, 245020, 246063, 247061,
        248013, 249011, 250008, 251006, 252004, 252956, 253909, 254952, 255859, 256857,
        257900, 258852, 259804, 260802, 261755, 262707, 263659, 264793, 265791, 266789,
        267786, 268784, 269782, 270734, 271777, 272730, 273682, 274725, 275677, 276584,
        277628, 278625, 279578, 280621, 281618, 282616, 283569, 284566, 285609, 286607,
        287560, 288557, 289555, 290598, 291505, 292503, 293546, 294498, 295405, 296448,
        297446, 298353, 299396, 300394, 301301, 302208, 303251, 304203, 305201, 306063,
        306970, 307968, 308875, 309827, 310734, 311686, 312639, 313546, 314453, 315405,
        316267, 317129, 317990, 318897, 319759, 320621, 321482, 322299, 323160, 324067,
        324884, 325745, 326562, 327378, 328194, 329011, 329782, 330598, 331324, 332095,
        332911, 333637, 334453, 335224, 335904, 336675, 337401, 338126, 338897, 339532,
        340349, 341074, 341800, 342525, 343251, 343886, 344657, 345337, 346018, 346698,
        347378, 348058, 348739,
    ];
    function getNearestBeat(time) {
        let left = 0;
        let right = beatMap.length - 1;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (beatMap[mid] < time) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        const previousBeat = beatMap[Math.max(0, left - 1)];
        const nextBeat = beatMap[left];
        return Math.abs(time - previousBeat) <= Math.abs(time - nextBeat) ? previousBeat : nextBeat;
    }
