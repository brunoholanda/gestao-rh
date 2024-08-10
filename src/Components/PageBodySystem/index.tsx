import { Outlet } from 'react-router-dom';
import * as S from './Styles';
import Sidebar from '../Sidebar';
import { HeaderSystem } from '../HeaderSystem';

export default function PageBodySystem() {
    return (
        <S.Container>
            <Sidebar />
            <S.Content>
                <HeaderSystem />  {/* Adicione o header aqui */}
                <Outlet />
                <FooterDev />
            </S.Content>
        </S.Container>
    );
}

function FooterDev() {
    return (
        <S.FooterDevContainer>
            <S.FooterText>Holanda Desenvolvimento de Software 50.509.731/0001-35</S.FooterText>
            <S.FooterText>Copyright© Holanda Dev Software 2023. Todos os direitos reservados.</S.FooterText>
        </S.FooterDevContainer>
    );
}
