const express = require('express');
const cors = require('cors');
const app = express();

// CORS middleware to allow requests from frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow only frontend origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type'], // Allow these headers
}));

app.use(express.json()); // Middleware to parse JSON requests

// Define a GET route for '/'
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Backend! Ready for your requests." });
});

// Define a POST route for '/'
app.post('/', (req, res) => {
  console.log(req.body); // Log the request payload
  const userMessage = req.body.contents[0]?.parts[0]?.text; // Extract user message

  // Prepare the bot's response
  const botResponse = `You said: "${userMessage}". Here is the bot's response.`;

  res.json({
    response: botResponse,
  });
});

// Handle OPTIONS requests for preflight
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Start the server
app.listen(5000, () => console.log('Server running on http://127.0.0.1:5000'));
