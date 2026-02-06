import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import outhRouter from './src/routes/outh.route.js';
import errorMiddleware from './src/middleware/Error.Middlaware.js';
dotenv.config();


// inistilize express app
const app = express();


// seting cors options

const allowlist = ['http://localhost:5173', 'http://localhost:5174'];
const allowGetMethods = ['*'];

const corsOptions = {
    
    origin: function (origin, callback) {
        // const origin = req.header('Origin');
        if(!origin) {return callback(null, {origin: true, methods: ['GET']})};
        if(allowlist.includes(origin)){
            return callback(null,
                {
                    origin: true,
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                    credentials: true
                }
            );
        }
        if(allowGetMethods.includes(origin)){
            return callback(null, {
                origin: true,
                methods: ['GET'],
                credentials: true
            })
        }
    }
}
// const allowlist = ['http://localhost:5173', 'http://localhost:5174'];

// const corsOptions = {
//   origin: function (origin, callback) {

//     // Postman / curl / server-to-server
//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowlist.includes(origin)) {
//       return callback(null, true);
//     }

//     return callback(new Error('Not allowed by CORS'));
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   credentials: true
// };

app.use(cors(corsOptions));




// calling rate limiter

const globalRateLimiter = rateLimit({                      
    windowMs: 1000, // 15 minutes
    max: 7, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req,res)=>{
        const ip = req.ip;
        console.log(`IP ${ip} has exceeded the request limit.`);
        res.status(429).json({
            status: 'fail',
            message: 'Too many requests from this IP, please try again after 15 minutes'
        })
    }
})    


app.use(globalRateLimiter)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use('/api/v1/users', outhRouter);


// implementing error middleware 

app.use(errorMiddleware)



export default app;