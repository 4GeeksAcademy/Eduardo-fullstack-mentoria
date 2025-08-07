import { Link } from "react-router-dom";

import useGlobalReducer from "../hooks/useGlobalReducer";
import LoginAndSignup from "./LoginAndSignup";
import React from "react";

export const Navbar = () => {
	const { dispatch, store } = useGlobalReducer();

	const handleLoginClick = () => {
		dispatch({ type: "SHOW_LOGIN_FORM", payload: true });
	};

	const handleCloseModal = () => {
		dispatch({ type: "SHOW_LOGIN_FORM", payload: false });
	};

	return (
		<>
			<nav className="navbar navbar-light bg-light">
				<div className="container">
					<Link to="/">
						<span className="navbar-brand mb-0 h1">React Boilerplate</span>
					</Link>
					<div className="ml-auto">
						{store.is_logged ? (
							<button className="btn btn-outline-danger">Logout</button>
						) : (
							<button
								className="btn btn-outline-primary"
								onClick={handleLoginClick}
							>
								Login
							</button>
						)}
					</div>
				</div>
			</nav>

			{/* Modal de Login */}
			{store.showLoginForm && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					background: "rgba(0,0,0,0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 9999
				}}>
					<div style={{ background: "#fff", padding: 32, borderRadius: 8, minWidth: 320, position: "relative" }}>
						<button onClick={handleCloseModal} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>&times;</button>
						<LoginAndSignup type="login" />
					</div>
				</div>
			)}
		</>
	);
};