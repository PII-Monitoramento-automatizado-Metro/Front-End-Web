import metroLogoDark from "./../assets/metro-logo.png"; // Logo na cor escura
import "./Main.css"; // Ajuste o caminho conforme sua estrutura

function MainPage() {
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
    </div>
  );
}

export default MainPage;
