import React, { useState, useEffect } from 'react';
import type { Project, ProjectCategory, ProjectImage } from '../../types/database';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
}

const CATEGORIES: ProjectCategory[] = [
  'Graphic Design',
  'Visual Composition',
  'Commercial Creative',
  'Posters & Campaigns',
  'Film & Creative Direction',
];

export const ProjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}) => {
  const isEditing = Boolean(projectToEdit);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Graphic Design');
  const [clientOrOrg, setClientOrOrg] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setCategory(projectToEdit.category);
      setClientOrOrg(projectToEdit.client_or_org || '');
      setYear(projectToEdit.year.toString());
      setDescription(projectToEdit.description);
      setFeatured(projectToEdit.featured);
      setImageUrl(projectToEdit.images[0]?.storage_path || '');
    } else {
      setTitle('');
      setCategory('Graphic Design');
      setClientOrOrg('');
      setYear(new Date().getFullYear().toString());
      setDescription('');
      setFeatured(true);
      setImageUrl('/photos/Work/scrap%20craft/transformer%206.jpg');
    }
    setErrorMsg('');
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a project description.');
      return;
    }

    const newProject: Project = {
      id: projectToEdit?.id || `proj-${Date.now()}`,
      title: title.trim(),
      category,
      client_or_org: clientOrOrg.trim() || undefined,
      year: parseInt(year) || new Date().getFullYear(),
      description: description.trim(),
      featured,
      images: [
        {
          id: `pimg-${Date.now()}`,
          project_id: projectToEdit?.id || `proj-${Date.now()}`,
          storage_path: imageUrl.trim() || '/photos/Work/scrap%20craft/transformer%206.jpg',
          sort_order: 1,
        },
      ],
      created_at: projectToEdit?.created_at || new Date().toISOString(),
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141311]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FBFBF9] border border-[#E8E5DC] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-8">
        
        <div className="px-6 py-4 border-b border-[#E8E5DC] flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#9B4722] font-semibold">
              Creative Portfolio Upload
            </span>
            <h2 className="font-serif-display text-2xl text-[#141311] font-medium">
              {isEditing ? 'Edit Design / Creative Project' : 'Add Creative Project'}
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
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Heritage Typographic Visual Identity"
              className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
                Client / Organization
              </label>
              <input
                type="text"
                value={clientOrOrg}
                onChange={(e) => setClientOrOrg(e.target.value)}
                placeholder="e.g. National Cultural Festival"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
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
            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141311]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#9B4722] focus:ring-[#9B4722]"
                />
                <span className="font-medium">Feature on Homepage Beyond Fine Art</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
              Project Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the typography, composition, art direction, and client objectives..."
              className="w-full px-3 py-2 text-sm bg-white border border-[#D3CEBF] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#9B4722]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#57544E] font-medium mb-1">
              Project Photography / Visual Asset
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste Image URL or upload below"
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
            {imageUrl && (
              <div className="aspect-[16/9] max-h-48 overflow-hidden rounded-sm border border-[#E8E5DC]">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
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
              <span>{isEditing ? 'Update Project' : 'Add Project'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
