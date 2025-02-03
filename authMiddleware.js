const JWT = require('jsonwebtoken');

module.exports = async (_req, _res, _next) => {
    try {
        // Get the Authorization header
        const authHeader = _req.headers["authorization"];
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return _res.status(401).send({
                success: false,
                message: 'UNAUTHORIZED USER: Missing or invalid Authorization header'
            });
        }

        // Extract the token
        const token = authHeader.split(' ')[1]

        // Verify the token
        JWT.verify(token, process.env.JWT_SECRET, (err, decode ) => {
            if (err) {
                return _res.status(401).send({
                    success: false,
                    message: 'UNAUTHORIZED USER: Invalid token'
                });
            }

            // Attach decoded user ID to the request
            _req.body.id = decode.id;
            _next();
        });
    } catch (error) {
        console.error(error);
        _res.status(500).send({
            success: false,
            message: 'Error IN AUTH API',
            error
        });
    }
};

