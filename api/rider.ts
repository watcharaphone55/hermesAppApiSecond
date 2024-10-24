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
router.post('/register', (req, res) => {
    let riders: RiderRegisterReq = req.body;
    console.log(riders);

    // SQL query to check if the phone number exists in the user table
    let sql_check = "SELECT phone FROM user WHERE phone = ?";
    let sql_insert = "INSERT INTO rider (phone, name, password, picture, plate) VALUES (?,?,?,?,?)";

    // Check if the phone number exists in the user table
    conn.query(sql_check, [riders.phone], (err, result) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        if (result.length > 0) {
            // Phone number already exists in the user table
            return res.status(409).json({ msg: "Phone number already registered in user table" });
        }

        // Proceed to insert the new rider
        const sql = mysql.format(sql_insert, [
            riders.phone,
            riders.name,
            riders.password,
            riders.picture,
            riders.plate
        ]);

        conn.query(sql, (err, result) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }

            // Successful registration
            res.status(201).json({ 
                msg: "Rider registered successfully", 
                affected_rows: result.affectedRows, 
                last_idx: result.insertId 
            });
        });
    });
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
            plate = ?, 
            picture = ? 
        WHERE rid = ?`; // เปลี่ยนจาก id เป็น uid

        const formattedUpdateSql = mysql.format(updateSql, [
            users.name,
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

