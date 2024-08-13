import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Divider } from 'antd';
import { CameraOutlined, SaveOutlined, RedoOutlined } from '@ant-design/icons';

interface CameraCaptureModalProps {
    isOpenCameraModal: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpenCameraModal, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            if (isOpenCameraModal && videoRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                } catch (error) {
                    console.error("Error accessing the camera", error);
                }
            }
        };

        const stopCamera = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };

        startCamera();

        return stopCamera;
    }, [isOpenCameraModal]);

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const imageUrl = URL.createObjectURL(blob);
                        setCapturedImage(imageUrl);
                        setCapturedBlob(blob); // Armazena o blob capturado
                        (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(track => track.stop());
                        {/*@ts-ignore*/ }
                        videoRef.current.srcObject = null;
                    }
                });
            }
        }
    };

    const saveCapturedImage = () => {
        if (capturedBlob) {
            const file = new File([capturedBlob], "captured-image.jpg", { type: "image/jpeg" });
            onCapture(file);
            onClose();
        }
    };

    const retakeImage = () => {
        setCapturedImage(null);
        setCapturedBlob(null);
        if (videoRef.current) {
            const startCamera = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    {/*@ts-ignore*/ }
                    videoRef.current.srcObject = stream;
                } catch (error) {
                    console.error("Error accessing the camera", error);
                }
            };
            startCamera();
        }
    };

    return (
        <Modal
            title="Captura de foto 📸"
            open={isOpenCameraModal}
            onCancel={() => {
                onClose();
                if (videoRef.current && videoRef.current.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                    videoRef.current.srcObject = null;
                }
            }}
            footer={null}
        >
            <Divider />
            {capturedImage ? (
                <>
                    <img src={capturedImage} alt="Capturada" style={{ width: '100%' }} />
                    <Divider />
                    <Button type="primary" icon={<SaveOutlined />} onClick={saveCapturedImage} style={{ marginTop: '10px', width: '100%' }}>
                        Salvar Foto
                    </Button>
                    <Button icon={<RedoOutlined />} onClick={retakeImage} style={{ marginTop: '10px', width: '100%' }}>
                        Capturar Novamente
                    </Button>
                </>
            ) : (
                <>
                    <video ref={videoRef} autoPlay style={{ width: '100%', transform: 'scaleX(-1)' }}></video>
                    <Divider />
                    <Button type="primary" onClick={captureImage} style={{ marginTop: '10px', width: '100%' }}>
                        <CameraOutlined /> Tirar Foto
                    </Button>
                </>
            )}
        </Modal>
    );
};

export default CameraCaptureModal;
