import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { AsyncUser } from "../Actions/UserActions"
import axios from "axios"
import Swal from "sweetalert2"

const Market = () => {


    let dispatch = useDispatch()
    let history = useHistory()

    let [img, setImg] = useState(null)
    let [user, setUser] = useState([])
    let [market, setMarket] = useState('')

    let cookie = localStorage.getItem("username")

    if (!cookie) {
        history.push("/")
    }

    let AddMarket = () => {

        if (!user[0].lat || !user[0].longitude) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาระบุตำเเหน่ง!',
                text: '(ไปหน้า "โปรไฟล์" เพื่ออัพเดตตำเเหน่ง)',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push("/myprofile")
                }
            })
        } else {
            if (market && img) {
                if (market.length <= 5) {
                    Swal.fire("ชื่อร้านค้าควรมีมากกว่า 5 ตัวอักษรขึ้นไป")

                } else {
                    const fd = new FormData()

                    fd.append('username', cookie)
                    fd.append('market', market)
                    fd.append('img', img)

                    axios.post(process.env.REACT_APP_DOMAIN_KEY+"/market", fd).then((res) => {
                        console.log(res.data)
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'สมัครเป็นเจ้าของร้านอาหารเเล้ว!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            history.push("/ownmarket")
                            window.location.reload(true)
                        }, 2000)
                    })
                }
            }
            else {
                Swal.fire("กรอกข้อมูลเเละใส่รูปให้ครบถ้วน")
            }
        }
    }


    useEffect(() => {
        dispatch(AsyncUser(cookie))
        axios.post(process.env.REACT_APP_DOMAIN_KEY+'/user', {
            username: cookie
        }).then((res) => {
            setUser(res.data)
        })
    }, [])

    return (
        <div className="add-market">
            <p>*กรุณาระบุตำเเหน่งก่อนสมัครเป็นร้านค้า*</p><br />
            <p>ชื่อร้านค้า</p>
            <input className="add-market-input" onChange={(e) => {
                setMarket(e.target.value)
            }}></input><br /><br />
            <p>โลโก้ร้าน</p>
            <input onChange={(e) => {
                setImg(e.target.files[0])
                console.log(e.target.files[0])
            }} type="file"></input><br />
            <button onClick={() => {
                AddMarket()
            }} type="button">สมัครเป็นร้านค้า</button>
        </div>
    )
}

export default Market