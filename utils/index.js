const fs = require('fs');
const { connect } = require('http2');

let cityByContinent = {};
let currentCity = {};
let cityArray = [];
let sequence = ['asia', 'africa', 'europe', 'north-america', 'south-america', 'oceania']

function findCityById(cityCode) {
    return cityArray.find(city => city.id === cityCode);

}

function findTrip(cityCode) {
    return new Promise((resolve, reject) => {
        currentCity = findCityById(cityCode);
        if (!currentCity) {
            reject({ status: 500, error: "Please select valid city" })
        }
        cityByContinent = groupBy(cityArray, "contId");
        const travellingCities = findNearestCitiesAmongContinent({...currentCity, distance: 100000});// pre-init distance
        resolve(travellingCities);
    })
}

function readCitiesjson(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(`utils/${fileName}`, (err, data) => {
            if (err || !data) {
                console.log("err", err);
                reject(err)
            };
            cityArray = JSON.parse(data);
            resolve(cityArray)
        });
    })
}

const groupBy = (arr, key) => {
    const initialValue = {};
    return arr.reduce((acc, cval) => {
        const myAttribute = cval[key];
        acc[myAttribute] = [...(acc[myAttribute] || []), cval]
        return acc;
    }, initialValue);
};

function findNearestCitiesAmongContinent(currentCity) {
    let nearestCities = [currentCity];
    try {
        let i =0;
        while (i < 5) {
            const nextCity = (sequence.indexOf(currentCity.contId) + i + 1) % 6;
            const cities = cityByContinent[sequence[nextCity]]
            nearestCities.push(cities[0]);
            cities.forEach(city => {

                const distance = getDistanceFromLatLonInKm(nearestCities[i].location.lat, nearestCities[i].location.lon, city.location.lat, city.location.lon);
                if(nearestCities[i].distance > distance) {
                    nearestCities[i].distance = distance;
                    nearestCities[i+1] = {...city, distance: 100000}; //pre-init distance of next destination
                }

            })
            i++;
        }
        nearestCities[nearestCities.length - 1].distance = getDistanceFromLatLonInKm(nearestCities[0].location.lat, nearestCities[0].location.lon,  nearestCities[nearestCities.length - 1].location.lat,  nearestCities[nearestCities.length - 1].location.lon);
    }
    catch (err) {
        console.log("errr", err)
        return [];
    }
    console.log("near",nearestCities)
    return nearestCities;
}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

module.exports = {
    readCitiesjson,
    findTrip,
}