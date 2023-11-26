const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase =
    supabaseClient.createClient('https://minhaurl',
        'minhaAPIKey');

app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select();
    res.send(data);
    console.log(`lists all products${data}`);
});

app.get('/products/:id', async (req, res) => {
    console.log("id = " + req.params.id);
    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id);
    res.send(data);
    console.log("retorno " + data);
});

app.post('/products', async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .insert({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
            });

        if (error) {
            res.status(500).send(error);
        } else {
            res.send("created!!");
        }

        console.log("retorno " + req.body.name);
        console.log("retorno " + req.body.description);
        console.log("retorno " + req.body.price);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.put('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id);
    if (error) {
        res.status(500).send(error);
    } else {
        res.send("updated!!");
    }
});

app.delete('/products/:id', async (req, res) => {
    console.log("delete: " + req.params.id);
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);
    if (error) {
        res.status(500).send(error);
    } else {
        res.send("deleted!!");
    }
    console.log("delete: " + req.params.id);
});

app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    res.send("Hello again I am working my friend to the moon and behind <3");
});

app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});
