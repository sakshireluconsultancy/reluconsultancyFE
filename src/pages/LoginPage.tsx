import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hpLogo from "../assets/logo.webp";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* authentication would go here */
    navigate("/dashboard"); // redirect
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow animate-fadeUp"
      >
        {/* brand header */}
        <div className="flex flex-col items-center gap-3">
          <img src={hpLogo} alt="HP logo" className="w-16" />
          <h1 className="text-2xl font-bold text-hpBlue tracking-hp">
            HP Latex Buzz
          </h1>
          <p className="text-sm text-gray-500 tracking-hp">
            Sign in to your account
          </p>
        </div>

        {/* fields */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium tracking-hp">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hpBlue"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium tracking-hp"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hpBlue"
            />
          </div>
        </div>

        {/* submit */}
        <button
          type="submit"
          className="w-full rounded-md bg-hpBlue py-2 font-semibold text-white tracking-hp transition hover:bg-hpBlue/90"
        >
          Login
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
