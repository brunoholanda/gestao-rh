import { useNavigate } from 'react-router-dom';
import * as S from './Styles';
import erro403 from '../../assets/img/proibido.png';
import Btn from '../Btn';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <S.ErrorSection>
            <img src={erro403} alt="imagem da pagina de erro" />
            <div>
                <h1>Ops... Você não tem acesso a este recurso... Clique em voltar!</h1>
                <p>Caso acredite que deve ter esse acesso, fale com seu gestor.</p>
                <div onClick={() => navigate('/configs')}>
                    <Btn>VOLTAR</Btn>
                </div>
            </div>
        </S.ErrorSection>
    );
}
