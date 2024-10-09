const http = require('http');

// Create a simple CORS setup manually
const allowCors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api') {
        // Set the CORS headers
        allowCors(req, res);

        // Set the response content type to JSON
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);

        // Respond with the JSON data
        res.end(JSON.stringify({ "fruits": ["apple", "banana", "orange"] }));
    } else {
        // Handle other routes or methods
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Listen on port 3000
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
