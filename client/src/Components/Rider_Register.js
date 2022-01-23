import axios from "axios"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"

const Rider_Register = () => {

    let dispatch = useDispatch()
    let user_data = useSelector(state => state.user_data.userData)
    let history = useHistory()

    let getRider

    let cookie = localStorage.getItem('username')

    console.log(user_data)


    let ToRider = (id) => {
        axios.post(process.env.REACT_APP_DOMAIN_KEY+"/to_rider", {
            id: id
        }).then((res) => {
            if (res.data.rider) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'คุณได้สมัครเป็นไรเดอร์เรียบร้อยเเล้ว',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(()=>{
                    history.push("/rider")
                    window.location.reload(true)
                }, 2000)
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'โปรดลองใหม่',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }).catch((err) => {
            if (err) throw err
        })
    }


    let HandleSubmit = (e) => {
        e.preventDefault()

        let rider = getRider.value


        if (rider === "ยืนยันที่จะเป็นไรเดอร์" && user_data && user_data.length > 0) {
            ToRider(user_data[0].id)
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'โปรดลองใหม่',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (
        <div className="rider-register">
            <h1>Register Rider</h1>
            <hr /><br />
            <form onSubmit={HandleSubmit}>
                <div className="asked-rider">
                    <p>ถ้าคุณต้องการเป็นไรเดอร์ให้พิมพ์ "ยืนยันที่จะเป็นไรเดอร์"</p>
                    <input ref={(input) => getRider = input} type="text"></input>
                    <button onClick={() => {

                    }}>ยืนยัน</button>
                </div>
            </form>
        </div>
    )
}

export default Rider_Register;