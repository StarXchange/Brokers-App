import { Link } from "react-router-dom";
import { IoIosContact } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";

export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Modern Insurance Management System</h1>
      <div className=" flex space-x-4">


        <div className="flex items-center" >
        <IoIosContact />
        <Link to="/brokers" className="hover:underline ">Brokers</Link>
        </div>

        <div className="flex items-center">
        <MdGroups />    
        <Link to="/insuredclients" className="hover:underline">InsuredClients</Link>
        </div>

        <div className="flex items-center">
        <BsFillBuildingsFill />
        <Link to="/companies" className="hover:underline">Companies</Link>
        </div>
        
      </div>
    </nav>
  );
}
