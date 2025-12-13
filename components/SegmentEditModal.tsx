import React, { useState, useEffect } from 'react';
import type { ContentBlock } from '../types';
import { compressImage } from '../utils/image';

interface SegmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (segment: Omit<ContentBlock, 'id'> & { id?: string }) => void;
  segmentToEdit: ContentBlock | null;
}

const SegmentEditModal: React.FC<SegmentEditModalProps> = ({ isOpen, onClose, onSave, segmentToEdit }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [layout, setLayout] = useState<'image-left' | 'image-right'>('image-left');

  useEffect(() => {
    if (segmentToEdit) {
      setTitle(segmentToEdit.title);
      setText(segmentToEdit.text);
      setImageUrl(segmentToEdit.imageUrl);
      setLayout(segmentToEdit.layout);
    } else {
      setTitle('');
      setText('');
      setImageUrl('');
      setLayout('image-left');
    }
  }, [segmentToEdit, isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });
      setImageUrl(newImageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: segmentToEdit?.id, type: 'content', title, text, imageUrl, layout });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{segmentToEdit ? 'Modifier la section' : 'Ajouter une section'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Titre</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Texte</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600" required />
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium">Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
            </div>
            {imageUrl && <img src={imageUrl} alt="Aperçu" className="w-24 h-24 object-cover rounded-md"/>}
          </div>
          <div>
            <label className="block text-sm font-medium">Disposition</label>
            <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="layout" value="image-left" checked={layout === 'image-left'} onChange={() => setLayout('image-left')} className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"/>
                    Image à Gauche
                </label>
                 <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="layout" value="image-right" checked={layout === 'image-right'} onChange={() => setLayout('image-right')} className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"/>
                    Image à Droite
                </label>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SegmentEditModal;