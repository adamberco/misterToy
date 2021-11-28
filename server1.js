const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')

const toyService = require('./services/__toy-service')
// const userService = require('./services/user-service')

const app = express()
const port = 3030

app.use(cors());

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(session({
    secret: 'some secret token',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

//Toy API REST (crudl)

//LIST

app.get('/api/toy/', (req, res) => {
    // const { filterBy } = req.params
    // const filterBy = req.body
    const filterBy = req.query


    // console.log('filterBy', filterBy)

    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
        })
})

//READ
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.getById(toyId).then(toy => {
        if (toy) res.send(toy)
        else res.status(404).send('Toy not found')
    })
})

//DELETE
app.delete('/api/toy/:toyId', (req, res) => {
    // const { theUser } = req.session
    // if (!theUser) return res.status(401).send('Login first')

    const { toyId } = req.params
    // toyService.remove(toyId, theUser)
    toyService.remove(toyId)
        .then(() => {
            res.send('Deleted!')
        })
        .catch((err) => {
            res.status(401).send('Not your toy!')
        })
})

// CREATE
app.post('/api/toy', (req, res) => {
    // const { theUser } = req.session
    // if (!theUser) return res.status(401).send('Login first')
    const toy = req.body
    // toy.creator = { nickname: theUser.nickname }
    toyService.save(toy).then((savedToy) => {
        console.log('Added New Toy: ', savedToy);
        res.send(savedToy)
    })
})

// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
    // const { theUser } = req.session
    // if (!theUser) return res.status(401).send('Login first')

    const toy = req.body
    // toy.creator = { nickname: theUser.nickname }
    // toyService.save(toy, theUser)
    toyService.save(toy)
        .then((savedToy) => {
            console.log('Toy Updated: ', savedToy);
            res.send(savedToy)
        })
        .catch(() => {
            console.log('Cannot update toy');
            res.status(401).send('Not your toy!')
        })
})


app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`)
})

// app.post('/login', (req, res) => {
//     const { nickname } = req.body
//     const { password } = req.body
//     userService.checkLogin(nickname, password)
//         .then(user => {
//             if (user) {
//                 req.session.loggedinAt = Date.now()
//                 req.session.theUser = user
//                 res.send(user)
//             } else {
//                 res.status(401).send('Invalid User/Password')
//             }
//         })
// })

// app.post('/signup', (req, res) => {
//     const { nickname } = req.body
//     const { password } = req.body
//     console.log('Signup req from:', nickname)
//     userService.signup(nickname, password)
//         .then(user => {
//             if (user) {
//                 req.session.loggedinAt = Date.now()
//                 req.session.theUser = user
//                 res.send(user)
//             } else res.status(401).send('Invalid User/Password')
//         })
// })

// app.post('/logout', (req, res) => {
//     req.session.destroy();
//     res.end()
// })