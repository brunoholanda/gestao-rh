import styled from 'styled-components';

export const StyledFuncionariosPage = styled.div`
    margin: 2rem;

    button {
        margin-bottom: 1rem;
    }
`;

export const StyledModalRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .ant-form-item {
        flex: 1;
        margin-right: 1rem;

        &:last-child {
            margin-right: 0;
        }
    }

    @media screen and (max-width: 768px) {
        flex-direction: column;

        .ant-form-item {
            width: 100%;
            margin-right: 0;
        }
    }
`;

export const StyledModalColumn = styled.div`
    display: flex;
    flex-direction: column;

    .ant-form-item {
        width: 100%;
    }
`;

