const jwt = require('jsonwebtoken');

function verifyRole(roles){
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).json({ message : 'Unauthorized' });

        try{
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if(!roles.includes(user.role)){
                return res.status(403).json({ message : 'Access denied' });
            }
            req.user = user;
            next();

        } catch (err) {
            res.status(401).json({message : 'Invalid token'});
        }
    }
}

module.exports = { verifyRole };