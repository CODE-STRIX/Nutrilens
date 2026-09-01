import React, { useState, useEffect } from 'react';
import { LearningLesson } from '@shared/types';
import { WebApiService } from '../services/api';
import { BookOpen, CheckCircle2, Search, Award } from 'lucide-react';
import additivesData from '../../../data/additive-knowledge-base.json';

type ViewMode = 'modules' | 'glossary';

export const LearningLibraryView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('modules');
  const [lessons, setLessons] = useState<LearningLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [points, setPoints] = useState(0);

  // Glossary state
  const [searchGlossary, setSearchGlossary] = useState('');
  const [concernFilter, setConcernFilter] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      const data = await WebApiService.getLearningLessons();
      setLessons(data);
      if (data.length > 0) setActiveLesson(data[0]);
    };
    load();
  }, []);

  const handleAnswerSubmit = (optionIndex: number) => {
    if (quizSubmitted || !activeLesson) return;
    setSelectedOption(optionIndex);
    setQuizSubmitted(true);
    const correctIdx = (activeLesson as any).quiz?.correctOptionIndex ?? (activeLesson as any).quiz?.correctIndex ?? (activeLesson as any).knowledgeCheck?.correctIndex;
    if (optionIndex === correctIdx) {
      if (!completedSlugs.includes(activeLesson.id)) {
        setCompletedSlugs(prev => [...prev, activeLesson.id]);
        setPoints(p => p + 50);
      }
    }
  };

  const filteredGlossary = (additivesData as any[]).filter(item => {
    const matchesSearch = !searchGlossary ||
      item.name.toLowerCase().includes(searchGlossary.toLowerCase()) ||
      item.ins_code.toLowerCase().includes(searchGlossary.toLowerCase()) ||
      item.class.toLowerCase().includes(searchGlossary.toLowerCase());
    const matchesConcern = concernFilter === 'all' || item.concern_level === concernFilter;
    return matchesSearch && matchesConcern;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Learning mode &amp; INS glossary</h1>
        <p className="page-subtitle">
          Master food label reading, understand industrial processing, and explore 60+ Indian food INS codes.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)', flexWrap: 'wrap' }}>
        <div className="card-sunk" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-4)' }}>
          <BookOpen size={16} style={{ color: 'var(--ink)' }} />
          <span style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)' }}>
            {completedSlugs.length} of {lessons.length} Modules Passed
          </span>
        </div>
        <div className="card-sunk" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-4)' }}>
          <Award size={16} style={{ color: 'var(--ink)' }} />
          <span style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
            {points} Points Earned
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-btn${viewMode === 'modules' ? ' active' : ''}`} onClick={() => setViewMode('modules')}>
          Learning Modules
        </button>
        <button className={`tab-btn${viewMode === 'glossary' ? ' active' : ''}`} onClick={() => setViewMode('glossary')}>
          INS Glossary
        </button>
      </div>

      {/* Modules Mode */}
      {viewMode === 'modules' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--sp-6)' }}>
          {/* Module List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {lessons.map(lesson => {
              const isActive = activeLesson?.id === lesson.id;
              const isDone = completedSlugs.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    setSelectedOption(null);
                    setQuizSubmitted(false);
                  }}
                  className="card"
                  style={{
                    padding: 'var(--sp-3)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: `1px solid ${isActive ? 'var(--ink)' : 'var(--rule)'}`,
                    background: isActive ? 'var(--surface-sunk)' : 'var(--surface)',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginBottom: 2 }}>
                    {(lesson as any).category} &middot; {(lesson as any).estimatedReadTimeMinutes || (lesson as any).readTimeMinutes || 3} min read
                  </div>
                  <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)' }}>
                    {lesson.title}
                  </div>
                  {isDone && (
                    <div style={{ fontSize: 'var(--text-12)', color: 'var(--verdict-ok)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> Passed (+50 pts)
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Module Reader */}
          <div>
            {activeLesson ? (
              <div className="card">
                <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', fontWeight: 600, marginBottom: 'var(--sp-1)' }}>
                  {(activeLesson as any).category} &middot; {(activeLesson as any).estimatedReadTimeMinutes || (activeLesson as any).readTimeMinutes || 3} min read
                </div>
                <h2 style={{ fontSize: 'var(--text-25)', marginBottom: 'var(--sp-4)' }}>{activeLesson.title}</h2>
                <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 'var(--sp-6)' }}>
                  {(activeLesson as any).contentMarkdown || (activeLesson as any).summary}
                </div>

                {/* Knowledge Check */}
                {((activeLesson as any).quiz || (activeLesson as any).knowledgeCheck) && (
                  <div className="card-sunk" style={{ padding: 'var(--sp-6)' }}>
                    <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
                      Knowledge Check
                    </div>
                    <div style={{ fontSize: 'var(--text-16)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
                      {((activeLesson as any).quiz || (activeLesson as any).knowledgeCheck).question}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                      {(((activeLesson as any).quiz || (activeLesson as any).knowledgeCheck).options || []).map((opt: any, idx: number) => {
                        const correctIdx = ((activeLesson as any).quiz || (activeLesson as any).knowledgeCheck).correctOptionIndex ?? ((activeLesson as any).quiz || (activeLesson as any).knowledgeCheck).correctIndex;
                        let bg = 'var(--surface)';
                        let border = 'var(--rule)';
                        if (quizSubmitted) {
                          if (idx === correctIdx) {
                            bg = 'var(--tint-ok)';
                            border = 'var(--verdict-ok)';
                          } else if (selectedOption === idx) {
                            bg = 'var(--tint-avoid)';
                            border = 'var(--verdict-avoid)';
                          }
                        }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSubmit(idx)}
                          className="btn"
                          style={{
                            justifyContent: 'flex-start',
                            background: bg,
                            borderColor: border,
                            color: 'var(--ink)',
                            textAlign: 'left',
                            padding: 'var(--sp-3) var(--sp-4)'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', borderTop: '1px solid var(--rule)', paddingTop: 'var(--sp-3)' }}>
                      <strong>Explanation:</strong> {((activeLesson as any).quiz || (activeLesson as any).knowledgeCheck)?.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
          </div>
        </div>
      )}

      {/* Glossary Mode */}
      {viewMode === 'glossary' && (
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)', flexWrap: 'wrap' }}>
            <div className="input-icon-wrap" style={{ flex: '1 1 240px' }}>
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="input"
                value={searchGlossary}
                onChange={e => setSearchGlossary(e.target.value)}
                placeholder="Search by INS code, additive name, or class..."
                aria-label="Search glossary"
              />
            </div>
            <select className="select" style={{ width: 'auto' }} value={concernFilter} onChange={e => setConcernFilter(e.target.value)}>
              <option value="all">All Concern Levels</option>
              <option value="high">High Concern</option>
              <option value="medium">Medium Concern</option>
              <option value="low">Low Concern</option>
            </select>
          </div>

          {/* Table */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>INS Code</th>
                  <th>Additive Name</th>
                  <th>Class</th>
                  <th>Concern</th>
                  <th>What it is / Why added</th>
                </tr>
              </thead>
              <tbody>
                {filteredGlossary.map((item: any) => (
                  <tr key={item.ins_code}>
                    <td style={{ fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      INS {item.ins_code}
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{item.name}</td>
                    <td>{item.class}</td>
                    <td>
                      <span className={`verdict-badge verdict-${item.concern_level === 'high' ? 'avoid' : item.concern_level === 'medium' ? 'limit' : 'ok'}`}>
                        {item.concern_level}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-12)', color: 'var(--ink-2)', maxWidth: 400 }}>
                      {item.what_it_is} {item.why_added}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
