import * as S from './Styles';
import erro404 from './404.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export default function NotFound() {
    const navigate = useNavigate ();

    return (
        <S.ErrorContainer>
            <img src={erro404} alt="imagem da página de erro" />
            <S.ErrorContent>
                <h1>Ops... Página não encontrada... Clique em voltar!</h1>
                <p>Provavelmente a página que você tentou acessar ainda está em produção, logo mais muitas mais funcionalidades ficarão disponíveis...</p>
                <div onClick={() => navigate(-1)}>
                    <Button>VOLTAR</Button>
                </div>
            </S.ErrorContent>
        </S.ErrorContainer>
    )
}