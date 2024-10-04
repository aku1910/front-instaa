import { FaInstagram} from "react-icons/fa"

export default function Loader() {
    return (
        <div className="w-full h-full fixed top-0 left-0 bg-zinc-50 text-pink-600 flex items-center justify-center text-2xl flex-col">
            <FaInstagram size={100}/>
           <p className="font-bold">Instagram</p>
        </div>
    )
}