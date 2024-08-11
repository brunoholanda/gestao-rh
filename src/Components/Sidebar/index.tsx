import React, { useEffect, useState } from 'react';
import {
  ScheduleOutlined,
  LogoutOutlined,
  SettingOutlined,
  LockOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  BankOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider } = Layout;

interface MenuItem {
  key: string;
  icon: JSX.Element;
  label: string | JSX.Element;
  children?: MenuItem[];
  url?: string;
  type?: string;
}

function getItem(label: string, key: string, icon: JSX.Element, children: MenuItem[] | null, url?: string, type?: string): MenuItem {
  if (type === 'dropdown') {
    return {
      key,
      icon,
      label,
      children: children || [],
    };
  }
  if (url) {
    return {
      key,
      icon,
      label: <Link to={url}>{label}</Link>,
    };
  }
  return {
    key,
    icon,
    label,
  };
}

const Sidebar: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState<boolean>(isMobile);
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const { colorBgContainer } = theme.useToken().token;

  useEffect(() => {
    const handleResize = () => {
      const currentIsMobile = window.innerWidth < 768;
      setIsMobile(currentIsMobile);
      if (currentIsMobile) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapsed = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const onMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      handleLogout();
    }
  };

  const iconSize = 22;
//@ts-ignore
  const items: MenuItem[] = [
    getItem('Home', '1', <HomeOutlined style={{ fontSize: iconSize }} />, null, '/home'),
    getItem('Funcionários', '2', <UsergroupAddOutlined style={{ fontSize: iconSize }} />, null, '/funcionarios'),
    getItem('Ocorrências', '3', <WarningOutlined style={{ fontSize: iconSize }} />, null, '/funcionarios'),
    getItem('Ponto Eletrônico', '4', <ClockCircleOutlined style={{ fontSize: iconSize }} />, null, '/funcionarios'),
    getItem('Controle de Férias', '5', <CalendarOutlined style={{ fontSize: iconSize }} />, null, '/funcionarios'),
    getItem('Usuários', '6', <UserAddOutlined style={{ fontSize: iconSize }} />, null, '/funcionarios'),
    getItem('Empresa', '7', <BankOutlined style={{ fontSize: iconSize }} />, null, '/funcionarios'),

    getItem('Sair +', 'logout', <LogoutOutlined style={{ fontSize: iconSize }} />, [
          // @ts-expect-errorsdsds

      { label: 'Sair', key: 'logout-system', icon: <LogoutOutlined />, onClick: handleLogout },
      { label: 'Alterar Senha', key: 'change-password', icon: <LockOutlined /> },
    ], undefined, 'dropdown'),
        // @ts-expect-errorsdsds

    authData.companyID === 1 && getItem('Administrador', '11', <SettingOutlined style={{ fontSize: iconSize }} />, null, '/adminpanel'),
  ].filter(Boolean);

  const isAuthenticated = !!sessionStorage.getItem('authToken');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible={!isMobile}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="sidebar"
      >
        <div className="demo-logo-vertical"></div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          //@ts-ignore
          items={items}
          onClick={onMenuClick}
          className="custom-menu"
        />
        {!isMobile && (
          <div onClick={toggleCollapsed}></div>
        )}
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
      </Layout>
    </Layout>
  );
};

export default Sidebar;
