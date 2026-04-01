// 1. Import Express
const express = require('express');
const app = express();

// 2. Set EJS as the view engine
app.set('view engine', 'ejs');

// 3. Tell Express where to find static files (CSS, Images, etc.)
app.use(express.static('public'));

// 4. Create the main route for your Kiko Clone
app.get('/', (req, res) => {
    // This looks inside the 'views' folder for 'index.ejs' and sends it to the browser
    res.render('index'); 
});
// This tells Express to load contact-us.ejs when someone goes to /contact-us
app.get('/contact-us', (req, res) => {
    res.render('contact-us'); 
});
// 5. Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Kiko Milano Server is running at http://localhost:${PORT}`);
});