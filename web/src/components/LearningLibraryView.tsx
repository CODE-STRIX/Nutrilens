import React, { useState, useEffect } from 'react';
import { LearningLesson } from '@shared/types';
import { WebApiService } from '../services/api';
import { BookOpen, Sparkles, Clock, CheckCircle2, Search, Award, HelpCircle, FileCode2, Check, Bookmark } from 'lucide-react';

interface INSGlossaryItem {
  code: string;
  name: string;
  category: string;
  hazardRating: 'Safe' | 'Moderate' | 'High Risk';
  plainExplanation: string;
  foundIn: string;
}

const insGlossary: INSGlossaryItem[] = [
  { code: 'INS 211', name: 'Sodium Benzoate', category: 'Preservatives', hazardRating: 'Moderate', plainExplanation: 'Acidic preservative that inhibits mold growth but adds to daily sodium intake.', foundIn: 'Carbonated drinks, pickles, savory sauces' },
  { code: 'INS 621', name: 'Monosodium Glutamate (MSG)', category: 'Flavor Enhancers', hazardRating: 'Moderate', plainExplanation: 'Triggers umami taste receptors on tongue to amplify savory taste profile.', foundIn: 'Instant noodles, chips, seasoning mixes' },
  { code: 'INS 102', name: 'Tartrazine (Yellow #5)', category: 'Artificial Colorants', hazardRating: 'High Risk', plainExplanation: 'Azo dye providing vivid yellow color; requires warning label in EU for hyperactivity.', foundIn: 'Bright yellow snacks, confectionery, sodas' },
  { code: 'INS 322', name: 'Soy Lecithin', category: 'Emulsifiers', hazardRating: 'Safe', plainExplanation: 'Natural fatty substance from soybeans that keeps water and oils smoothly mixed.', foundIn: 'Chocolates, baked goods, margarine' },
  { code: 'INS 415', name: 'Xanthan Gum', category: 'Stabilizers & Thickeners', hazardRating: 'Safe', plainExplanation: 'Fermented carbohydrate that creates smooth, thick texture in liquids.', foundIn: 'Salad dressings, plant milks, gluten-free bread' },
  { code: 'INS 150d', name: 'Caramel IV (Sulfite Ammonia)', category: 'Colorants', hazardRating: 'Moderate', plainExplanation: 'Dark caramel color synthesized with ammonia compounds.', foundIn: 'Cola beverages, dark sauces, gravies' }
];

export const LearningLibraryView: React.FC = () => {
  const [lessons, setLessons] = useState<LearningLesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'LESSONS' | 'GLOSSARY'>('LESSONS');
  const [glossaryQuery, setGlossaryQuery] = useState('');
  
  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState<number>(150);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await WebApiService.getLessons();
      setLessons(data);
      if (data.length > 0) setSelectedLesson(data[0]);
    };
    fetchLessons();
  }, []);

  const categories = ['ALL', 'Macro & Micro Nutrients', 'Additives & Preservatives', 'Cardiovascular & Metabolic Health'];

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.conceptHeadline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || l.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryBadgeClass = (category: string) => {
    if (category.includes('Cardiovascular')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (category.includes('Additives')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  };

  const filteredGlossary = insGlossary.filter(g =>
    g.code.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
    g.name.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
    g.plainExplanation.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

  const sampleQuiz = {
    question: "Why should shoppers monitor INS 211 (Sodium Benzoate) on snack packaging?",
    options: [
      "It completely destroys all digestive vitamins.",
      "It contributes hidden sodium load without tasting overwhelmingly salty.",
      "It turns snacks into artificial sugar crystals.",
      "It is an unregistered heavy metal banned across Asia."
    ],
    correctIdx: 1
  };

  const handleQuizSubmit = (idx: number) => {
    setSelectedAnswer(idx);
    setQuizSubmitted(true);
    if (idx === sampleQuiz.correctIdx && selectedLesson && !completedLessons.includes(selectedLesson.id)) {
      setCompletedLessons([...completedLessons, selectedLesson.id]);
      setUserPoints(userPoints + 50);
    }
  };

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
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Food Science <span className="text-cyan-400 font-black">Learning Library</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Every scan teaches one simple nutrition concept. Explore digestible science modules on additives, sodium, fiber, and gut microbiome health.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30 text-right min-w-[160px]">
              <div className="text-xs text-slate-400 font-medium">Shopper Rank Points</div>
              <div className="text-3xl font-black text-cyan-400 flex items-center justify-end gap-1.5">
                <Award className="w-6 h-6 text-amber-400" />
                {userPoints} pts
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">{completedLessons.length} Modules Passed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('LESSONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'LESSONS' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Science Concept Modules ({lessons.length})
        </button>

        <button
          onClick={() => setActiveTab('GLOSSARY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'GLOSSARY' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          INS Additive Code Glossary
        </button>
      </div>

      {activeTab === 'LESSONS' ? (
        /* Spacious Main Content View */
        <div className="space-y-8">
          
          {/* Top Search & Category Filter Header Bar */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex items-center max-w-md w-full">
                <Search className="w-4 h-4 absolute left-3.5 text-cyan-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search concepts (Sodium, INS 211, Fiber)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field input-with-icon py-2.5 text-xs text-white placeholder-slate-400 font-semibold w-full"
                />
              </div>

              {/* Category Filter Pills Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Modules' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Module Cards Grid (Spacious 2-Column Layout for Large, Readable Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredLessons.map((l) => {
              const isCompleted = completedLessons.includes(l.id);
              const isSelected = selectedLesson?.id === l.id;

              return (
                <div
                  key={l.id}
                  onClick={() => {
                    setSelectedLesson(l);
                    setQuizSubmitted(false);
                    setSelectedAnswer(null);
                  }}
                  className={`glass-panel p-7 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-500/50 scale-[1.01]'
                      : 'border-slate-700/80 hover:border-slate-600 bg-slate-900/90 hover:shadow-xl'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-3.5 py-1 text-xs font-black rounded-full border ${getCategoryBadgeClass(l.category)}`}>
                        {l.category}
                      </span>
                      {isCompleted && (
                        <span className="px-3 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1.5 shrink-0">
                          <Check className="w-4 h-4 text-emerald-400" /> Completed
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-black text-xl text-white leading-snug">{l.title}</h3>
                    <p className="text-slate-200 text-sm font-semibold leading-relaxed">{l.quickSummary}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" /> {l.readTimeMinutes} min read
                    </span>
                    <span className={`text-xs font-black flex items-center gap-1 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {isSelected ? 'Active Module' : 'Explore Science Module →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Lesson Full-Width Reader Display Area */}
          {selectedLesson && (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-cyan-500/40 bg-slate-900/90 shadow-2xl space-y-8 animate-fadeIn">
              
              {/* Module Header Title */}
              <div className="border-b border-slate-800 pb-6 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3.5 py-1 text-xs font-black rounded-full border ${getCategoryBadgeClass(selectedLesson.category)}`}>
                    {selectedLesson.category}
                  </span>
                  <span className="text-xs text-slate-200 font-bold flex items-center gap-1">
                    <Clock className="w-4 h-4 text-cyan-400" /> {selectedLesson.readTimeMinutes} min read
                  </span>
                  {completedLessons.includes(selectedLesson.id) && (
                    <span className="px-3 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-400" /> Lesson Passed (+50 Pts)
                    </span>
                  )}
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">{selectedLesson.title}</h2>
                <p className="text-base font-extrabold text-emerald-400">{selectedLesson.conceptHeadline}</p>
              </div>

              {/* Quick Summary Banner */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-slate-100 font-semibold leading-relaxed space-y-1">
                <strong className="text-cyan-400 font-black block text-xs uppercase tracking-wider mb-1">Quick Executive Summary:</strong>
                {selectedLesson.quickSummary}
              </div>

              {/* Detailed Science & Mechanism Block */}
              <div className="space-y-3">
                <h3 className="font-heading text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Detailed Science &amp; Metabolic Mechanism
                </h3>
                <div className="text-sm text-slate-100 font-medium leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-700 shadow-inner">
                  {selectedLesson.detailedScience}
                </div>
              </div>

              {/* Key Shopper Takeaway Box */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-sm text-slate-100 font-semibold flex items-start gap-4 shadow-lg shadow-emerald-500/5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-emerald-400 font-black block text-xs uppercase tracking-wider">Key Shopper Takeaway:</strong>
                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">{selectedLesson.keyTakeaway}</p>
                </div>
              </div>

              {/* Interactive Quiz / Knowledge Check Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-6 shadow-xl shadow-cyan-500/10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-cyan-400" />
                    <h3 className="font-heading text-lg font-black text-white">Interactive Knowledge Check</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    +50 Shopper Pts Reward
                  </span>
                </div>

                <p className="text-sm font-black text-white leading-relaxed">{sampleQuiz.question}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sampleQuiz.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizSubmit(i)}
                      className={`text-left p-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-start gap-3 ${
                        selectedAnswer === i
                          ? i === sampleQuiz.correctIdx
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-black shadow-lg shadow-emerald-500/20'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500 font-black shadow-lg shadow-rose-500/20'
                          : 'bg-slate-900 text-slate-100 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-black text-cyan-400 shrink-0 text-xs">
                        {i + 1}
                      </span>
                      <span className="mt-0.5 leading-relaxed">{opt}</span>
                    </button>
                  ))}
                </div>

                {quizSubmitted && (
                  <div className={`p-4 rounded-2xl text-xs font-black flex items-center gap-3 ${
                    selectedAnswer === sampleQuiz.correctIdx
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    <Award className="w-5 h-5 shrink-0 text-amber-400" />
                    <span>
                      {selectedAnswer === sampleQuiz.correctIdx
                        ? '🎉 Correct! +50 Points awarded to your Smart Shopper profile.'
                        : '❌ Not quite. Review the detailed science mechanism above and try again!'}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      ) : (
        /* INS Glossary View */
        <div className="space-y-6">
          <div className="relative flex items-center max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search INS Code (e.g. INS 211, INS 621)..."
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              className="input-field input-with-icon text-xs text-white placeholder-slate-400 font-semibold w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((item) => (
              <div key={item.code} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-800 text-cyan-400 border border-slate-700">
                    {item.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.hazardRating === 'Safe' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.hazardRating === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.hazardRating}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-base text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.category}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  {item.plainExplanation}
                </p>

                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Common In:</strong> {item.foundIn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

