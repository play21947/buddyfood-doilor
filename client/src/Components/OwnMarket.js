import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { useDispatch } from "react-redux"
import { AsnycStock } from "../Actions/StockActions"
import { useHistory } from "react-router-dom"
import CopyRight from "./CopyRight"
import io from 'socket.io-client'

// let socket = io.connect("http://play2lover.ddns.net:3001")

const OwnMarket = () => {

    // socket.on('get_count', (payload) => {
    //     console.log(payload)
    // })

    let dispatch = useDispatch()
    let history = useHistory()

    let [user_data, setUser_data] = useState([])
    const cookie = localStorage.getItem('username')


    let catogory = ['อาหาร', 'เครื่องดื่ม', 'ขนม']
    let [selected, SetSelected] = useState('')
    let [price, setPrice] = useState()
    let [name, setName] = useState('')
    let [status, setStauts] = useState(false)
    let [food, setFood] = useState([])
    let [selectedfile, setSelectedFile] = useState()
    let [editStatus, setEditStatus] = useState(false)
    let [open_time, setOpen_Time] = useState(0)
    let [close_time, setClose_Time] = useState(0)
    let [old_hours_open, setOld_Hours_Open] = useState('')
    let [old_hours_close, setOld_Hours_Close] = useState('')
    let [define_hours_open, setDefine_Hours_Open] = useState('')
    let [define_hours_close, setDefine_Hours_Close] = useState('')

    // console.log(selectedfile)

    // console.log(user_data)

    let AddItem = () => {

        const fd = new FormData();

        // console.log(selected, price, name, user_data[0].market)
        Swal.fire({
            title: 'แน่ใจว่าต้องการเพิ่มอาหาร',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'เพิ่ม',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                if (!name, !price, !selected) {
                    Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วนก่อน")
                } else {
                    fd.append('name', name)
                    fd.append('price', price)
                    fd.append('img', selectedfile)
                    fd.append('img_name', selectedfile.name)
                    fd.append('type', selected)
                    fd.append('owner', user_data[0].market)
                    axios.post(process.env.REACT_APP_DOMAIN_KEY + "/additem", fd).then((res) => {
                        console.log(res.data)
                        if (res.data.picture_already) {
                            Swal.fire("ใช้รูปจากแกลเลอรี่")
                        }
                        else {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'เพิ่มอาหารสำเร็จ',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            // socket.emit("refresh_stock")
                            setTimeout(() => {
                                SetSelected('')
                                setPrice('')
                                setName('')
                                history.push('/home')
                                history.push('/ownmarket')
                            }, 2000)
                        }
                    }).catch((err) => {
                        if (err) throw err
                    })
                }
            }
        })
    }


    const CloseItem = (item_id) => {
        Swal.fire({
            title: 'จะปิดของชิ้นนี้',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + "/close_item", {
                    item_id: item_id,
                }).then((res) => {
                    console.log(res.data)
                    history.push('/home')
                    history.push('/ownmarket')
                })
            }
        })
    }


    const stock_user_api = process.env.REACT_APP_DOMAIN_KEY + "/stock_user"
    const get_user = process.env.REACT_APP_DOMAIN_KEY + "/user"

    const LoadApiGet = async (api) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                resolve(res.data)
                console.log("เสร็จเเล้ว")
            })
        })
    }

    const LoadApiPost = async (api, user_data) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                user_market: user_data[0].market
            }).then((res) => {
                console.log()
                resolve(res.data)
            })
        })
    }

    useEffect(async () => {
        await LoadApiGet(get_user).then((res) => {
            setUser_data(res)
            LoadApiPost(stock_user_api, res).then((res) => {
                setFood(res)
                if (res && res.length > 0) {
                    setOld_Hours_Open(res[0].auto_time_open)
                    setOld_Hours_Close(res[0].auto_time_close)
                    setDefine_Hours_Open(res[0].auto_time_open)
                    setDefine_Hours_Close(res[0].auto_time_close)
                }
            })
        })
    }, [])

    console.log(food)

    // if (user_data && user_data.length > 0 && user_data[0].market) {
    //     console.log(food)
    // }

    let DeleteStock = (id, img) => {
        Swal.fire({
            title: 'ต้องการลบสินค้าจริงหรือ',
            text: "จะไม่มีการที่จะย้อนกลับคืนได้อีกต่อไป",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + "/stock_delete", {
                    id: id,
                    img_name: img
                }).then((res) => {
                    if (res.data.delete) {
                        Swal.fire("นำสินค้าออกจากร้านเรียบร้อย")
                        history.push('/home')
                        history.push('/ownmarket')
                    }
                }).catch((err) => {
                    if (err) throw err
                })
            }
        })
    }

    let [editFood, setEditFood] = useState([])
    let [food_old, setFood_old] = useState('')
    let [food_price_old, setFood_price_old] = useState('')
    let [food_id_old, setFood_id_old] = useState('')
    let [code, setCode] = useState('')
    let [show, setShow] = useState(false)

    let Edit = (id) => {
        axios.post(process.env.REACT_APP_DOMAIN_KEY + "/get_food", {
            id: id
        }).then((res) => {
            setEditFood(res.data)
            setFood_old(res.data[0].food_name)
            setFood_price_old(res.data[0].food_price)
            setFood_id_old(res.data[0].id)
        })
    }

    let getfood
    let getprice

    if (food_old) {
        console.log(food_old)
    }


    let HandleSubmit = (e) => {
        e.preventDefault()

        let new_food_name = getfood.value
        let new_food_price = getprice.value

        Swal.fire({
            title: 'เเน่ใจว่าต้องการอัพเดท',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + "/update_stock", {
                    id: food_id_old,
                    food_name: new_food_name,
                    food_price: new_food_price
                }).then((res) => {
                    if (res.data.update) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'แก้ไขเสร็จสิ้น',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            history.push("/home")
                            history.push('/ownmarket')
                        }, 2000)
                    }
                })
            }
        })

        console.log(new_food_name)
        console.log(new_food_price)
    }


    let SetTime = () => {
        console.log("OpenTime : ", open_time, "Close Time : ", close_time)

        Swal.fire({
            text: "เปลี่ยนเวลา?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + '/auto_time', {
                    open_time: old_hours_open,
                    close_time: old_hours_close,
                    username: cookie
                }).then((res) => {
                    console.log(res.data)
                    history.push("/home")
                    history.push("/ownmarket")
                })
            }
        })
    }


    let closeStore = (store) => {

        Swal.fire({
            text: "ต้องการเปิด/ปิดร้าน?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + "/close_Store", {
                    store: store
                }).then((res) => {
                    if (res.data.success) {
                        history.push("/home")
                        history.push("/ownmarket")
                    }
                })
            }
        })
    }

    const CreateCode=()=>{


        axios.post(process.env.REACT_APP_DOMAIN_KEY+'/create_code',{
            username: cookie,
        }).then((res)=>{
            if(res.data.code_success){
                Swal.fire("สร้าง Code ลดราคาสำเร็จ")
            }
            console.log(res.data)
        })
    }

    return (
        <div>
            <div className="own-market">
                <h3>คุณมีอาหาร : {food.length} อย่าง</h3>
                <hr />
                <p>เพิ่มอาหารของคุณ</p>
                <input onChange={(e) => setName(e.target.value)} style={{ textIndent: '10px' }} placeholder="ข้าวผัดกระเพรา"></input>
                <p>ประเภทของอาหาร</p>
                <div className="box-category">
                    {catogory.map((item, index) => {
                        return (
                            <div key={index} className="grid-box-cate">
                                <input style={{ width: '20px', margin: '0px auto' }} value={item} name="test" type="radio" onChange={(e) => SetSelected(e.target.value)}></input>
                                <p>{item}</p>
                            </div>
                        )
                    })}
                </div>
                <p>ราคาของอาหาร</p>
                <input style={{ textIndent: "8px" }} onChange={(e) => setPrice(e.target.value)} type="number"></input>
                <div className="upload">
                    <p>รูปของอาหาร</p>
                    <input onChange={(e) => setSelectedFile(e.target.files[0])} type="file"></input>
                </div>
                {!name || !selected || !price || !selectedfile ? <button disabled className="add-food-not-yet" onClick={() => AddItem()}>เพิ่มรายการอาหาร</button> : <button className="add-food" onClick={() => AddItem()}>เพิ่มรายการอาหาร</button>}
            </div>

            <div className="set-time-market">
                <p>เซ็ตเวลาเปิดปิดร้าน อัตโนมัติ</p><br />
                <div className="grid-set-time">
                    เปิด <input value={old_hours_open ? old_hours_open : null} placeholder="0-23" onChange={(e) => {
                        console.log(e.target.value)
                        setOld_Hours_Open(e.target.value)
                    }} type="number" maxLength="2" max="23" min="0"></input> โมง
                    ปิด <input value={old_hours_close ? old_hours_close : null} placeholder="0-23" onChange={(e) => {
                        console.log(e.target.value)
                        setOld_Hours_Close(e.target.value)
                    }} type="number" maxLength="2" max="23" min="0"></input> โมง
                </div><br />
                <p>เปิดร้าน : {define_hours_open ? define_hours_open : null}.00 - {define_hours_close ? define_hours_close : null}.00 โมง</p>
                {food && food.length > 0 ? food[0].close === 0 ? <p className="store-online">สถานะ : เปิดร้าน </p> : <p className="store-offline">สถานะ : ปิดร้าน</p> : null}
                <button className="btn-set-time" onClick={() => {
                    SetTime()
                }}>เซ็ตเวลา</button><br />
                <button className="switch-store" onClick={() => {
                    console.log(food)
                    closeStore(food[0].owner)
                }}>เปิด/ปิดร้าน</button>
            </div>

            {/* <div style={{textAlign: 'center', marginTop: '40px'}}>
                <button>เพิ่มโค้ดของคุณ</button>
                {show ? <input></input> : null}
            </div> */}


            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <h1 style={{ fontSize: '25px' }}>สินค้าอาหารของคุณ</h1>
            </div>

            <div className="home">
                <div className="stock">
                    {user_data && user_data.length > 0 && food && food.length > 0 ? food.map((item) => {
                        return (
                            <div style={{ cursor: 'initial' }} className="stock-box" key={item.id}>
                                <div>
                                    <div className="flex">
                                        <p>{item.food_name}</p>
                                        <p>{item.food_price} ฿</p>
                                    </div>
                                    <div>
                                        <p>เจ้าของ : {item.owner}</p>
                                        {item.close ? item.close === 0 ? <p style={{ color: 'green' }}>สถานะ : เปิดขาย</p> : item.close === 1 ? <p style={{ color: 'firebrick' }}>สถานะ : ปิดขาย</p> : <p style={{ color: 'green' }}>สถานะ : เปิดขาย</p> : <p style={{ color: 'green' }}>สถานะ : เปิดขาย</p>}
                                    </div>
                                </div><br />
                                <div className="img-food">
                                    <img src={'../resize_pictures_food/' + item.food_img}></img>
                                </div>
                                <div className="flex-market">
                                    <button onClick={() => {
                                        setEditStatus(true)
                                        Edit(item.id)
                                        console.log(item.id)
                                    }} className="btn-edit">แก้ไข</button>
                                    <button onClick={() => DeleteStock(item.id)} className="btn-delete">ลบ</button>
                                    <button style={{ backgroundColor: '#1a1a1a', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => {
                                        CloseItem(item.id)
                                    }}>{item.close ? item.close === 0 ? <p>ปิด</p> : <p>เปิด</p> : <p>ปิด</p>}</button>
                                </div>
                                <br /><hr />
                            </div>
                        )
                    }) : <p>ไม่มีอาหารค่ะ</p>}
                </div>
            </div>

            {editStatus ? <div className="modal-edit-show">
                <p className="edit-x" onClick={() => {
                    setEditStatus(false)
                }}>x</p>
                <h1>แก้ไขสินค้า</h1>
                <hr />
                <form onSubmit={HandleSubmit}>
                    <p>ชื่อสินค้า</p>
                    <input ref={(food_name) => getfood = food_name} value={food_old} onChange={(e) => {
                        setFood_old(e.target.value)
                    }}></input>
                    <p>ราคาสินค้า</p>
                    <input type="number" ref={(food_price) => getprice = food_price} value={food_price_old} onChange={(e) => {
                        setFood_price_old(e.target.value)
                    }}></input><br />
                    <button type="submit">อัพเดตสินค้า</button>
                </form>
            </div> : <div className="modal-edit-close"></div>}
            <CopyRight />
        </div>
    )
}

export default OwnMarket