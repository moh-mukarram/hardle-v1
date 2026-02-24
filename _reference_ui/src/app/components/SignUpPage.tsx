import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const leaderboardData = [
    { username: "w0rdmaster", points: 1238, rank: 1 },
    { username: "deducto42", points: 1239, rank: 2 },
    { username: "guesserino", points: 1261, rank: 3 },
    { username: "scrabbly", points: 1260, rank: 4 },
    { username: "lingolegend", points: 1250, rank: 5 },
    { username: "puzzler975", points: 1128, rank: 6 },
    { username: "vocabvulture", points: 1133, rank: 7 },
    { username: "cryptospell", points: 1155, rank: 8 },
    { username: "lexiconking", points: 1850, rank: 9 },
    { username: "anagramadept", points: 850, rank: 10 },
  ];

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Navigate to game mode selection after signup
      navigate("/mode-select");
    }
  };

  const isFormValid =
    username &&
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-12 dark">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />
      
      {/* Main container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column - Authentication Panel */}
        <div className="flex flex-col justify-center space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-white">
              HARDLE
            </h1>
            <p className="text-gray-500">
              Server-Authoritative Word Deduction Game
            </p>
          </div>

          {/* Sign Up Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">
              Create Account
            </h2>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm text-gray-400">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 bg-[#1a1a1a] border ${
                    errors.username ? "border-red-500/50" : "border-gray-800"
                  } rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 ${
                    errors.username ? "focus:ring-red-500/50" : "focus:ring-gray-700"
                  } focus:border-transparent transition-all`}
                />
                {errors.username && (
                  <p className="text-sm text-red-400">{errors.username}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-gray-400">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-[#1a1a1a] border ${
                    errors.email ? "border-red-500/50" : "border-gray-800"
                  } rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 ${
                    errors.email ? "focus:ring-red-500/50" : "focus:ring-gray-700"
                  } focus:border-transparent transition-all`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm text-gray-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-[#1a1a1a] border ${
                      errors.password ? "border-red-500/50" : "border-gray-800"
                    } rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 ${
                      errors.password ? "focus:ring-red-500/50" : "focus:ring-gray-700"
                    } focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-all duration-200"
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="transition-opacity duration-200" />
                    ) : (
                      <Eye size={20} className="transition-opacity duration-200" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm text-gray-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-[#1a1a1a] border ${
                      errors.confirmPassword ? "border-red-500/50" : "border-gray-800"
                    } rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? "focus:ring-red-500/50" : "focus:ring-gray-700"
                    } focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-all duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} className="transition-opacity duration-200" />
                    ) : (
                      <Eye size={20} className="transition-opacity duration-200" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isFormValid
                    ? "bg-[#d4a933] hover:bg-[#e0b840] text-black"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                Sign Up
              </button>
            </form>

            {/* Log In Link */}
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-[#d4a933] hover:text-[#e0b840] transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Leaderboard Panel */}
        <div className="flex flex-col justify-center">
          <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-white">
              Leaderboard
            </h2>

            {/* Leaderboard Table */}
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-2 pb-3 border-b border-gray-800">
                <div className="text-sm font-medium text-gray-400">User</div>
                <div className="text-sm font-medium text-gray-400 text-right">Points</div>
              </div>

              {/* Leaderboard Entries */}
              <div className="space-y-0.5">
                {leaderboardData.map((entry, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-2 py-3 border-b border-gray-800/50 last:border-0 ${
                      index < 3 ? "text-white" : "text-gray-400"
                    }`}
                  >
                    <div className={`${index < 3 ? "text-[#d4a933]" : ""}`}>
                      {entry.username}
                    </div>
                    <div className={`text-right ${index < 3 ? "font-medium" : ""}`}>
                      {entry.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
