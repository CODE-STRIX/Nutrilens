import React, { useState, useEffect } from 'react';
import { LearningLesson } from '@shared/types';
import { WebApiService } from '../services/api';
import { BookOpen, Sparkles, Clock, CheckCircle2, Search } from 'lucide-react';

export const LearningLibraryView: React.FC = () => {
  const [lessons, setLessons] = useState<LearningLesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await WebApiService.getLessons();
      setLessons(data);
      if (data.length > 0) setSelectedLesson(data[0]);
    };
    fetchLessons();
  }, []);

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.conceptHeadline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Feature 10 — Learning Mode Library
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Food Science <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Learning Library</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Every scan teaches one simple nutrition concept. Explore digestible science modules on additives, sodium, fiber, and gut microbiome health.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30 text-right min-w-[200px]">
            <div className="text-xs text-slate-400 font-medium">Concept Modules</div>
            <div className="text-3xl font-black text-cyan-400">{lessons.length} Lessons</div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">1 Concept Per Scan</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lesson Cards List */}
        <div className="space-y-4 lg:col-span-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts (e.g. Sodium, INS 211, Fiber)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredLessons.map((l) => (
              <div
                key={l.id}
                onClick={() => setSelectedLesson(l)}
                className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedLesson?.id === l.id
                    ? 'border-cyan-500/50 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-cyan-400 rounded">
                  {l.category}
                </span>
                <h3 className="font-heading font-bold text-sm text-white mt-1.5">{l.title}</h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{l.quickSummary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Lesson Deep Dive Display */}
        {selectedLesson && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                  {selectedLesson.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedLesson.readTimeMinutes} min read
                </span>
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-white">{selectedLesson.title}</h2>
              <p className="text-sm font-semibold text-emerald-400 mt-1">{selectedLesson.conceptHeadline}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              <strong className="text-white block mb-1">Quick Summary:</strong>
              {selectedLesson.quickSummary}
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Detailed Science & Mechanism</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {selectedLesson.detailedScience}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-400 font-bold block mb-0.5">Key Shopper Takeaway:</strong>
                {selectedLesson.keyTakeaway}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
