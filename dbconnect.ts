import mysql from "mysql";

export const conn = mysql.createPool({
    connectionLimit: 10,
    host: "202.28.34.197",
    user: "web66_65011212077",
    password: "65011212077@csmsu",
    database: "web66_65011212077",
})

// export const conn = mysql.createPool({
//     connectionLimit: 10,
//     host: "mysql-lottomuu.alwaysdata.net",
//     user: "lottomuu",
//     password: "lotto123",
//     database: "lottomuu_database",
// })

