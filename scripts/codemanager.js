const fs = require('fs')
const uuid = require('uuid')

let db = require('../db')

const { times } = require('../consts') 
const argv = process.argv
const root_uuid = process.env.ROOT_UUID
const cmd = argv[2]

db.import('db')
let codes = db.tables.codes.data
let videos = db.tables.videos.data

if (cmd == 'list') {
    console.log("Codes:\n", codes)
    console.log("Videos:\n", videos)
} else if (cmd == 'add') {
    const local_video_id = argv[3]
    let access_type = argv[4];

    let count = 0;
    if (argv[5] == '--'){
        count = argv.length - 6;
    } else {
        count = parseInt(argv[5]);
    }

    let parsed = false;
    
    if (parseInt(access_type) === 0) {
        access_type = 0;
        parsed = true;
    } else {
        let num = parseInt(access_type);
        let time_symbol = access_type.trimEnd().charAt(access_type.length - 1);
        if (!isNaN(num) && time_symbol in times) {
            parsed = true;
            access_type =  num * times[time_symbol];
        }
    }
    if (parsed) {
        for (let i=0; i<count; i++) {
            let newrecord = {
                code: uuid.v4(),
                type: access_type,
                video_id: local_video_id,
                t_start: 0, 
                t_end: 0, 
                who: argv[6+i]
            }
            let csv = String(Object.values(newrecord));
            codes.push(newrecord);
            console.log(csv);
        }
        
    } else {
        console.error("ERROR: invalid access type\n")
    }
} else {
    console.error("Unknown command\n");
}

db.save('db');