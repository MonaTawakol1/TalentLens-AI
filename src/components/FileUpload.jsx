import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onFileSelect, acceptedTypes = ['.pdf', '.docx'] }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const validateFile = (selectedFile) => {
        // Simple extension check
        const extension = '.' + selectedFile.name.split('.').pop().toLowerCase();
        if (!acceptedTypes.includes(extension)) {
            setError(`Invalid file type. Please upload ${acceptedTypes.join(' or ')}`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                onFileSelect(droppedFile);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                onFileSelect(selectedFile);
            }
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        onFileSelect(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div style={{ width: '100%' }}>
            <motion.div
                layout
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
                    backgroundColor: isDragging ? '#F0FDFA' : 'var(--bg-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem'
                }}
                whileHover={{ borderColor: 'var(--accent)', backgroundColor: '#F8FAFC' }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(',')}
                    style={{ display: 'none' }}
                    onChange={handleInputChange}
                />

                <AnimatePresence mode='wait'>
                    {file ? (
                        <motion.div
                            key="file-success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <FileText size={48} color="var(--primary)" />
                            <div style={{ fontWeight: 600 }}>{file.name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <button
                                onClick={removeFile}
                                style={{
                                    marginTop: '0.5rem',
                                    color: 'var(--danger)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Remove File
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <UploadCloud size={48} color={isDragging ? 'var(--accent)' : 'var(--text-muted)'} />
                            <h3 style={{ fontSize: '1.25rem' }}>Drag & drop your resume here</h3>
                            <p style={{ color: 'var(--text-muted)' }}>or click to browse</p>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                                Supports PDF, DOCX
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#FEF2F2',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <AlertCircle size={16} />
                    {error}
                </motion.div>
            )}
        </div>
    );
};

export default FileUpload;
