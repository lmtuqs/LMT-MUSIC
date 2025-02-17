const LMT_COOKIE = {
    
    cookieName: "lmt-music-token",

    lifecycle: 7,

    setCookie: (res, value) => {
        res.cookie(LMT_COOKIE.cookieName, value, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: LMT_COOKIE.lifecycle * 24 * 60 * 60 * 1000
        })
    }
}

module.exports = LMT_COOKIE;

