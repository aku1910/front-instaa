import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store/store";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// import { Link } from "react-router-dom"
// import more from "../image/more.png"
// import home from "../image/home.png"
// import search from "../image/search.png"
// import social from "../image/social.png"
// import reel from "../image/reel.png"
// import messenger from "../image/messenger.png"
// import heart from "../image/heart.png"



// <header className="h-[100vh] w-[230px] bg-white border flex ">
//     <div>
//         <div className="p-[19px]">
//             <div className="h-[92px] mt-[19px]">
//                 <Link to="/">
//                     <img className="h-[38px]" src={logo} alt="" />
//                 </Link>
//             </div>
//             <div>
//                 <div className="flex h-[48px] items-center gap-3">
//                     <img className="w-[24px]" src={home} alt="" />
        //                     <h1>Home</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="w-[24px]" src={search} alt="" />
        //                     <h1>Search</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="w-[24px]" src={social} alt="" />
        //                     <h1>Explore</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="w-[24px]" src={reel} alt="" />
        //                     <h1>Reels</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="w-[24px]" src={messenger} alt="" />
        //                     <h1>Messages</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="w-[24px]" src={heart} alt="" />
        //                     <h1>Notifications</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="h-[24px]" src={more} alt="" />
        //                     <h1>Create</h1>
        //                 </div>
        //                 <div className="flex h-[48px] items-center gap-3">
        //                     <img className="h-[24px] w-[24px] rounded-[50%] border" src="" alt="" />
        //                     <h1>Profile</h1>
        //                 </div>
        //             </div>
        //         </div>
        //         <div>
        
        //         </div>
        //     </div>
        // </header>