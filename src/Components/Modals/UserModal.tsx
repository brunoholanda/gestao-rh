import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;  // Passa o onFinish diretamente
  form: any;
  isEditing: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onCancel, onFinish, form, isEditing }) => {
  return (
    <Modal
      title={isEditing ? 'Alterar Usuário' : 'Adicionar Usuário'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}  // A submissão é feita aqui
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username (Email)"
          rules={[{ required: true, message: 'Por favor, insira o username!' }, { type: 'email', message: 'Por favor, insira um email válido!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        {!isEditing && (
          <>
            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: true, message: 'Por favor, insira a senha!' }]}
            >
              <Input.Password placeholder="Senha" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirmar Senha"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Por favor, confirme a senha!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('As senhas não correspondem!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirmar Senha" />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
        >
          <Input placeholder="Nome" />
        </Form.Item>

        <Form.Item
          name="userType"
          label="Tipo de Usuário"
          rules={[{ required: true, message: 'Por favor, selecione o tipo de usuário!' }]}
        >
          <Select placeholder="Selecione o tipo de usuário">
            <Option value="1">Administrador</Option>
            <Option value="2">Usuário Comum</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
