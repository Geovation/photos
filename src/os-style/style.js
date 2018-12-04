const OSstyle = {
    "version": 8,
    "name": "OS Outdoor",
    "metadata": {
        "mapbox:autocomposite": true,
        "mapbox:type": "template",
        "mapbox:print": {
            "units": "in",
            "width": 8.5,
            "height": 11,
            "resolution": 300,
            "format": "png"
        },
        "mapbox:sdk-support": {
            "js": "0.45.0",
            "android": "6.0.0",
            "ios": "4.0.0"
        },
        "mapbox:groups": {
            "95de6b6a9598813bfa2767abe8c13e6b": {
                "name": "Names Group",
                "collapsed": false
            },
            "b70308493053f7bbb91b528ae2a71241": {
                "name": "Road Level 0",
                "collapsed": true
            },
            "544b2a8d8b4148c11cbdbcbf6ea8173d": {
                "name": "Road Level 1",
                "collapsed": true
            }
        }
    },
    "center": [
        -1.445462913521851,
        50.924985957591986
    ],
    "zoom": 13.822550415023533,
    "bearing": -1.393608084872767,
    "pitch": 0,
    "light": {
        "intensity": 0.2
    },
    "sources": {
        "composite2": {
            "url": "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/data/vector/open-zoomstack/config.json",
            "type": "vector",
        },
    },
    "sprite": "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/sprites",
    "glyphs": "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/fonts/{fontstack}/{range}.pbf",
    "layers": [
        // {
        //     "id": "background",
        //     "type": "background",
        //     "layout": {},
        //     "paint": {
        //         "background-color": "#f4f4ee"
        //     }
        // },
        // {
        //     "id": "sea shadow",
        //     "type": "fill",
        //     "source": "composite2",
        //     "source-layer": "sea",
        //     "layout": {},
        //     "paint": {
        //         "fill-color": "hsl(195, 67%, 65%)",
        //         "fill-translate": [
        //             "interpolate",
        //             [
        //                 "linear"
        //             ],
        //             [
        //                 "zoom"
        //             ],
        //             5,
        //             [
        //                 "literal",
        //                 [
        //                     -0.2,
        //                     -0.2
        //                 ]
        //             ],
        //             15,
        //             [
        //                 "literal",
        //                 [
        //                     -1,
        //                     -1
        //                 ]
        //             ]
        //         ],
        //         "fill-translate-anchor": "viewport"
        //     }
        // },
        // {
        //     "id": "sea",
        //     "type": "fill",
        //     "source": "composite2",
        //     "source-layer": "sea",
        //     "layout": {},
        //     "paint": {
        //         "fill-color": "hsl(195, 68%, 80%)"
        //     }
        // },
        {
            "id": "national-parks",
            "type": "fill",
            "source": "composite2",
            "source-layer": "national-parks",
            "minzoom": 5,
            "maxzoom": 12,
            "layout": {},
            "paint": {
                "fill-color": "#e2efce",
                "fill-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            5,
                            1
                        ],
                        [
                            9,
                            1
                        ],
                        [
                            12,
                            0.1
                        ]
                    ]
                }
            }
        },
        {
            "id": "built up areas",
            "type": "fill",
            "source": "composite2",
            "source-layer": "buildings",
            "minzoom": 5,
            "maxzoom": 11,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "fill-color": "hsl(46, 24%, 82%)",
                "fill-opacity": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.2,
                    11,
                    0.4
                ]
            }
        },
        {
            "id": "sites",
            "type": "fill",
            "source": "composite2",
            "source-layer": "sites",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "fill-color": [
                    "match",
                    [
                        "get",
                        "type"
                    ],
                    "Air Transport",
                    "#e6e6e6",
                    "Education",
                    "#f7eaca",
                    "Medical Care",
                    "#f3d8e7",
                    "Road Transport",
                    "#f7f3ca",
                    "Water Transport",
                    "#d8e6f3",
                    "hsl(55, 74%, 88%)"
                ],
                "fill-opacity": 0.6
            }
        },
        {
            "id": "greenspaces",
            "type": "fill",
            "source": "composite2",
            "source-layer": "greenspaces",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "fill-color": "#e3f0db",
                "fill-outline-color": "#d1e7c3",
                "fill-opacity": 1,
                "fill-antialias": false
            }
        },
        {
            "id": "greenspaces outlines",
            "type": "line",
            "source": "composite2",
            "source-layer": "greenspaces",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "line-color": "#b9dba4",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    0.1,
                    15,
                    0.3,
                    18,
                    0.6
                ]
            }
        },
        {
            "id": "woodland",
            "type": "fill",
            "source": "composite2",
            "source-layer": "woodland",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "fill-color": "#d1e7c3",
                "fill-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            6,
                            0.3
                        ],
                        [
                            11,
                            1
                        ]
                    ]
                }
            }
        },
        {
            "id": "contours",
            "type": "line",
            "source": "composite2",
            "source-layer": "contours",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "line-width": [
                    "match",
                    [
                        "get",
                        "type"
                    ],
                    "Normal",
                    0.2,
                    0.5
                ],
                "line-opacity": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    9,
                    0.15,
                    11,
                    0.25,
                    12,
                    0.6
                ],
                "line-color": "hsl(36, 16%, 45%)"
            }
        },
        {
            "id": "waterlines",
            "type": "line",
            "source": "composite2",
            "source-layer": "waterlines",
            "minzoom": 5,
            "filter": [
                "in",
                "type",
                "Surface",
                "surface"
            ],
            "layout": {},
            "paint": {
                "line-color": "#a4daeb"
            }
        },
        {
            "id": "surfacewater shadow",
            "type": "fill",
            "source": "composite2",
            "source-layer": "surfacewater",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "fill-color": "#6ac4e2",
                "fill-translate": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    6,
                    [
                        "literal",
                        [
                            0,
                            0
                        ]
                    ],
                    15,
                    [
                        "literal",
                        [
                            -0.8,
                            -0.8
                        ]
                    ],
                    16,
                    [
                        "literal",
                        [
                            -1.5,
                            -1.5
                        ]
                    ],
                    20,
                    [
                        "literal",
                        [
                            -2,
                            -2
                        ]
                    ]
                ],
                "fill-translate-anchor": "viewport"
            }
        },
        {
            "id": "surfacewater",
            "type": "fill",
            "source": "composite2",
            "source-layer": "surfacewater",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "fill-color": "hsl(195, 68%, 80%)"
            }
        },
        {
            "id": "foreshore",
            "type": "fill",
            "source": "composite2",
            "source-layer": "foreshore",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "fill-color": "#ebebd3"
            }
        },
        {
            "id": "roads 0 Restricted Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "Restricted"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    3.5,
                    17,
                    7,
                    22,
                    60
                ],
                "line-dasharray": [
                    2,
                    0.5
                ]
            }
        },
        {
            "id": "roads 0 Local Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "Local"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    4.5,
                    17,
                    16,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 0 Minor Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "Minor"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5.5,
                    17,
                    20,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 0 B Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "B Road"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5.5,
                    17,
                    20,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 0 A Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "A Road"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5.5,
                    17,
                    20,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 0 Primary",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "Primary"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#77c776",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    6,
                    17,
                    22,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 0 Motorway",
            "type": "line",
            "metadata": {
                "mapbox:group": "b70308493053f7bbb91b528ae2a71241"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "0"
                ],
                [
                    "==",
                    "type",
                    "Motorway"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#08b8e8",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    6,
                    17,
                    22,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 1 Local Road case",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Local"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(60, 22%, 90%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    6,
                    15,
                    8.5,
                    17,
                    24,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 1 Minor Road case",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Minor"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(60, 22%, 90%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    6,
                    15,
                    9,
                    17,
                    28,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 1 B Road case",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "B Road"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(60, 22%, 90%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    6,
                    15,
                    9,
                    17,
                    28,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 1 A Road case",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "A Road"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(60, 22%, 90%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    6,
                    15,
                    9,
                    17,
                    28,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 1 Primary case",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Primary"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(60, 22%, 90%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    6,
                    15,
                    10,
                    17,
                    32,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 1 Motorway case",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Motorway"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "#ebebe0",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    6,
                    15,
                    10,
                    17,
                    32,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 1 Restricted Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Restricted"
                ]
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    3.5,
                    17,
                    7,
                    22,
                    60
                ],
                "line-dasharray": [
                    2,
                    0.5
                ]
            }
        },
        {
            "id": "roads 1 Local Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Local"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    4.5,
                    17,
                    16,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 1 Minor Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Minor"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5.5,
                    17,
                    20,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 1 B Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "B Road"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5.5,
                    17,
                    20,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 1 A Road",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "A Road"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(0, 0%, 100%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5.5,
                    17,
                    20,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 1 Primary",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Primary"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#77c776",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    6,
                    17,
                    22,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 1 Motorway",
            "type": "line",
            "metadata": {
                "mapbox:group": "544b2a8d8b4148c11cbdbcbf6ea8173d"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "==",
                    "level",
                    "1"
                ],
                [
                    "==",
                    "type",
                    "Motorway"
                ]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(193, 93%, 47%)",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    6,
                    17,
                    22,
                    22,
                    100
                ]
            }
        },
        {
            "id": "roads 2 case",
            "type": "line",
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 12,
            "filter": [
                "==",
                "level",
                "2"
            ],
            "layout": {
                "line-join": "round"
            },
            "paint": {
                "line-color": "#ebebe0",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    12,
                    2.5,
                    14,
                    3,
                    15,
                    9,
                    17,
                    24,
                    22,
                    120
                ]
            }
        },
        {
            "id": "roads 2",
            "type": "line",
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 5,
            "filter": [
                "==",
                "level",
                "2"
            ],
            "layout": {
                "line-cap": "square",
                "line-join": "round"
            },
            "paint": {
                "line-color": [
                    "match",
                    [
                        "get",
                        "type"
                    ],
                    "Motorway",
                    "#08b8e8",
                    "Primary",
                    "#77c776",
                    "hsl(0, 0%, 100%)"
                ],
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    0.35,
                    10,
                    1.75,
                    14,
                    2,
                    15,
                    5,
                    17,
                    18,
                    22,
                    100
                ]
            }
        },
        {
            "id": "rail",
            "type": "line",
            "source": "composite2",
            "source-layer": "rail",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "line-color": "#949197",
                "line-width": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    [
                        "match",
                        [
                            "get",
                            "type"
                        ],
                        "Multi Track",
                        0.6,
                        "Single Track",
                        0.5,
                        "Narrow Gauge",
                        0.5,
                        "tunnel",
                        0.6,
                        0.5
                    ],
                    17,
                    [
                        "match",
                        [
                            "get",
                            "type"
                        ],
                        "Multi Track",
                        2,
                        "Single Track",
                        1.5,
                        "Narrow Gauge",
                        1,
                        "tunnel",
                        1,
                        1
                    ]
                ],
                "line-opacity": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    0.2,
                    14,
                    1
                ]
            }
        },
        {
            "id": "road numbers under",
            "type": "symbol",
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 14,
            "filter": [
                "!in",
                "type",
                "Motorway",
                "Primary"
            ],
            "layout": {
                "symbol-placement": "line",
                "text-field": "{number}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    7,
                    15,
                    11,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro SemiBold"
                ]
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#858585"
            }
        },
        {
            "id": "Primary road numbers under",
            "type": "symbol",
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 14,
            "filter": [
                "==",
                "type",
                "Primary"
            ],
            "layout": {
                "symbol-placement": "line",
                "text-field": "{number}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    8,
                    15,
                    11,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro Bold"
                ]
            },
            "paint": {
                "text-halo-color": "#77c776",
                "text-halo-width": 1,
                "text-color": "#fff",
                "text-halo-blur": 0
            }
        },
        {
            "id": "Motorway numbers under",
            "type": "symbol",
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 14,
            "filter": [
                "==",
                "type",
                "Motorway"
            ],
            "layout": {
                "symbol-placement": "line",
                "text-field": "{number}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    8,
                    15,
                    11,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro Bold"
                ]
            },
            "paint": {
                "text-halo-color": "#08b8e8",
                "text-halo-width": 1,
                "text-color": "#fff",
                "text-halo-blur": 0
            }
        },
        {
            "id": "road names under",
            "type": "symbol",
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 14,
            "layout": {
                "symbol-placement": "line",
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    8,
                    15,
                    10,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-max-angle": 35
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#5c5c5c"
            }
        },
        {
            "id": "buildings",
            "type": "fill-extrusion",
            "source": "composite2",
            "source-layer": "buildings",
            "minzoom": 11,
            "layout": {},
            "paint": {
                "fill-extrusion-color": "#dcd7c6",
                "fill-extrusion-height": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    0,
                    15,
                    7
                ]
            }
        },
        {
            "id": "boundaries",
            "type": "line",
            "source": "composite2",
            "source-layer": "boundaries",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "line-width": 1,
                "line-color": "#c4c4c4",
                "line-opacity": 1
            }
        },
        {
            "id": "etl",
            "type": "line",
            "source": "composite2",
            "source-layer": "etl",
            "minzoom": 5,
            "layout": {},
            "paint": {
                "line-opacity": 0.4,
                "line-color": "hsl(0, 9%, 55%)",
                "line-dasharray": [
                    10,
                    5
                ]
            }
        },
        {
            "id": "road numbers",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 10,
            "maxzoom": 14,
            "filter": [
                "!in",
                "type",
                "Motorway",
                "Primary"
            ],
            "layout": {
                "symbol-placement": "line",
                "text-field": "{number}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    7,
                    15,
                    11,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro SemiBold"
                ]
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#858585"
            }
        },
        {
            "id": "Primary road numbers",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 10,
            "maxzoom": 14,
            "filter": [
                "==",
                "type",
                "Primary"
            ],
            "layout": {
                "symbol-placement": "line",
                "text-field": "{number}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    8,
                    15,
                    11,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro Bold"
                ]
            },
            "paint": {
                "text-halo-color": "#77c776",
                "text-halo-width": 1,
                "text-color": "#fff",
                "text-halo-blur": 0
            }
        },
        {
            "id": "Motorway numbers",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 10,
            "maxzoom": 14,
            "filter": [
                "==",
                "type",
                "Motorway"
            ],
            "layout": {
                "symbol-placement": "line",
                "text-field": "{number}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    8,
                    15,
                    11,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro Bold"
                ]
            },
            "paint": {
                "text-halo-color": "#08b8e8",
                "text-halo-width": 1,
                "text-color": "#fff",
                "text-halo-blur": 0
            }
        },
        {
            "id": "road names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "roads",
            "minzoom": 10,
            "maxzoom": 14,
            "layout": {
                "symbol-placement": "line",
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    8,
                    15,
                    10,
                    22,
                    20
                ],
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-max-angle": 35
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#5c5c5c"
            }
        },
        {
            "id": "contour labels",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "contours",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Index"
            ],
            "layout": {
                "text-field": [
                    "to-string",
                    [
                        "get",
                        "height"
                    ]
                ],
                "symbol-placement": "line",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    12,
                    7,
                    15,
                    9,
                    22,
                    20
                ],
                "text-letter-spacing": 0.05,
                "text-font": [
                    "Open Sans Regular"
                ],
                "text-max-angle": 35,
                "symbol-spacing": 250
            },
            "paint": {
                "text-color": "#b2a695",
                "text-halo-color": "hsla(60, 21%, 95%, 0.7)",
                "text-halo-blur": 1,
                "text-halo-width": 1
            }
        },
        {
            "id": "Motorway Junctions",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 14,
            "filter": [
                "==",
                "type",
                "Motorway Junction"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Bold"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    14,
                    11,
                    22,
                    20
                ]
            },
            "paint": {
                "text-halo-color": "hsl(193, 78%, 36%)",
                "text-color": "#fff",
                "text-halo-blur": 0,
                "text-halo-width": 10
            }
        },
        {
            "id": "Greenspace names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 13,
            "filter": [
                "==",
                "type",
                "Greenspace"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    13,
                    9,
                    14,
                    11
                ],
                "text-line-height": 1
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#438519"
            }
        },
        {
            "id": "Sites names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 13,
            "filter": [
                "==",
                "type",
                "Sites"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    13,
                    9,
                    14,
                    11
                ],
                "text-line-height": 1
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#a79720"
            }
        },
        {
            "id": "Landform names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Landform"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    9,
                    14,
                    11
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#af7631"
            }
        },
        {
            "id": "Landcover names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Landcover"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    9,
                    14,
                    11
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#af9031"
            }
        },
        {
            "id": "Water names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Water"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    9,
                    14,
                    11
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#318fae"
            }
        },
        {
            "id": "Woodland names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Woodland"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    9,
                    14,
                    11
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#599c30"
            }
        },
        {
            "id": "Small Settlement names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Small Settlements"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    12,
                    9,
                    14,
                    11
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "hsl(47, 66%, 27%)"
            }
        },
        {
            "id": "Suburban names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 10,
            "filter": [
                "==",
                "type",
                "Suburban Area"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    10.5,
                    14,
                    14
                ],
                "text-padding": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    6,
                    14,
                    2
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "hsl(47, 66%, 27%)",
                "text-opacity": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    0.8,
                    14,
                    1
                ]
            }
        },
        {
            "id": "railwaystation names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "railwaystation",
            "minzoom": 5,
            "layout": {
                "text-line-height": 1,
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    12,
                    9,
                    15,
                    13
                ],
                "icon-image": [
                    "match",
                    [
                        "get",
                        "type"
                    ],
                    "Railway Station",
                    "RS",
                    "London Underground Station",
                    "UG",
                    "Light Rapid Transit Station",
                    "LRTS",
                    "Light Rapid Transit Station And London Underground Station",
                    "LRTS-UG",
                    "Light Rapid Transit Station And Railway Station",
                    "RS-LRTS",
                    "Railway Station And London Underground Station",
                    "RS-UG",
                    ""
                ],
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-justify": "left",
                "text-offset": [
                    "match",
                    [
                        "get",
                        "type"
                    ],
                    "Railway Station",
                    [
                        "literal",
                        [
                            1,
                            0
                        ]
                    ],
                    "Light Rapid Transit Station",
                    [
                        "literal",
                        [
                            1,
                            0
                        ]
                    ],
                    "London Underground Station",
                    [
                        "literal",
                        [
                            1,
                            0
                        ]
                    ],
                    "Railway Station And London Underground Station",
                    [
                        "literal",
                        [
                            1.7,
                            0
                        ]
                    ],
                    "Light Rapid Transit Station And London Underground Station",
                    [
                        "literal",
                        [
                            1.5,
                            0
                        ]
                    ],
                    "Light Rapid Transit Station And Railway Station",
                    [
                        "literal",
                        [
                            1.7,
                            0
                        ]
                    ],
                    [
                        "literal",
                        [
                            0,
                            0
                        ]
                    ]
                ],
                "icon-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    12,
                    0.4,
                    15,
                    1
                ],
                "text-anchor": "left",
                "text-field": [
                    "to-string",
                    [
                        "get",
                        "name"
                    ]
                ]
            },
            "paint": {
                "text-halo-color": "#ffffff",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        },
        {
            "id": "airport names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "airports",
            "minzoom": 5,
            "layout": {
                "text-line-height": 1,
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    9,
                    15,
                    13
                ],
                "icon-image": "Airport",
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-justify": "left",
                "text-offset": [
                    0.8,
                    0
                ],
                "icon-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    0.8,
                    15,
                    1
                ],
                "text-anchor": "left",
                "text-field": [
                    "to-string",
                    [
                        "get",
                        "name"
                    ]
                ]
            },
            "paint": {
                "text-halo-blur": 1,
                "text-halo-width": 1,
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-color": "#303030"
            }
        },
        {
            "id": "Village names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "in",
                "type",
                "Hamlet",
                "Village"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    9,
                    9,
                    14,
                    15
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#655314"
            }
        },
        {
            "id": "Town names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Town"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Regular"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    7,
                    10,
                    14,
                    18
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "hsl(46, 67%, 13%)"
            }
        },
        {
            "id": "City names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "City"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro SemiBold"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    6,
                    10,
                    14,
                    20
                ]
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#342a07"
            }
        },
        {
            "id": "National Park names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "National Park"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro SemiBold"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    6,
                    8,
                    14,
                    15
                ],
                "text-letter-spacing": 0.05,
                "text-line-height": 1
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#599c30",
                "text-opacity": 0.8
            }
        },
        {
            "id": "Capital City names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "filter": [
                "==",
                "type",
                "Capital"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro Bold"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    11,
                    14,
                    26
                ],
                "text-letter-spacing": 0.05
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#342a07"
            }
        },
        {
            "id": "Country names",
            "type": "symbol",
            "metadata": {
                "mapbox:group": "95de6b6a9598813bfa2767abe8c13e6b"
            },
            "source": "composite2",
            "source-layer": "names",
            "minzoom": 5,
            "maxzoom": 10,
            "filter": [
                "==",
                "type",
                "Country"
            ],
            "layout": {
                "text-font": [
                    "Source Sans Pro SemiBold"
                ],
                "text-field": "{name}",
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    5,
                    18,
                    10,
                    30
                ],
                "text-letter-spacing": 0.2,
                "text-transform": "uppercase"
            },
            "paint": {
                "text-halo-color": "#f4f4ee",
                "text-halo-width": 1,
                "text-halo-blur": 1,
                "text-color": "#342a07",
                "text-opacity": 0.6
            }
        }
    ],
    "created": "2018-05-11T11:38:48.884Z",
    "id": "cjh1w236f0tj22sl87sm547vt",
    "modified": "2018-05-26T21:01:47.000Z",
    "owner": "Ordnance Survey",
    "visibility": "public",
    "draft": false
}

export { OSstyle }
