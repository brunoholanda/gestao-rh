import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Modal, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { Funcionario } from '../../types';
import api from '../api/api';

const { Option } = Select;
const { TextArea } = Input;

interface OcorrenciaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  funcionarios: Funcionario[];
}

const OcorrenciaModal: React.FC<OcorrenciaModalProps> = ({ visible, onCancel, onSave, funcionarios }) => {
  const [form] = Form.useForm();
  const [selectedFuncionario, setSelectedFuncionario] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    if (fileList.length > 5) {
      notification.warning({ message: 'Você pode adicionar no máximo 5 arquivos' });
      return;
    }
    setFileList(fileList);
  };

  const handleFinish = async (values: { history_name: string; history_describes: string }) => {
    try {
      if (!selectedFuncionario) {
        notification.error({ message: 'Selecione um funcionário!' });
        return;
      }

      setLoading(true);

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('files', file.originFileObj as File);
      });

      formData.append('funcionario_id', selectedFuncionario.toString());
      formData.append('history_name', values.history_name);
      formData.append('history_describes', values.history_describes);
      formData.append('history_date', new Date().toISOString().split('T')[0]);

      await api.post('/func_history', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      notification.success({ message: 'Ocorrência registrada com sucesso!' });
      form.resetFields();
      setFileList([]);
      setLoading(false);
      onSave(); // Chama a função de callback para atualizar a lista de ocorrências e fechar o modal
    } catch (error) {
      setLoading(false);
      {/*@ts-ignore*/ }
      notification.error({ message: 'Erro ao registrar ocorrência', description: error.message });
    }
  };

  return (
    <Modal
      title="Registrar Nova Ocorrência"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="funcionario_id"
          label="Funcionário"
          rules={[{ required: true, message: 'Por favor, selecione o funcionário!' }]}
        >
          <Select
            placeholder="Selecione o funcionário"
            onChange={(value: number) => setSelectedFuncionario(value)}
          >
            {funcionarios.length > 0 ? (
              funcionarios.map((funcionario) => (
                <Option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </Option>
              ))
            ) : (
              <Option disabled>Nenhum funcionário encontrado</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="history_name"
          label="Título da Ocorrência"
          rules={[{ required: true, message: 'Por favor, insira o título da ocorrência!' }]}
        >
          <Input placeholder="Título da Ocorrência" />
        </Form.Item>

        <Form.Item
          name="history_describes"
          label="Descrição da Ocorrência"
          rules={[{ required: true, message: 'Por favor, insira a descrição da ocorrência!' }]}
        >
          <TextArea rows={4} placeholder="Descrição da Ocorrência" />
        </Form.Item>

        <Form.Item label="Arquivos (Máximo 5)">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            multiple
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Selecionar Arquivos</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Registrar Ocorrência
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OcorrenciaModal;
