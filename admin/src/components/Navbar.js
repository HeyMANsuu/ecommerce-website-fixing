import React  from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
	
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light  border-bottom"  >
			<div className="container-fluid">
				<Link className="navbar-brand" href="#">
					<i className="fa-solid fa-shop me-2" style={{ fontSize: "2rem" }}></i>
					<Link className="navbar-brand" to="/" style={{ fontWeight: "800" }}>ShopYours </Link>
				</Link>
				<div className='me-5'>
					<i className="fa-solid fa-user" style={{ fontSize: "2rem" }}></i>
				</div>
			</div>
		</nav >
	)
}

export default Navbar