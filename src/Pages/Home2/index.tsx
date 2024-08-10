import React from 'react';
import { Avatar, Card } from 'antd';
import * as S from './Styles';

const { Meta } = Card;

const Homes: React.FC = () => (
  <S.Container>
    <S.CardItem onClick={() => console.log('Cadastro de Funcionários')}>
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
        title="Cadastro de Funcionários"
        description="Aqui você pode adicionar funcionários ou editar dados dos funcionários já cadastrados. Um cadastro bem feito ajuda na gestão."
      />
    </S.CardItem>

    <S.CardItem onClick={() => console.log('Registro de Ocorrências')}>
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=9" />}
        title="Registro de Ocorrências"
        description="Nesta sessão você pode registrar ocorrências relativas a funcionários, tais como advertências, faltas, atestados médicos e mais."
      />
    </S.CardItem>

    <S.CardItem onClick={() => console.log('Dados da Empresa')}>
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=10" />}
        title="Dados da Empresa"
        description="Aqui você pode atualizar os dados da sua empresa, endereço, contato, razão social e mais."
      />
    </S.CardItem>

    <S.CardItem onClick={() => console.log('Gestão de Usuários')}>
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=11" />}
        title="Gestão de Usuários"
        description="Aqui você pode adicionar usuários ao sistema. Tome cuidado ao fornecer acesso aos dados da sua empresa, editar seus dados e mais."
      />
    </S.CardItem>
  </S.Container>
);

export default Homes;
