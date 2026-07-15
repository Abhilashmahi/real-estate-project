import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Image as ImageIcon, Trash2, RefreshCw, 
  ArrowLeft, ArrowRight, RotateCw, ZoomIn, ZoomOut, Check, Star, Download
} from 'lucide-react';

interface PremiumUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function PremiumUploader({ images, onChange }: PremiumUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lightbox/Preview State
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  // Close camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Upload handler
  const handleUpload = async (files: FileList) => {
    setErrorMsg(null);
    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg('Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.');
        return;
      }
      if (file.size > maxSize) {
        setErrorMsg('File is too large. Maximum size allowed is 10 MB.');
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Simulate progress
    const tempProgress: Record<string, number> = {};
    validFiles.forEach(file => {
      tempProgress[file.name] = 10;
    });
    setUploadProgress(prev => ({ ...prev, ...tempProgress }));

    // Real Upload
    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      // Step up progress dummy
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = { ...prev };
          Object.keys(tempProgress).forEach(name => {
            if (next[name] < 90) next[name] += 15;
          });
          return next;
        });
      }, 150);

      const res = await fetch('https://real-estate-backend-9qqo.onrender.com/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);

      if (res.ok) {
        const data = await res.json();
        // Clear progress
        setUploadProgress({});
        onChange([...images, ...data.urls]);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Upload failed');
      }
    } catch (e) {
      setErrorMsg('Network error uploading images.');
    }
  };

  // Camera Actions
  const startCamera = async () => {
    setErrorMsg(null);
    setCameraActive(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setErrorMsg('Could not access camera. Make sure permissions are granted.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            // Create a FileList-like object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            handleUpload(dataTransfer.files);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Drag & Drop Sorting
  const onDragStart = (index: number) => {
    setDragIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const onDrop = (index: number) => {
    if (dragIndex === null) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Remove/Replace
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const replaceImage = (index: number) => {
    // Select a file to replace the image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        const formData = new FormData();
        formData.append('files', files[0]);
        try {
          const res = await fetch('https://real-estate-backend-9qqo.onrender.com/api/upload', { method: 'POST', body: formData });
          if (res.ok) {
            const data = await res.json();
            const updated = [...images];
            updated[index] = data.urls[0];
            onChange(updated);
          } else {
            const err = await res.json();
            setErrorMsg(err.error || 'Failed to replace image');
          }
        } catch {
          setErrorMsg('Network error replacing image.');
        }
      }
    };
    input.click();
  };

  // Make cover
  const makeCover = (index: number) => {
    if (index === 0) return; // already cover
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      
      {/* Premium Upload Dropzone */}
      <div 
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #3B82F6',
          borderRadius: '16px',
          background: 'rgba(59, 130, 246, 0.02)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.03)'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'; e.currentTarget.style.borderColor = '#1D4ED8'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.02)'; e.currentTarget.style.borderColor = '#3B82F6'; }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept="image/jpeg,image/png,image/webp,image/jpg" 
          style={{ display: 'none' }}
          onChange={e => e.target.files && handleUpload(e.target.files)}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#EFF6FF', color: '#3B82F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
          }}>
            <ImageIcon size={26} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>Drag & drop property photos</h4>
            <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.78rem' }}>Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB per file)</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              type="button" 
              className="btn" 
              style={{
                height: '42px', padding: '0 1.25rem', background: '#3B82F6', color: '#fff',
                fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              Browse Gallery
            </button>
            <button 
              type="button" 
              onClick={e => { e.stopPropagation(); startCamera(); }}
              className="btn" 
              style={{
                height: '42px', padding: '0 1.25rem', background: '#F8FAFC', color: '#1E293B',
                fontWeight: 700, borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <Camera size={15} /> Take Photo
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16}/>
          {errorMsg}
          <button onClick={() => setErrorMsg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
        </div>
      )}

      {/* Camera Panel */}
      {cameraActive && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#1E293B', borderRadius: '16px', overflow: 'hidden', maxWidth: '500px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Capture Property Photo</h3>
              <button type="button" onClick={stopCamera} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', background: '#000', transform: 'scaleX(-1)' }} />
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button type="button" onClick={capturePhoto} style={{ height: '48px', padding: '0 2rem', background: '#3B82F6', color: '#fff', borderRadius: '999px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18}/> Capture
              </button>
              <button type="button" onClick={stopCamera} style={{ height: '48px', padding: '0 1.5rem', background: '#475569', color: '#fff', borderRadius: '999px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Loader Bars */}
      {Object.keys(uploadProgress).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          {Object.entries(uploadProgress).map(([name, progress]) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{name}</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#3B82F6', borderRadius: '999px', transition: 'width 0.15s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery List (Drag & Drop) */}
      {images.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {images.map((url, idx) => {
            const isCover = idx === 0;
            const isDragging = dragIndex === idx;
            const isDragOver = dragOverIndex === idx;

            return (
              <div
                key={url}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={e => onDragOver(e, idx)}
                onDrop={() => onDrop(idx)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: isDragOver ? '2px dashed #3B82F6' : '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  cursor: 'grab',
                  opacity: isDragging ? 0.4 : 1,
                  transform: isDragOver ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  background: '#F8FAFC'
                }}
              >
                {/* Image element */}
                <img 
                  src={url.startsWith('http') ? url : `https://real-estate-backend-9qqo.onrender.com/${url}`} 
                  alt={`Property Image ${idx + 1}`} 
                  onClick={() => setPreviewIndex(idx)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />

                {/* Cover Tag */}
                {isCover && (
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#10B981', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Check size={10}/> Cover
                  </div>
                )}

                {/* Hover Quick actions overlay */}
                <div className="uploader-overlay" style={{
                  position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '8px', transition: 'opacity 0.2s', opacity: 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {!isCover && (
                      <button type="button" onClick={() => makeCover(idx)} title="Make Cover Image" style={{ background: '#fff', color: '#F59E0B', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                        <Star size={12} fill="#F59E0B" />
                      </button>
                    )}
                    <button type="button" onClick={() => replaceImage(idx)} title="Replace Photo" style={{ background: '#fff', color: '#3B82F6', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 800, marginLeft: 'auto' }}>
                      Replace
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', width: '100%' }}>
                    <a href={url} download title="Download Photo" target="_blank" rel="noreferrer" style={{ background: '#fff', color: '#475569', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                      <Download size={12}/>
                    </a>
                    <button type="button" onClick={() => removeImage(idx)} title="Delete Photo" style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                      <Trash2 size={12}/>
                    </button>
                  </div>
                </div>

                {/* Inject hover rule styling inline to support clean CSS class */}
                <style>{`
                  div:hover > .uploader-overlay { opacity: 1 !important; }
                `}</style>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
          No images uploaded yet. Added images will appear here.
        </div>
      )}

      {/* Lightbox / Previewer Modal */}
      {previewIndex !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.95)', zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          
          {/* Top panel */}
          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', color: '#fff', zIndex: 10 }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Image {previewIndex + 1} of {images.length}</span>
              {previewIndex === 0 && <span style={{ marginLeft: '10px', background: '#10B981', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>Cover Image</span>}
            </div>
            <button onClick={() => { setPreviewIndex(null); setZoom(1); setRotate(0); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.75rem', cursor: 'pointer', padding: '4px' }}>×</button>
          </div>

          {/* Action Tools */}
          <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '15px', background: 'rgba(30,41,59,0.8)', padding: '8px 20px', borderRadius: '999px', zIndex: 10, backdropFilter: 'blur(8px)' }}>
            <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }} title="Zoom Out"><ZoomOut size={18}/></button>
            <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }} title="Zoom In"><ZoomIn size={18}/></button>
            <button onClick={() => setRotate(r => r + 90)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }} title="Rotate"><RotateCw size={18}/></button>
          </div>

          {/* Left Arrow */}
          <button 
            disabled={previewIndex === 0}
            onClick={() => { setPreviewIndex(p => p !== null ? Math.max(p - 1, 0) : null); setZoom(1); setRotate(0); }}
            style={{ position: 'absolute', left: '1.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: previewIndex === 0 ? 0.3 : 1 }}
          >
            <ArrowLeft size={20}/>
          </button>

          {/* Image Display */}
          <div style={{ width: '80%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img 
              src={images[previewIndex].startsWith('http') ? images[previewIndex] : `https://real-estate-backend-9qqo.onrender.com/${images[previewIndex]}`} 
              alt="Full Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${zoom}) rotate(${rotate}deg)`,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

          {/* Right Arrow */}
          <button 
            disabled={previewIndex === images.length - 1}
            onClick={() => { setPreviewIndex(p => p !== null ? Math.min(p + 1, images.length - 1) : null); setZoom(1); setRotate(0); }}
            style={{ position: 'absolute', right: '1.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: previewIndex === images.length - 1 ? 0.3 : 1 }}
          >
            <ArrowRight size={20}/>
          </button>

        </div>
      )}

    </div>
  );
}

// Custom AlertCircle Icon
function AlertCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
