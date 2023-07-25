require('dotenv').config();
const host_ip = process.env.REACT_APP_HOST_IP
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const router = require('./router');

exports.start = () => {
    const app = express()
    app.use(express.json())
    app.use(cookieParser())     // For cookies implementation
    app.use(cors({
        credentials: true,
        origin: ['http://localhost:3000', 'https://localhost:3000','http://'+host_ip+':3000', 'https://'+host_ip+':3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type','Authorization','Origin','Accept','X-Requested-With','Access-Control-Request-Method','Access-Control-Request-Headers']
    }))
    app.use(express.urlencoded({ extended: true }))
    // Router
    app.use('/api/0.1', router);

    app.listen(3001, (err) => {
        if (err) { console.log(err) }
        else {console.log('Server started at port 3001')}
    })
}
