exports.myMiddleware = (req, res, next) => {
    req.name = 'myname';
    res.cookie('name', 'this is a cookie', {maxAge: 9000000});
    next();
};

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};