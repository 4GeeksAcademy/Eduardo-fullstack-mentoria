import React, { useState } from "react";


const LoginAndSignup = ({ type = "login", onSubmit }) => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        ...(type === "signup" && { confirmPassword: "", username: "" }),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (type === "login") {
            setLoading(true);
            try {
                const resp = await fetch("https://laughing-orbit-v64px7qwjqr3xrpp-3001.app.github.dev/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: form.email, password: form.password })
                });
                const data = await resp.json();
                if (!resp.ok) {
                    setError(data.message || "Login failed");
                } else {
                    // Guardar token en localStorage o donde se requiera
                    localStorage.setItem("access_token", data.access_token);
                    if (onSubmit) onSubmit(data);
                }
            } catch (err) {
                setError("Network error");
            }
            setLoading(false);
            return;
        }
        if (onSubmit) onSubmit(form);
        // Me haria falta enviarle al store que cambie le estado de is_logged a true
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{type === "login" ? "Login" : "Sign Up"}</h2>
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            {type === "signup" && (
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
            )}
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            {type === "signup" && (
                <div>
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
            )}
            <button type="submit" disabled={loading}>
                {loading ? "Loading..." : type === "login" ? "Login" : "Sign Up"}
            </button>
        </form>
    );
};

export default LoginAndSignup;