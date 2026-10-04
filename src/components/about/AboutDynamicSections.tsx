import React, { useState, useEffect } from 'react';
import type { Achievement, Project } from '../../types/database';
import { mergeAchievements, mergeProjects } from '../../lib/cmsStorage';

interface Props {
  initialAchievements: Achievement[];
  initialProjects: Project[];
}

function getThumbnailUrl(src?: string): string {
  if (!src) return '';
  const cleaned = src.replace(/%26/g, '&');
  return cleaned.replace(/\.(jpg|jpeg|png)$/i, '.thumb.webp');
}

export const AboutDynamicSections: React.FC<Props> = ({
  initialAchievements,
  initialProjects,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => mergeAchievements(initialAchievements));
  const [projects, setProjects] = useState<Project[]>(() => mergeProjects(initialProjects));

  useEffect(() => {
    const handleUpdate = () => {
      setAchievements(mergeAchievements(initialAchievements));
      setProjects(mergeProjects(initialProjects));
    };
    window.addEventListener('dhirendra_cms_updated', handleUpdate);
    return () => window.removeEventListener('dhirendra_cms_updated', handleUpdate);
  }, [initialAchievements, initialProjects]);

  return (
    <div className="space-y-24">
      
      {/* 1. Recognition & Achievements */}
      <section id="recognition" className="border-b border-[#E8E5DC] pb-16">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.22em] text-[#B68B35] font-semibold block">
            Credentials & Honors
          </span>
          <h2 className="font-serif-display text-4xl text-[#141311] font-medium mt-1">
            Recognition & Achievements
          </h2>
          <p className="text-sm text-[#6B6864] mt-2">
            Verified awards, state honors, institutional fellowships, and government citations.
          </p>
          <div className="pt-2">
            <a
              href="/awards"
              className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-[#9B4722] hover:text-[#7D3516] font-semibold underline underline-offset-4"
            >
              Explore Complete Verified Awards &amp; Press Archive &rarr;
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-white p-6 rounded-sm border border-[#E8E5DC] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 bg-[#FAF5E9] text-[#9B4722] font-medium uppercase tracking-wider text-[10px] rounded-sm">
                    {ach.category}
                  </span>
                  <span className="font-mono text-[#8A857D]">{ach.year}</span>
                </div>
                <h3 className="font-serif-display text-xl text-[#141311] font-medium leading-snug">
                  {ach.title}
                </h3>
                <p className="text-xs text-[#6B6864] font-medium">
                  {ach.organization} {ach.location ? `• ${ach.location}` : ''}
                </p>
                <p className="text-xs text-[#57544E] leading-relaxed pt-1">
                  {ach.description}
                </p>
              </div>

              {ach.image_path && (
                <div className="pt-2">
                  <a
                    href={ach.image_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-[16/9] bg-[#F0ECE3] rounded-sm overflow-hidden border border-[#E8E5DC] group cursor-pointer"
                    title={`View ${ach.title} certificate`}
                  >
                    <img
                      src={getThumbnailUrl(ach.image_path)}
                      alt={`${ach.title} certificate`}
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if (ach.image_path && e.currentTarget.src !== ach.image_path) {
                          e.currentTarget.src = ach.image_path;
                        }
                      }}
                    />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Beyond Fine Art: Creative Design & Commercial Projects */}
      <section id="beyond-fine-art" className="pb-16">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.22em] text-[#9B4722] font-semibold block">
            Secondary Professional Capability
          </span>
          <h2 className="font-serif-display text-4xl text-[#141311] font-medium mt-1">
            Beyond Fine Art — Graphics Design & Visual Direction
          </h2>
          <p className="text-sm text-[#6B6864] mt-2">
            Translating fine art sensibility into large-scale civic works: public awareness street art, monumental scrap metal sculptures, municipal wall murals, and ceremonial commissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => {
            const rawPath = proj.images[0]?.storage_path || '/photos/Work/wall%20art/IMG_20240115_090548.jpg';
            return (
              <div key={proj.id} className="bg-white border border-[#E8E5DC] rounded-sm overflow-hidden flex flex-col">
                <div className="aspect-[16/10] bg-[#E8E5DC] overflow-hidden">
                  <img
                    src={getThumbnailUrl(rawPath)}
                    alt={proj.title}
                    width={600}
                    height={375}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src !== rawPath) {
                        e.currentTarget.src = rawPath;
                      }
                    }}
                  />
                </div>

              <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#9B4722] tracking-wider uppercase text-[11px]">
                      {proj.category}
                    </span>
                    <span className="font-mono text-[#8A857D]">{proj.year}</span>
                  </div>

                  <h3 className="font-serif-display text-2xl text-[#141311] font-medium">
                    {proj.title}
                  </h3>

                  {proj.client_or_org && (
                    <p className="text-xs text-[#8A857D] font-medium uppercase tracking-wider">
                      Client / Org: {proj.client_or_org}
                    </p>
                  )}

                  <p className="text-sm text-[#57544E] leading-relaxed pt-1">
                    {proj.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </section>

    </div>
  );
};
