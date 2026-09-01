import React from 'react';
import { Info, ExternalLink, ShieldCheck, Database } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h1 className="page-title">About NutriLens</h1>
        <p className="page-subtitle">
          Data sources, licences, scoring methodology, and system limitations.
        </p>
      </div>

      {/* Team / Mission */}
      <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-2)' }}>Mission &amp; Context</h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          NutriLens is Team CODESTRIX's Smart India Hackathon submission under the Food Tech / Public Health theme.
          Indian packaged food labels are dense, small, and technical. NutriLens decodes them into plain-language
          safety and nutrition verdicts personalised to individual health profiles in under five seconds.
        </p>
      </div>

      {/* Honest Scope & Data Sources */}
      <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-4)' }}>Data Sources &amp; Licensing</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="card-sunk">
            <div style={{ fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)', marginBottom: 2 }}>
              Open Food Facts
            </div>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
              Product ingredient text, nutrient values, NOVA groups, and barcodes are sourced from the Open Food Facts
              global and Indian databases. Licensed under the <strong>Open Database License (ODbL)</strong>.
            </p>
            <div style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
              <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={11} style={{ display: 'inline', marginRight: 4 }} />
                world.openfoodfacts.org
              </a>
            </div>
          </div>

          <div className="card-sunk">
            <div style={{ fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)', marginBottom: 2 }}>
              Additive Knowledge Base (Seeded)
            </div>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
              60+ INS additive entries with 6-facet explanations (what it is, why added, body impact, caution conditions,
              typical products, and FSSAI status) compiled from FSSAI Food Safety and Standards regulations.
            </p>
          </div>

          <div className="card-sunk">
            <div style={{ fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)', marginBottom: 2 }}>
              FSSAI Recall advisories (Seeded)
            </div>
            <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
              Recall and ban safety centre data is a sample dataset compiled from published FSSAI advisories.
              Live production deployment requires formal regulatory data-sharing integration.
            </p>
          </div>
        </div>
      </div>

      {/* Single Scoring Engine Methodology */}
      <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-4)' }}>Scoring Methodology</h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 'var(--sp-4)' }}>
          NutriLens uses a single deterministic scoring engine (<code style={{ background: 'var(--surface-sunk)', padding: '2px 6px', borderRadius: 4 }}>scoring.ts</code>)
          across all screens:
        </p>

        <ul style={{ listStyle: 'disc', paddingLeft: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
          <li><strong>Base Score (100 pts start):</strong> Deducts for excess sodium (&gt;120 mg), added sugars (&gt;5 g), saturated fat (&gt;1.5 g), and energy (&gt;200 kcal).</li>
          <li><strong>Bonuses:</strong> Adds points for dietary fibre (&gt;3 g), protein (&gt;5 g), and zero additives.</li>
          <li><strong>Processing &amp; Additives:</strong> NOVA group 4 deducts 12 pts. Additives deduct by concern level (high: −6, medium: −3, low: −1, capped at −24).</li>
          <li><strong>Personalisation Caps:</strong> Allergen match forces score 0 (Avoid). Conditions enforce deterministic score caps (e.g. Hypertension caps at 25 if sodium &gt; 500 mg).</li>
        </ul>
      </div>

      {/* Limitations */}
      <div className="card card-sunk">
        <h2 style={{ fontSize: 'var(--text-16)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>Known Limitations</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
          <li style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Info size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
            NutriLens provides general nutrition guidance based on published label data and saved profiles. It is not medical advice.
          </li>
          <li style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Info size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
            Crowdsourced data from Open Food Facts may have missing or unverified fields, indicated in the interface as partial confidence.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
