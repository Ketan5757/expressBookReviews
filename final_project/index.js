const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    // Remove "Bearer " from the token string if present
    const tokenWithoutBearer = token.split(' ')[1];

    // Verify token using the secret key
    jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        // Attach the decoded token information to the request object for later use
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
