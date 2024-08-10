import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import Loading from '../../Components/Loading';

import * as S from './Styles';
import Btn from '../../Components/Btn';
import { useAuth } from '../../context/AuthContext';
import api from '../../Components/api/api';

const Authentication = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { updateAuthData } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
  
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
  
      const { access_token, company_id, user_type } = response.data;
  
      if (!access_token) {
        throw new Error('Token de acesso não recebido.');
      }
  
      updateAuthData({
        authToken: access_token,
        companyID: company_id || null,
        userType: user_type || [],
      });
  
      setUsername('');
      setPassword('');
      navigate('/home');
      console.log(company_id);  // Verifique se este log mostra o valor correto de company_id
  
    } catch (error) {
      setIsLoading(false);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao fazer login.';
      setLoginError(errorMessage);
      message.error(errorMessage);
    }
  };
  

  return (
    <S.AuthContainer>
      {isLoading ? <S.LoadingOverlay><Loading /> </S.LoadingOverlay> : (
        <S.AuthForm onSubmit={handleLogin}>
          <h1>Acesso <LockOutlined /></h1>
          <S.InputContainer>
            <label htmlFor="username">E-mail</label>
            <input
              type="text"
              id="username"
              placeholder='E-mail'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </S.InputContainer>
          <S.InputContainer>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <S.Error>{loginError}</S.Error>}
          </S.InputContainer>
          {/*  @ts-expect-errorsdsds*/}
          <Btn type="submit" >Entrar</Btn>
          <S.ForgotPassword>
            <Button type="link">
              Esqueci minha senha
            </Button>
          </S.ForgotPassword>
          {/*
            <S.RegisterPrompt>
              <p>Você ainda não tem uma conta Marquei?</p>
              <Link to='/cadastro'>
                Teste o Marquei gratuitamente
              </Link>
            </S.RegisterPrompt>
      */}
        </S.AuthForm>
      )}
    </S.AuthContainer>
  );
};

export default Authentication;