import { Button, Table, Space, Popconfirm, notification } from "antd";
import { useEffect, useState } from "react";
import * as S from './Styles';
import api from "../../Components/api/api";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import CadastroFuncionarioModal from "./Modals";
import { Funcionario } from "../../types";

export default function Home() {

  const [cadastrarFuncionarioOpen, setCadastrarFuncionarioOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const { data } = await api.get<Funcionario[]>('/funcionarios');
      setFuncionarios(data);
    } catch (error) {
      notification.error({
        message: 'Erro ao buscar funcionários',
        description: 'Não foi possível carregar os dados dos funcionários.',
      });
    }
  };

  const handleSaveFuncionario = (funcionario: Funcionario) => {
    if (editingFuncionario) {
      setFuncionarios(prev => prev.map(f => f.id === funcionario.id ? funcionario : f));
    } else {
      setFuncionarios(prev => [...prev, funcionario]);
    }
    setCadastrarFuncionarioOpen(false);
    setEditingFuncionario(null);
  };

  const onEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setCadastrarFuncionarioOpen(true);
  };
  

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/funcionarios/${id}`);
      setFuncionarios(prev => prev.filter(f => f.id !== id));
      notification.success({ message: 'Funcionário deletado com sucesso!' });
    } catch (error) {
      notification.error({ message: 'Erro ao deletar funcionário' });
    }
  };

  const showCadastrarFuncionarioModal = () => {
    setCadastrarFuncionarioOpen(true);
    setEditingFuncionario(null);
  };

  const columns = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Data de Nascimento', dataIndex: 'data_nascimento', key: 'data_nascimento', render: (date: string) => moment(date).format('DD/MM/YYYY') },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
    { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
    { title: 'Estado Civil', dataIndex: 'estado_civil', key: 'estado_civil' },
    { title: 'Cargo', dataIndex: 'cargo', key: 'cargo' },
    { title: 'Formação Acadêmica', dataIndex: 'formacao_academica', key: 'formacao_academica' },
    { title: 'Endereço', dataIndex: 'endereco', key: 'endereco' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Funcionario) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)}>Editar</Button>
          <Popconfirm title="Tem certeza que deseja deletar?" onConfirm={() => onDelete(record.id)}>
            <Button type="primary" icon={<DeleteOutlined />} danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <S.StyledFuncionariosPage>
        <h2>Cadastro de Funcionários</h2>
        <Button type="primary" onClick={showCadastrarFuncionarioModal}>
          <PlusOutlined /> Novo Funcionário
        </Button>

        <Table
          columns={columns}
          dataSource={funcionarios}
          rowKey="id"
        />
      </S.StyledFuncionariosPage>
      <CadastroFuncionarioModal
        open={cadastrarFuncionarioOpen}
        onCancel={() => setCadastrarFuncionarioOpen(false)}
        onSave={handleSaveFuncionario}
        editingFuncionario={editingFuncionario}
      />
    </div>
  );
}
