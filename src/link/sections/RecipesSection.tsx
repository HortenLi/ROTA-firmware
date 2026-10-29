import { useTranslation } from 'react-i18next'
import { RecipeEditorPanel, RecipeListPanel } from '../AppUI'
import { BUILTIN_RECIPES, fmtClock, totalSec } from '../appData'
import { Stage } from '../Stage'

const DESC_KEY: Record<number, string> = {
  1: 'bw',
  2: 'c41',
  3: 'ecn2',
  4: 'e6',
  5: 'bwr',
}

/**
 * Section 03 — recipes. The five processes are presented twice on purpose:
 * as a real list screen, and as a plain typographic index. No colour-coded
 * icons — the difference between C-41 and ECN-2 is chemistry, not hue.
 */
export default function RecipesSection() {
  const { t } = useTranslation()
  return (
    <section className="lk-sec lk-sec-warm" id="recipes">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.recipes.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.recipes.title')}</h2>
          <p className="lk-lede">{t('link.recipes.body')}</p>
        </div>

        <div className="lk-recipes-grid" data-reveal>
          <div className="lk-recipes-list">
            <div className="lk-plate-frame">
              <Stage width={390}>
                <RecipeListPanel inUseSlot={2} />
              </Stage>
            </div>
            <div className="lk-figcap">
              <span className="lk-figcap-rule" aria-hidden="true" />
              {t('link.recipes.listCaption')}
            </div>
          </div>

          <div className="lk-proc-wrap">
            <div className="lk-proc-head">
              <span>{t('link.recipes.colProcess')}</span>
              <span>{t('link.recipes.colSteps')}</span>
              <span>{t('link.recipes.colTemp')}</span>
              <span>{t('link.recipes.colRpm')}</span>
              <span>{t('link.recipes.colTotal')}</span>
            </div>
            {BUILTIN_RECIPES.map((r) => (
              <div className="lk-proc" key={r.slot}>
                <span className="lk-proc-name">
                  <span className="lk-proc-title">
                    <b>{String(r.slot).padStart(2, '0')}</b>
                    {r.name}
                    <i>{r.process}</i>
                  </span>
                  <span className="lk-proc-desc">{t(`link.recipes.${DESC_KEY[r.slot]}`)}</span>
                </span>
                <span className="lk-proc-num">{r.steps.length}</span>
                <span className="lk-proc-num">{r.temperatureC.toFixed(1)} °C</span>
                <span className="lk-proc-num">{r.rpm} rpm</span>
                <span className="lk-proc-num brass">{fmtClock(totalSec(r))}</span>
              </div>
            ))}
            <p className="lk-aside">{t('link.recipes.aside')}</p>
          </div>
        </div>

        <div className="lk-editor-grid" data-reveal>
          <div className="lk-editor-copy">
            <span className="lk-kicker">{t('link.recipes.editorKicker')}</span>
            <p className="lk-editor-desc">{t('link.recipes.editorBody')}</p>
            <p className="lk-editor-note">{t('link.recipes.editorNote')}</p>
          </div>
          <figure className="lk-editor-figure">
            <div className="lk-plate-frame dark">
              <Stage width={390}>
                <RecipeEditorPanel />
              </Stage>
            </div>
            <figcaption className="lk-figcap">
              <span className="lk-figcap-rule" aria-hidden="true" />
              {t('link.recipes.editorCaption')}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
