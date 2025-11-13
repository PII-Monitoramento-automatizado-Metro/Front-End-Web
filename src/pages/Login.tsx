import { useNavigate } from "react-router-dom";
import loginIllustration from "./../assets/login-illustration.png"; // Ilustração da direita
import metroLogoDark from "./../assets/metro-logo.png"; // Logo na cor escura
import "./Login.css"; // Ajuste o caminho conforme sua estrutura
import { TextField, Button } from "@mui/material";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      console.log("Login bem-sucedido:");
      navigate("/main");
    } catch (error) {
      alert("Ocorreu um erro ao fazer login. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="login-page-container">
      {/* Lado Esquerdo: Formulário de Login */}
      <div className="login-left">
        <div className="login-header">
          <img src={metroLogoDark} alt="Metrô Logo" className="login-logo" />
        </div>

        <div className="login-form-area">
          <h1>BEM-VINDO!</h1>
          <p className="login-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
            ligula.
          </p>

          <form className="login-form">
            <TextField
              className="email input"
              label="Funcional"
              type="text"
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              className="senha input"
              label="Senha"
              type="password"
              margin="normal"
              variant="outlined"
              required
            />
            <div className="Preferences">
              <div className="lembrar-usuario">
                <input type="checkbox" className="checkbox-circular" />
                <p>Lembrar de mim</p>
              </div>
              <div className="forgot-password">
                <a href="/forgot-password">Esqueceu sua senha?</a>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              onClick={handleLogin}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      {/* Lado Direito: Ilustração e Descrição */}
      <div className="login-right">
        <div className="illustration-card">
          <img
            src={loginIllustration}
            alt="Engenheiros trabalhando"
            className="illustration-image"
          />
          <div className="carousel-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <p className="illustration-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
            ligula nulla, hendrerit at{" "}
            <span className="highlight">malesuada at.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
