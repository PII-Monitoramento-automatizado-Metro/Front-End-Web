import "./ChangeLog.css"; // Ajuste o caminho conforme sua estrutura
import metroLogoDark from "./../assets/metro-logo.png"; // Logo na cor escura
import loginIllustration from "./../assets/login-illustration.png"; // Ilustração da direita

function ChangeLogPage() {
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
            <div className="input-group">
              <input type="text" id="username" placeholder="Usuário" />
              {/* <label htmlFor="username">Usuário</label> */}{" "}
              {/* Exemplo de label flutuante se quiser */}
            </div>

            <div className="input-group">
              <input type="password" id="password" placeholder="Senha" />
              {/* <label htmlFor="password">Senha</label> */}{" "}
              {/* Exemplo de label flutuante se quiser */}
              {/* Ícone de olho para mostrar/esconder senha (opcional, requer JS) */}
              <span className="password-toggle-icon">
                {/* Você pode usar um SVG ou um ícone de biblioteca aqui */}
                👁️ {/* Exemplo simples */}
              </span>
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Esqueceu sua senha?</a>
            </div>

            <button type="submit" className="login-button">
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

export default ChangeLogPage;
