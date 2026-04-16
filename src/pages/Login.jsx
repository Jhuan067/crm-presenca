import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import logo from "../assets/logo.jpg"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")

    try {
      const response = await api.post("/crm/login", {
        email: email.trim(), // ✅ evita erro invisível
        senha
      })

      // ✅ salva corretamente o que o backend retorna
      localStorage.setItem("admin", JSON.stringify(response.data.admin))

      navigate("/dashboard")
    } catch (err) {
      // ✅ mostra erro real (acabou o "erro fantasma")
      console.log("ERRO:", err)
      console.log("RESPOSTA:", err.response?.data)

      setErro(err.response?.data?.error || "Erro ao conectar com o servidor")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* LOGO */}
        <div style={styles.logoContainer}>
          <img 
            src={logo} 
            alt="Logo Empresa"
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Acessar CRM</h2>

        {erro && <p style={styles.error}>{erro}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #d3d3d3, #bcbcbc)"
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    width: "360px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  logoContainer: {
    marginBottom: "20px"
  },
  logo: {
    width: "300px",
    objectFit: "contain"
  },
  title: {
    marginBottom: "30px",
    fontWeight: "600",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s"
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s"
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px"
  }
}