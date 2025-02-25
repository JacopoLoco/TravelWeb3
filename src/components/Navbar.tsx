import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="shadow-md p-4 mt-4">
      <div className="container mx-auto flex justify-center">
        
        <ul className="flex space-x-6 text-gray-300">
          <li>
            <Link to="/" className="hover:text-blue-400 transition text-white">Home</Link>
          </li>
          <li>
            <Link to="/Travels" className="hover:text-blue-400 transition text-white">Travels</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
