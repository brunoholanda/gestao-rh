import React, { useState, useEffect } from 'react';
import { Calendar, Modal, notification, Select, Input, DatePicker, Form, Table, Button, Popconfirm } from 'antd';
import { useAuth } from '../../context/AuthContext';
import api from '../../Components/api/api';
import ptBR from 'antd/es/calendar/locale/pt_BR';
import dayjs, { Dayjs } from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';  // Importa o plugin isBetween

dayjs.extend(isBetween);

const { Option } = Select;

const FeriasCalendar: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal de edição
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [additionalDays, setAdditionalDays] = useState<number | null>(null);
  const [secondPeriodStartDate, setSecondPeriodStartDate] = useState<Dayjs | null>(null);
  const [firstPeriodEndDate, setFirstPeriodEndDate] = useState<Dayjs | null>(null);
  const [feriasList, setFeriasList] = useState<any[]>([]);
  const [editingFerias, setEditingFerias] = useState<any>(null); // Armazena as informações das férias que estão sendo editadas

  const [form] = Form.useForm();
  const { authData } = useAuth();
  const [editForm] = Form.useForm(); // Formulário de edição

  useEffect(() => {
    if (selectedDays && selectedDate) {
      const endDate = calculateEndDate(selectedDate, selectedDays);
      setFirstPeriodEndDate(dayjs(endDate, 'DD/MM/YYYY'));
      form.setFieldsValue({ dataFim: endDate });
    }
  }, [selectedDays, selectedDate, form]);

  useEffect(() => {
    if (additionalDays && secondPeriodStartDate) {
      const secondPeriodEndDate = calculateEndDate(secondPeriodStartDate, additionalDays);
      form.setFieldsValue({ dataFimSegundoPeriodo: secondPeriodEndDate });
    }
  }, [additionalDays, secondPeriodStartDate, form]);

  const fetchFuncionarios = async () => {
    try {
      const response = await api.get<{ data: any[] }>('/funcionarios', {
        params: { company_id: authData.companyID },
      });

      if (Array.isArray(response.data.data)) {
        setFuncionarios(response.data.data);
      } else {
        setFuncionarios([]);
        notification.error({ message: 'Erro inesperado', description: 'A resposta da API não contém um array de funcionários.' });
      }
    } catch (error) {
      const err = error as Error;
      notification.error({ message: 'Erro ao buscar funcionários', description: err.message });
    }
  };

  const isDateValid = (date: Dayjs) => {
    const dayOfWeek = date.day();
    return dayOfWeek !== 0;
  };

  const handleDaysChange = (value: number) => {
    setSelectedDays(value);
    setAdditionalDays(null);
    setSecondPeriodStartDate(null);
  };

  const handleAdditionalDaysChange = (value: number) => {
    setAdditionalDays(value);
  };

  const calculateEndDate = (startDate: Dayjs | null, days: number): string => {
    if (!startDate) return '';
    return startDate.add(days, 'day').format('DD/MM/YYYY');
  };


  useEffect(() => {
    fetchFuncionarios();
    fetchFeriasList();
  }, []);


  const fetchFeriasList = async () => {
    try {
      const response = await api.get('/ferias', {
        params: { company_id: authData.companyID },
      });
      setFeriasList(response.data);
    } catch (error) {
      notification.error({ message: 'Erro ao buscar férias', description: (error as Error).message });
    }
  };

  const onDateSelect = (date: Dayjs) => {
    if (isDateValid(date)) {
      setSelectedDate(date);
      setIsModalVisible(true);
    } else {
      notification.warning({
        message: 'Data Inválida',
        description: 'As férias não podem começar em um domingo ou feriado.',
      });
    }
  };

  const handleEdit = (record: any) => {
    setEditingFerias(record); // Define as informações das férias que estão sendo editadas
    editForm.setFieldsValue({
      data_inicio_a: dayjs(record.data_inicio_a),
      data_fim_a: dayjs(record.data_fim_a),
      data_inicio_b: record.data_inicio_b ? dayjs(record.data_inicio_b) : null,
      data_fim_b: record.data_fim_b ? dayjs(record.data_fim_b) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditingFerias(null);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      const { data_inicio_a, data_fim_a, data_inicio_b, data_fim_b } = values;

      const feriasData = {
        data_inicio_a: data_inicio_a?.format('YYYY-MM-DD') || null,
        data_fim_a: data_fim_a?.format('YYYY-MM-DD') || null,
        data_inicio_b: data_inicio_b ? data_inicio_b.format('YYYY-MM-DD') : null,
        data_fim_b: data_fim_b ? data_fim_b.format('YYYY-MM-DD') : null,
      };

      await api.put(`/ferias/${editingFerias.id}`, feriasData);
      notification.success({ message: 'Férias reagendadas com sucesso!' });
      setIsEditModalVisible(false);
      fetchFeriasList(); // Atualiza a tabela de férias
    } catch (error) {
      notification.error({ message: 'Erro ao reagendar férias', description: (error as Error).message });
    }
  };


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { funcionario, dias, diasAdicionais } = values;

      // Constrói o objeto de férias a ser enviado ao backend
      const feriasData = {
        funcionario_id: funcionario,
        data_inicio_a: selectedDate?.format('YYYY-MM-DD') || null,
        data_fim_a: firstPeriodEndDate?.format('YYYY-MM-DD') || null,
        data_inicio_b: secondPeriodStartDate?.format('YYYY-MM-DD') || null,
        data_fim_b: secondPeriodStartDate ? calculateEndDate(secondPeriodStartDate, diasAdicionais || 0) : null, // Certifica-se de que está no formato correto
      };

      // Faz a requisição para o backend para registrar as férias
      await api.post('/ferias', feriasData);

      notification.success({ message: 'Férias registradas com sucesso!' });
      setIsModalVisible(false);
      form.resetFields();
      fetchFeriasList();
    } catch (error) {
      notification.error({ message: 'Erro ao registrar férias', description: (error as Error).message });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/ferias/${id}`);
      notification.success({ message: 'Férias excluídas com sucesso!' });
      fetchFeriasList(); // Atualiza a tabela de férias
    } catch (error) {
      notification.error({ message: 'Erro ao excluir férias', description: (error as Error).message });
    }
  };

  const columns = [
    {
      title: 'Funcionário',
      dataIndex: 'funcionario_nome',
      key: 'funcionario_nome',
      render: (_: any, record: any) => record.funcionario.nome,
    },
    {
      title: 'Período 1',
      dataIndex: 'periodo_1',
      key: 'periodo_1',
      render: (_: any, record: any) => (
        `${dayjs(record.data_inicio_a).format('DD/MM/YYYY')} - ${dayjs(record.data_fim_a).format('DD/MM/YYYY')}`
      ),
    },
    {
      title: 'Período 2',
      dataIndex: 'periodo_2',
      key: 'periodo_2',
      render: (_: any, record: any) => (
        record.data_inicio_b && record.data_fim_b
          ? `${dayjs(record.data_inicio_b).format('DD/MM/YYYY')} - ${dayjs(record.data_fim_b).format('DD/MM/YYYY')}`
          : 'N/A'
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: any) => (
        <span>
          <Button onClick={() => handleEdit(record.id)} type="primary" style={{ marginRight: 8 }}>
            Editar
          </Button>
          <Popconfirm
            title="Você tem certeza que deseja excluir estas férias?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" danger>
              Excluir
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const disabledSecondPeriodStartDate = (date: Dayjs): boolean => {
    if (!firstPeriodEndDate) return false;
    return date.isBetween(selectedDate, firstPeriodEndDate, 'day', '[]');
  };

  return (
    <div className="content-margin">
      <Calendar
        fullscreen
        locale={ptBR}
        onSelect={onDateSelect}
      />

      <Modal
        title={`Registrar Férias - ${selectedDate?.format('DD/MM/YYYY')}`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="funcionario"
            label="Funcionário"
            rules={[{ required: true, message: 'Por favor, selecione um funcionário!' }]}
          >
            <Select placeholder="Selecione um funcionário" style={{ width: '100%' }}>
              {funcionarios.map((funcionario) => (
                <Option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedDate && (
            <Form.Item label="Data de Início">
              <Input value={selectedDate.format('DD/MM/YYYY')} disabled />
            </Form.Item>
          )}

          <Form.Item
            name="dias"
            label="Quantidade de dias de férias"
            rules={[{ required: true, message: 'Por favor, selecione o número de dias!' }]}
          >
            <Select placeholder="Selecione o número de dias" onChange={handleDaysChange} style={{ width: '100%' }}>
              <Option value={10}>10 dias</Option>
              <Option value={15}>15 dias</Option>
              <Option value={30}>30 dias</Option>
            </Select>
          </Form.Item>

          {selectedDays !== 30 && (
            <Form.Item
              name="diasAdicionais"
              label={`Selecione os próximos ${30 - (selectedDays || 0)} dias`}
              rules={[{ required: true, message: 'Por favor, selecione os dias adicionais!' }]}
            >
              <Select placeholder={`Selecione os próximos ${30 - (selectedDays || 0)} dias`} onChange={handleAdditionalDaysChange} style={{ width: '100%' }}>
                <Option value={30 - (selectedDays || 0)}>{30 - (selectedDays || 0)} dias</Option>
              </Select>
            </Form.Item>
          )}

          {additionalDays && selectedDays !== 30 && (
            <Form.Item
              name="dataInicioProximoPeriodo"
              label={`Data de início para os próximos ${additionalDays} dias`}
              rules={[{ required: true, message: 'Por favor, selecione a data de início do próximo período!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disabledSecondPeriodStartDate}
                onChange={(date) => setSecondPeriodStartDate(date)}
              />
            </Form.Item>
          )}

          <Form.Item
            name="dataFim"
            label="Data de Término das Férias"
          >
            <Input
              value={calculateEndDate(selectedDate, selectedDays || 0)}
              disabled
            />
          </Form.Item>

          {additionalDays && secondPeriodStartDate && (
            <Form.Item
              name="dataFimSegundoPeriodo"
              label="Data de Término do Segundo Período"
            >
              <Input
                value={calculateEndDate(secondPeriodStartDate, additionalDays)}
                disabled
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        title={`Editar Férias - ${editingFerias?.funcionario?.nome}`}
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Nome do Funcionário">
            <Input value={editingFerias?.funcionario?.nome} disabled />
          </Form.Item>

          <Form.Item
            name="data_inicio_a"
            label="Data de Início (Período 1)"
            rules={[{ required: true, message: 'Por favor, selecione a data de início!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="data_fim_a"
            label="Data de Término (Período 1)"
            rules={[{ required: true, message: 'Por favor, selecione a data de término!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="data_inicio_b"
            label="Data de Início (Período 2)"
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="data_fim_b"
            label="Data de Término (Período 2)"
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={feriasList} columns={columns} rowKey="id" style={{ marginTop: 24 }} />

    </div>
  );
};

export default FeriasCalendar;
function handleEdit(id: any): void {
  throw new Error('Function not implemented.');
}

