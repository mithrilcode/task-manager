import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-400">
        Task list coming next.
      </p>
    </div>
  );
};

export default Tasks;
