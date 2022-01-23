import { useEffect } from "react"

const StatusOrder = ({ item, time, confirm_market, confirm_rider, confirm_market_time, confirm_rider_time, code_discount }) => {

    console.log(confirm_rider)

    let total = item.reduce((sum, item)=> sum = sum + item.quantity, 0)
    let all_money = item.reduce((sum, item)=> sum + (item.quantity * item.food_price), 0)

    // console.log("Confirm Time: ", confirm_market_time)
    // console.log("Time buy : ", time)
    let cvt_time_buy = time.split(':')
    let cvt_time = confirm_market_time.split(':')

    // console.log(cvt_time_buy[0].split(' ')[1])
    // console.log(cvt_time)

    // console.log(item)
    let cvt_time_rider = confirm_rider_time.split(':')

    return (
        <div className="box-order-client-inside">
            <p className="time_order">{time} น.</p>
            <div>
                {item && item.length > 0 ? item.map((item) => {
                    return (
                        <div className="my-order-detail">
                            <p>{item.food_name} x {item.quantity} = {item.quantity * item.food_price}</p>
                        </div>
                    )
                }) : null}
                <p style={{textAlign: 'center', padding: '10px'}}>จำนวน : {total} ชิ้น</p>
                <div style={{textAlign: 'center'}}>
                    <p>ค่าขนส่ง 15 บาท</p>
                    {code_discount ? <p>โค้ดส่วนลด : {code_discount} บาท</p> : <p>โค้ดส่วนลด : 0</p>}
                    <p className="all_money">รวมเป็นเงินทั้งสิ้น : {code_discount ? all_money : all_money+15} ฿</p>
                </div>
                <p className="time-ago-market">ร้านค้ารับ : {cvt_time[0].split(' ')[1]}:{cvt_time[1]} นาที</p>
                <p>ไรเดอร์รับ : {cvt_time_rider[0].split(' ')[1]}:{cvt_time_rider[1]} นาที</p>
            </div>
            {/* <div>
                <p>{confirm_market ? confirm_market == 1 ? <p style={{color: 'green', marginTop: '20px'}}><s>ร้านค้ารับออเดอร์แล้วค่ะ</s></p> : <p>กำลังรอร้านค้ารับออเดอร์ค่ะ...</p> : <p style={{color: 'firebrick', marginTop: '15px'}}>กำลังรอร้านค้ารับออเดอร์ค่ะ</p>}</p>
                <p>{confirm_rider != 0 ? <p style={{color: 'green'}}><s>ไรเดอร์รับสินค้าเเล้ว</s></p> : <p style={{color: 'firebrick'}}>ไรเดอร์ยังไม่รับสินค้าโปรดรอ</p>}</p>
            </div> */}
            <div className="tracking">
                {confirm_market == 0 && confirm_rider == 0 ? <img src="../img/wait.png"></img> : confirm_market == 1 && confirm_rider == 0 ? <img src="../img/market_confirm.png"></img> : confirm_rider == 1 && confirm_market == 1 ? <img src="../img/rider_confirm.png"></img> : null}
            </div>
        </div>
    )
}

export default StatusOrder