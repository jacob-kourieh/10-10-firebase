//sätt upp firestor
//sätt upp webbserven
//publicera på render

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAcount = require('./serviceAcount.json');
const { async } = require('@firebase/util');

admin.initializeApp({
    credential: admin.credential.cert(serviceAcount)
});

const db = admin.firestore();

const app = new express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send('Hej från Webbserven')
});

app.get('/shoppinglists', async (req, res) => {
    try {
        const shoppinglists = [];
        const query = await db.collection('shoppinglist').get();

        query.forEach(doc => {
            shoppinglists.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.json({ lists: shoppinglists })
        console.log(shoppinglists);

    } catch (err) {
        console.error(err);
    }
});


app.put('/shoppinglist', async (req, res) => {
    const { id } = req.body;

    try {
        const ref = await db.collection('shoppinglist').doc(id);
        const doc = await ref.get();
        res.json(doc.data());

    } catch (err) {
        console.error(err);
    }
})


app.put('/updateItemDone', async (req, res) => {
    const { shoppingListId, name, done } = req.body

    try {

        const ref = await db.collection('shoppinglist').doc(shoppingListId);
        let doc = await db.collection('shoppinglist').doc(shoppingListId).get();
        let itemsList = doc.data().items
        console.log(itemsList);

        const itemIndex = itemsList.findIndex(i => i.name === name);
        itemsList[itemIndex].done = done;
        await ref.update({
            items: itemsList
        })

        res.json({ message: 'funkade säkert' })

    } catch (err) {
        console.error(err);
        res.json({ message: 'funkar inte!' })
    }

})



app.listen(1234, () => {
    console.log('ah, den är uppe');
})

