import { useEffect, useState } from 'react';
import './App.css';
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import { Switch, Route } from 'react-router-dom'
import LandingPage from './Components/LandingPage';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Cart from './Components/Cart';
import Market from './Components/Market';
import ProfileMarket from './Components/ProfileMarket';
import OwnMarket from './Components/OwnMarket';
import MyProfile from './Components/MyProfile';
import Orders from './Components/Orders';
import MapView from './Components/MapView';
import Rider from './Components/Rider';
import Rider_Register from './Components/Rider_Register';
import Test from './Components/Test';
import HistoryOrder from './Components/HistoryOrder';
import CopyRight from './Components/CopyRight';
import Swal from 'sweetalert2'
import axios from 'axios'
import Service from './Components/Service';
import DashBoardMerchant from './Components/DashBoardMerchant'
import DashBoardRider from './Components/DashBoardRider';
import MyOrder from './Components/MyOrder';
import Tutorial from './Components/Tutorial';

let socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)

function App() {
  // console.log(process.env)


  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })

  const cookie = localStorage.getItem('username')
  const audio = new Audio('../sound/cake.mp3')
  audio.volume = 0.3

  let [round, setRound] = useState('')
  let [test, setTest] = useState(0)

  let user_data = useSelector(state => state.user_data.userData)

  let [count, setCount] = useState(0)
  let [ridercount, setRiderCount] = useState(0)

  setTimeout(() => {
    if (cookie) {
      axios.post(process.env.REACT_APP_DOMAIN_KEY + '/check_cookie', {
        username: cookie
      }).then((res) => {
        if (res.data.status === false) {
          localStorage.removeItem('cart')
          localStorage.removeItem('username')
        }
      })
    }
  }, 2000)


  useEffect(() => {

    if (cookie) {
      axios.post(process.env.REACT_APP_DOMAIN_KEY + '/check_cookie', {
        username: cookie
      }).then((res) => {

        if (res.data.status) {
          socket.emit('username', cookie)
        } else {
          localStorage.removeItem('username')
          localStorage.removeItem('cart')
        }
      })
    }

    socket.emit("username", cookie)

    socket.on("receive_market", (payload) => {
      setRound(payload)
      console.log(payload)
      Toast.fire({
        icon: 'success',
        title: payload.text
      })
    })

    if (cookie) {
      axios.post(process.env.REACT_APP_DOMAIN_KEY + '/check_cookie', {
        username: cookie
      }).then((res) => {
        if (res.data.status) {
          socket.emit("get_name", cookie)
          socket.on("notify_count", (payload) => {
            console.log(payload.notification_count)
            setCount(payload.notification_count)
          })
          socket.on("notify_count_rider", (payload) => {
            setRiderCount(payload)
          })
          socket.on("count_notification", (payload) => {
            setTest(payload)
          })
        } else {
          localStorage.removeItem('username')
          localStorage.removeItem('cart')
        }
      })
    }
  })

  if (round) {
    audio.play()
  }

  return (
    <div className="App">
      <Navbar count={count} rider_count={ridercount} />
      <Switch>
        <Route exact path="/" component={LandingPage}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/cart" component={Cart}></Route>
        <Route path="/market" component={Market}></Route>
        <Route path="/profilemarket/:market" component={ProfileMarket}></Route>
        <Route path="/ownmarket" component={OwnMarket}></Route>
        <Route path="/myprofile" component={MyProfile}></Route>
        <Route path="/orders" component={Orders}></Route>
        <Route path="/rider" component={Rider}></Route>
        <Route path="/rider_register" component={Rider_Register}></Route>
        <Route path="/map" component={MapView}></Route>
        <Route path="/history_order" component={HistoryOrder}></Route>
        <Route path="/test" component={Test}></Route>
        <Route path="/service" component={Service}></Route>
        <Route path="/dashboard_merchant" component={DashBoardMerchant}></Route>
        <Route path="/dashboard_rider" component={DashBoardRider}></Route>
        <Route path="/my_order" component={MyOrder}></Route>
        <Route path="/tutorial" component={Tutorial}></Route>
      </Switch>
    </div>
  );
}

export default App;