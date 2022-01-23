import { useHistory } from "react-router-dom"
import CopyRight from "./CopyRight"

const LandingPage = () => {

    let history = useHistory()

    let cookie = localStorage.getItem("username")

    if (cookie) {
        history.push("/home")
    }

    return (
        <div>
            <div className="container">
                <p className="buddyfood-header">BuddyFood</p>
                <p className="buddyfood-header2">แอพสั่งของง่ายรวดเร็ว แค่ปลายนิ้ว</p>
                <div className="buddy-banner-grid">
                    <div className="banner-b1">
                        <img onClick={() => history.push('/register')} src="/img/09.jpg"></img>
                    </div>
                    <div className="banner-b2">
                        <img onClick={() => history.push('/register')} src="/img/21.jpg"></img>
                    </div>
                    <div className="banner-b3">
                        <img onClick={() => history.push('/register')} src="/img/13.jpg"></img>
                    </div>
                    <div className="banner-b4">
                        <img onClick={() => history.push('/register')} src="/img/35.jpg"></img>
                    </div>
                    <div className="banner-b5">
                        <img src="/img/video.gif"></img>
                    </div>
                </div>
            </div>
            <div className="show-step">
                <div className="show-box">
                    <img src="../img/show-1.png"></img>
                    <p>มีอาหารหลากหลายให้คัดสรร</p>
                </div>
                <div className="show-box">
                    <img src="../img/show-2.png"></img>
                    <p>สั่งได้เพียงเเตะที่มือถือ</p>
                </div>
                <div className="show-box">
                    <img src="../img/show-3.png"></img>
                    <p>ส่งอาหารได้รวดเร็วทันใจ</p>
                </div>
            </div>
            <CopyRight />
        </div>
    )
}

export default LandingPage