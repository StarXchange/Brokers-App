import { Link } from "react-router-dom";
import { IoIosContact } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
import { useLocation } from "react-router-dom"

export default function NavBar() {

    const { pathname } = useLocation();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Modern Insurance Management System</h1>
      <div className=" flex space-x-4">


        <div className="flex items-center" >
        <IoIosContact />
        <Link to="/brokers" className={`hover:underline ${pathname === '/brokers' ? 'font-bold' : ''} `}>Brokers</Link>
        </div>

        <div className="flex items-center">
        <MdGroups />    
        <Link to="/insured-clients" className={`hover:underline ${pathname === '/insured-clients' ? 'font-bold' : ''} `}>InsuredClients</Link>
        </div>

        <div className="flex items-center">
        <BsFillBuildingsFill />
        <Link to="/company" className={`hover:underline ${pathname === '/company' ? 'font-bold' : ''} `}>Company</Link>
        </div>
        
      </div>
    </nav>
  );
}
