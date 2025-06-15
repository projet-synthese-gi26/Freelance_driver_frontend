import { useAuth } from "@/app/(pricing)/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  return (
    <nav className="flex justify-between p-4 bg-gray-100 text-white">
      <h1 className="text-lg font-bold text-primary"></h1>
      {user ? (
        <div className="flex items-center justify-center space-x-4">
            <h1 className="text-xl font-bold text-black mb-4">Welcome, {user?.email} 👋</h1>
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
            Logout
            </button>
        </div>
      ) : (
        <a href="/login" className="bg-blue-500 px-4 py-2 rounded">
          Sign In
        </a>
      )}
    </nav>
  );
}
