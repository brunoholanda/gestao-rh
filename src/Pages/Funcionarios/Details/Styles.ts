import styled from 'styled-components';
import { Button } from 'antd';

export const DadosPessoais = styled.div`
  display: flex;

  .foto-funcionario {
    position: relative;
    width: 220px;
    height: 240px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    margin: 2rem 3rem 0 0;
}

.foto-funcionario img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ant-upload {
    color: var(--branco);
}


.upload-btn {
    position: absolute;
    bottom: -15px;
    right: 1px;
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
}


  .dados-funcionario {
    margin: 0 0 0 2rem;
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
