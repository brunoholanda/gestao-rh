import styled from 'styled-components';

export const ErrorSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 8rem 8rem 1rem 8rem;
    font-family: var(--fonte-principal);

    h1 {
        color: var(--cinza-texto);
        font-size: 1.4rem;
    }

    img {
        width: 350px;
    }

    button {
        border: none;
        width: 300px;
        height: 45px;
        border-radius: 8px;
    }

    @media screen and (max-width: 768px) {
        margin: 1em 2em;
        flex-direction: column;

        img {
            width: 150px;
        }

        h1 {
            font-size: 1.25rem;
        }

        button {
            margin-bottom: 1em;
        }
    }
`;
