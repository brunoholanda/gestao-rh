import styled from 'styled-components';

export const ErrorContainer = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 8rem 8rem 1rem 8rem;
    font-family: var(--fonte-principal);

    @media screen and (max-width: 768px) {
        margin: 1em 2em;
        flex-direction: column;

        img {
            width: 150px;
        }
    }
`;

export const ErrorContent = styled.div`
    h1 {
        color: var(--cinza-texto);
        font-size: 1.88rem;

        @media screen and (max-width: 768px) {
            font-size: 1.25rem;
        }
    }

    button {
        border: none;
        width: 300px;
        height: 45px;
        border-radius: 8px;
        margin-bottom: 1em;

        @media screen and (max-width: 768px) {
            margin-bottom: 1em;
        }
    }
`;