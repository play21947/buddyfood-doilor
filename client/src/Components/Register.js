import axios from "axios"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import { AsyncRegister } from "../Actions/RegisterActions"
import { useState } from "react"

const Register = () => {

    let dispatch = useDispatch()

    let register = useSelector(state => state.register_data)

    console.log(register)

    let getUsername
    let getPassword
    let getPasswordcf
    let getEmail
    let getTel
    let getFirst_name
    let getLast_name

    let [checkUsername, setCheckUsername] = useState('')
    let [tel, setTel] = useState('')

    let history = useHistory()

    let cookie = localStorage.getItem("username")

    if (cookie) {
        history.push("/home")
    }

    let HandleSubmit = (e) => {

        e.preventDefault()

        let username = getUsername.value
        let password = getPassword.value
        let passwordcf = getPasswordcf.value
        let email = ''
        let tel = getUsername.value
        let first_name = getFirst_name.value
        let last_name = getLast_name.value

        if (!username || !password || !passwordcf || !tel) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            if (password === passwordcf) {
                if (tel.length !== 10) {
                    Swal.fire("เบอร์โทรศัพท์ไม่ถูกต้อง")
                } else {
                    dispatch(AsyncRegister(username, password, first_name, last_name ,email, tel, () => {
                        setTimeout(() => {
                            localStorage.setItem("username", username)
                            history.push("/home")
                            window.location.reload(true)
                        })
                    }))
                }
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'รหัสผ่านไม่ตรงกัน',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    return (
        <div className="login">
            <div className="box-login">
                <form onSubmit={HandleSubmit}>
                    <h1>สมัครสมาชิก</h1>
                    <hr />
                    {checkUsername.length <= 0 ? null : checkUsername.length < 5 ? <p style={{ color: 'firebrick' }}>ยังใช้ไม่ได้</p> : <p style={{ color: 'green' }}>สามารถใช้ได้</p>}
                    <p>ชื่อ(จริง)</p>
                    <input ref={(first_name)=> getFirst_name = first_name}></input>
                    <p>นามสกุล</p>
                    <input ref={(last_name)=> getLast_name = last_name}></input>
                    <p>เบอร์โทรศัพท์ *(เบอร์โทรจริง)</p>
                    <input type="tel" onChange={(e) => {
                        setCheckUsername(e.target.value)
                    }} ref={(username_input) => getUsername = username_input} placeholder="0987654321"></input>
                    <div className="password-flex">
                        <div>
                            <p>รหัสผ่าน</p>
                            <input placeholder="*********" ref={(pass_input) => getPassword = pass_input} type="password"></input>
                        </div>
                        <div className="pass">
                            <p>ยืนยันรหัสผ่าน</p>
                            <input placeholder="*********" ref={(passcf_input) => getPasswordcf = passcf_input} type="password"></input>
                        </div>
                    </div>
                    {/* <p>อีเมลล์</p>
                    <input placeholder="example@gmail.com" ref={(email_input) => getEmail = email_input} type="email"></input> */}
                    <div className="btn-flex">
                        <button className="btn-ready">สมัครสมาชิก</button>
                        <button className="btn-register" onClick={() => history.push("/login")} type="button">กลับ</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register