import React, { useState, useEffect } from 'react';
import { LearningLesson } from '@shared/types/learning';
import { api } from '../services/api';
import { BookOpen, Award, CheckCircle, HelpCircle, Sparkles, Filter } from 'lucide-react';

export const LearningLibraryPage: React.FC = () => {
  const [lessons, setLessons] = useState<LearningLesson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    const data = await api.getLearningLessons();
    setLessons(data);
    if (data.length > 0) setActiveLesson(data[0]);
  };

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(l => l.category === selectedCategory);

  const handleAnswerQuiz = (index: number) => {
    if (quizAnswered) return;
    setQuizSelected(index);
    setQuizAnswered(true);
    // No quiz in simplified types — just add points on any answer
    setUserScore(prev => prev + 10);
  };

  const handleSelectLesson = (lesson: LearningLesson) => {
    setActiveLesson(lesson);
    setQuizSelected(null);
    setQuizAnswered(false);
  };

  const CATEGORIES = ['all', "Additives & Preservatives", "Macro & Micro Nutrients", "Label Reading & Decoding", "Cardiovascular & Metabolic Health", "Gut Microbiome"];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-emerald"><BookOpen size={14} /> Learning Library</span>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Food Literacy & Nutrition Knowledge Base</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
              Every label scan teaches one nutrition concept. Browse the full library of food science lessons and additive guides.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderColor: 'var(--indigo-400)' }}>
            <Award size={28} color="var(--indigo-400)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Food Literacy Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{userScore} PTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '6px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <Filter size={14} /> Filter:
        </span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: selectedCategory === cat ? '1px solid var(--indigo-400)' : '1px solid var(--border-subtle)',
              background: selectedCategory === cat ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'all' ? 'All Lessons' : cat}
          </button>
        ))}
      </div>

      {/* Main Layout: Archive List + Lesson Reader */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(400px, 2fr)', gap: '24px' }}>
        {/* Left: Lesson Archive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Archive ({filteredLessons.length} lessons)
          </h2>

          {filteredLessons.map(lesson => {
            const isSelected = activeLesson?.id === lesson.id;
            return (
              <div
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--indigo-400)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.68rem', textTransform: 'none' }}>
                    {lesson.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.readTimeMinutes} min</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>{lesson.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{lesson.quickSummary}</div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Lesson Reader */}
        {activeLesson && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-emerald">{activeLesson.category}</span>
              {activeLesson.triggerKey && (
                <span className="badge badge-amber">{activeLesson.triggerKey}</span>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--indigo-400)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Concept:
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{activeLesson.title}</h1>
            <div style={{ fontSize: '1.05rem', color: 'var(--emerald-400)', fontWeight: 600, marginBottom: '20px' }}>
              {activeLesson.conceptHeadline}
            </div>

            <div style={{ fontSize: '0.97rem', color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.75, background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {activeLesson.detailedScience}
            </div>

            {/* Key Takeaway */}
            <div style={{ marginBottom: '30px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ fontWeight: 700, color: 'var(--emerald-400)', marginBottom: '6px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Key Takeaway
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: '#fff' }}>
                <CheckCircle size={18} color="var(--emerald-400)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{activeLesson.keyTakeaway}</span>
              </div>
            </div>

            {/* Mini Quiz Interaction */}
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <HelpCircle color="var(--indigo-400)" size={20} />
                <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Quick Check (+10 PTS)</h3>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Which of these foods is a natural source of the nutrient discussed in this lesson?
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Processed white bread', 'Whole grain oats & legumes', 'Refined vegetable oil', 'Carbonated soft drinks'].map((opt, idx) => {
                  const isCorrect = idx === 1;
                  const isSelected = quizSelected === idx;
                  let bgColor = 'rgba(255, 255, 255, 0.04)';
                  let borderColor = 'var(--border-subtle)';

                  if (quizAnswered) {
                    if (isCorrect) { bgColor = 'rgba(16, 185, 129, 0.2)'; borderColor = 'var(--emerald-400)'; }
                    else if (isSelected) { bgColor = 'rgba(239, 68, 68, 0.2)'; borderColor = 'var(--rose-400)'; }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuiz(idx)}
                      style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: `1px solid ${borderColor}`, background: bgColor, color: '#fff', textAlign: 'left', cursor: quizAnswered ? 'default' : 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease' }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Explanation:</strong> Whole grains, pulses, and leafy vegetables retain their full nutrient profile including fibre, vitamins, and micronutrients lost in processing.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
