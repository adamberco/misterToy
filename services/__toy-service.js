const fs = require('fs')
const gToys = require('../data/toy.json')

module.exports = {
    query,
    getById,
    remove,
    save
}

function query(filterBy) {
    let filteredToys = JSON.parse(JSON.stringify(gToys));

    if (filterBy.status === 'In stock') {
        filteredToys = filteredToys.filter((toy) => {
            return toy.inStock
        });
    }
    else if (filterBy.status === 'Out of stock') {
        filteredToys = filteredToys.filter((toy) => !toy.inStock);
    }

    filteredToys = filteredToys.filter((toy) =>
        new RegExp(filterBy.txt.toLowerCase(), 'i').test(
            toy.name.toLowerCase()
        )
    );
    if (filterBy.labels) {
        filteredToys = filteredToys.filter((toy) =>
            filterBy.labels.every((filterLabel) =>
                toy.labels.includes(filterLabel)
            )
        );
    }

    if (filterBy.sort === 'Name') {
        filteredToys = filteredToys.sort((toyA, toyB) => {
            if (toyA.name.toLowerCase() < toyB.name.toLowerCase()) return -1;

            if (toyA.name.toLowerCase() > toyB.name.toLowerCase()) return 1;

            return 0;
        });

    } else if (filterBy.sort === 'Date') {
        filteredToys = filteredToys.sort(
            (toyA, toyB) => toyB.createdAt - toyA.createdAt
        );
    } else if (filterBy.sort === 'Price Low') {
        filteredToys = filteredToys.sort(
            (toyA, toyB) => toyA.price - toyB.price
        );
    } else {
        filteredToys = filteredToys.sort(
            (toyA, toyB) => toyB.price - toyA.price
        );
    }
    return Promise.resolve(filteredToys);
}

function getById(toyId) {
    const toy = gToys.find(toy => toy._id === toyId)
    toy.reviews = [
        { txt: "Great toy!" },
        { txt: "Broke after two days, not worth the price!" },
    ]
    return Promise.resolve(toy)
}

function remove(toyId, user) {
    // const idx = gToys.findIndex(toy => toy._id === toyId && (toy.creator.nickname === user.nickname || user.isAdmin))
    const idx = gToys.findIndex(toy => toy._id === toyId)
    if (idx === -1) {
        return Promise.reject()
    }
    gToys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, user) {
    if (toy._id) {
        const idx = gToys.findIndex(currToy => currToy._id === toy._id)
        gToys.splice(idx, 1, toy);

        // let dbToy = gToys[idx]
        // if (user.isAdmin || dbToy.creator.nickname === toy.creator.nickname) {
        // Selective Update:
        // dbToy = toy
        // dbToy.name = toy.name
        // dbToy.price = toy.price
        // dbToy.labels = toy.labels
        // dbToy.createdAt = toy.createdAt
        // dbToy.inStock = toy.inStock
        return _saveToysToFile()
            .then(() => toy)
        // } else {
        //     return Promise.reject('Not your Toy')
        // }
    } else {
        toy._id = _makeId()
        toy.createdAt = Date.now()
        // toy.creator.nickname = nickname
        gToys.push(toy)
        return _saveToysToFile()
            .then(() => toy)
    }
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}