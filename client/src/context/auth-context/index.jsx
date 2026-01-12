import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";


export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const response = await registerService(signUpFormData);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: response.message || "User registered successfully!",
        });
        setSignUpFormData(initialSignUpFormData);
        navigate("/auth");
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Please try again";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Cannot connect to server. Please make sure the server is running on port 3000";
      } else {
        // Something else happened
        errorMessage = error.message || "Network error occurred";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log(data, "datadatadatadatadata");

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.token)
        );
        setAuth({
          authenticate: true,
          user: data.user,
        });
        toast({
          title: "Success!",
          description: data.message || "Logged in successfully",
        });
        setSignInFormData(initialSignInFormData);
        navigate("/");
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast({
          title: "Login Failed",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}