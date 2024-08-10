import { memo, ReactNode, MouseEvent } from 'react';
import styled from 'styled-components';

interface BtnProps {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}

const StyledButton = styled.button`
    background-color: var(--azul);
    color: var(--branco);
    font-family: var(--fonte-secundaria);
    font-weight: 500;
    border: none;
    width: 100%;
    height: 45px;
    font-size: 16px;
    border-radius: 10px;
    transition: 0.5s ease;

    &:hover {
        transform: scale(1.005);
        cursor: pointer;
        background-color: #02075d;
    }

    @media (max-width: 768px) {
        width: 80%;
    }
`;

const Btn = memo((props: BtnProps) => {
    return (
        <StyledButton onClick={props.onClick}>
            {props.children}
        </StyledButton>
    );
});

export default Btn;
