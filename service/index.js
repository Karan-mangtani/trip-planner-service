
const { readCitiesjson, findTrip } = require('../utils/index');

module.exports = {
    getTrip: (req) => {
        const params = req.params;
        const cityCode = params.city;
        if (!cityCode) {
            reject({ status: 500, error: "Please select valid city" })
        }
        console.log("citycode", cityCode)
        return new Promise((resolve, reject) => {
            readCitiesjson('cities.json')
                .then(cities => {
                    findTrip(cityCode)
                        .then(response => {
                            resolve(response)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                .catch(err => {
                    reject(err)
                })
        });
    },
    getCityNames: (req) => {
        return new Promise((resolve, reject) => {
            readCitiesjson('cities.json')
                .then(cities => {
                    resolve(cities.map(({id, name, location}) =>({id, name, location})))
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}