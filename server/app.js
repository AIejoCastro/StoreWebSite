const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
