const LMT_MAILER = require('./mailer');
const LMT_JWT = require('./jwt');
const LMT_COOKIE = require('./cookie');
const allowEmails = ['leminhtung2355@gmail.com'];
const users = {};
function initRoutes(app) {
    app.get('/login', (req, res) => {
        res.clearCookie(LMT_COOKIE.cookieName);
        res.render('pages/login', { title: 'Login', layout: 'layouts/auth_layout' })
    });

    app.get('/', LMT_JWT.authenticate, (req, res) => {
        res.render('pages/home', { title: 'LMT-MUSIC' })
    });

    app.get('/music', LMT_JWT.authenticate, (req, res) => {
        res.render('pages/music', { title: 'LMT-MUSIC' })
    });
    
    app.post('/send-pin', async (req, res) => {

        const { email } = req.body;

        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;              

        if (!email || !regex.test(email) || !allowEmails.includes(email)) 
            return res.status(400).json({ message: 'Email bạn nhập không chính xác!'});
        
        users[email] = {
            pin: LMT_MAILER.generatePIN(),
            expires: Date.now() + 5 * 60 * 1000
        };  

        try {
            await LMT_MAILER.sendPIN(email, users[email].pin);
            res.status(200).json({ message: 'Mã xác nhận đã được gửi, hãy kiểm tra email của bạn!', status: true});
        } catch (e) {
            const error = `An error occurred while sending email: ${e.message}`;
            console.error(error);
            return res.status(500).json({message: error});
        }        

    })

    app.post("/login", (req, res) => {

        const { email, pin } = req.body;

        if (!email || !pin || !allowEmails.includes(email)) 
            return res.status(400).json({ message: "Email và mã xác nhận không chính xác!" });
    
        const user = users[email];

        if (!user || user.expires < Date.now()) return res.status(400).json({ message: "Mã xác nhận đã hết hạn" });        
        
        if (user.pin != pin) return res.status(400).json({ message: "Mã xác nhận không hợp lệ" });                
        
        delete users[email];        
        
        const token = LMT_JWT.sign(email);

        LMT_COOKIE.setCookie(res, token);

        res.status(200).json({ message: "Xác thực thành công", url: '/' });
    });
}

module.exports = initRoutes;