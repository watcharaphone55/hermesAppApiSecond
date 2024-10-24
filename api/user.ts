import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UserRegisterReq } from "../models/Request/user_register_req";
import { RiderRegisterReq } from "../models/Request/rider_register_req";
import { SelectRiderPhone } from "../models/Response/rider_phone_res";

export const router = express.Router();

// select user by uid
router.get('/:uid', (req, res) => {
    let uid = req.params.uid;

    let sql = 'SELECT * FROM user WHERE uid = ?'

    sql = mysql.format(sql, [
        uid
    ])

    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.json(result);
        }
    })
});

// select user by some phone
// PHONE SHOW SELF FIX IT TO NOT SHOW YOURSELF
router.get('/search/:phone/:uid', (req, res) => {
    let phone = req.params.phone;
    let uid = req.params.uid;
    let sql = 'SELECT * FROM user WHERE phone LIKE ? AND type = 1 AND uid != ?';

    sql = mysql.format(sql, [
        `${phone}%`,
        uid
    ]);

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
    let users: UserRegisterReq = req.body;

    // SQL query to check if the phone number exists
    let sql_check = "SELECT phone FROM rider WHERE phone = ?";
    let sql_insert = "INSERT INTO user (phone, name, password, address, lat, lng, picture) VALUES (?,?,?,?,?,?,?)";

    // Check if the phone number exists
    conn.query(sql_check, [users.phone], (err, result) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        if (result.length > 0) {
            // Phone number already exists
            return res.status(409).json({ msg: "Phone number already registered" });
        }

        // Proceed to insert the new user
        const sql = mysql.format(sql_insert, [
            users.phone,
            users.name,
            users.password,
            users.address,
            users.lat,
            users.lng,
            users.picture,
        ]);

        conn.query(sql, (err, result) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }

            // Successful registration
            res.status(201).json({ msg: "User registered successfully", userId: result.insertId });
        });
    });
});

// Get customer
router.get("/", (req, res) => {
    
    conn.query('SELECT * FROM user WHERE type = 1', (err, result, fields)=>{
      res.json(result);
    });
  });

  router.get("/home/:uid", (req, res) => {
    let uid = req.params.uid;
    let sql = 'SELECT * FROM user WHERE type = 1 AND uid != ?'

    sql = mysql.format(sql, [
        uid
    ]);
    conn.query(sql, (err, result, fields)=>{
      res.json(result);
    });
  });

// login user
router.post("/login", (req, res) => {
    const { phone, password } = req.body

    let sql = `
      SELECT uid, NULL AS rid, phone, password, type
      from user
      where phone = ?
      and password = ?

      UNION 

      SELECT NULL AS uid, rid, phone, password, type
      from rider
      where phone = ? 
      and password = ?
    `;

    sql = mysql.format(sql, [
        phone,
        password,
        phone,
        password
    ])

    conn.query(sql, (err, result) => {
        res.json(result);
    })


    // const query = mysql.format('SELECT * FROM user WHERE phone = ? AND password = ?', [phone, password]);
    // conn.query(query, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(400).json({ msg: err.message });
    //     }
    //     res.json(result[0]); 
    // });
  });

// delete user from uid
// router.delete("/delete", (req, res) => {
//     let sql = 'DELETE FROM user WHERE uid = 16';

//     conn.query(sql, (err, result) => {
//         if(err){
//             res.status(400).json(err.message);
//         }else{
//             res.json(result);
//         }
//     })
// });

router.put("/update/:uid", (req, res) => {
    const uid = req.params.uid;
    const newData = req.body;

    // Step 1: SELECT the current data from the database
    const selectSql = `SELECT * FROM user WHERE uid = ?`;

    conn.query(selectSql, [uid], (err, results) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }

        // Check if the user exists
        if (results.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Retrieve the current data
        const currentData = results[0];

        // Step 2: Update fields if they have new values, otherwise keep old values
        const updatedUser = {
            name: newData.name || currentData.name,
            password: newData.password || currentData.password,
            address: newData.address || currentData.address,
            lat: (newData.lat !== undefined && newData.lat !== 0) ? newData.lat : currentData.lat,
            lng: (newData.lng !== undefined && newData.lng !== 0) ? newData.lng : currentData.lng,
            picture: newData.picture || currentData.picture
        };

        // SQL for updating user data
        const updateSql = `
        UPDATE user 
        SET 
            name = ?, 
            password = ?, 
            address = ?, 
            lat = ?, 
            lng = ?, 
            picture = ? 
        WHERE uid = ?`;

        const formattedUpdateSql = mysql.format(updateSql, [
            updatedUser.name,
            updatedUser.password,
            updatedUser.address,
            updatedUser.lat,
            updatedUser.lng,
            updatedUser.picture,
            uid
        ]);

        // Step 3: Execute the UPDATE query
        conn.query(formattedUpdateSql, (err, result) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            } else {
                res.json({ affected_rows: result.affectedRows });
            }
        });
    });
});





