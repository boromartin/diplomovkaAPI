const express = require('express')
const app = express()
const cors = require('cors')
const mqtt = require('mqtt')
const util = require('util');

app.use(cors());
app.use(express.json());


async function getDeviceData (conn, ageLimit, DeviceID, TableName, column1, column2) {
    let [rows, fields] = await conn.query('SELECT Time(Time) AS x, ' + column1 + ' AS y1, '+ column2 + ' AS y2 FROM ' + TableName + ' WHERE DeviceID="' + DeviceID + '" AND Time > now() - INTERVAL ' + ageLimit + ' minute ORDER BY ID DESC;');
    return rows;
}


async function getChartData (ageLimit, DeviceID, TableName, column1, column2, res) {
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({user: "root", host: "192.168.1.10", port: 3306, password: "123456", database: "SmartRoomData"});

    compiledData = await getDeviceData(conn, ageLimit, DeviceID, TableName, column1, column2)

    res.send(compiledData)
    conn.end()
}


app.listen(3002, () => {
    console.log("server running at 3002");

});

app.get("/getChartData", (req, res) => { 
    getChartData(req.query.age, req.query.DeviceID, req.query.TableName, req.query.column1, req.query.column2, res)
    console.log(req.query.column1, req.query.column2)
})
    



