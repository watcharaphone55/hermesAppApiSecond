import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { RiderRegisterReq } from "../models/Request/rider_register_req";

export const router = express.Router();

// select all rider
router.get('/:rid', (req, res) => {
    let rid = req.params.rid;

    let sql = 'SELECT * FROM user WHERE rid = ?'

    sql = mysql.format(sql, [
        rid
    ])

    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.json(result);
        }
    })
});

// register for user
router.post('/register', (req, res)=>{
    let riders: RiderRegisterReq = req.body;
    console.log(riders);
    

    let sql = "INSERT INTO rider (phone, name, password, picture, plate) VALUES (?,?,?,?,?)";
    sql = mysql.format(sql, [
        riders.phone,
        riders.name,
        riders.password,
        riders.picture,
        riders.plate
    ]);
    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.json({affected_rows: result.affectedRows, last_idx: result.insertId});
        }
    })
});

