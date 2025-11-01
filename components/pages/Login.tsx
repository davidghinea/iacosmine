import React from "react";
import { LoginCard } from "@/components/personal-components/logincard";

const Login: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 box-border overflow-hidden bg-background">
      <LoginCard />
    </div>
  );
};

export default Login;
