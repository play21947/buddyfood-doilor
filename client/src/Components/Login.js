import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AsnycLogin } from '../Actions/LoginActions'
import Swal from 'sweetalert2'
import CopyRight from './CopyRight'

const Login = () => {

    let history = useHistory()

    let dispatch = useDispatch()

    let cookie = localStorage.getItem("username")

    let [blind, setBlind] = useState(false)
    let [word, setWord] = useState('password')

    let login = useSelector(state => state.login_data)

    console.log(login)

    if (cookie) {
        history.push("/home")
    }

    let getUsername
    let getPassword

    let HandleSubmit = (e) => {
        e.preventDefault()

        let username = getUsername.value
        let password = getPassword.value

        if (!username || !password) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'กรุณากรอกข้อมูล',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            dispatch(AsnycLogin(username, password, () => {
                history.push('/home')
                window.location.reload(true)
            }))
        }

    }

    return (
        <div className="login">
            <div className="box-login">
                <form onSubmit={HandleSubmit}>
                    <h1>เข้าสู่ระบบ</h1>
                    <hr />
                    <p>เบอร์โทรศัพท์</p>
                    <input type="tel" ref={(input_username) => getUsername = input_username} placeholder="xample"></input>
                    <p>รหัสผ่าน</p>
                    <input ref={(input_password) => getPassword = input_password} placeholder="*********" type={word}></input><img style={{cursor: 'pointer'}} className="eye" onClick={()=>{
                        if(blind){
                            setBlind(false)
                            setWord('password')
                        }
                        else{
                            setBlind(true)
                            setWord('text')
                        }
                        console.log(blind)
                    }} width="35px" src={blind ? "../img/eye.png" : "../img/eye_blind.png"}/>
                    <div className="btn-flex">
                        {login.isLoading ? <button className="btn-loading" disabled>กำลังเข้าสู่ระบบ...</button> : <button className="btn-ready">เข้าสู่ระบบ</button>}
                        <button className="btn-register" onClick={() => history.push("/register")} type="button">สมัครสมาชิก</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login