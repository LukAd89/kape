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
            if(err) reject(err);
            dbCustomers.persistence.compactDatafile();
            resolve(numAffected);
        })
    })
}

module.exports.deleteCustomer = (id) => {
    
    return new Promise(function (resolve, reject) {
        dbCustomers.remove({_id:id}, {}, function (err, numAffected) {
            if(err) reject(err);
            dbCustomers.persistence.compactDatafile();
            resolve(numAffected);
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
            if(err) reject(err);
            dbCats.persistence.compactDatafile();
            resolve(numAffected);
        })
    })
}

module.exports.deleteCat = (id) => {
    
    return new Promise(function (resolve, reject) {
        dbCats.remove({_id:id}, {}, function (err, numAffected) {
            if(err) reject(err);
            dbCats.persistence.compactDatafile();
            resolve(numAffected);
        })
    })
}

module.exports.deleteCatsFromOwner = (ownerid) => {
    
    return new Promise(function (resolve, reject) {
        dbCats.remove({"ownerid": ownerid}, {multi: true}, function (err, numAffected) {
            if(err) reject(err);
            dbCats.persistence.compactDatafile();
            resolve(numAffected);
        })
    })
}

module.exports.getReservations = (ids) => {
    return new Promise(function (resolve, reject) {
        if(ids){
            if(!$.isArray(ids)){
                dbReservations.find({_id:ids}, function (err, docs) {
                    if(err) reject(err)
                    resolve(docs)
                })
            } else{
                dbReservations.find({_id: {$in: ids}}).sort({_id:1}).exec(function (err, docs) {
                    if(err) reject(err)
                    resolve(docs)
                })
            }
        }
        dbReservations.find({}).sort({_id:1}).exec(function (err, docs) {
            if(err) reject(err)
            resolve(docs)
        })
    });
};

module.exports.getCurrentReservations = () => {
    let today = new Date();
    today.setUTCHours(0,0,0,0);
    today = today.toISOString();
    
    return new Promise(function (resolve, reject) {
        dbReservations.find({dateCheckout: {$gte: today}}).sort({_id:1}).exec(function (err, docs) {
            if(err) reject(err)
            resolve(docs)
        })
    });
};

module.exports.insertReservation = (data) => {
    return new Promise(function (resolve, reject) {
        dbReservations.insert(data, function (err, newdoc) {
            if(err) reject(err)
            resolve(newdoc)
        })
    })
};

module.exports.deleteReservation = (id) => {
    
    return new Promise(function (resolve, reject) {
        dbReservations.remove({_id:id}, {}, function (err, numAffected) {
            if(err) reject(err);
            dbReservations.persistence.compactDatafile();
            resolve(numAffected);
        })
    })
}

module.exports.updateReservationBox = (reservationid, newboxid) => {
    
    return new Promise(function (resolve, reject) {
        dbReservations.update({_id:reservationid}, { $set: { boxid: newboxid } }, {}, function (err, numAffected) {
            if(err) reject(err);
            dbReservations.persistence.compactDatafile();
            resolve(numAffected);
        })
    })
}