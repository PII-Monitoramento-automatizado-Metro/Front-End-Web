import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import loginIllustration from "./../assets/login-illustration.png"; // Ilustração da direita
import metroLogo from "./../assets/metro-logo.png"; // Logo na cor escura
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./Login.css";
import { useState } from "react";

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

  const [showPassword, setShowPassword] = useState(false);

  // 2. Funções para alternar o estado
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault(); // Impede que o clique "saia" do foco do input
  };

  return (
    <div className="login-page-container">
      {/* Lado Esquerdo: Formulário de Login */}
      <div className="login-left">
        <div className="login-header">
          <img src={metroLogo} alt="Metrô Logo" className="login-logo" />
        </div>

        <div className="login-form-area">
          <div className="texts">
            <h1>BEM-VINDO!</h1>
            <p className="login-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              ligula.
            </p>
          </div>

          <form className="login-form">
            <div className="textFields">
              <TextField
                className="email input"
                label="Funcional"
                type="text"
                variant="outlined"
                required
              />
              <TextField
                className="senha input"
                label="Senha"
                variant="outlined"
                required
                // 3. Alterne o 'type' com base no estado
                type={showPassword ? "text" : "password"}
                // 4. Adicione o ícone clicável aqui
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        className="eye"
                      >
                        {/* 5. Alterne o ícone com base no estado */}
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="preferences">
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
