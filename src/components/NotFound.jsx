import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="h-[70vh] flex flex-col justify-center items-center text-center text-white bg-gray-800">
      <h1 className="text-7xl font-bold mb-4 text-sky-blue">404</h1>
      <p className="text-2xl mb-8 text-gray-300">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-btn-blue text-white px-8 py-3 rounded-md transition-all duration-200 transform hover:scale-105 hover:ring-2 hover:ring-btn-outline-blue "
      >
        Go Back Home
      </Link>
    </section>
  );
}

export default NotFound;