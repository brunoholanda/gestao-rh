import React from 'react';
import { Avatar, Card } from 'antd';
import * as S from './Styles';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assumindo que você tem um contexto de autenticação

const { Meta } = Card;

const Home: React.FC = () => {
  const { authData } = useAuth(); // Obtém os dados de autenticação do usuário logado

  return (
    <S.Container>
      <Link to="/funcionarios">
        <S.CardItem>
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
            title="Cadastro de Funcionários"
            description="Aqui você pode adicionar funcionários ou editar dados dos funcionários já cadastrados. Um cadastro bem feito ajuda na gestão."
          />
        </S.CardItem>
      </Link>
      <Link to="/ocorrencias">
        <S.CardItem>
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=9" />}
            title="Registro de Ocorrências"
            description="Nesta sessão você pode registrar ocorrências relativas a funcionários, tais como advertências, faltas, atestados médicos e mais."
          />
        </S.CardItem>
      </Link>
      <S.CardItem onClick={() => console.log('Dados da Empresa')}>
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=10" />}
          title="Dados da Empresa"
          description="Aqui você pode atualizar os dados da sua empresa, endereço, contato, razão social e mais."
        />
      </S.CardItem>
      {authData.userType.includes('1') && (  // Condicional para exibir "Gestão de Usuários" apenas se userType for 1
        <Link to="/usuarios">
          <S.CardItem onClick={() => console.log('Gestão de Usuários')}>
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=11" />}
              title="Gestão de Usuários"
              description="Aqui você pode adicionar usuários ao sistema. Tome cuidado ao fornecer acesso aos dados da sua empresa, editar seus dados e mais."
            />
          </S.CardItem>
        </Link>
      )}

      <Link to="/ferias">
        <S.CardItem onClick={() => console.log('Gestão de Usuários')}>
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=11" />}
            title="Gestão de Ferias"
            description="Aqui você pode adicionar usuários ao sistema. Tome cuidado ao fornecer acesso aos dados da sua empresa, editar seus dados e mais."
          />
        </S.CardItem>
      </Link>
    </S.Container>
  );
};

export default Home;
