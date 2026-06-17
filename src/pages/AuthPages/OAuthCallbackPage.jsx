import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { exchangeOAuthCode } from "../../store/slices/authSlice";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { toast } from "react-toastify";
import { getRoleLandingPath } from "../../utils/rolePaths";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuth = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        toast.error("Đăng nhập thất bại, vui lòng thử lại!");
        navigate("/auth/login", { replace: true });
        return;
      }

      try {
        const resultAction = await dispatch(exchangeOAuthCode(code)).unwrap();
        toast.success("Đăng nhập thành công!");
        navigate(getRoleLandingPath(resultAction.role), { replace: true });
      } catch (error) {
        toast.error("Đăng nhập thất bại, vui lòng thử lại!");
        navigate("/auth/login", { replace: true });
      }
    };

    handleAuth();
  }, [dispatch, navigate]);

  return <LoadingSpinner />;
};

export default OAuthCallbackPage;
