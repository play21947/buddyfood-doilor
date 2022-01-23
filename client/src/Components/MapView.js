import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet'
import './MapLeaflet.css'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import CopyRight from './CopyRight'

const MapView = () => {

    let [MyPos, setMyPos] = useState([])
    let [MarketPos, setMarketPos] = useState([])

    let cookie = localStorage.getItem('username')

    const LoadApiPost = (url) => {
        return new Promise((resolve, reject) => {
            if (url) {
                axios.post(url, {
                    username: cookie
                }).then((res) => {
                    resolve(setMyPos(res.data))
                })
            } else {
                reject({ error: true })
            }
        })
    }


    const LoadApiGet = (url) => {
        return new Promise((resolve, reject) => {
            if (url) {
                axios.get(url).then((res) => {
                    resolve(setMarketPos(res.data))
                })
            } else {
                reject({ error: true })
            }
        })
    }

    useEffect(async () => {
        await LoadApiPost(process.env.REACT_APP_DOMAIN_KEY+'/map')
        await LoadApiGet(process.env.REACT_APP_DOMAIN_KEY+'/map_market')
    }, [])


    console.log(MyPos)

    return (
        <div className="contain-map">
            <MapContainer style={{ height: '100vh' }} center={[18.514, 98.83]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <div>
                    {MyPos && MyPos.length > 0 ? MyPos.map((item) => { //Yourself
                        return (
                            <Circle center={[item.lat, item.longitude]} radius={20}>
                                <Tooltip direction="bottom" permanent>ฉัน</Tooltip>
                            </Circle>
                        )
                    }) : null}
                </div>
                <div>
                    {MyPos && MyPos.length > 0 ? MyPos.map((item) => { // Customer
                        return (
                            <Circle center={[item.lat_client, item.long_client]}>
                                <Tooltip direction="bottom" permanent>ลูกค้า</Tooltip>
                            </Circle>
                        )
                    }) : null}
                </div>
                <div>
                    {MarketPos && MarketPos.length > 0 ? MarketPos.map((item) => {
                        return (
                            <Circle center={[item.lat, item.longitude]} color="mediumseagreen">
                                <Tooltip direction="bottom" permanent>{item.market}</Tooltip>
                            </Circle>
                        )
                    }) : null}
                </div>
            </MapContainer>
            <CopyRight />
        </div>
    )
}

export default MapView