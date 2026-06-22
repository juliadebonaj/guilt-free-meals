import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useLocalStorage } from '../useLocalStorage';

interface Sessao {
  logado: boolean;
  email: string;
}

export default function Login() {
  const [sessao, setSessao] = useLocalStorage<Sessao | null>('guilt-free-sessao', null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  if (sessao?.logado) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha e-mail e senha para continuar.');
      return;
    }
    setSessao({ logado: true, email: email.trim() });
    navigate('/');
  };

  return (
    <Pagina>
      <Cartao>
        <Rotulo>Acesso</Rotulo>
        <Titulo>
          Bem-vindo <em>de volta</em>
        </Titulo>

        <Formulario onSubmit={handleSubmit} noValidate>
          <CampoWrapper>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro('');
              }}
              autoComplete="email"
            />
          </CampoWrapper>

          <CampoWrapper>
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro('');
              }}
              autoComplete="current-password"
            />
          </CampoWrapper>

          {erro && <MensagemErro role="alert">{erro}</MensagemErro>}

          <BotaoEntrar type="submit">Entrar</BotaoEntrar>
        </Formulario>
      </Cartao>
    </Pagina>
  );
}

const Pagina = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espacos['3xl']} ${({ theme }) => theme.espacos.lg};
`;

const Cartao = styled.div`
  width: 100%;
  max-width: 420px;
  text-align: center;
`;

const Rotulo = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.cores.sage[900]};
  margin-bottom: ${({ theme }) => theme.espacos.md};
`;

const Titulo = styled.h1`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: ${({ theme }) => theme.tamanhosFonte['2xl']};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  color: ${({ theme }) => theme.cores.texto.primario};
  margin-bottom: ${({ theme }) => theme.espacos['2xl']};

  em {
    font-style: italic;
    color: ${({ theme }) => theme.cores.sage[900]};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: ${({ theme }) => theme.tamanhosFonte['3xl']};
  }
`;

const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.lg};
  text-align: left;
`;

const CampoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.xs};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.secundario};
`;

const Input = styled.input`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.lg};
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.bordas.md};
  color: ${({ theme }) => theme.cores.texto.primario};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.cores.sage[900]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.cores.sage[300]}66;
  }

  &::placeholder {
    color: ${({ theme }) => theme.cores.texto.muted};
  }
`;

const MensagemErro = styled.p`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.estados.erro};
  margin: 0;
`;

const BotaoEntrar = styled.button`
  width: 100%;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  font-weight: ${({ theme }) => theme.pesoFonte.medium};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.espacos.md} ${({ theme }) => theme.espacos.xl};
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  border: none;
  border-radius: ${({ theme }) => theme.bordas.pill};
  cursor: pointer;
  transition: background 0.2s;
  margin-top: ${({ theme }) => theme.espacos.sm};

  &:hover {
    background: ${({ theme }) => theme.cores.texto.secundario};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
