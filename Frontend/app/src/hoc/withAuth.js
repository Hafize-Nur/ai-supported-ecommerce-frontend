// hoc/withAuth.js
import { decodeToken } from "../utils/auth/decodeToken";

const withAuth = (WrappedComponent, requiredRoles = []) => {
  return (props) => {
    const token = localStorage.getItem("token");
    const roles = decodeToken(token);

    if (!token || !roles.some((role) => requiredRoles.includes(role))) {
      // Token yoksa veya gerekli role sahip değilse giriş sayfasına yönlendir
      window.location.href = "/login";
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
