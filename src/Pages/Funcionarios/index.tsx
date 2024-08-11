import React, { useEffect, useState } from 'react';
import { Button, Input, Table, notification } from 'antd';
import { EyeOutlined, PlusOutlined, TeamOutlined, WarningFilled, WhatsAppOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';

import { TabelaContainer, StyledButton, ActionButtonWrapper, WhatsAppButton, CustomSearch, TableContainer } from './Styles';
import { useAuth } from '../../context/AuthContext';
import api from '../../Components/api/api';
import debounce from 'lodash.debounce';
import CadastroFuncionarioModal from './Modals';
import { Funcionario } from '../../types';

const { Search } = Input;



const Funcionarios: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nomeConsultorio, setNomeConsultorio] = useState<string>('');
    const [showAddFuncionarioModal, setShowAddFuncionarioModal] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalFuncionarios, setTotalFuncionarios] = useState<number>(0);
    const [cadastrarFuncionarioOpen, setCadastrarFuncionarioOpen] = useState(false);
    const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);

    const { authData } = useAuth();
    const companyID = authData.companyID;
    const navigate = useNavigate();

    const handleOpenAddFuncionarioModal = () => {
        setShowAddFuncionarioModal(true);
    };

    useEffect(() => {
        const fetchNomeConsultorio = async () => {
            if (companyID) {
                try {
                    const response = await api.get(`/companies/${companyID}`);
                    setNomeConsultorio(response.data.nome);
                } catch (error) {
                    console.error('Erro ao buscar nome do consultório:', error);
                    showNotification('error', 'Erro ao buscar nome do consultório.');
                }
            }
        };

        fetchNomeConsultorio();
    }, [companyID]);

    const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        notification[type]({
            message: message,
        });
    };

    const onSearch = debounce(async (value: string) => {
        const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');

        if (!cleanedValue.trim()) return;
        setLoading(true);

        if (!companyID) {
            setLoading(false);
            showNotification('error', 'Erro ao identificar a empresa. Por favor, faça login novamente.');
            return;
        }

        try {
            const response = await api.get('/funcionarios/search', {
                params: {
                    searchTerm: cleanedValue.trim(),
                    company_id: companyID,
                    page: currentPage,
                },
            });

            if (response.data.length > 0) {
                setFuncionarios(response.data.data);
                setTotalFuncionarios(response.data.total);
            } else {
                showNotification('info', 'Nenhum funcionário encontrado com os dados fornecidos.');
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            showNotification('error', 'Erro ao realizar a pesquisa.');
        }
        setLoading(false);
    }, 400);

    const handleViewDetails = (funcionarioId: number) => {
        navigate(`/funcionario-details/${funcionarioId}`, { state: { from: 'Funcionarios' } });
    };

    const getSaudacao = (): string => {
        const hora = new Date().getHours();
        if (hora >= 0 && hora < 12) return "bom dia";
        if (hora >= 12 && hora < 18) return "boa tarde";
        return "boa noite";
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatName = (name: string): string => {
        const nameParts = name.split(' ');
        if (nameParts.length > 3) {
            return `${nameParts[0]} ${nameParts[1]} ${nameParts[2]}`;
        }
        return name;
    };

    const columns: ColumnsType<Funcionario> = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
            render: (text: string) => isMobile ? formatName(text) : text,
        },
    ];

    if (!isMobile) {
        columns.push(
            {
                title: 'CPF',
                dataIndex: 'cpf',
                key: 'cpf',
            },
            {
                title: 'Telefone',
                dataIndex: 'telefone',
                key: 'telefone',
            },
            {
                title: 'Ação',
                key: 'action',
                render: (_, record) => {
                    const primeiroNome = record.nome.split(" ")[0];
                    const saudacao = getSaudacao();
                    const mensagem = `Oi, ${primeiroNome} ${saudacao}, sou do consultório ${nomeConsultorio}, tudo bem?`;

                    return (
                        <ActionButtonWrapper>
                            <Button type='primary' onClick={() => handleViewDetails(record.id)}>Detalhes <EyeOutlined /></Button>
                            <WhatsAppButton
                                key={`whatsapp-${record.id}`}
                                onClick={() => {
                                    const phoneNumber = record.telefone.replace(/[^0-9]/g, "");
                                    window.open(`https://api.whatsapp.com/send?phone=+55${phoneNumber}&text=${encodeURIComponent(mensagem)}`, '_blank');
                                }}
                            >
                                Conversar <WhatsAppOutlined />
                            </WhatsAppButton>
                        </ActionButtonWrapper>
                    );
                },
            }
        );
    } else {
        columns.push({
            title: 'Ação',
            key: 'action',
            render: (_, record) => {
                const primeiroNome = record.nome.split(" ")[0];
                const saudacao = getSaudacao();
                const mensagem = `Oi, ${primeiroNome} ${saudacao}, sou do consultório ${nomeConsultorio}, tudo bem?`;

                return (
                    <ActionButtonWrapper>
                        <Button type='primary' onClick={() => handleViewDetails(record.id)} icon={<EyeOutlined />}>{!isMobile && 'Detalhes'}</Button>
                        <WhatsAppButton
                            key={`whatsapp-${record.id}`}
                            onClick={() => {
                                const phoneNumber = record.telefone.replace(/[^0-9]/g, "");
                                window.open(`https://api.whatsapp.com/send?phone=+55${phoneNumber}&text=${encodeURIComponent(mensagem)}`, '_blank');
                            }}
                            icon={<WhatsAppOutlined />}>{!isMobile && 'Conversar'}
                        </WhatsAppButton>
                    </ActionButtonWrapper>
                );
            },
        });
    }

    useEffect(() => {
        setLoading(true);

        if (!companyID) {
            setLoading(false);
            showNotification('error', 'Erro ao identificar a empresa. Por favor, faça login novamente.');
            return;
        }

        api.get('/funcionarios', {
            params: {
                company_id: companyID,
                page: currentPage,
            },
        })
            .then((response) => {
                const funcionariosData = response.data?.data ?? []; // Verifique se os dados existem
                if (funcionariosData.length > 0) {
                    const sortedFuncionarios = funcionariosData.sort((a: Funcionario, b: Funcionario) => {
                        return a.nome.localeCompare(b.nome);
                    });

                    setFuncionarios(sortedFuncionarios);
                    setTotalFuncionarios(response.data.total);
                } else {
                    showNotification('info', 'Nenhum funcionário encontrado.');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar funcionários:', error);
                showNotification('error', 'Erro ao buscar funcionários.');
                setLoading(false);
            });
    }, [currentPage, companyID]);


    const handleSaveFuncionario = (funcionario: Funcionario) => {
        if (editingFuncionario) {
          setFuncionarios(prev => prev.map(f => f.id === funcionario.id ? funcionario : f));
        } else {
          setFuncionarios(prev => [...prev, funcionario]);
        }
        setCadastrarFuncionarioOpen(false);
        setEditingFuncionario(null);
      };
      

      
  const showCadastrarFuncionarioModal = () => {
    setCadastrarFuncionarioOpen(true);
    setEditingFuncionario(null);
  };

    return (
        <TabelaContainer>
            <div className='tabela'>
                <h1>Funcionários <TeamOutlined /></h1>
                <p>Utilize a lupa para pesquisar por Nome ou CPF <WarningFilled /></p>
                <CustomSearch isMobile={isMobile}>
                    <Search
                        placeholder="Digite o nome ou CPF"
                        onSearch={onSearch}
                    />
                </CustomSearch>
                <StyledButton
                    type='primary'
                    onClick={showCadastrarFuncionarioModal}
                >
                    <PlusOutlined /> Adicionar Funcionário
                </StyledButton>
                <TableContainer>
                    <Table
                        columns={columns}
                        dataSource={funcionarios}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: 10,
                            total: totalFuncionarios,
                            onChange: (page) => {
                                setCurrentPage(page);
                            },
                        }}
                    />
                </TableContainer>
            </div>
            <CadastroFuncionarioModal
                open={cadastrarFuncionarioOpen}
                onCancel={() => setCadastrarFuncionarioOpen(false)}
                onSave={handleSaveFuncionario}
                editingFuncionario={editingFuncionario}
            />
        </TabelaContainer>
    );
};

export default Funcionarios;
