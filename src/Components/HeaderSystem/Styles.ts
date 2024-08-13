import styled from 'styled-components';
import { Layout } from 'antd';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const HeaderStyled = styled(Layout.Header)`
  background-color: #001529;
  padding: 0;


`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

export const HeaderTitle = styled.h1`
  font-size: 14px;
  color: #fff;
`;

export const HeaderDropdown = styled.div`
  cursor: pointer;
  color: #fff;
  font-weight: bold;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const UserName = styled.span`
  color: #fff;
  margin-left: 8px;
  font-weight: bold;
  font-size: 12px;

`;
