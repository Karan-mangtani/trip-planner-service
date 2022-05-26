const service = require('./index');

function responseWrapper(req, res, p) {
    p.then((data) => {
        res.status(200).json(data);
    }).catch((e) => {
        res.status(e.status ? e.status : 500).json(e);
    });
}

module.exports = (app, router) => {
    router.get('/get-trip/:city', (req, res) => responseWrapper(req, res, service.getTrip(req)));
    router.get('/get-city-names', (req, res) => responseWrapper(req, res, service.getCityNames(req)));
};