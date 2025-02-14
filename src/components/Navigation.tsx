import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path
      ? "text-blue-600"
      : "text-gray-600 hover:text-blue-600";
  };

  return (
    <nav className="mb-8">
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/"
            className={`${isActiveLink("/")} transition-colors duration-200`}
          >
            home
          </Link>
        </li>
        <li>
          <Link
            to="/blog"
            className={`${isActiveLink("/blog")} transition-colors duration-200`}
          >
            blog
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={`${isActiveLink("/projects")} transition-colors duration-200`}
          >
            projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
