import axios from "axios"
import Swal from 'sweetalert2'

let StartLogin = () => {
    return {
        type: "START_LOGIN"
    }
}


let ReceiveLogin = (data) => {
    return {
        type: "RECEIVE_LOGIN",
        payload: data
    }
}


let ErrorLogin = () => {
    return {
        type: "ERROR_LOGIN"
    }
}


export let AsnycLogin = (username, password, cb) => {
    return (dispatch) => {
        dispatch(StartLogin())
        setTimeout(() => {
            axios.post(process.env.REACT_APP_DOMAIN_KEY+"/login", {
                username: username,
                password: password
            }).then((res) => {
                if (res.data.login) {
                    dispatch(ReceiveLogin(res.data))
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'เข้าสู่ระบบสำเร็จ',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(()=>{
                        localStorage.setItem("username", username)
                        cb()
                    }, 2000)
                }
                else {
                    dispatch(ErrorLogin())
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'ชื่อผู้ใช้หรือรหัสผ่านผิด',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch((err) => {
                if (err) {
                    dispatch(ErrorLogin())
                }
            })
        }, 2000)
    }
}