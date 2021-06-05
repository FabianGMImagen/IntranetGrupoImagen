var config = {
    TR_TEST_94: {
        user: 'sa',
        password: 'housemd',
        server: '10.106.1.94',
        database:'TR_TEST',
        options: {tdsVersion:'7_1'}
    }
    ,
    WO_TRAFFIC_INTERNATIONAL_85: {
        user: 'sa',
        password: 'd1nosauri0Z',
        server: '10.29.128.85', 
        database: 'WO_TRAFFIC_INTERNATIONAL' 

    }
    ,
    Tika: {
        user: 'sa',
        password: 'd1nosauri0Z',
        server: '10.29.128.85',
        database:'db_tk',
        options: {tdsVersion:'7_1'}

    }
    ,
    WEB:{
        user: 'sa',
        password: 'd1nosauri0Z',
        server: '10.29.128.63',
        database: 'ImagenFinanzas',
        options: {tdsVersion:'7_1'}
    }
    ,
    SERWEB:{
        user: 'sa',
        password: 'd1nosauri0Z',
        server: '10.29.128.63',
        database: 'ImagenFinanzasProd',
        options: {tdsVersion:'7_1'}
    }


};

module.exports = config;
    