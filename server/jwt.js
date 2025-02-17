const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_code';
const LMT_COOKIE = require('./cookie');

const LMT_JWT = {    

    authenticate: (req, res, next) => {

        const token = req.cookies[LMT_COOKIE.cookieName];  
        
        return next();
           
        if (!token) {
            return res.redirect('/login')            
        }    
        
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) 
                return res.redirect('/login')            
            req.user = user;
            next();
        });        
    },

    sign: (email) => {
        return jwt.sign({ email: email, lastSignIn: Date.now() }, JWT_SECRET, { expiresIn: `${LMT_COOKIE.lifecycle}d` });    
    }
}

module.exports = LMT_JWT;