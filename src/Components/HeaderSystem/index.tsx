import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as S from './Styles';  // Estilos que você pode definir
import { useAuth } from '../../context/AuthContext';

const { Header } = Layout;

export const HeaderSystem: React.FC = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();
  const userName = "Bruno Holanda"; 

  const handleLogout = () => {
    // Lógica de logout
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<LockOutlined />}>
        Alterar Senha
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <S.HeaderStyled>
      <S.HeaderContent>
        <S.HeaderTitle>Nome da sua empresa</S.HeaderTitle>
        <Dropdown overlay={menu} placement="bottomRight">
          <S.UserSection>
            <Avatar size="large" icon={<UserOutlined />} />
            <S.UserName>{userName}</S.UserName>
          </S.UserSection>
        </Dropdown>
      </S.HeaderContent>
    </S.HeaderStyled>
  );
};
