const Datastore = require('nedb');

var dbCustomers = new Datastore({ filename: __dirname + '/../../data/customers.nedb', autoload: true });
var dbCats = new Datastore({ filename: __dirname + '/../../data/cats.nedb', autoload: true });
var dbBoxes = new Datastore({ filename: __dirname + '/../../data/boxes.nedb', autoload: true });
var dbReservations = new Datastore({ filename: __dirname + '/../../data/reservations.nedb', autoload: true });

var dbBoxesInsert = [{"_id":"1","size":"5"},{"_id":"2","size":"5"},{"_id":"3","size":"5"},{"_id":"4","size":"5"},{"_id":"5","size":"5"},{"_id":"6","size":"5"},{"_id":"7","size":"5"},{"_id":"8","size":"5"},{"_id":"9","size":"5"},{"_id":"10","size":"5"},{"_id":"11","size":"5"},{"_id":"12","size":"5"},{"_id":"13","size":"5"}];

/*
dbBoxes.insert(dbBoxesInsert, (err, newDocs) => {
    if(err) console.log(err);
    console.log("Boxes inserted");
});
*/

module.exports.getBoxes = (ids) => {
    return new Promise(function (resolve, reject) {
        if(ids){
            dbBoxes.find({_id: {$in: ids}}).sort({_id:1}).exec(function (err, docs) {
                if(err) reject(err)
                resolve(docs)
            })
        }
        dbBoxes.find({}).sort({_id:1}).exec(function (err, docs) {
            if(err) reject(err)
            resolve(docs)
        })
    })
}

module.exports.getBoxesCount = async () => {
    return new Promise(function (resolve, reject) {
        dbBoxes.count({}, (err, count) => {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    })
}

module.exports.getCustomers = (ids) => {
    return new Promise(function (resolve, reject) {
        if(ids){
            if(!$.isArray(ids)){
                dbCustomers.find({_id:ids}, function (err, docs) {
                    if(err) reject(err)
                    resolve(docs)
                })
            } else{
                dbCustomers.find({_id: {$in: ids}}).sort({lastname:1}).exec(function (err, docs) {
                    if(err) reject(err)
                    resolve(docs)
                })
            }
        }
        dbCustomers.find({}).sort({lastname:1}).exec(function (err, docs) {
            if(err) reject(err)
            resolve(docs)
        })
    })
}

module.exports.insertCustomer = (data) => {
    
    return new Promise(function (resolve, reject) {
        dbCustomers.insert(data, function (err, newdoc) {
            if(err) reject(err)
            resolve(newdoc)
        })
    })
}

module.exports.updateCustomer = (data) => {
    
    return new Promise(function (resolve, reject) {
        dbCustomers.update({_id:data._id}, data, {}, function (err, numAffected) {
            if(err) reject(err)
            resolve(numAffected)
        })
    })
}

module.exports.getCats = (ids) => {
    return new Promise(function (resolve, reject) {
        if(ids){
            if(!$.isArray(ids)){
                dbCats.find({_id:ids}, function (err, docs) {
                    if(err) reject(err)
                    resolve(docs)
                })
            } else{
                dbCats.find({_id: {$in: ids}}).sort({_id:1}).exec(function (err, docs) {
                    if(err) reject(err)
                    resolve(docs)
                })
            }
        }
        dbCats.find({}).sort({_id:1}).exec(function (err, docs) {
            if(err) reject(err)
            resolve(docs)
        })
    })
}

module.exports.getCatsByOwnerid = (owner) => {
    return new Promise(function (resolve, reject) {
        dbCats.find({ownerid:owner}).sort({num:1}).exec(function (err, docs) {
            if(err) reject(err)
            resolve(docs)
        })
    })
}

module.exports.insertCat = (data) => {
    
    return new Promise(function (resolve, reject) {
        dbCats.insert(data, function (err, newdoc) {
            if(err) reject(err)
            resolve(newdoc)
        })
    })
}

module.exports.updateCat = (data) => {
    
    return new Promise(function (resolve, reject) {
        dbCats.update({_id:data._id}, data, {}, function (err, numAffected) {
            if(err) reject(err)
            resolve(numAffected)
        })
    })
}

module.exports.getAllBookings = () => {

}
module.exports.setAllBookings = () => {

}