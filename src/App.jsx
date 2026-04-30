import { useState } from "react";

const BASE_URL = "https://localhost:4000/api"; // ← apna backend URL lagao

export default function App() {
    const token = new URLSearchParams(window.location.search).get("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid invite link. Token missing from URL.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      // ✅ Direct fetch — NO auth header (public route hai)
      const res = await fetch(`${BASE_URL}/member/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,                        // ✅ URL se liya hua
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("API Response:", data); // debug

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccess(true);

    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
        {/* bg blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute bottom-[-100px] right-[-80px] w-[350px] h-[350px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">You're all set!</h2>
          <p className="text-white/60 text-sm">Your account has been created successfully.<br />You can now log in.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="mt-8 w-full text-white font-semibold py-3.5 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

      {/* Card */}
      <div className="relative w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-10 pt-10 pb-8 text-center border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Accept Invitation</h1>
          <p className="text-white/50 text-sm mt-2">Complete your profile to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-5">

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "firstName", label: "First Name", placeholder: "John" },
              { name: "lastName", label: "Last Name", placeholder: "Smith" },
            ].map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-medium text-white/70">{field.label}</label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 transition-all"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              </div>
            ))}
          </div>

          {/* Password */}
          {[
            { name: "password", label: "Password", show: showPass, toggle: () => setShowPass(p => !p), placeholder: "Min. 8 characters" },
            { name: "confirmPassword", label: "Confirm Password", show: showConfirm, toggle: () => setShowConfirm(p => !p), placeholder: "Repeat your password" },
          ].map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">{field.label}</label>
              <div className="relative">
                <input
                  name={field.name}
                  type={field.show ? "text" : "password"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-white/30 outline-none border border-white/10 focus:border-indigo-400 focus:ring-2 transition-all"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
                <button type="button" onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {field.show ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Password Strength */}
          {formData.password && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: formData.password.length >= i * 3
                        ? formData.password.length >= 10 ? "#10b981"
                          : formData.password.length >= 6 ? "#f59e0b"
                          : "#ef4444"
                        : "rgba(255,255,255,0.1)"
                    }} />
                ))}
              </div>
              <p className="text-xs text-white/40">
                {formData.password.length < 6 ? "Weak" : formData.password.length < 10 ? "Medium" : "Strong"} password
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Setting up your account...
              </>
            ) : "Sign Up"}
          </button>

          <p className="text-center text-white/30 text-xs pt-1">
            By continuing, you agree to our Terms of Service
          </p>
        </form>
      </div>
    </div>
  );
}