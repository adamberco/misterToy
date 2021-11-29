const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    // console.log('filterBy', filterBy)
    try {
        const filterCriteria = _buildFilterCriteria(filterBy)
        const SortCriteria = _buildSortCriteria(filterBy)

        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(filterCriteria).sort(SortCriteria).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}
function _buildSortCriteria(filterBy) {
    const criteria = {}
    if (filterBy.sort) {
        switch (filterBy.sort) {
            case 'Name':
                criteria.name = 1
                break;
            case 'Date':
                criteria.createdAt = 1
                break;
            case 'Price Low':
                criteria.price = 1
                break;
            case 'Price High':
                criteria.price = -1
                break;
        }
    }
    return criteria
}

function _buildFilterCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        criteria.name = { $regex: regex }
    }

    if (filterBy.status === 'In stock') criteria.inStock = true
    else if (filterBy.status === 'Out of stock') criteria.inStock = false

    if (filterBy.labels && filterBy.labels.length) {
        criteria.labels = { $all: filterBy.labels }
    }

    // if (filterBy.labels) {
    //     if (filterBy.labels.length > 1) criteria.labels = filterBy.labels
    //     else criteria.labels = filterBy.labels[0]
    // }
    return criteria
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ '_id': ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ '_id': ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        // const addedToy = await collection.insertOne(toy)
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}
async function update(toy) {
    try {
        var id = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ "_id": id }, { $set: { ...toy } })
        toy._id = id
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}



module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}