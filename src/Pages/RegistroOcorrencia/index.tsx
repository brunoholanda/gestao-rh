import React, { useState, useEffect } from 'react';
import { Button, Table, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Funcionario } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../Components/api/api';
import moment from 'moment';
import OcorrenciaModal from '../../Components/Modals/OcorrenciaModal';
import { HistoryOutlined } from '@ant-design/icons';

const RegistroOcorrencia: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { authData } = useAuth();
  const navigate = useNavigate();

  const fetchFuncionarios = async () => {
    try {
      const response = await api.get<{ data: Funcionario[] }>('/funcionarios', {
        params: { company_id: authData.companyID },
      });

      if (Array.isArray(response.data)) {
        setFuncionarios(response.data);
      } else if (Array.isArray(response.data.data)) {
        setFuncionarios(response.data.data);
      } else {
        setFuncionarios([]);
        notification.error({ message: 'Erro inesperado', description: 'A resposta da API não contém um array de funcionários.' });
      }
    } catch (error) {
      setFuncionarios([]);
      {/*@ts-ignore*/ }
      notification.error({ message: 'Erro ao buscar funcionários', description: error.message });
    }
  };

  useEffect(() => {
    fetchOcorrencias();
  }, [authData.companyID]);

  const fetchOcorrencias = async () => {
    try {
      const response = await api.get<any[]>('/func_history', {
        params: { company_id: authData.companyID },
      });

      if (Array.isArray(response.data)) {
        const ocorrenciasMapeadas = response.data.map((ocorrencia) => ({
          id: ocorrencia.id,
          funcionario_nome: ocorrencia.funcionario.nome,
          history_name: ocorrencia.history_name,
          history_date: moment(ocorrencia.history_date).format('DD/MM/YYYY'),
        }));
        setOcorrencias(ocorrenciasMapeadas);
      } else {
        setOcorrencias([]);
        notification.error({ message: 'Erro inesperado', description: 'A resposta da API não contém um array de ocorrências.' });
      }
    } catch (error) {
      setOcorrencias([]);
      {/*@ts-ignore*/ }
      notification.error({ message: 'Erro ao buscar ocorrências', description: error.message });
    }
  };

  const openModal = async () => {
    await fetchFuncionarios();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    setIsModalVisible(false);
    await fetchOcorrencias();
  };

  const handleDetailsClick = (id: number) => {
    navigate(`/ocorrencias/${id}`);
  };

  const columns = [
    {
      title: 'Funcionário',
      dataIndex: 'funcionario_nome',
      key: 'funcionario_nome',
    },
    {
      title: 'Título da Ocorrência',
      dataIndex: 'history_name',
      key: 'history_name',
    },
    {
      title: 'Data',
      dataIndex: 'history_date',
      key: 'history_date',
    },
    {
      title: 'Ações',
      key: 'acoes',
      //@ts-ignore
      render: (_, record) => (
        <Button type="link" onClick={() => handleDetailsClick(record.id)}>
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <div className='content-margin'>
    <h2>Historico de Ocorrencias <HistoryOutlined /></h2>
      <Button type="primary" onClick={openModal}>
        Registrar Nova Ocorrência
      </Button>

      <Table dataSource={ocorrencias} columns={columns} rowKey="id" />

      <OcorrenciaModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
        funcionarios={funcionarios}
      />
    </div>
  );
};

export default RegistroOcorrencia;
