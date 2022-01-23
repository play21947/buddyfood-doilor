import axios from "axios"
import Swal from "sweetalert2"

let Start_Register = () => {
    return {
        type: "START_REGISTER"
    }
}

let Receive_Register = (data) => {
    return {
        type: "RECEIVE_REGISTER",
        payload: data
    }
}

let Error_Register = () => {
    return {
        type: "ERROR_REGISTER"
    }
}


export const AsyncRegister = (username, password, first_name, last_name, email, tel, cb) => {
    return (dispatch) => {
        dispatch(Start_Register())
        axios.post(process.env.REACT_APP_DOMAIN_KEY+"/register", {
            username: username,
            password: password,
            email: email,
            tel: tel,
            first_name: first_name,
            last_name: last_name
        }).then((res) => {
            if (res.data.register) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'สมัครสมาชิกเสร็จสิ้น',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    dispatch(Receive_Register(res.data))
                    cb()
                }, 2000)
            }
            else if (res.data.register == false) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'สมัครสมาชิกไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }).catch((err) => {
            if (err) {
                console.log(err)
                dispatch(Error_Register())
            }
        })
    }
}