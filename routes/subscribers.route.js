const router = require('express').Router();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });
client.connect((err) => {
    if (err) return console.log(err);
    console.log('connected to cassandra');
});

const getAll = 'select * from people.subscribers';

router.get('/', (req, res) => {
    client.execute(getAll, [], (err, result) => {
        if (err) return res.status(500).send(err);
        else {
            return res.render('index.ejs', { result: result['rows'] });
        }
    })
});

router.get('/subscribers/:id', (req, res) => {
    const id = req.params.id;
    const getOne = `select * from people.subscribers where id = ${id}`;
    client.execute(getOne, [], (err, result) => {
        if (err) return res.status(500).send(err);
        else {
            return res.render('subscriber.ejs', { result: result['rows'] });
        }
    })
})

// or the other way for upper route, Both are equals
// router.get('/subscribers/:id', (req, res) => {
//     const id = req.params.id;
//     const getOne = `select * from people.subscribers where id = ?`;
//     client.execute(getOne, [req.params.id], (err, result) => {
//         if (err) return res.status(500).send(err);
//         else {
//             console.log(result, 'lhell')
//             return res.render('subscriber.ejs', {result: result['rows']});
//         }       
//     })
// })


router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const getOne = `select * from people.subscribers where id = ${id}`;
    client.execute(getOne, [], (err, result) => {
        if (err) return res.status(500).send(err);
        else {
            return res.render('add.ejs', { result: result['rows'] });
        }
    })
});

router.post('/edit/:id', (req, res) => {
    console.log('coming in edit')
    const id = req.params.id;
    const { email, first_name, last_name } = req.body;
    const query = `update people.subscribers set first_name='${first_name}', last_name='${last_name}', email='${email}' where id = ${id}`
    client.execute(query, [], (err, result) => {
        if (err) return res.status(500).send(err);
        else {
            return res.redirect('/');
        }
    });
});


router.get('/add', (req, res) => {
    res.render('add.ejs', { result: [] })
});

router.post('/addSubscriber', (req, res) => {
    console.log('coming in post')
    const { email, first_name, last_name } = req.body;
    const id = cassandra.types.uuid();
    const query = 'insert into people.subscribers(id, first_name, last_name, email) values(?,?,?,?)'
    client.execute(query, [id, first_name, last_name, email], (err, result) => {
        if (err) return res.status(500).send(err);
        else {
            client.execute(getAll, [], (err, result) => {
                if (err) return res.status(500).send(err);
                else {
                    return res.redirect('/');
                }
            })
        }
    });
});

router.delete('/remove/:id', (req, res) => {
    const query = 'delete from people.subscribers where id = ?';
    client.execute(query, [req.params.id], (err, result) => {
        if(err) return res.status(500).send(err)
        else {
            return res.redirect('/');
        }
    })
})

module.exports = router;