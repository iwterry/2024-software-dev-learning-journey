import { Link, Outlet } from "react-router-dom";

export default function NavigationMenu() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="sports">Sports</Link>
          </li>
          <li>
            <Link to="cooking">Cooking</Link>
          </li>
          <li>
            <Link to="cars">Cars</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}