import React, { useState, useEffect } from 'react';
import { Calendar, Modal, notification, Select, Input, DatePicker, Form } from 'antd';
import { useAuth } from '../../context/AuthContext';
import api from '../../Components/api/api';
import ptBR from 'antd/es/calendar/locale/pt_BR';
import dayjs, { Dayjs } from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';  // Importa o plugin isBetween

dayjs.extend(isBetween); 

const { Option } = Select;

const FeriasCalendar: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [additionalDays, setAdditionalDays] = useState<number | null>(null);
  const [secondPeriodStartDate, setSecondPeriodStartDate] = useState<Dayjs | null>(null);
  const [firstPeriodEndDate, setFirstPeriodEndDate] = useState<Dayjs | null>(null);
  const [form] = Form.useForm();
  const { authData } = useAuth();

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

  const onDateSelect = (date: Dayjs) => {
    if (isDateValid(date)) {
      fetchFuncionarios();
      setSelectedDate(date);
      setIsModalVisible(true);
    } else {
      notification.warning({
        message: 'Data Inválida',
        description: 'As férias não podem começar em um dia de descanso semanal remunerado (domingo) ou feriado.',
      });
    }
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

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Férias registradas:', values);
      setIsModalVisible(false);
      notification.success({ message: 'Férias registradas com sucesso!' });
    }).catch((error) => {
      notification.error({ message: 'Erro ao registrar férias', description: error.message });
    });
  };

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
    </div>
  );
};

export default FeriasCalendar;
