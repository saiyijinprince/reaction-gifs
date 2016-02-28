/**
 * Created by akabeera on 2/18/2016.
 */
module.exports = function(app) {
    app.route('/gifs')
        .get(function (req, res) {
            res.json(
                [
                    {
                        "id":"nope",
                        "gifs": [
                            "ElCPi",
                            "IzUaG",
                            "BTR34",
                            "Sj6HN",
                            "R2v3c6H",
                            "v6JHwtK",
                            "RMsnqCF",
                            "PFRaVV6",
                            "ZQ4RyHo",
                            "biHam6L",
                            "LCUjeU1",
                            "0U2cnck",
                            "t6jxZYx",
                            "AT5je46",
                            "G4QbkbX",
                            "vFhh4JW",
                            "nqQQlXM",
                            "XdecdeT",
                            "E3jqOHP",
                            "ffgtvJG",
                            "ltmY2rg",
                            "O8G3idn",
                            "PeOkjoB",
                            "qGr2jmT",
                            "YsEvEu3",
                            "SqUnkNY",
                            "0fY0s03",
                            "GqUfvsA",
                            "tXysky4",
                            "woZL9TO",
                            "fFUjGje",
                            "YkoCx",
                            "dEFHI",
                            "vTqWh",
                            "GPqtwr7",
                            "NpAbl",
                            "megqR",
                            "8waIx0Y",
                            "RVBi3T1"
                        ],
                        "meta":{}
                    },
                    {
                        "id": "abandon thread",
                        "gifs": [
                        ],
                        "meta":{}
                    },
                    {
                        "id": "shut up",
                        "gifs": [
                            "KOoBDaK",
                            "Snf7uIV",
                            "pNh0taM",
                            "JolxCAB",
                            "CS03xWv",
                            "R9WnseD",
                            "W4fhqtP",
                            "9ThfjKP",
                            "8JVdY3D",
                            "2x9zLKy",
                            "c6uDaYV",
                            "kb5YcqK",
                            "2ewqmHP",
                            "AWPBlR9",
                            "xqjErKg",
                            "i3ZlsPX",
                            "3QOyC35",
                            "mO1sPoT"
                        ],
                        "meta":{}
                    }
                ]
            );
        });
    app.route('/cats')
        .get(function(req, res) {
           res.json(
               {
                   "availableSections": [
                       "NOPE",
                       "ABANDON THREAD",
                       "SHUT UP"
                     ]
               }
           );
        });
};