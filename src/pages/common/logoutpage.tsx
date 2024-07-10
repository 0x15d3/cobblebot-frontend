import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullPageLoading from "../../components/page/pageloading";
import { AuthContext } from "../../providers/AuthProvider";

function LogoutPage() {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      navigate('/');
    };

    handleLogout();
  }, [signOut, navigate]);

  return <FullPageLoading />;
}

export default LogoutPage;
