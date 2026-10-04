import React, { useState, useEffect } from 'react';
import type { Achievement, AchievementCategory } from '../../types/database';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
  achievementToEdit?: Achievement | null;
}

const CATEGORIES: AchievementCategory[] = [
  'National Awards',
  'State Awards',
  'Government Recognition',
  'District / DM Recognition',
  'Art Competitions',
  'Exhibitions',
  'Other Honours',
];

export const AchievementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  achievementToEdit,
}) => {
  const isEditing = Boolean(achievementToEdit);

  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState<AchievementCategory>('National Awards');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(true);
  const [imagePath, setImagePath] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (achievementToEdit) {
      setTitle(achievementToEdit.title);
      setOrganization(achievementToEdit.organization);
      setYear(achievementToEdit.year.toString());
      setCategory(achievementToEdit.category);
      setLocation(achievementToEdit.location || '');
      setDescription(achievementToEdit.description);
      setFeatured(achievementToEdit.featured);
      setImagePath(achievementToEdit.image_path || '');
    } else {
      setTitle('');
      setOrganization('');
      setYear(new Date().getFullYear().toString());
      setCategory('National Awards');
      setLocation('');
      setDescription('');
      setFeatured(true);
      setImagePath('/photos/awards/certificates%20and%20awards/FB_IMG_1659230957054.jpg');
    }
    setErrorMsg('');
  }, [achievementToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePath(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an award or achievement title.');
      return;
    }
    if (!organization.trim()) {
      setErrorMsg('Please specify conferring institution or body.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please write a brief description of the recognition.');
      return;
    }

    const newAch: Achievement = {
      id: achievementToEdit?.id || `ach-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      category,
      location: location.trim() || undefined,
      description: description.trim(),
      featured,
      image_path: imagePath.trim() || '/photos/awards/certificates%20and%20awards/FB_IMG_1659230957054.jpg',
    };

    onSave(newAch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141311]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FBFBF9] border border-[#E8E5DC] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-8">
        
        <div className="px-6 py-4 border-b border-[#E8E5DC] flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#9B4722] font-semibold">
              Curatorial Accolades
            </span>
            <h2 className="font-serif-display text-2xl text-[#141311] font-medium">
              {isEditing ? 'Edit Recognition / Award' : 'Add Recognition or Award'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8A857D] hover:text-[#141311]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 rounded-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
              Title of Award / Recognition *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. National Lalit Kala Akademi Participation & Merit"
              className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
                Conferring Organization / Authority *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Ministry of Culture, Govt of India"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AchievementCategory)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New Delhi, India"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141311]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#9B4722] focus:ring-[#9B4722]"
                />
                <span className="font-medium">Feature in Top Accolades</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
              Description & Citation *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the jury selection, significance, and nature of the honor..."
              className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
              Certificate / Event Photograph
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                placeholder="Paste Certificate or Event Photo URL"
                className="flex-1 px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none"
              />
              <label className="px-4 py-2 bg-[#141311] text-[#FBFBF9] text-xs uppercase tracking-wider cursor-pointer rounded-sm hover:bg-[#2C2A26] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            {imagePath && (
              <div className="aspect-[16/9] max-h-44 overflow-hidden rounded-sm border border-[#E8E5DC]">
                <img src={imagePath} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E8E5DC] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D3CEBF] text-xs uppercase tracking-wider text-[#57544E] hover:bg-gray-100 rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#141311] hover:bg-[#2C2A26] text-[#FBFBF9] text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Update Award' : 'Save Award'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
