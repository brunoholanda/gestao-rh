
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;

    @media screen and (max-width: 768px) {
        flex-direction: column;
    }
`;

export const Content = styled.div`
    flex-grow: 500; // Isso garante que o conteúdo ocupe o espaço restante ao lado do sidebar
`;

export const FooterContainer = styled.div`
    display: flex;
    margin: 13rem 0 0 0;
    background-color: #001529;
    padding: 2rem 0;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        margin: 10rem 0 0 0;
        padding: 1rem 0;
    }
`;

export const FooterTopic = styled.div`
    flex: 1;
    margin-right: 20px;
    margin: 0 5rem;
    color: var(--branco);

    h3 {
        color: var(--branco);
    }

    a, span {
        text-decoration: none;
        color: var(--branco);
        margin-bottom: .5rem;

        &:hover {
            color: var(--gold-black);
        }
    }

    span:hover {
        cursor: pointer;
    }
`;

export const FooterDevContainer = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #001529;
    padding: .33rem;
    text-align: center;
`;

export const FooterText = styled.p`
    font-size: 12px;
    color: #607D8B;
    margin: .1rem 0;
`;
