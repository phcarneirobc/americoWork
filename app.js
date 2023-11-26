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

// Substitua 'https://minhaurl' e 'minhaAPIKey' pelos seus dados reais
const supabase =
    supabaseClient.createClient('https://wubhxqwovvrplzrudmot.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Ymh4cXdvdnZycGx6cnVkbW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA0ODM4MzgsImV4cCI6MjAxNjA1OTgzOH0.WyqmNm7_gio092SRFL_Z0Gzzvj_bNuH3qTosMsZs0FQ');

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
        const { name, description, price } = req.body;

        // Verifique se todos os campos necessários estão presentes
        if (!name || !description || !price) {
            return res.status(400).send("Todos os campos são obrigatórios.");
        }

        const { error } = await supabase
            .from('products')
            .insert({
                name,
                description,
                price,
            });

        if (error) {
            return res.status(500).send(error.message);
        }

        res.status(201).send("Produto criado com sucesso!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno do servidor");
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
