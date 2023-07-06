
import userService from '../services/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    console.log('your email: ' + email);
    let password = req.body.password;

    // Check user Data already done
    // !email = '', undefined, null
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password)

    // check email exist
    // compare password
    // return user info: role
    // access_token: JWT

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

module.exports = {
    handleLogin: handleLogin,
}