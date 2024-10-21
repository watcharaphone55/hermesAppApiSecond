import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { RiderRegisterReq } from "../models/Request/rider_register_req";

export const router = express.Router();

// select all rider
router.get('/:rid', (req, res) => {
    let rid = req.params.rid;

    let sql = 'SELECT * FROM rider WHERE rid = ?'

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

router.put("/update/:rid", (req, res) => {
    const uid = req.params.rid; 
    const users = req.body; 

    // คำสั่ง SELECT เพื่อตรวจสอบว่ามีผู้ใช้ที่มี uid นี้หรือไม่
    const selectSql = `SELECT * FROM rider WHERE rid = ?`;
    
    conn.query(selectSql, [uid], (err, results) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        // ตรวจสอบว่ามีผลลัพธ์จากการ SELECT หรือไม่
        if (results.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        // ถ้าพบผู้ใช้ ให้ทำการ UPDATE ข้อมูล
        const updateSql = `
        UPDATE rider 
        SET 
            name = ?, 
            password = ?, 
            plate = ?, 
            picture = ? 
        WHERE rid = ?`; // เปลี่ยนจาก id เป็น uid

        const formattedUpdateSql = mysql.format(updateSql, [
            users.name,
            users.password,
            users.plate,
            users.picture,
            uid // ใช้ uid ให้สอดคล้องกัน
        ]);

        // ทำการ UPDATE ข้อมูล
        conn.query(formattedUpdateSql, (err, result) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            } else {
                res.json({ affected_rows: result.affectedRows });
            }
        });
    });
});

