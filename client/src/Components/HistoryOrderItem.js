import { useState } from "react"

const HistoryOrderItem=({item, time, store, finish_time})=>{
    
    let total = item.reduce((sum, item)=> sum + (item.quantity * item.food_price), 0)

    let cvt_finish = finish_time.split(':')
    let cvt_time_buy = time.split(":")

    console.log(cvt_time_buy[1]) //เวลาที่ซื้อ
    console.log(cvt_finish[1]) //เวลาที่เสร็จสิ้น

    let buy = parseInt(cvt_time_buy[1])
    let finish = parseInt(cvt_finish[1])

    return(
        <div className="box-history">
            <div className="flex">
                <p>{time}</p>
                <p className="store-history">{store}</p>
            </div>
            {item && item.length > 0 ? item.map((item)=>{
                return(
                    <div>
                        <p className="history-item-word">{item.food_name} x {item.quantity}</p>
                    </div>
                )
            }): null}
            <p>ยอดรวมทั้งสิ้น : {total}</p>
            <hr/>
            <p style={{color: 'green', textAlign: 'center'}}>เสร็จสิ้นใช้เวลา {buy < finish ? finish - buy : buy > finish ? 60 - (buy-finish) : null} นาที</p>
        </div>
    )
}

export default HistoryOrderItem