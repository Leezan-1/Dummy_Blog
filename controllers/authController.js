const signUpController = async (req, res) => {
    res.send(req.method, 'signup controller.');
}

module.exports = { signUpController };