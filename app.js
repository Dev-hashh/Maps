const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'ejs'); // enable EJS
app.use(express.static('public')); // serve static files like leaflet.css/js
app.use(express.urlencoded({ extended: true })); // for form data

app.get('/', (req, res) => {
    res.render('index', { data: null });
});

app.post('/', async(req, res) => {
    const location = req.body.location; // get form data

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&addressdetails=1`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'test-app (youremail@example.com)' }
        });

        const data = response.data.length ? response.data[0] : null;
        res.render('index', { data }); // render map with location
    } catch (err) {
        console.error('Error fetching location:', err.message);
        res.render('index', { data: null });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});