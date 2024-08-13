import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Popconfirm, Tooltip, Form } from 'antd';
import { useAuth } from '../../context/AuthContext';
import api from '../../Components/api/api';
import UserModal from '../../Components/Modals/UserModal';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { authData } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [authData.companyID]);

  const fetchUsers = async () => {
    try {
      const response = await api.get<any[]>('/users', {
        params: { company_id: authData.companyID },
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        notification.error({ message: 'Erro inesperado', description: 'A resposta da API não contém um array de usuários.' });
      }
    } catch (error) {
      const err = error as Error;
      notification.error({ message: 'Erro ao buscar usuários', description: err.message });
    }
  };

  const handleDelete = async (id: number) => {
    const userID = parseInt(authData.userID || '', 10);

    if (id === userID) {
      notification.error({ message: 'Você não pode excluir a si mesmo!' });
      return;
    }
    try {
      await api.delete(`/users/${id}`);
      notification.success({ message: 'Usuário excluído com sucesso!' });
      fetchUsers();
    } catch (error) {
      const err = error as Error;
      notification.error({ message: 'Erro ao excluir usuário', description: err.message });
    }
  };

  const handleSave = async (values: any) => {
    try {
      if (isEditing && editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          ...values,
          company_id: authData.companyID,
        });
        notification.success({ message: 'Usuário alterado com sucesso!' });
      } else {
        await api.post('/users/create', {
          ...values,
          company_id: authData.companyID,
        });
        notification.success({ message: 'Usuário criado com sucesso!' });
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      const err = error as Error;
      notification.error({ message: 'Erro ao salvar usuário', description: err.message });
    }
  };

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue({ ...record, password: '' });
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const openModal = () => {
    form.resetFields();
    setEditingUser(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo de Usuário',
      dataIndex: 'userType',
      key: 'userType',
      render: (userType: string[]) => userType.join(', '),
    },
    {
      title: 'Ação',
      key: 'action',
      render: (text: any, record: any) => {
        const userID = parseInt(authData.userID || '', 10);
        const isCurrentUser = record.id === userID;

        return (
          <>
            <Button onClick={() => handleEdit(record)}>Alterar</Button>
            <Popconfirm
              title="Excluir usuário"
              description="Excluir este usuário removerá todo o seu acesso ao sistema. Tem certeza que deseja continuar?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sim"
              cancelText="Não"
              disabled={isCurrentUser}
            >
              <Tooltip title={isCurrentUser ? 'Você não pode se autoexcluir do sistema 😑 ' : ''}>
                <Button danger style={{ marginLeft: 8 }} disabled={isCurrentUser}>
                  Excluir
                </Button>
              </Tooltip>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div className='content-margin'>
      {authData.userType.includes('1') && (
        <Button type="primary" onClick={openModal} style={{ marginBottom: 16 }}>
          Adicionar Usuário
        </Button>
      )}

      <Table dataSource={users} columns={columns} rowKey="id" />

      <UserModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onFinish={handleSave}  // Passa a função de handleSave
        form={form}
        isEditing={isEditing}
      />
    </div>
  );
};

export default UsersList;
