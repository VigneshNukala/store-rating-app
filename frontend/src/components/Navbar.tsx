const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Store Rating App</div>

      <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
