import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const [ userData, setUserData ] = useState();

	async function handleCallApi() {
		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("No access token found");
			return;
		}
		try {
			const res = await fetch("https://laughing-orbit-v64px7qwjqr3xrpp-3001.app.github.dev/api/protected", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`, // [IMPORTANTE] Asegúrate de que el token se envía correctamente
				},
			});
			if (!res.ok) {
				// Intenta obtener el mensaje de error del backend
				let errorMsg = "Failed to fetch user data";
				try {
					const errorData = await res.json();
					if (errorData && errorData.msg) errorMsg = errorData.msg;
					if (errorData && errorData.message) errorMsg = errorData.message;
				} catch { }
				throw new Error(errorMsg);
			}
			const data = await res.json();
			setUserData(data);
		} catch (err) {
			alert(err.message);
		}
	}


	return (
		<div className="text-center mt-5">
			<h1>Welcome to the <span className="text-primary">React</span> Frontend!</h1>
			<button
				className="btn btn-primary my-3"
				onClick={handleCallApi}
			>
				Obtener datos de usuario
			</button>
			{userData && (
				<pre className="text-start bg-light p-3 rounded">
					{JSON.stringify(userData, null, 2)}
				</pre>
			)}
		</div>
	);
}; 