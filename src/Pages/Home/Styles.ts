import styled from 'styled-components';
import { Card } from 'antd';

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  margin-top: 4rem;

  a {
    text-decoration: none;
  }
`;

export const CardItem = styled(Card)`
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: 0.5s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.005);
  }

  .ant-card-meta-title {
    font-weight: bold;
    font-size: 16px;
  }

  .ant-card-meta-description {
    color: #555;
  }
`;
