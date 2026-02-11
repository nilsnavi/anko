import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Upload, Image, X, Loader2, Trash2, Download } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_MEDIA_URL = `${API_BASE_URL}/api/media`;

const MediaManager: React.FC = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Load files on component mount
    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_MEDIA_URL}/files`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(response.data);
        } catch (error) {
            console.error('Error loading files:', error);
            alert('Ошибка при загрузке файлов');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFiles(files);

            // Create preview for first file
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewUrl(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        try {
            setUploading(true);
            const token = localStorage.getItem('accessToken');

            const formData = new FormData();

            if (selectedFiles.length === 1) {
                formData.append('image', selectedFiles[0]);
                await axios.post(`${API_MEDIA_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Append all files for multiple upload
                Array.from(selectedFiles).forEach(file => {
                    formData.append('images', file as Blob);
                });
                await axios.post(`${API_MEDIA_URL}/upload-multiple`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            // Reset form and reload files
            setSelectedFiles(null);
            setPreviewUrl(null);
            loadFiles();
            alert('Файлы успешно загружены!');
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(error.response?.data?.message || 'Ошибка при загрузке файлов');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (filename: string) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот файл?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_MEDIA_URL}/files/${filename}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadFiles();
            alert('Файл успешно удален!');
        } catch (error) {
            console.error('Delete error:', error);
            alert('Ошибка при удалении файла');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" />
                    <p className="text-slate-600">Загрузка файлов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Медиа-файлы</h1>
                <div className="text-sm text-slate-500">
                    Всего файлов: {files.length}
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-brand-600" />
                    Загрузить файлы
                </h2>

                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-brand-400 transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer block"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-slate-400" />
                                <div>
                                    <p className="text-slate-600 font-medium">
                                        Нажмите для выбора файлов или перетащите сюда
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Поддерживаются изображения до 5MB
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>

                    {previewUrl && selectedFiles && (
                        <div className="border rounded-lg p-4 bg-slate-50">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-medium text-slate-900">
                                    Предпросмотр ({selectedFiles.length} файлов)
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedFiles(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="text-slate-400 hover:text-slate-600"
                                    aria-label="Отменить выбор файлов"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Array.from(selectedFiles).map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={previewUrl}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded border"
                                        />
                                        <div className="mt-2 text-xs text-slate-600 truncate">
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Загрузка...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Загрузить
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Files Grid */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-brand-600" />
                    Загруженные файлы
                </h2>

                {files.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Image className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Нет загруженных файлов</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map((file) => (
                            <div key={file.id} className="group relative">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                    <img
                                        src={`${API_BASE_URL}${file.path}`}
                                        alt={file.filename}
                                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                    />
                                </div>

                                <div className="mt-2 text-xs text-slate-600 truncate">
                                    {file.filename}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {formatFileSize(file.size)}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {formatDate(file.uploadDate)}
                                </div>

                                {/* Action buttons */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <a
                                        href={`${API_BASE_URL}${file.path}`}
                                        download={file.filename}
                                        className="bg-white p-1 rounded shadow-sm hover:bg-slate-50"
                                        aria-label={`Скачать ${file.filename}`}
                                    >
                                        <Download size={14} className="text-slate-600" />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="bg-white p-1 rounded shadow-sm hover:bg-red-50"
                                        aria-label={`Удалить ${file.filename}`}
                                    >
                                        <Trash2 size={14} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaManager;