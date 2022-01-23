import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import StatusOrder from "./StatusOrder"
import { useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import io from 'socket.io-client'
import { Browser } from "leaflet"

// let socket = io.connect("http://play2lover.ddns.net:3001")


const MyProfile = () => {

    let history = useHistory()

    let cookie = localStorage.getItem('username')

    if (!cookie) {
        history.push('/')
    }

    let [user, setUser] = useState([])

    let [Update, setUpdate] = useState(false)

    let [tel, setTel] = useState('')
    let [nickname, setNickname] = useState('')
    let [email, setEmail] = useState('')
    let [order, setOrder] = useState([])
    let [cvt, setCvt] = useState([])
    let fil
    let [status, setStatus] = useState(false)
    let [id, setId] = useState()
    let [other, setOther] = useState([])
    let [img, setImg] = useState(null)
    let [editGPS, setEditGPS] = useState(false)
    let [posGPS, setPosGPS] = useState('')

    let [tutorial, setTutorial] = useState(false)

    let inventory
    let total

    if (user && user.length > 0 && user[0].rider_inventory) {
        inventory = JSON.parse(user[0].rider_inventory)
    }

    let HandlerUpdate = () => {
        setUpdate(true)
    }

    // console.log(id)

    const LoadUser = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const LoadOrderClient = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                resolve(res)
            })
        })
    }

    const LoadPositionMarket = (api, market) => {
        return new Promise((resovle, reject) => {
            axios.post(api, {
                market: market
            }).then((res) => {
                resovle(res)
            })
        })
    }

    useEffect(async () => {

        await LoadUser(process.env.REACT_APP_DOMAIN_KEY + '/user', cookie).then((res) => {
            console.log(res)
            setUser(res)
            setTel(res[0].tel)
            setNickname(res[0].nickname)
            setEmail(res[0].email)
            setId(res[0].id)


            LoadPositionMarket(process.env.REACT_APP_DOMAIN_KEY + "/position_market", res[0].buy_store).then((res) => {
                console.log(res.data)
                setOther(res.data)
            })

        })

        await LoadOrderClient(process.env.REACT_APP_DOMAIN_KEY + "/order_client", cookie).then((res) => {
            console.log(res.data)
            setOrder(res.data)
        })

    }, [])

    // console.log(order)
    // console.log(inventory)

    if (inventory && inventory.length > 0) {
        total = inventory.reduce((sum, item) => sum + (item.quantity * item.food_price), 0)
    }


    let FinishDeliver = (id) => {
        Swal.fire({
            text: "คุณจะยืนยันว่าส่งอาหารแล้ว",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + "/finish_deliver", {
                    username: cookie,
                    food_id: id,
                    date: new Date().toLocaleTimeString('th-th')
                }).then((res) => {
                    if (res.data.finish) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'ส่งอาหารเรียบร้อย',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            history.push("/home")
                            history.push('/myprofile')
                        }, 2000)
                    }
                })
            }
        })
    }


    let UpdateProfile = (id) => {
        if (tel.length == 10) {

            const fd = new FormData()

            fd.append('username', id)
            fd.append('nickname', nickname)
            fd.append('email', email)
            fd.append('tel', tel)
            fd.append('img', img)

            axios.post(process.env.REACT_APP_DOMAIN_KEY + '/update_profile', fd).then((res) => {
                if (res.data.update) {
                    history.push('/home')
                    history.push('/myprofile')
                    Swal.fire("อัพเดทโปรไฟล์เสร็จสิ้น")
                }
            })
        } else {
            Swal.fire("หมายเลขโทรศัพท์ไม่ถูกต้อง")
        }
    }


    let FindGps = () => {
        if (navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + '/update_location', {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    username: cookie
                }).then((res) => {
                    if (res.data.success) {
                        Swal.fire('อัพเดทตำเเหน่งเรียบร้อย')
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)
                    }
                })
                console.log(position.coords.latitude)
                console.log(position.coords.longitude)
            })
        } else {
            console.log("supposed to open gps")
        }
    }

    return (
        <div className="myprofile-container">


            {tutorial ?
                <div className="modal-tutorial">
                    <p onClick={() => {
                        setTutorial(false)
                    }} className="x-modal-tutorial">X</p>
                    <img src="../img/videos.gif"></img>
                </div> : <div className="modal-tutorial-close"></div>}


            <div className="my-profile">
                {Update ? <i style={{ cursor: 'pointer' }} onClick={() => {
                    setUpdate(false)
                }} className="fas fa-arrow-left back"></i> : null}
                <h1 style={{ fontSize: '25px' }}>โปรไฟล์</h1><br />
                {user && user.length > 0 ? Update === false ?
                    <div className="box-profile">
                        {user[0].profile_img ? <img className="avatar" src={"../profile_img/" + user[0].profile_img}></img> : <img className="avatar" src="../img/avatar.png"></img>}
                        <div className="detail-profile">
                            <p>ชื่อ : {user[0].username}</p>
                            <i style={{ cursor: 'pointer' }} onClick={() => HandlerUpdate()} className="far fa-edit edit"></i>
                            <p>ชื่อเล่น : {nickname ? nickname : "ยังไม่มีชื่อเล่น"}</p>
                            <p>เบอร์โทรศัพท์ : {user[0].tel}</p>
                            <p>สถานะ : {user[0].role == 1 ? "ร้านค้า" : user[0].role === 2 ? "ไรเดอร์" : "ผู้คนทั่วไป"}</p>
                            <hr />

                            {user[0].lat && user[0].longitude && !editGPS ? <p style={{ color: 'green' }}>พิกัดตำเเหน่ง : {user[0].lat}, {user[0].longitude}</p> : !user[0].lat && !user[0].longitude && !editGPS ? <p style={{ color: 'firebrick' }}>พิกัดตำเเหน่ง : ไม่ระบุ</p> : null}

                            {!editGPS ? null : <p>พิกัดตำเเหน่ง : <input className="input-gps" placeholder="พิกัดของคุณ" onChange={(e) => {
                                setPosGPS(e.target.value)
                                console.log(e.target.value)
                            }}></input></p>}
                            {!editGPS ? null : <button className="confirm" onClick={() => {
                                Swal.fire({
                                    title: 'ยืนยันจะระบุตำเเหน่ง',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'ยืนยัน',
                                    cancelButtonText: 'ยกเลิก'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        console.log(posGPS)
                                        let newPos = posGPS.split(/[\s,()]+/)
                                        console.log(newPos)
                                        axios.post(process.env.REACT_APP_DOMAIN_KEY + "/getPosUser", {
                                            lat: newPos[0] == '' ? newPos[0 + 1] : newPos[0],
                                            long: newPos[newPos.length - 1] == '' ? newPos[newPos.length - 2] : newPos[1],
                                            username: cookie
                                        }).then((res) => {
                                            if (res.data.update_pos) {
                                                Swal.fire({
                                                    position: 'center',
                                                    icon: 'success',
                                                    title: 'อัพเดทที่อยู่ของคุณเสร็จเรียบร้อย',
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                })
                                                setTimeout(() => {
                                                    setEditGPS(false)
                                                    history.push("/home")
                                                    history.push('/myprofile')
                                                    window.location.reload(true)
                                                }, 2000)
                                            }
                                        })
                                    }
                                })
                            }}>ยืนยัน</button>}
                            <div className="grid-find-gps" style={{ marginTop: '5px' }}>
                                <button onClick={() => {
                                    history.push("/tutorial")
                                }} >1. วิธีหาตำเเหน่ง</button>
                                <button onClick={() => {
                                    window.location = "https://www.google.co.th/maps/@18.5107411,98.8311454,14.25z"
                                }}>2. หาตำเเหน่ง</button>
                                <button onClick={() => {
                                    setEditGPS(!editGPS)
                                }}>3. แก้ไข</button>
                            </div>
                            <button className="gps-profile" onClick={() => {
                                FindGps()
                            }}>บันทึกพิกัดเเบบรวดเร็ว<img className="gps-img-profile" src="/img/location.png"></img></button>
                        </div>
                    </div> : <div className="box-profile">
                        <p>ชื่อเล่น</p>
                        <input value={nickname} onChange={(e) => {
                            setNickname(e.target.value)
                        }}></input>
                        <p>อีเมลล์</p>
                        <input value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }}></input>
                        <p>เบอร์โทรศัพท์</p>
                        <input type="tel" value={tel} onChange={(e) => {
                            setTel(e.target.value)
                        }}></input>
                        <p>Line ID</p>
                        <input type="text"></input>
                        <input type="file" onChange={(e) => {
                            setImg(e.target.files[0])
                        }}></input>
                        <button style={{ cursor: 'pointer' }} type="button" onClick={() => {
                            UpdateProfile(user[0].username)
                        }} className="update-profile-btn">อัพเดทโปรไฟล์</button>
                    </div> :
                    "กำลังโหลดข้อมูล..."}
            </div>
        </div>
    )
}

export default MyProfile