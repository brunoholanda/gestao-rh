import { useState } from "react";
import { Button, Input, Modal, Form, DatePicker, Divider, Steps, notification, Select, Upload } from "antd";
import axios from "axios";
import api from "../../../Components/api/api";
import InputMask from 'react-input-mask';
import moment from 'moment';
import { useAuth } from "../../../context/AuthContext";
import { Funcionario } from "../../../types";
import CameraCaptureModal from "../../../Components/Modals/CameraCaptureModal";
import { CameraOutlined, UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;



interface CadastroFuncionarioModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (funcionario: Funcionario) => void;
    editingFuncionario: Funcionario | null;
}

export default function CadastroFuncionarioModal({
    open,
    onCancel,
    onSave,
    editingFuncionario,
}: CadastroFuncionarioModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [dataNascimento, setDataNascimento] = useState<string | null>(editingFuncionario ? editingFuncionario.data_nascimento : null);
    const [enderecoCompleto, setEnderecoCompleto] = useState<string>(editingFuncionario?.endereco || '');
    const [nome, setNome] = useState<string | undefined>(editingFuncionario?.nome);
    const [cpf, setCpf] = useState<string | undefined>(editingFuncionario?.cpf);
    const [telefone, setTelefone] = useState<string | undefined>(editingFuncionario?.telefone);
    const [estadoCivil, setEstadoCivil] = useState<string | undefined>(editingFuncionario?.estado_civil);
    const [isCameraModalVisible, setIsCameraModalVisible] = useState<boolean>(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [fotoPath, setFotoPath] = useState<string | null>(editingFuncionario ? editingFuncionario.foto_path : null);

    const { authData } = useAuth();


    const next = async () => {
        try {
            await form.validateFields();
            setCurrentStep(currentStep + 1);
        } catch (error) {
        }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const uploadedPhotoPath = await uploadPhoto();

            const payload = {
                nome,
                data_nascimento: dataNascimento,
                telefone,
                cpf,
                estado_civil: estadoCivil,
                cargo: values.cargo,
                formacao_academica: values.formacao_academica,
                endereco: enderecoCompleto || `${values.endereco.rua}, ${values.endereco.numero}, ${values.endereco.referencia}, ${values.endereco.cidade}, ${values.endereco.estado}, ${values.endereco.cep}`,
                foto_path: uploadedPhotoPath || fotoPath,
                company_id: authData.companyID || '',
            };


            const method = editingFuncionario ? 'patch' : 'post';
            const url = editingFuncionario ? `/funcionarios/${editingFuncionario.id}` : '/funcionarios';

            const response = await api[method](url, payload);
            //@ts-ignore
            onSave({ ...payload, id: editingFuncionario ? editingFuncionario.id : response.data.id });
            form.resetFields();
            setCurrentStep(0);
            notification.success({ message: `Funcionário ${editingFuncionario ? 'atualizado' : 'cadastrado'} com sucesso!` });

        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            notification.error({
                message: 'Erro ao salvar funcionário',
                //@ts-ignore
                description: error.response?.data?.message || 'Não foi possível salvar os dados do funcionário.',
            });
        }
    };

    const handleDateChange = (date: moment.Moment | null) => {
        if (date) {
            setDataNascimento(date.format('YYYY-MM-DD'));
        } else {
            setDataNascimento(null);
        }
    };

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNome(e.target.value);
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleanedCpf = e.target.value.replace(/_/g, ''); 
        setCpf(cleanedCpf);
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleanedTelefone = e.target.value.replace(/_/g, ''); 
        setTelefone(cleanedTelefone);
    };

    const handleEstadoCivilChange = (value: string) => {
        setEstadoCivil(value);
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let cep = e.target.value.replace(/[^0-9]/g, ''); 

        if (cep.length === 8) { 
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { logradouro, localidade, uf } = response.data;
                const endereco = `${logradouro}, ${localidade}, ${uf}, ${cep}`;
                setEnderecoCompleto(endereco);
                form.setFieldsValue({
                    endereco: {
                        rua: logradouro,
                        cidade: localidade,
                        estado: uf,
                        cep: e.target.value,
                        numero: form.getFieldValue(['endereco', 'numero']),
                        referencia: form.getFieldValue(['endereco', 'referencia']),
                    }
                });
            } catch (error) {
                notification.error({ message: 'Erro ao buscar CEP', description: 'CEP não encontrado.' });
            }
        }
    };

    const handleCapturePhoto = (file: File) => {
        setPhotoFile(file);
    };

    const uploadPhoto = async () => {
        if (photoFile) {
            const formData = new FormData();
            formData.append('file', photoFile);
            const response = await api.post('/funcionarios/upload', formData);
            return response.data.filePath;
        }
        return null;
    };

    const handleUploadChange = async (info: { file: { status?: any; response?: any; }; }) => {
        if (info.file.status === 'done') {
            const { response } = info.file;
            setFotoPath(response.filePath);
            notification.success({ message: 'Foto carregada com sucesso!' });
        }
    };

    return (
        <Modal
            title={editingFuncionario ? "Editar Funcionário" : "Cadastrar Funcionário"}
            open={open}
            onCancel={() => {
                onCancel();
                form.resetFields();
                setCurrentStep(0);
            }}
            onOk={currentStep === 3 ? handleSave : next}
            okText={currentStep === 3 ? "Salvar" : "Próximo"}
            cancelText={currentStep === 0 ? "Cancelar" : "Anterior"}
            width={600}
            footer={[
                <Button key="back" onClick={currentStep === 0 ? onCancel : prev}>
                    {currentStep === 0 ? "Cancelar" : "Anterior"}
                </Button>,
                <Button key="submit" type="primary" onClick={currentStep === 3 ? handleSave : next}>
                    {currentStep === 3 ? "Salvar" : "Próximo"}
                </Button>,
            ]}
        >
            <Steps current={currentStep}>
                <Step title="Dados Pessoais" />
                <Step title="Dados de Contato" />
                <Step title="Dados Profissionais" />
            </Steps>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                initialValues={editingFuncionario || {}}
            >
                {currentStep === 0 && (
                    <>
                        <Form.Item
                            name="nome"
                            label="Nome"
                            rules={[{ required: true, message: 'Por favor, insira o nome do funcionário!' }]}
                        >
                            <Input placeholder="Nome do funcionário" onChange={handleNomeChange} />
                        </Form.Item>
                        <Form.Item
                            name="data_nascimento"
                            label="Data de Nascimento"
                            rules={[{ required: true, message: 'Por favor, selecione a data de nascimento!' }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: '100%' }}
                                onChange={handleDateChange}
                            />
                        </Form.Item>
                        <Form.Item
                            name="cpf"
                            label="CPF"
                            rules={[{ required: true, message: 'Por favor, insira o CPF do funcionário!' }]}
                        >

                            <InputMask mask="999.999.999-99" onChange={handleCpfChange}>
                                {/* @ts-ignore */}
                                {(inputProps) => <Input {...inputProps} />}
                            </InputMask>
                        </Form.Item>
                        <Form.Item
                            name="estado_civil"
                            label="Estado Civil"
                            rules={[{ required: true, message: 'Por favor, selecione o estado civil!' }]}
                        >
                            <Select placeholder="Selecione o estado civil" onChange={handleEstadoCivilChange}>
                                <Option value="casado(a)">Casado(a)</Option>
                                <Option value="solteiro(a)">Solteiro(a)</Option>
                                <Option value="viuvo(a)">Viúvo(a)</Option>
                                <Option value="divorciado(a)">Divorciado(a)</Option>
                            </Select>
                        </Form.Item>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <Form.Item
                            name={['endereco', 'cep']}
                            label="CEP"
                            rules={[{ required: true, message: 'Por favor, insira o CEP!' }]}
                        >
                            <InputMask mask="99999-999" onChange={handleCepChange}>
                                {/* @ts-ignore */}
                                {(inputProps) => <Input {...inputProps} />}
                            </InputMask>
                        </Form.Item>
                        <Form.Item
                            name={['endereco', 'numero']}
                            label="Número"
                            rules={[{ required: true, message: 'Por favor, insira o número!' }]}
                        >
                            <Input placeholder="Número" />
                        </Form.Item>
                        <Form.Item
                            name={['endereco', 'referencia']}
                            label="Referência"
                        >
                            <Input placeholder="Referência" />
                        </Form.Item>
                        <Form.Item
                            name={['endereco', 'rua']}
                            label="Rua"
                            rules={[{ required: true, message: 'Por favor, insira o nome da rua!' }]}
                        >
                            <Input placeholder="Nome da Rua" />
                        </Form.Item>
                        <Form.Item
                            name={['endereco', 'cidade']}
                            label="Cidade"
                            rules={[{ required: true, message: 'Por favor, insira a cidade!' }]}
                        >
                            <Input placeholder="Cidade" />
                        </Form.Item>
                        <Form.Item
                            name={['endereco', 'estado']}
                            label="Estado"
                            rules={[{ required: true, message: 'Por favor, insira o estado!' }]}
                        >
                            <Input placeholder="Estado" />
                        </Form.Item>
                        <Form.Item
                            name="telefone"
                            label="Telefone"
                            rules={[{ required: true, message: 'Por favor, insira o telefone!' }]}
                        >
                            <InputMask mask="(99) 99999-9999" onChange={handleTelefoneChange}>
                                {/* @ts-ignore */}
                                {(inputProps) => <Input {...inputProps} />}
                            </InputMask>
                        </Form.Item>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <Form.Item
                            name="cargo"
                            label="Cargo"
                            rules={[{ required: true, message: 'Por favor, insira o cargo!' }]}
                        >
                            <Input placeholder="Cargo" />
                        </Form.Item>
                        <Form.Item
                            name="formacao_academica"
                            label="Formação Acadêmica"
                            rules={[{ required: true, message: 'Por favor, insira a formação acadêmica!' }]}
                        >
                            <Input placeholder="Formação Acadêmica" />
                        </Form.Item>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <Form.Item label="Foto (Opcional)">
                            <Upload
                                name="file"
                                action="/api/v2/funcionarios/upload"
                                listType="picture"
                                onChange={handleUploadChange}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Carregar Foto</Button>
                            </Upload>
                            <Button
                                icon={<CameraOutlined />}
                                onClick={() => setIsCameraModalVisible(true)}
                                style={{ marginTop: 16 }}
                            >
                                Usar Câmera
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form>
            <Divider />
            <CameraCaptureModal
                isOpenCameraModal={isCameraModalVisible}
                onClose={() => setIsCameraModalVisible(false)}
                onCapture={handleCapturePhoto}
            />
        </Modal>
    );
}