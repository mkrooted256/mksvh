const fs = require('fs')
const Path = require('path');

let Table = function (name){
    this.name = name;
    this.data = [];

    this.model = undefined;

    this.setModel = function(keys) {
        this.model = JSON.stringify(keys.sort())
    }

    this.create = function(uid, obj) {
        if (this.data.hasOwnProperty(uid)) {
            throw "No such uid"
        } else {
            this.update(uid, obj)
        }
    }

    this.read = function(uid) {
        return this.data[uid]
    }

    this.update = function(uid, obj) {
        if (typeof model == 'undefined')
            this.data[uid] = obj
        else if (JSON.stringify(object.keys(obj).sort()) == model)
            this.data[uid] = obj
        else 
            throw "Incompatible model" 
    }

    this.delete = function(uid) {
        delete this.data[uid]
    }

    this.load = function(path) {
        this.data = JSON.parse(fs.readFileSync(path))
    }

    this.save = function(path) {
        fs.writeFileSync(path, JSON.stringify(this.data))
    }
}

let DB = function() {
    this.tables = {}

    this.addTable = function(name) {
        this.tables[name] = new Table(name)
    }

    this.load = function(path) {
        for (name in this.tables) {
            this.tables[name].load(Path.join(path, name + '.json'))
        }
    }
    this.save = function(path) {
        for (name in this.tables) {
            this.tables[name].save(Path.join(path, name + '.json'))
        }
    }

    this.import = function(path) {
        paths = fs.readdirSync(path).filter(a => a.endsWith('.json'))
        for (p of paths) {
            dbname = Path.parse(p).name
            this.addTable(dbname)
            this.tables[dbname].load(Path.join(path, p))
        }
    }
}

module.exports = new DB();
 