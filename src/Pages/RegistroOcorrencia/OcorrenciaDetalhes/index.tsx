import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions, notification } from 'antd';
import api from '../../../Components/api/api';
import { FileOutlined } from '@ant-design/icons';

const OcorrenciaDetalhes: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [ocorrencia, setOcorrencia] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOcorrencia = async () => {
            try {
                const response = await api.get(`/func_history/${id}`);
                setOcorrencia(response.data);
            } catch (error) {
                notification.error({ message: 'Erro ao buscar detalhes da ocorrência', description: 'Ocorreu um erro desconhecido' });
            }
        };

        fetchOcorrencia();
    }, [id]);

    return (
        <div className='content-margin'>
            <h2>Detalhes da Ocorrência <FileOutlined /></h2>
            <Button onClick={() => navigate(-1)} type='primary'>Voltar</Button>
            {ocorrencia && (
                <Descriptions  bordered>

                    <Descriptions.Item label="Funcionário">{ocorrencia.funcionario.nome}</Descriptions.Item>
                    <Descriptions.Item label="Título da Ocorrência">{ocorrencia.history_name}</Descriptions.Item>
                    <Descriptions.Item label="Data">{ocorrencia.history_date}</Descriptions.Item>
                    <Descriptions.Item label="Descrição">{ocorrencia.history_describes}</Descriptions.Item>
                    <Descriptions.Item label="Arquivos">
                        {ocorrencia.history_files.split(',').map((fileId: string) => (
                            <a key={fileId} href={`https://drive.google.com/uc?id=${fileId}&export=download`} target="_blank" rel="noopener noreferrer">
                                Download {fileId}
                            </a>
                        ))}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </div>
    );
};

export default OcorrenciaDetalhes;
