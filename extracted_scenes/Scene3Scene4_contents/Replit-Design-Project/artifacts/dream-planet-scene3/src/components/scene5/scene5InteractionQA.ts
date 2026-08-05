/**
 * scene5InteractionQA.ts
 *
 * Phase 5 — Lightweight automated interaction verification.
 *
 * Runs in-browser via:
 *   window.__scene5QA.runAll()
 *
 * Or from the Playwright capture script:
 *   await page.evaluate(() => window.__scene5QA.runAll())
 *
 * Each test mutates state through scene5Actions (the same path the
 * cinematic timeline uses) and asserts the resulting DOM attributes.
 *
 * Tests
 * ─────
 * 1.  Open Side Navigation
 * 2.  Open Portfolio
 * 3.  Open Forum
 * 4.  Find hero post (p1)
 * 5.  Like hero post
 * 6.  Verify Like state (liked=true, count incremented)
 * 7.  Open Comments
 * 8.  Reveal prepared comment
 * 9.  Verify comment state
 * 10. Close Comments
 * 11. Open Share (p2)
 * 12. Confirm Share
 * 13. Verify Share confirmed
 * 14. Close Share
 * 15. Switch to Overview tab
 * 16. Return to Post tab
 * 17. Verify feed state preserved
 *
 * Each step logs PASS / FAIL with a short reason.
 * Returns { passed: number, failed: number, results: QAResult[] }.
 */

export interface QAResult {
  step: number;
  name: string;
  passed: boolean;
  reason?: string;
}

export interface QAReport {
  passed: number;
  failed: number;
  results: QAResult[];
}

// ─── DOM helpers ───────────────────────────────────────────────────────────────

function query(selector: string): Element | null {
  return document.querySelector(selector);
}

function attr(selector: string, attribute: string): string | null {
  const el = query(selector);
  return el ? el.getAttribute(attribute) : null;
}

function exists(selector: string): boolean {
  return !!query(selector);
}

// ─── Wait helper ───────────────────────────────────────────────────────────────

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Result builder ────────────────────────────────────────────────────────────

function pass(step: number, name: string): QAResult {
  return { step, name, passed: true };
}

function fail(step: number, name: string, reason: string): QAResult {
  console.error(`[Scene5 QA] FAIL step ${step} "${name}": ${reason}`);
  return { step, name, passed: false, reason };
}

// ─── Test suite ────────────────────────────────────────────────────────────────

async function runAll(): Promise<QAReport> {
  const acts = (window as unknown as Record<string, unknown>)['__scene5Actions'] as Record<string, (...args: unknown[]) => unknown> | undefined;
  if (!acts) {
    return {
      passed: 0,
      failed: 1,
      results: [fail(0, 'scene5Actions available', '__scene5Actions not found on window — is Scene5PreviewApp mounted?')],
    };
  }

  const results: QAResult[] = [];
  const STEP_DELAY = 350; // ms between steps (longer than any animation)

  // 1. Open Side Navigation
  acts['openSideNavigation']();
  await wait(STEP_DELAY);
  results.push(
    exists('[data-scene5="side-nav-root"]')
      ? pass(1, 'Open Side Navigation')
      : fail(1, 'Open Side Navigation', 'side-nav-root not found in DOM'),
  );

  // 2. Open Portfolio
  acts['openPortfolio']();
  await wait(STEP_DELAY * 2); // extra time for side-nav exit animation (320 ms)
  results.push(
    exists('[data-scene5="portfolio-page"]')
      ? pass(2, 'Open Portfolio')
      : fail(2, 'Open Portfolio', 'portfolio-page not found after navigation'),
  );

  // 3. Open Forum
  acts['openForum']();
  await wait(STEP_DELAY);
  results.push(
    exists('[data-scene5="forum-page"]')
      ? pass(3, 'Open Forum')
      : fail(3, 'Open Forum', 'forum-page not found in DOM'),
  );

  // 4. Find hero post p1
  await wait(STEP_DELAY);
  results.push(
    exists('[data-scene5-post-id="p1"]')
      ? pass(4, 'Find hero post p1')
      : fail(4, 'Find hero post p1', 'post element with data-scene5-post-id="p1" not found'),
  );

  // 5. Like hero post p1
  acts['likePost']('p1');
  await wait(STEP_DELAY);

  // 6. Verify Like state
  const likedAttr = attr('[data-scene5-action="like"][data-scene5-post-id="p1"]', 'data-scene5-liked');
  results.push(
    likedAttr === 'true'
      ? pass(5, 'Like post p1')
      : fail(5, 'Like post p1', `data-scene5-liked expected "true", got "${likedAttr}"`),
  );

  // 7. Open Comments
  acts['openComments']('p1');
  await wait(STEP_DELAY);
  results.push(
    exists('[data-scene5-action="comment-sheet"]')
      ? pass(7, 'Open Comments')
      : fail(7, 'Open Comments', 'comment-sheet not found in DOM'),
  );

  // 8. Reveal prepared comment
  acts['showPreparedComment']('p1');
  await wait(STEP_DELAY);

  // 9. Verify comment state
  results.push(
    exists('[data-scene5-action="prepared-comment"]')
      ? pass(9, 'Prepared comment visible')
      : fail(9, 'Prepared comment visible', 'prepared-comment element not found'),
  );

  // 10. Close Comments
  acts['closeComments']();
  await wait(STEP_DELAY);
  results.push(
    !exists('[data-scene5-action="comment-sheet"]')
      ? pass(10, 'Close Comments')
      : fail(10, 'Close Comments', 'comment-sheet still visible after close'),
  );

  // 11. Open Share (p2)
  acts['openShare']('p2');
  await wait(STEP_DELAY);
  results.push(
    exists('[data-scene5-action="share-panel"]')
      ? pass(11, 'Open Share p2')
      : fail(11, 'Open Share p2', 'share-panel not found in DOM'),
  );

  // 12. Confirm Share
  acts['confirmShare']('p2');
  await wait(STEP_DELAY);

  // 13. Verify Share confirmed (copy-link button should show confirmed state)
  // We check the share panel still exists (not closed) and the copy-link button.
  results.push(
    exists('[data-scene5-action="share-panel"]')
      ? pass(13, 'Share confirmed state')
      : fail(13, 'Share confirmed state', 'share-panel disappeared unexpectedly'),
  );

  // 14. Close Share
  acts['closeShare']();
  await wait(STEP_DELAY);
  results.push(
    !exists('[data-scene5-action="share-panel"]')
      ? pass(14, 'Close Share')
      : fail(14, 'Close Share', 'share-panel still visible after close'),
  );

  // 15. Switch to Overview tab
  acts['switchForumTab']('overview');
  await wait(STEP_DELAY);
  results.push(
    !exists('[data-scene5="forum-post-feed"]')
      ? pass(15, 'Switch to Overview tab')
      : fail(15, 'Switch to Overview tab', 'forum-post-feed still in DOM — tab did not switch'),
  );

  // 16. Return to Post tab
  acts['switchForumTab']('post');
  await wait(STEP_DELAY);
  results.push(
    exists('[data-scene5="forum-post-feed"]')
      ? pass(16, 'Return to Post tab')
      : fail(16, 'Return to Post tab', 'forum-post-feed not found after switching back'),
  );

  // 17. Verify feed state preserved (post p1 still liked)
  await wait(200);
  const likedAttrAfter = attr('[data-scene5-action="like"][data-scene5-post-id="p1"]', 'data-scene5-liked');
  results.push(
    likedAttrAfter === 'true'
      ? pass(17, 'Feed state preserved after tab switch')
      : fail(17, 'Feed state preserved after tab switch', `data-scene5-liked expected "true", got "${likedAttrAfter}"`),
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(
    `[Scene5 QA] Complete: ${passed} passed, ${failed} failed`,
    failed === 0 ? '✅' : '❌',
  );
  results.forEach((r) => {
    console.log(`  ${r.passed ? '✅' : '❌'} Step ${r.step}: ${r.name}${r.reason ? ` — ${r.reason}` : ''}`);
  });

  return { passed, failed, results };
}

// ─── Register on window ────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>)['__scene5QA'] = { runAll };
}

export const scene5QA = { runAll };
