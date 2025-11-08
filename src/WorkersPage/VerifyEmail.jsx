import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify?token=${token}`);

        if (res.data.redirectUrl) {
          // Perform the redirect in the browser
          window.location.href = res.data.redirectUrl;
          return; // stop further execution
        }

        // fallback toast if no redirectUrl
        toast.success(res.data.message || "Email verified ✅");

      } catch (error) {
        toast.error(error?.response?.data?.message || "Verification failed ❌");
      } finally {
        setLoading(false);
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-700 text-lg">
        {loading ? "Verifying your email..." : "Redirecting..."}
      </p>
    </div>
  );
};

export default VerifyEmail;
