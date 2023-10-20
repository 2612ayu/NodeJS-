const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerDocs = require('./Swagger/Swagger');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Database connection
const uri = "mongodb://localhost:27017/ToDo_Backend";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define routes
app.use("/api/todos", require('./Routes/todoRoutes'));
app.use("/api/user/login", require('./Routes/authRoutes'));
app.use("/api/user/register", require('./Routes/userRoutes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 8000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
