const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found')
        return res.status(403).json({ error: 'Unauthorized' })
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db.collection('users')
                .doc(req.user.uid)
                .get();
        })
        .then(doc => {
            req.user.username = doc.data().firstName + ' ' + doc.data().lastName;
            req.user.imageUrl = doc.data().imageUrl;
            req.user.following = doc.data().following;
            req.user.following.push(req.user.uid);
            return next();
        })
        .catch(err => {
            console.error('Error while verifying token', err);
            return res.status(403).json(err);
        })
}