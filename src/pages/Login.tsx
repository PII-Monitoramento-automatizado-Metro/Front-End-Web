import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/httpsRequests";
import loginIllustration from "./../assets/login-illustration.png";
import metroLogo from "./../assets/metro-logo.png";
import "./Login.css";

function LoginPage() {
  const navigate = useNavigate();

  // 1. DECLARAÇÃO DOS ESTADOS (DEVE FICAR NO TOPO)
  const [funcional, setFuncional] = useState("");
  const [senha, setSenha] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. FUNÇÕES DE VALIDAÇÃO (AJUSTADAS)
  const hasSenhaErrors = () => senha.length > 0 && senha.length < 4;
  const hasFuncionalErrors = () =>
    funcional.length > 0 && !funcional.includes("@");

  // 3. FUNÇÕES AUXILIARES DE UI
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  // 4. FUNÇÃO DE LOGIN (handleLogin)
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento padrão do formulário

    setLoginError("");

    if (!funcional || !senha) {
      setLoginError("Preencha o campo Funcional e a Senha.");
      return;
    }

    if (hasFuncionalErrors() || hasSenhaErrors()) {
      setLoginError(
        "Verifique os campos digitados (formato do funcional ou tamanho da senha)."
      );
      return;
    }

    setLoading(true);

    try {
      // Chamada à API
      const response = await loginRequest(funcional.trim(), senha);

      setLoading(false);

      if (response && response.success) {
        console.log("Login bem-sucedido:", response.nome);
        // Salva o nome que veio do banco no navegador
        localStorage.setItem("nome_usuario", response.nome);
        navigate("/main"); // Redireciona
      } else {
        setLoginError("Falha desconhecida no login. Tente novamente.");
      }
    } catch (error) {
      // Tratamento de Erro (Falha HTTP 401, Erro de Rede, etc.)
      setLoading(false);

      setLoginError(
        (error as Error).message ||
          "Erro de conexão com o servidor. Verifique sua rede."
      );
    }
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
              Entre para gerenciar e acompanhar o progresso das obras.
            </p>
          </div>

          {/* CONECTA O FORMULÁRIO COM O handleLogin via onSubmit */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="textFields">
              {/* CAMPO FUNCIONAL */}
              <TextField
                className="email input"
                label="Funcional"
                type="text"
                variant="outlined"
                required
                value={funcional}
                onChange={(e) => setFuncional(e.target.value)}
                error={hasFuncionalErrors()}
                helperText={hasFuncionalErrors() ? "Funcional inválido" : ""}
              />
              {/* CAMPO SENHA */}
              <TextField
                className="senha input"
                label="Senha"
                variant="outlined"
                required
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                error={hasSenhaErrors()}
                helperText={hasSenhaErrors() ? "Senha muito curta" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        className="eye"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* EXIBIÇÃO DO ERRO GERAL */}
              {loginError && (
                <p style={{ color: "red", marginTop: 10 }}>{loginError}</p>
              )}
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

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
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
