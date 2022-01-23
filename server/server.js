const cors = require('cors')
const express = require('express')
const mysql2 = require('mysql2')
const app = express()
const upload = require('express-fileupload')
const sharp = require('sharp')
const fs = require('fs')
const http = require('http').createServer(app)
require('dotenv').config()
const omise = require('omise')({
    'publicKey': process.env.OMISE_PUBLIC_KEY,
    'secretKey': process.env.OMISE_SECRET_KEY,
})
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
})

console.log(process.env.OMISE_PUBLIC_KEY)

app.use(express.json())
app.use(cors())
app.use(upload())

// const createCard =async()=>{
//     const customer = await omise.customers.create({
//         'email': 'johon@gmai.com',
//         'description': 'jogon',
//         'card': 'tokn_test_5pg1vdn7ezb8xr8cji1'
//     })

//     const charge = await omise.charges.create({
//         'amount': 10000,
//         'currency': 'thb',
//         'customer': customer.id
//     })

//     console.log(charge)
// }

// createCard()

app.get("/test", (req, res) => {
    res.json("Hello")
})

app.post("/check_cookie", (req, res) => {
    const username = req.body.username

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
        if (err) throw err

        if (rs.length > 0 && rs) {
            res.json({ status: true })
        } else {
            res.json({ status: false })
        }
    })
})

app.post("/checkout-credit-card", async (req, res) => {

    let token = req.body.token
    let username = req.body.username
    let amount = req.body.amount

    let cart = req.body.cart
    let cvt_cart = JSON.stringify(cart)
    let time = req.body.time
    let store = req.body.store
    let tel = req.body.tel

    console.log(username)
    console.log(cart)
    console.log(time)
    console.log(store)
    console.log(tel)

    try {
        const customer = await omise.customers.create({
            'email': username,
            'description': 'You have just bought',
            'card': token
        })

        const charge = await omise.charges.create({
            'amount': amount * 100,
            'currency': 'thb',
            'customer': customer.id
        })


        dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
            if (err) throw err

            dbcon.query("SELECT * FROM users WHERE market = ? ", [store], (err, market) => {
                if (err) throw err

                let count = market[0].notification_order

                let result = count + 1

                dbcon.query("INSERT INTO orders (bill, time, owner_bill, store, tel_owner_bill) VALUES (?, ?, ?, ?, ?)", [cvt_cart, time, username, store, tel], (err, rs2) => {
                    if (err) throw err

                    dbcon.query("UPDATE users SET notification_order = ? WHERE market = ?", [result, store], (err, rs3) => {
                        if (err) throw err

                        dbcon.query("INSERT INTO storage (bill_storage, buyer, time, store, tel) VALUES (?, ?, ?, ?, ?)", [cvt_cart, username, time, store, tel], (err, rs4) => {
                            if (err) throw err

                            res.json({ amount: charge.amount, status: charge.status })
                        })
                    })
                })
            })
        })

    } catch (err) {
        console.log(err)
    }
})


io.on('connection', (socket) => {
    // console.log("Connected")

    // socket.on("connect_market", (payload) => { //ให้ร้านค้า เข้า room ของ ร้านค้าก่อน
    //     socket.join(payload)
    //     // console.log("You are join room : " + payload)
    // })

    // socket.on('notification', (payload) => { //ส่ง notification ให้กับ room ของร้านค้านั้นๆ
    //     console.log("Room : " + payload.room + " Text : " + payload.text)
    //     dbcon.query("SELECT * FROM users WHERE market = ?", [payload.room], (err, rs) => { //ดึงข้อมูลที่ market = argument ทีเ่ข้ามา
    //         if (err) throw err

    //         if (rs.length > 0) { // ถ้าเกิดว่า มีจริง If true
    //             socket.join(payload.room)
    //             socket.to(payload.room).emit("notify", { notify: payload.text })
    //             socket.disconnect()
    //         }
    //     })
    //     // socket.broadcast.emit("notify", {notify: payload.text})
    // })

    socket.on("get_name", (payload) => {
        // console.log("Market Name : "+ payload)
        dbcon.query("SELECT * FROM users WHERE username = ?", [payload], (err, rs) => {
            if (err) throw err

            socket.emit('notify_count', { notification_count: rs[0].notification_order })
        })
    })

    dbcon.query("SELECT * FROM orders WHERE confirm_market = ?", [1], (err, rs) => {
        if (err) throw err

        socket.emit("notify_count_rider", rs.length)
    })

    // socket.on("user", (user) => {
    //     console.log(user)
    //     dbcon.query("SELECT * FROM orders WHERE owner_bill = ?", [user], (err, rs) => {
    //         if (err) throw err

    //         io.emit('this_user', rs)
    //     })
    // })

    //Send Data Again


    // STock Realtime

    // setInterval(()=>{
    //     dbcon.query("SELECT * FROM stock", (err, rs) => {
    //         if (err) throw err

    //         socket.emit("all_stock", rs)
    //     })

    // }, 1000)


    //user Realtime


    //market order

    // socket.on("data_market", (market) => {
    //     console.log(market)
    //     setInterval(() => {
    //     dbcon.query("SELECT * FROM orders WHERE store = ? ", [market], (err, rs) => {
    //         if (err) throw err

    //         socket.emit("order_market", rs)
    //     })
    //     }, 1000)
    // })


    // socket.on("get_username", (payload) => {
    //     setInterval(() => {
    //         dbcon.query("SELECT * FROM orders WHERE owner_bill = ?", [payload], (err, rs) => {
    //             if (err) throw err

    //             socket.emit("value_status", rs)
    //         })
    //     }, 1000)
    // })


    //Check Users Who have the store by ownself

    socket.on("username", (payload) => {
        if (payload) {
            dbcon.query("SELECT * FROM users WHERE username = ?", [payload], (err, rs) => {
                if (err) throw err

                if (rs.length > 0 && rs) {
                    if (rs[0].market && rs[0].market !== '') {
                        socket.join(rs[0].market)
                        // console.log("You have Joined Front Store")
                    }
                }
            })
        }
    })

    socket.on("send_notification", (payload) => {
        if (payload) {
            socket.to(payload.market).emit("receive_market", { text: payload.text })
        }
    })



    // setInterval(() => {
    //     dbcon.query("SELECT * FROM orders", (err, rs) => {
    //         if (err) throw err

    //         socket.emit("admin_orders", rs)
    //     })
    // }, 1000)


    //realtime order Rider

    // setInterval(() => {
    //     dbcon.query("SELECT * FROM orders WHERE confirm_market = ?", [1], (err, rs) => {
    //         if (err) throw err

    //         socket.emit("rider_orders", rs)
    //     })
    // }, 1000)

    //stock

    // setInterval(() => {
    //     dbcon.query("SELECT * FROM stock", (err, rs) => {
    //         if (err) throw err

    //         socket.emit("all_stock", rs)
    //     })
    // }, 200)

    socket.on('disconnect', () => {
        // console.log("disconnect")
    })
})


let dbcon = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'delivery'
})


app.post("/login", (req, res) => {

    let username = req.body.username
    let password = req.body.password

    dbcon.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, rs) => {
        if (err) throw err

        if (rs.length > 0) {
            res.json({ login: true, user_data: rs })
        }
        else {
            res.json({ login: false })
        }
    })
})

app.post("/register", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let tel = req.body.tel
    let first_name = req.body.first_name
    let last_name = req.body.last_name

    // console.log(email, tel)

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
        if (err) throw err

        if (rs.length > 0) {
            res.json({ register: false })
        }
        else {
            dbcon.query("INSERT INTO users (username, password, first_name, last_name, email, tel) VALUES (?, ?, ?, ?, ?, ?)", [username, password, first_name, last_name, email, tel], (err, rs2) => {
                if (err) throw err

                res.json({ register: true })
            })
        }
    })
})


app.get("/stock", (req, res) => {
    dbcon.query("SELECT * FROM stock ORDER BY food_name", (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/user", (req, res) => {

    let username = req.body.username

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post("/market", (req, res) => {
    let username = req.body.username
    let market = req.body.market
    let img = req.files.img

    console.log(img)

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
        if (err) throw err

        if (rs.length > 0) {
            dbcon.query("UPDATE users SET role = ?, market = ?, market_logo = ? WHERE id = ?", [1, market, img.name, rs[0].id], async (err, rs) => {
                if (err) throw err

                let new_logo = await sharp(img.data).resize(300, 200).rotate().toBuffer()

                fs.writeFile('../client/public/logo_food/' + img.name, new_logo, (err) => {
                    if (err) throw err

                    res.json({ Register_Market: true })
                })
            })
        }
    })
})

app.post("/profile_market", (req, res) => {
    let owner = req.body.owner

    dbcon.query("SELECT * FROM stock WHERE owner = ?", [owner], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/additem", (req, res) => {
    let name = req.body.name
    let price = req.body.price
    let type = req.body.type
    let owner = req.body.owner
    let img = req.body.img
    let img_name = req.body.img_name

    let picture = req.files.img

    dbcon.query("SELECT * FROM stock WHERE food_name = ? AND owner = ?", [name, owner], (err, rs) => {
        if (err) throw err

        if (picture) {
            const path = '../client/public/pictures/' + picture.name

            if (fs.existsSync(path)) {
                res.json({ picture_already: true })
            }
            else {
                dbcon.query("INSERT INTO stock (food_name, food_price, food_img, type, owner) VALUES (? ,? ,?, ?, ?)", [name, price, img_name, type, owner], async (err, rs) => {
                    if (err) throw err


                    let new_picture = await sharp(picture.data).resize({ width: 560, height: 600 }).rotate().toBuffer()

                    fs.writeFile('../client/public/resize_pictures_food/' + picture.name, new_picture, (err) => {

                        if (err) throw err

                        res.json({ item_already: false })
                    })
                })
            }
        }
    })
})

app.post("/stock_user", (req, res) => {
    let user_market = req.body.user_market

    dbcon.query("SELECT * FROM stock WHERE owner = ?", [user_market], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post("/stock_delete", (req, res) => {
    let id = req.body.id

    dbcon.query("DELETE FROM stock WHERE id = ?", [id], (err, rs) => {
        if (err) throw err

        res.json({ delete: true })
    })
})

app.post("/bill", (req, res) => {
    let cart = req.body.cart
    let username = req.body.username
    let cvt_cart = JSON.stringify(cart)
    let time = req.body.time
    let store = req.body.store
    let tel = req.body.tel
    let first_name = req.body.first_name
    // let food_id = req.body.food_id
    let star = 0
    let code = req.body.code
    let total_money = cart.reduce((sum, item) => sum + (item.food_price * item.quantity), 0)

    // console.log(cart)
    // console.log(store)

    // console.log(store)
    console.log("Code : ", code)
    console.log(total_money)

    if (code) {
        dbcon.query("SELECT * FROM code_discount WHERE code = ?", [code], (err, codes) => {
            if (err) throw err

            if (codes.length > 0) { // ถ้าเกิดว่า Code มีจิรง
                if (total_money >= 150) {
                    if (codes[0].market !== cart[0].owner) {
                        res.json({ another_code: true })
                    } else {
                        if (codes[0].amount_use >= 3) {
                            res.json({ maximum: true })
                        } else {
                            dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
                                if (err) throw err

                                // console.log(rs)

                                dbcon.query("SELECT * FROM users WHERE market = ? ", [store], (err, market) => {
                                    if (err) throw err

                                    console.log(market)

                                    let count = market[0].notification_order

                                    let result = count + 1

                                    let amount_use = codes[0].amount_use

                                    let result_use = amount_use + 1

                                    dbcon.query("INSERT INTO orders (bill, time, owner_bill, first_name_owner_bill, store, tel_owner_bill, tel_owner_market, lat_client, long_client, code_discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [cvt_cart, time, username, first_name, store, tel, market[0].tel, rs[0].lat, rs[0].longitude, 15], (err, rs2) => {
                                        if (err) throw err

                                        dbcon.query("UPDATE code_discount SET amount_use = ? WHERE code = ?", [result_use, code], (err, rs5) => {
                                            if (err) throw err

                                            dbcon.query("UPDATE users SET notification_order = ? WHERE market = ?", [result, store], (err, rs3) => {
                                                if (err) throw err

                                                dbcon.query("INSERT INTO storage (bill_storage, buyer, time, store, tel) VALUES (?, ?, ?, ?, ?)", [cvt_cart, username, time, store, tel], (err, rs4) => {
                                                    if (err) throw err

                                                    res.json({ bill: true })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    }
                }
                else{
                    res.json({less_money: true})
                }
            } else {
                res.json({ code_err: true })
            }
        })
    } else {
        dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
            if (err) throw err

            // console.log(rs)

            dbcon.query("SELECT * FROM users WHERE market = ? ", [store], (err, market) => {
                if (err) throw err

                console.log(market)

                let count = market[0].notification_order

                let result = count + 1

                dbcon.query("INSERT INTO orders (bill, time, owner_bill, first_name_owner_bill, store, tel_owner_bill, tel_owner_market, lat_client, long_client) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [cvt_cart, time, username, first_name, store, tel, market[0].tel, rs[0].lat, rs[0].longitude], (err, rs2) => {
                    if (err) throw err

                    dbcon.query("UPDATE users SET notification_order = ? WHERE market = ?", [result, store], (err, rs3) => {
                        if (err) throw err

                        dbcon.query("INSERT INTO storage (bill_storage, buyer, time, store, tel) VALUES (?, ?, ?, ?, ?)", [cvt_cart, username, time, store, tel], (err, rs4) => {
                            if (err) throw err

                            res.json({ bill: true })
                        })
                    })
                })
            })
        })
    }
})


app.get('/orders', (req, res) => {
    dbcon.query("SELECT * FROM orders", (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/order_store", (req, res) => {
    let market = req.body.market

    dbcon.query("SELECT * FROM orders WHERE store = ?", [market], (err, rs) => {
        if (err) throw err

        // console.log(rs)

        res.json(rs)
    })
})

app.post('/order_client', (req, res) => {

    let username = req.body.username

    dbcon.query("SELECT * FROM orders WHERE owner_bill = ?", [username], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/get_order", (req, res) => {
    let id = req.body.id
    let store = req.body.store
    let date = req.body.date

    dbcon.query("SELECT * FROM users WHERE market = ?", [store], (err, rs) => {
        if (err) throw err

        let count = rs[0].notification_order

        let result = count - 1

        dbcon.query("UPDATE orders SET confirm_market = ?, confirm_market_time = ? WHERE id = ?", [1, date, id], (err, rs) => {
            if (err) throw err


            dbcon.query("UPDATE users SET notification_order = ? WHERE market = ?", [result, store], (err, rs) => {
                if (err) throw err


                dbcon.query("UPDATE storage SET time_market_confirm = ? WHERE id = ?", [date, id], (err, rs) => {
                    if (err) throw err

                    res.json({ get: true })
                })
            })

        })
    })
})

app.post("/to_rider", (req, res) => {

    let id = req.body.id

    dbcon.query("UPDATE users SET role = ? WHERE id = ?", [2, id], (err, rs) => {
        if (err) throw err

        res.json({ rider: true })
    })
})


app.get("/rider_order", (req, res) => {
    dbcon.query("SELECT * FROM orders WHERE confirm_market = ?", [1], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post("/get_rider", (req, res) => { // Rider Function
    let id_food = req.body.id
    let username = req.body.username
    let date = req.body.date


    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs_ex) => {
        if (rs_ex[0].rider_inventory.length > 0) {
            res.json({ rider_get: false })
        }
        else {
            dbcon.query("UPDATE orders SET confirm_rider = ?, confirm_rider_time = ? WHERE id = ?", [1, date, id_food], (err, rs) => {
                if (err) throw err

                dbcon.query("SELECT * FROM orders WHERE id = ?", [id_food], (err, rs2) => {
                    if (err) throw err

                    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs3) => {
                        if (err) throw err

                        dbcon.query("SELECT * FROM users WHERE rider_inventory = ? AND role = ?", [rs2[0].bill, 2], (err, check) => { // Check Who is holding this bill
                            if (err) throw err

                            console.log(check)
                            console.log(check.length)

                            if (check.length > 0) {  //Check Who is holding this bill if true refresh webpage and error if not update that into user inventory
                                console.log("Some people get this already")
                                res.json({ refresh_again: true })
                            } else {
                                console.log("Free")
                                if (rs3[0].rider_inventory.length > 0) {
                                    console.log("You have had order already")
                                    res.json({ rider_get: false })
                                } else {
                                    console.log(rs2[0].lat_client, rs2[0].long_client)
                                    dbcon.query("UPDATE users SET food_id = ?, rider_inventory = ?, first_name_order = ?, owner_order = ?, buy_store = ?, buy_store_tel = ?, owner_order_tel = ?, buy_time = ?, lat_client = ?, long_client = ?, ticket = ? WHERE username = ?", [id_food, rs2[0].bill, rs2[0].owner_bill, rs2[0].first_name_owner_bill, rs2[0].store, rs2[0].tel_owner_market, rs2[0].tel_owner_bill, rs2[0].time, rs2[0].lat_client, rs2[0].long_client, rs2[0].code_discount , username], (err, rs4) => {
                                        if (err) throw err

                                        dbcon.query("UPDATE storage SET time_rider_confirm = ? WHERE id = ?", [date, id_food], (err, rs) => {
                                            if (err) throw err

                                            res.json({ rider_get: true })
                                        })
                                    })
                                }
                            }
                        })
                    })
                })
            })
        }
    })
})


app.post("/finish_deliver", (req, res) => {
    let username = req.body.username
    let date = req.body.date
    let food_id = req.body.food_id

    let result_money = 0
    let count_rider = 0
    let cart = []


    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs0) => {

        if (err) throw err

        if (rs0 && rs0[0].role === 2) {
            result_money = rs0[0].rider_money
            count_rider = rs0[0].rider_count

            cart = JSON.parse(rs0[0].rider_inventory)

            // cart.map((item)=>{
            //     result_money = result_money + (item.food_price * item.quantity)
            // })

            result_money = result_money + 10

            count_rider = count_rider + 1

            dbcon.query("DELETE FROM orders WHERE id = ?", [rs0[0].food_id], (err, rs) => {
                if (err) throw err

                dbcon.query("UPDATE orders SET confirm_finish_time = ? WHERE id = ?", [date, food_id], (err, rs) => {
                    if (err) throw err

                    dbcon.query("UPDATE users SET food_id = ?, rider_inventory = ?, owner_order = ?, buy_store = ?, buy_store_tel = ?, owner_order_tel = ?, buy_time = ?, lat_client = ?, long_client = ?, rider_count = ?, rider_money = ?, ticket = ? WHERE username = ?", ['', '', '', '', '', '', '', 0, 0, count_rider, result_money, 0, username], (err, rs) => {
                        if (err) throw err

                        dbcon.query("UPDATE storage SET finish_time = ? WHERE id = ?", [date, food_id], (err, rs) => {
                            if (err) throw err

                            if (cart && cart.length > 0) {
                                cart.map((item) => {
                                    dbcon.query("SELECT * FROM stock WHERE id = ?", [item.id], (err, rs5) => {
                                        if (err) throw err

                                        // console.log(rs5)

                                        if (rs5.length > 0) {
                                            star = rs5[0].star

                                            console.log("Start Star : ", star)

                                            star = star + item.quantity

                                            console.log("Then Star : ", star)

                                            dbcon.query("UPDATE stock SET star = ? WHERE id = ?", [star, item.id], (err, rs) => {
                                                if (err) throw err
                                            })
                                        }
                                    })
                                })
                                res.json({ finish: true })
                            }
                        })
                    })
                })
            })
        }
    })
})

app.get("/notification_rider", (req, res) => {
    dbcon.query("SELECT * FROM orders WHERE confirm_market = ?", [1], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/history_order", (req, res) => {
    let username = req.body.username

    dbcon.query("SELECT * FROM storage WHERE buyer = ? ORDER BY id DESC", [username], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post('/map', (req, res) => {

    let username = req.body.username
    console.log(username)

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.get("/map_market", (req, res) => {
    dbcon.query("SELECT * FROM users WHERE market != ? AND lat != ? AND longitude != ?", ['', 0, 0], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post('/position', (req, res) => {

    let lat = req.body.lat
    let long = req.body.long
    let username = req.body.username


    dbcon.query("UPDATE users SET lat = ?, longitude = ? WHERE username = ?", [lat, long, username], (err, rs) => {
        if (err) throw err

        res.json({ position_success: true })
    })
})


app.post('/get_food', (req, res) => {
    let id = req.body.id

    dbcon.query("SELECT * FROM stock WHERE id = ?", [id], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post("/update_stock", (req, res) => {
    let food_id = req.body.id
    let new_food_name = req.body.food_name
    let new_food_price = req.body.food_price

    dbcon.query("UPDATE stock SET food_name = ?, food_price = ? WHERE id = ?", [new_food_name, new_food_price, food_id], (err, rs) => {

        res.json({ update: true })
    })
})

app.post("/update_profile", (req, res) => {
    let username = req.body.username
    let nickname = req.body.nickname
    let tel = req.body.tel
    let email = req.body.email
    let img = req.files.img

    dbcon.query("UPDATE users SET nickname = ?, profile_img = ? , tel = ?, email = ? WHERE username = ?", [nickname, img.name, tel, email, username], async (err, rs) => {
        if (err) throw err

        if (img) {
            let new_profile = await sharp(img.data).resize({ width: 300, height: 200 }).toBuffer()

            fs.writeFile("../client/public/profile_img/" + img.name, new_profile, (err) => {
                if (err) throw err

                res.json({ update: true })
            })
        }
    })
})


app.post('/getPosUser', (req, res) => {
    const lat = req.body.lat
    const long = req.body.long
    const username = req.body.username

    dbcon.query("UPDATE users SET lat = ?, longitude = ? WHERE username = ?", [lat, long, username], (err, rs) => {
        if (err) throw err

        res.json({ update_pos: true })
    })
})

app.get("/all_order", (req, res) => {
    dbcon.query("SELECT * FROM orders", (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post('/position_market', (req, res) => {
    const market = req.body.market

    dbcon.query("SELECT * FROM users WHERE market = ? ", [market], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})

app.post('/order_storage', (req, res) => {

    const market = req.body.market

    dbcon.query("SELECT * FROM storage WHERE store = ?", [market], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.get("/get_whole_store", (req, res) => {
    dbcon.query("SELECT market, market_logo FROM users WHERE market != ?", [''], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/close_item", (req, res) => {

    const item_id = req.body.item_id

    dbcon.query("SELECT * FROM stock WHERE id = ?", [item_id], (err, rs) => {
        if (err) throw err

        if (rs.length > 0) {
            // console.log(rs[0].close)
            dbcon.query("UPDATE stock SET close = ? WHERE id = ?", [rs[0].close === 1 ? 0 : rs[0].close === 0 ? 1 : 1, item_id], (err, rs) => {
                if (err) throw err

                res.json(rs)
            })
        }
    })
})

app.post("/all_user", (req, res) => {
    dbcon.query("SELECT * FROM users", (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post('/auto_time', (req, res) => {
    const openTime = req.body.open_time
    const closeTime = req.body.close_time
    const username = req.body.username

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs) => {
        if (err) throw err

        dbcon.query("UPDATE stock SET auto_time_open = ?, auto_time_close = ? WHERE owner = ?", [openTime, closeTime, rs[0].market], (err, rs1) => {
            if (err) throw err

            res.json(rs)
        })
    })
})


app.post("/close_Store", (req, res) => {
    const store = req.body.store
    let switch_store

    dbcon.query("SELECT * FROM stock WHERE owner = ?", [store], (err, rs) => {
        if (err) throw err

        switch_store = rs[0].close


        dbcon.query("UPDATE STOCK SET close = ? WHERE owner = ?", [!switch_store, store], (err, rs) => {
            if (err) throw err

            res.json({ success: true })
        })
    })
})


app.post("/update_location", (req, res) => {
    let lat = req.body.lat
    let lng = req.body.lng
    let username = req.body.username

    dbcon.query("UPDATE users SET lat = ?, longitude = ? WHERE username = ?", [lat, lng, username], (err, rs) => {
        if (err) throw err

        res.json({ success: true })
    })
})


//Code Discount

// app.post('/use_discount', (req, res)=>{
//     let username = req.body.username
//     let get_code = req.body.get_code

//     dbcon.query("SELECT * FROM code_discount", (err, rs)=>{
//         if(err) throw err

//         if(rs[0].code === get_code){
//             res.json({success: true})
//         }
//     })
// })


app.post("/get_code", (req, res) => {
    const code = req.body.code

    dbcon.query("SELECT * FROM code_discount WHERE code = ?", [code], (err, rs) => {
        if (err) throw err

        res.json(rs)
    })
})


app.post("/create_code", (req, res)=>{
    const username = req.body.username
    const code = req.body.code

    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs)=>{
        if(err) throw err

        
        dbcon.query("INSERT INTO code_discount (market, code, amount_use) VALUES (?, ?, ?)", [rs[0].market, code, 0], (err ,rs2)=>{
            if(err) throw err

            res.json({code_success: true})
        })  
    })
})


http.listen(3001, () => {
    console.log("server is running on port 3001")
})