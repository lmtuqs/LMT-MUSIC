const nodemailer = require('nodemailer');
const auth = {
    user: "leminhtung2355@gmail.com",
    pass: "myog xljs hogd ceqv",
}

const appName = "LMT-MUSIC"

const transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: auth,
});

const LMT_MAILER = {

    generatePIN: () => {
        return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    },

    sendPIN: async (mail, pin) => {

        await transporter.sendMail({
            from: {
                name: appName,
                address: 'lmt-music.vercel.app'
            },
            to: mail,
            subject: `${pin} là mã xác nhận email của bạn`,
            // text: ``
            html: `<div style="background: transparent; padding: 8px;">
                    <div style="width: 400px; max-width: 100vw; border: 1px solid #000; border-radius: 8px; overflow: hidden; margin: 0 auto;">
                        <div style="background: #000; text-align: center; padding: 12px 0; color: #fff; font-weight: bold;">${appName}</div>
                        <div style="background: #FFFFF0; text-align: center; padding: 8px;">
                            <p>Bạn đang yêu cầu cấp mã xác thực cho email ${mail}.</p>
                            <div style="text-transform: uppercase; font-weight: bold; display: inline-flex; text-align: center;">
                                <p>OTP: </p>
                                <p style="color: orange; margin-left: 4px;">${pin}</p>                                
                            </div>
                            <p style="font-style: italic;">(<span style="color: red;">*</span>) Lưu ý: Mã OTP chỉ có giá trị trong vòng 5 phút.</p>
                        </div>
                    </div>
                  </div>`
        })

        console.log(`Đã gửi mail đến ${mail} với mã pin ${pin} vào ${Date.now()}`);
        
    }

}

module.exports = LMT_MAILER