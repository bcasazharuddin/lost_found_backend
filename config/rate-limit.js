const RateLimit = require('express-rate-limit');

module.exports = {
    limiter: () => {
        return RateLimit({
            windowMs:  15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
            keyGenerator: (req, res) => {
                // Use the direct remote IP address
                return req.ip;
              },
            // handler: (req, res) => {
            //     res.status(429).json({
            //         message: 'Too many requests, please try again later.',
            //     });
            // },
        })
    }
};