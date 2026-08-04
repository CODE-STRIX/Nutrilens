/**
 * Nutri Lens — Person F Services Integration Test
 * ─────────────────────────────────────────────────────────────────────────
 * Tests all Person F backend services WITHOUT needing the server running.
 * Calls each service directly so you can verify logic before integrating
 * with the full backend.
 *
 * Run:  npm run test:person-f
 */

import { UserService } from '../services/userService';
import { UserStore } from '../models/userStore';
import { PersonalizationEngine } from '../services/personalization/personalizationEngine';
import { AlternativeEngine } from '../services/personalization/alternativeEngine';
import { ComparisonEngine } from '../services/personalization/comparisonEngine';
import { AnalyticsService } from '../services/analyticsService';
import { LearningService } from '../services/learningService';
import sampleProducts from '../../data/indian-food-products.json';
import { Product } from '../../../shared/types/product';

const products = sampleProducts as unknown as Product[];

// ── ANSI helpers for readable output ─────────────────────────────────────
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let passed = 0;
let failed = 0;

const pass = (label: string) => { console.log(`  ${GREEN}✓${RESET} ${label}`); passed++; };
const fail = (label: string, detail?: string) => { console.log(`  ${RED}✗${RESET} ${label}${detail ? ` — ${RED}${detail}${RESET}` : ''}`); failed++; };
const section = (title: string) => console.log(`\n${BOLD}${CYAN}▸ ${title}${RESET}`);

// ── TEST HELPERS ──────────────────────────────────────────────────────────
const assert = (condition: boolean, label: string, detail?: string) => {
  if (condition) pass(label);
  else fail(label, detail);
};

const assertEqual = <T>(a: T, b: T, label: string) => {
  assert(a === b, label, `expected "${b}", got "${a}"`);
};

const assertGte = (a: number, b: number, label: string) => {
  assert(a >= b, label, `expected >= ${b}, got ${a}`);
};

const assertLte = (a: number, b: number, label: string) => {
  assert(a <= b, label, `expected <= ${b}, got ${a}`);
};

// ════════════════════════════════════════════════════════════════════════════
const runTests = async () => {
  console.log(`\n${BOLD}╔═══════════════════════════════════════════════════╗`);
  console.log(`║   Nutri Lens — Person F Services Integration Test ║`);
  console.log(`╚═══════════════════════════════════════════════════╝${RESET}`);
  console.log(`  Team: CODESTRIX | Smart India Hackathon 2026`);

  // ── SECTION 1: Auth & User Service ─────────────────────────────────────
  section('1. Auth & User Profile API');

  // 1a. Login with seeded demo user
  try {
    const loginResult = await UserService.login({
      email: 'rahul.sharma@example.com',
      password: 'Password123!'
    });
    assert(!!loginResult.token, 'Demo user login returns a JWT token');
    assertEqual(loginResult.user.name, 'Rahul Sharma', 'Login returns correct user name');
    assertEqual(loginResult.user.email, 'rahul.sharma@example.com', 'Login returns correct email');
    assert(loginResult.user.healthConditions.includes('Hypertension'), 'User profile has Hypertension condition');
    assert(loginResult.user.allergies.includes('Peanuts'), 'User profile has Peanuts allergy');
    assert(loginResult.user.goals.includes('LowSodium'), 'User profile has LowSodium goal');
  } catch (e: any) {
    fail('Demo user login', e.message);
  }

  // 1b. Wrong password
  try {
    await UserService.login({ email: 'rahul.sharma@example.com', password: 'wrongPass' });
    fail('Wrong password should throw error');
  } catch {
    pass('Wrong password correctly throws authentication error');
  }

  // 1c. New user registration
  try {
    const reg = await UserService.register({
      email: 'test.user@nutrilens.in',
      password: 'TestPass456!',
      name: 'Test User',
      age: 28,
      healthConditions: ['Type2Diabetes'],
      allergies: ['Gluten'],
      goals: ['LowSugar']
    });
    assert(!!reg.token, 'New user registration returns a JWT');
    assert(reg.user.healthConditions.includes('Type2Diabetes'), 'Registration stores health conditions');
    assert(!(reg.user as any).passwordHash, 'Registration does NOT expose passwordHash in response');
  } catch (e: any) {
    fail('New user registration', e.message);
  }

  // 1d. Duplicate email
  try {
    await UserService.register({
      email: 'rahul.sharma@example.com',
      password: 'any',
      name: 'Duplicate'
    });
    fail('Duplicate email should throw error');
  } catch {
    pass('Duplicate email registration correctly rejected');
  }

  // 1e. Profile update
  try {
    const updatedProfile = UserService.updateProfile('usr-demo-rahul', {
      goals: ['LowSodium', 'HeartHealth', 'GutHealth']
    });
    assert(updatedProfile.goals.includes('GutHealth'), 'Profile update persists new goals');
  } catch (e: any) {
    fail('Profile update', e.message);
  }

  // ── SECTION 2: Personalization Engine ──────────────────────────────────
  section('2. Personalization Engine — Condition-aware Rules');

  const maggi = products.find(p => p.id === 'prod-maggi-2min')!;
  const muesli = products.find(p => p.id === 'prod-muesli-whole-grain')!;
  const lays = products.find(p => p.id === 'prod-lays-magic-masala')!;
  const rahul = UserStore.findById('usr-demo-rahul')!;
  const priya = UserStore.findById('usr-demo-priya')!;

  // 2a. High-sodium product flagged for Hypertension user
  const maggiAnalysis = PersonalizationEngine.analyzeProductForUser(maggi, rahul);
  const sodiumFlag = maggiAnalysis.conditionFlags.find(f => f.condition === 'Hypertension');
  assert(!!sodiumFlag, 'Hypertension condition flag raised for Maggi (850mg sodium)');
  assertEqual(sodiumFlag?.severity || '', 'WARNING', 'Hypertension sodium flag is WARNING severity');
  assertLte(maggiAnalysis.personalizedScore, 40, 'Maggi personalized score for Hypertension user is ≤40');
  assert(['POOR', 'CRITICAL_RISK'].includes(maggiAnalysis.safetyTier), `Safety tier is POOR or CRITICAL for Hypertension+Maggi (got ${maggiAnalysis.safetyTier})`);

  // 2b. Healthy product gets high score for same user
  const muesliAnalysis = PersonalizationEngine.analyzeProductForUser(muesli, rahul);
  assertGte(muesliAnalysis.personalizedScore, 70, 'Muesli gets high personalized score for Hypertension user');
  assert(['EXCELLENT', 'GOOD'].includes(muesliAnalysis.safetyTier), `Muesli safety tier is EXCELLENT or GOOD (got ${muesliAnalysis.safetyTier})`);

  // 2c. Celiac user gets CRITICAL warning for wheat product
  const maggiForPriya = PersonalizationEngine.analyzeProductForUser(maggi, priya);
  const celiacFlag = maggiForPriya.conditionFlags.find(f => f.condition === 'Celiac');
  assert(!!celiacFlag, 'Celiac condition flag raised for wheat-containing Maggi');
  assertLte(maggiForPriya.personalizedScore, 20, 'Score drops sharply for Celiac+wheat product');

  // 2d. LowSodium goal alignment check
  assert(
    muesliAnalysis.goalCompliance.some(g => g.goal === 'LowSodium' && g.status === 'ALIGNED'),
    'Muesli correctly shows ALIGNED for LowSodium goal'
  );
  assert(
    maggiAnalysis.goalCompliance.some(g => g.goal === 'LowSodium' && g.status === 'CONFLICT'),
    'Maggi correctly shows CONFLICT for LowSodium goal'
  );

  // 2e. Personalized score is always clamped 0–100
  [maggiAnalysis, muesliAnalysis, maggiForPriya].forEach(a => {
    assert(a.personalizedScore >= 0 && a.personalizedScore <= 100,
      `Score ${a.personalizedScore} is within [0, 100] for ${a.productName}`);
  });

  // ── SECTION 3: Healthy Alternative Engine ──────────────────────────────
  section('3. Healthy Alternative Recommendation Engine');

  const alternative = AlternativeEngine.findAlternative(maggi, rahul);
  assert(!!alternative, 'Alternative found for Maggi (Hypertension user)');
  assert(alternative?.recommendedProduct.id !== maggi.id, 'Alternative is not the same product');
  assertGte(alternative?.personalizedScore || 0, maggiAnalysis.personalizedScore,
    'Alternative has higher personalized score than original');

  const laysAlternative = AlternativeEngine.findAlternative(lays, rahul);
  assert(!!laysAlternative, 'Alternative found for Lay\'s chips');
  const laysAnalysis = PersonalizationEngine.analyzeProductForUser(lays, rahul);
  assert(
    (laysAlternative?.personalizedScore || 0) >= laysAnalysis.personalizedScore,
    `Alternative for Lay's has equal or better personalized score (${laysAlternative?.personalizedScore} vs ${laysAnalysis.personalizedScore})`
  );

  // ── SECTION 4: Product Comparison Engine ───────────────────────────────
  section('4. Smart Shopping Assistant — Product Comparison');

  const comparison = ComparisonEngine.compareProducts(maggi, muesli, rahul);
  assert(comparison.winningProduct !== 'TIE' || comparison.winnerBadge !== '', 'Comparison produces a winner or tie verdict');
  assertEqual(comparison.winningProduct, 'B', 'Muesli (product B) wins against Maggi for Hypertension user');
  assertGte(comparison.productBPersonalizedScore, comparison.productAPersonalizedScore,
    'Product B (Muesli) has higher or equal personalized score');
  assert(comparison.comparisonMetrics.length >= 4, 'Comparison includes at least 4 metrics');

  const sodiumMetric = comparison.comparisonMetrics.find(m => m.metricName === 'Sodium (mg)');
  assert(!!sodiumMetric, 'Comparison includes Sodium metric');
  assertEqual(sodiumMetric?.betterProduct || '', 'B', 'Muesli wins the Sodium metric');

  const fiberMetric = comparison.comparisonMetrics.find(m => m.metricName === 'Dietary Fiber (g)');
  assertEqual(fiberMetric?.betterProduct || '', 'B', 'Muesli wins the Fiber metric');

  // ── SECTION 5: Progress Dashboard & Pattern Intelligence ───────────────
  section('5. Progress Dashboard & Pattern Intelligence');

  const dashboard = AnalyticsService.getDashboard('usr-demo-rahul');
  assert(dashboard.totalScans > 0, `Dashboard shows ${dashboard.totalScans} total scans from seeded history`);
  assert(dashboard.runningAverageScore >= 0 && dashboard.runningAverageScore <= 100,
    `Running average score ${dashboard.runningAverageScore}/100 is in valid range`);
  assert(['SUPER_HEALTHY', 'BALANCED', 'NEEDS_ATTENTION', 'HIGH_RISK_DIET'].includes(dashboard.healthTier),
    `Health tier '${dashboard.healthTier}' is a valid classification`);
  assert(dashboard.recentScans.length <= 5, 'Dashboard returns at most 5 recent scans');
  assert(dashboard.userName === 'Rahul Sharma', 'Dashboard returns correct user name');

  const patterns = AnalyticsService.getPatterns('usr-demo-rahul', 10);
  assert(patterns.analyzedScansCount > 0, `Pattern analysis covers ${patterns.analyzedScansCount} scans`);
  assert(patterns.insights.length > 0, 'Pattern intelligence generates at least 1 insight');

  const highSodiumInsight = patterns.insights.find(i => i.metricKey === 'HIGH_SODIUM');
  assert(!!highSodiumInsight, 'High sodium pattern correctly detected from seeded history');
  assert(highSodiumInsight!.percentage > 0 && highSodiumInsight!.percentage <= 100,
    `High sodium pattern percentage ${highSodiumInsight?.percentage}% is in valid range`);

  // Verify insight severity ordering (HIGH_RISK before HEALTHY_TREND)
  const sevOrder: Record<string, number> = { HIGH_RISK: 0, MODERATE_WARNING: 1, HEALTHY_TREND: 2 };
  const insights = patterns.insights;
  let insightOrderOk = true;
  for (let i = 0; i < insights.length - 1; i++) {
    if (sevOrder[insights[i].severity] > sevOrder[insights[i + 1].severity]) {
      insightOrderOk = false;
      break;
    }
  }
  assert(insightOrderOk, 'Pattern insights are sorted by severity (HIGH_RISK → HEALTHY_TREND)');
  assert(patterns.overallSummary.length > 0, 'Pattern report contains a non-empty overall summary');

  // Empty user — no crash
  try {
    const emptyPatterns = AnalyticsService.getPatterns('usr-nonexistent-999', 10);
    assertEqual(emptyPatterns.analyzedScansCount, 0, 'Empty scan history returns 0 analyzed scans gracefully');
  } catch (e: any) {
    fail('Empty scan history should not throw', e.message);
  }

  // ── SECTION 6: Learning Mode ────────────────────────────────────────────
  section('6. Learning Mode — Content Delivery');

  const allLessons = LearningService.getAllLessons();
  assert(allLessons.length > 0, `Learning library contains ${allLessons.length} lessons`);

  // Triggered lesson — INS 211
  const ins211Lesson = LearningService.getLessonForScan(['INS_211']);
  assertEqual(ins211Lesson.triggerKey || '', 'INS_211', 'INS_211 trigger matches Sodium Benzoate lesson');
  assert(ins211Lesson.quickSummary.length > 0, 'Lesson quick summary is non-empty');
  assert(ins211Lesson.keyTakeaway.length > 0, 'Lesson key takeaway is non-empty');

  // Triggered lesson — HIGH_SODIUM
  const sodiumLesson = LearningService.getLessonForScan(['HIGH_SODIUM']);
  assertEqual(sodiumLesson.triggerKey || '', 'HIGH_SODIUM', 'HIGH_SODIUM trigger matches sodium/hypertension lesson');

  // Fallback for unmatched trigger
  const fallbackLesson = LearningService.getLessonForScan(['UNMATCHED_KEY_XYZ']);
  assert(!!fallbackLesson, 'Fallback lesson returned for unmatched trigger key');
  assert(fallbackLesson.id.length > 0, 'Fallback lesson has valid ID');

  // Lesson by ID
  const byId = LearningService.getLessonById('lesson-dietary-fibre');
  assert(!!byId, 'Lesson retrieved by ID: lesson-dietary-fibre');
  assertEqual(byId?.category || '', 'Macro & Micro Nutrients', 'Lesson category matches');

  // Non-existent ID
  const notFound = LearningService.getLessonById('lesson-does-not-exist');
  assert(notFound === undefined, 'Non-existent lesson ID returns undefined');

  // ── RESULTS ──────────────────────────────────────────────────────────────
  console.log(`\n${BOLD}${'─'.repeat(51)}${RESET}`);
  const totalTests = passed + failed;
  if (failed === 0) {
    console.log(`${GREEN}${BOLD}  ✅  All ${totalTests} tests passed!${RESET}`);
  } else {
    console.log(`${RED}${BOLD}  ❌  ${failed} of ${totalTests} tests FAILED${RESET}`);
    console.log(`${GREEN}  ✓  ${passed} passed${RESET}`);
    process.exit(1);
  }
  console.log(`${'─'.repeat(51)}\n`);
};

runTests().catch(err => {
  console.error(`\n${RED}[FATAL] Test runner crashed:${RESET}`, err);
  process.exit(1);
});
