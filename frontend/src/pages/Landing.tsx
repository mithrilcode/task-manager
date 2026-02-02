import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Task Manager
        </h1>

        <p className="text-gray-400 text-lg">
          A simple, focused way to manage your tasks.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded border border-white/30 hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>

        <p className="pt-6 text-sm text-gray-500">
          React • TypeScript • FastAPI • JWT Auth
        </p>
      </div>
    </div>
  );
};

export default Landing;
