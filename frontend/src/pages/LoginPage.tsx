import { useState } from "react";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";


function LoginPage() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  //function
  const setToken = useAuthStore((state) => state.setToken);


  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try{
      const data = await login({email,password});

      // implemetes the token setting
      setToken(data!.data.token);
      console.log("LOGIN SUCCESS: ", data);
      alert("Login successful (check console)");
    }catch(err:any){
      setError(err.response?.data?.error || "Login falied"); 
    }finally{
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
