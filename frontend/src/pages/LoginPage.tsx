import { Navigate } from 'react-router-dom';
import LoginOrReg from '../components/LoginOrReg';

export default function LoginPage({ isLogin }: { isLogin: boolean }) {
  if (isLogin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginOrReg />;
}
