const Express = require("express")
const fs = require('fs')
const apiVideoSdk = require('@api.video/nodejs-sdk')

let db = require('./db.js');
const { inspect } = require("util");

let apiVideo;
if (process.env.APIVIDEO_SANDBOX)
    apiVideo = new apiVideoSdk.ClientSandbox({ apiKey: process.env.APIVIDEO_KEY })
else
    apiVideo = new apiVideoSdk.Client({ apiKey: process.env.APIVIDEO_KEY })

    
const port = process.env.PORT || 9000


db.import('db')
// db views
codes = db.tables.codes.data
videos = db.tables.videos.data

function exitHandler() {
    db.save('db')
    process.exit();
}

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
process.on('unhandledRejection', exitHandler);


app = Express()

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('index.ejs')
})
app.get('/admin', function(req, res) {
    res.json(db);
})

app.get('/access', function(req, res) {


    let accesscode = req.query.accesscode;

    console.log("param:", accesscode);

    let code = codes.find((code) => {
        let a =  code.code === accesscode;
        // console.log(code, a);
        return a;
    })
    
    if (typeof code == 'undefined' || !code) {
        res.render('notfound.ejs');
        console.log('notfound1');
        return;
    } else if (code.t_end > 0 && code.t_end < Date.now()) {
        // Too late. Access code expired
        res.render('expired.ejs');
        console.log('expired');
        return;
    } else {
        let vid = videos.find((v) => {
            let a = v.local_video_id === code.video_id;
            // console.log(v, a);
            return a;
        })
    
        if (typeof vid == 'undefined') {
            res.render('notfound.ejs');
            console.log('notfound2');
            return;
        } else
            apiVideo.videos.get(vid.remote_video_id).then(function(video) {
                res.render('player.ejs', {player: video.assets.iframe});
        
                // Add time limits for this access code
                if (code.type > 0 && code.t_start == 0) {
                    code.t_start = Date.now();
                    code.t_end = code.t_start + code.type * 1000;
                }
            });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

  