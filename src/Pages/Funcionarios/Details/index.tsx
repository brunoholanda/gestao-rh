import React, { useEffect, useState } from 'react';
import { Button, Tabs, Input, notification, Spin, Dropdown, Menu, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { Funcionario } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../Components/api/api';
import ReactInputMask from 'react-input-mask';
import { UploadOutlined } from '@ant-design/icons';
import CameraCaptureModal from '../../../Components/Modals/CameraCaptureModal';
import * as S from './Styles';

const { TabPane } = Tabs;

const FuncionarioDetails: React.FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { authData } = useAuth();
    const companyID = authData.companyID;
    const [editedDetails, setEditedDetails] = useState<Partial<Funcionario>>({});
    const [perfilPictureUrl, setPerfilPictureUrl] = useState<string | null>(null);
    const [perfilPictureFile, setPerfilPictureFile] = useState<File | null>(null);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);


    useEffect(() => {
        const fetchFuncionarioDetails = async () => {
            try {
                const response = await api.get(`/funcionarios/${id}`, {
                    params: { company_id: companyID },
                });
                setFuncionario(response.data);
                setEditedDetails(response.data);

                // Assumindo que 'foto_path' é um caminho relativo como '/uploads/fotos/funcionario.jpg'
                if (response.data.foto_path) {
                    const apiUrl = api.defaults.baseURL; // Obtém a base URL da API
                    const imageUrl = `${apiUrl}${response.data.foto_path}`;
                    setPerfilPictureUrl(imageUrl);
                } else {
                    setPerfilPictureUrl(null);
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do funcionário:', error);
                notification.error({ message: 'Erro ao buscar detalhes do funcionário.' });
            } finally {
                setLoading(false);
            }
        };

        fetchFuncionarioDetails();
    }, [id, companyID]);


    const handleResize = () => setIsMobile(window.innerWidth < 768);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSaveChanges = async () => {
        try {
            let fotoPath = null;

            // Se há uma foto selecionada para upload, faça o upload primeiro
            if (perfilPictureFile) {
                const formData = new FormData();
                formData.append('file', perfilPictureFile);

                // Faz o upload da foto e obtém o caminho do arquivo salvo
                const uploadResponse = await api.post('/funcionarios/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                fotoPath = uploadResponse.data.filePath;  // Assumindo que o backend retorna o caminho completo no campo filePath
            }

            // Cria o payload com os dados do funcionário
            const payload = {
                ...editedDetails,
                cpf: editedDetails.cpf || funcionario?.cpf,
                nome: editedDetails.nome || funcionario?.nome,
                data_nascimento: editedDetails.data_nascimento || funcionario?.data_nascimento,
                telefone: editedDetails.telefone || funcionario?.telefone,
                estado_civil: editedDetails.estado_civil || funcionario?.estado_civil,
                endereco: editedDetails.endereco || funcionario?.endereco,
                foto_path: fotoPath || editedDetails.foto_path || funcionario?.foto_path,
                company_id: funcionario?.company_id,
            };

            // Envia os dados do funcionário como JSON
            const response = await api.patch(`/funcionarios/${id}`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                notification.success({ message: 'Detalhes atualizados com sucesso!' });
                setFuncionario(editedDetails as Funcionario);
            } else {
                throw new Error('Erro ao atualizar detalhes do funcionário');
            }
        } catch (error) {
            console.error('Erro ao atualizar detalhes do funcionário:', error);
            notification.error({ message: 'Erro ao atualizar detalhes do funcionário.' });
        }
    };

    const handleInputChange = (key: keyof Funcionario, value: string) => {
        setEditedDetails(prevDetails => ({
            ...prevDetails,
            [key]: value
        }));
    };

    const handleCapture = (file: File) => {
        resizeImage(file, 300, 300, 0.7, resizedFile => {
            const previewUrl = URL.createObjectURL(resizedFile);
            setPerfilPictureUrl(previewUrl);
            setPerfilPictureFile(resizedFile);
            setIsCameraModalOpen(false);
        });
    };

    const handleFileOrCameraImage = (file: File) => {
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            notification.error({ message: "Por favor, selecione um arquivo PNG, JPG ou JPEG." });
            return;
        }

        resizeImage(file, 300, 300, 0.7, resizedFile => {
            const previewUrl = URL.createObjectURL(resizedFile);
            setPerfilPictureUrl(previewUrl);
            setPerfilPictureFile(resizedFile);
        });
    };

    const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number, callback: (resizedFile: File) => void) => {
        const reader = new FileReader();
        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(blob => {
                        const resizedFile = new File([blob!], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        callback(resizedFile);
                    }, file.type, quality);
                }
            };
            {/*@ts-ignore*/ }
            img.src = event.target.result as string;
        };
        reader.readAsDataURL(file);
    };

    const uploadMenu = (
        <Menu>
            <Menu.Item key="upload">
                <label htmlFor="upload-photo">Escolher arquivo</label>
                <input
                    type="file"
                    id="upload-photo"
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                        const file = e.target.files![0];
                        if (file) {
                            handleFileOrCameraImage(file);
                        }
                    }}
                />
            </Menu.Item>
            <Menu.Item key="capture" onClick={() => setIsCameraModalOpen(true)}>
                Tirar foto
            </Menu.Item>
        </Menu>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='content-margin'>
            <h2>Detalhes do Funcionário</h2>
            <Button onClick={() => navigate(-1)} type='primary'>Voltar</Button>

            {funcionario && (
                <>
                    <Tabs defaultActiveKey="1" type='card'>
                        <TabPane tab={isMobile ? 'Pessoais' : 'Dados Pessoais'} key="1">
                            <S.DadosPessoais>
                                <div className='foto-funcionario'>
                                    {perfilPictureUrl && (
                                        <img src={perfilPictureUrl} alt="Foto do funcionário" style={{ maxWidth: '100%', height: 'auto' }} />
                                    )}
                                    <Tooltip title="Alterar foto do funcionário">
                                        <div className='upload-btn'>
                                            <Dropdown overlay={uploadMenu} trigger={['click']}>
                                                <Button icon={<UploadOutlined />} />
                                            </Dropdown>
                                        </div>
                                    </Tooltip>
                                </div>
                                <div className='dados-funcionario'>
                                    <p><b>Nome:</b> <Input value={editedDetails.nome} onChange={(e) => handleInputChange('nome', e.target.value)} /></p>
                                    <p><b>Data de Nascimento:</b>
                                        <ReactInputMask
                                            mask="99/99/9999"
                                            value={editedDetails.data_nascimento}
                                            onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                                        >
                                            {/*@ts-ignore*/}
                                            {(inputProps) => <Input {...inputProps} />}
                                        </ReactInputMask>
                                    </p>
                                    <p><b>CPF:</b>
                                        <ReactInputMask
                                            mask="999.999.999-99"
                                            value={editedDetails.cpf}
                                            onChange={(e) => handleInputChange('cpf', e.target.value)}
                                        >
                                            {/*@ts-ignore*/}

                                            {(inputProps) => <Input {...inputProps} />}
                                        </ReactInputMask>
                                    </p>
                                    <p><b>Estado Civil:</b> <Input value={editedDetails.estado_civil} onChange={(e) => handleInputChange('estado_civil', e.target.value)} /></p>
                                </div>
                            </S.DadosPessoais>
                        </TabPane>

                        <TabPane tab="Dados Profissionais" key="2">
                            <div className='dadosProfissionaisTab'>
                                <p><b>Formação Acadêmica:</b> <Input value={editedDetails.formacao_academica} onChange={(e) => handleInputChange('formacao_academica', e.target.value)} /></p>
                                <p><b>Cargo:</b> <Input value={editedDetails.cargo} onChange={(e) => handleInputChange('cargo', e.target.value)} /></p>
                            </div>
                        </TabPane>

                        <TabPane tab="Contato" key="3">
                            <div className='contatoTab'>
                                <p><b>Telefone:</b>
                                    <ReactInputMask
                                        mask="(99) 99999-9999"
                                        value={editedDetails.telefone}
                                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                                    >
                                        {/*@ts-ignore*/}

                                        {(inputProps) => <Input {...inputProps} />}
                                    </ReactInputMask>
                                </p>
                                <p><b>Endereço:</b> <Input value={editedDetails.endereco} onChange={(e) => handleInputChange('endereco', e.target.value)} /></p>
                            </div>
                        </TabPane>
                    </Tabs>

                    <Button type='primary' onClick={handleSaveChanges} style={{ marginTop: '20px' }}>Salvar</Button>
                </>
            )}

            <CameraCaptureModal
                isOpenCameraModal={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onCapture={handleCapture}
            />
        </div>
    );
};

export default FuncionarioDetails;
