import styled from 'styled-components';
import { Button } from 'antd';

export const TabelaContainer = styled.div`
  .tabela {
    h1 {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 20px;
    }
  }
`;

export const StyledButton = styled(Button)`
  margin-left: 15px;
`;

export const ActionButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: fit-content;
  align-items: center;
`;

export const WhatsAppButton = styled(Button)`
  margin-left: 10px;
`;

export const CustomSearch = styled.div<{ isMobile: boolean }>`
  width: ${(props) => (props.isMobile ? '100%' : '50%')};
  margin-bottom: 20px;
`;

export const TableContainer = styled.div`
  .ant-table-pagination {
    display: flex;
    justify-content: center;
  }
`;
