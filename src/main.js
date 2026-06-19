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
    const BPM = 59;
    const beatDuration = 60000 / BPM; // Duration of one beat in milliseconds
    const thirdBeatOffset = beatDuration * 2; // Offset for the 3rd beat (2 beats after the first beat)
    var rectangle;
    var time;
    const halfWindow = 100;
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
            time = (music.seek * 1000) - 23700; // Convert to milliseconds 
            remainder = time % beatDuration;
            
            if (remainder < halfWindow || remainder > beatDuration - halfWindow) {
    
                //if (Math.floor(time / beatDuration) % 3 === 0) {
                    //rectangle.setFillStyhle(0x0000ff, 0.5);
                //}
                //else {
                rectangle.setFillStyle(0x008000, 0.5);
                rectangle.setVisible(true);
                //}
            }
            else {
                rectangle.setVisible(false);
            }
        }
        else {
            rectangle.setFillStyle(0x000000, 0.5);
            rectangle.setVisible(false);
        }
       
    }
