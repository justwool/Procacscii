import type { Dispatch, SetStateAction } from 'react';
import type { Params } from '../core/params';

interface Props {
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
  onRegenerate: () => void;
  onExportPNG: () => void;
  onCopyASCII: () => void;
  onDownloadTXT: () => void;
  onSaveParams: () => void;
  onLoadParams: (text: string) => void;
}

interface NumberControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function NumberControl({ label, value, min, max, step, onChange }: NumberControlProps) {
  const updateValue = (nextValue: number) => {
    if (Number.isNaN(nextValue)) return;
    const clamped = Math.min(max, Math.max(min, nextValue));
    onChange(clamped);
  };

  return (
    <label>
      {label}
      <span className="numberControl">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => updateValue(Number(e.target.value))} />
        <input type="number" min={min} max={max} step={step} value={value} onChange={(e) => updateValue(Number(e.target.value))} />
      </span>
    </label>
  );
}

export function Controls({ params, setParams, onRegenerate, onExportPNG, onCopyASCII, onDownloadTXT, onSaveParams, onLoadParams }: Props) {
  return (
    <div className="controls">
      <h2>Procacscii</h2>
      <label>Seed <input type="number" value={params.seed} onChange={(e) => setParams((p) => ({ ...p, seed: Number(e.target.value) }))} /></label>
      <button onClick={onRegenerate}>Randomize / Regenerate</button>
      <label>Overlay
        <select value={params.renderMode} onChange={(e) => setParams((p) => ({ ...p, renderMode: e.target.value as Params['renderMode'] }))}>
          <option value="Off">Off</option><option value="ASCII Overlay">ASCII Overlay</option>
        </select>
      </label>
      <label>Hue mode
        <select value={params.hueMode} onChange={(e) => setParams((p) => ({ ...p, hueMode: e.target.value as Params['hueMode'] }))}>
          <option value="analogous">analogous</option><option value="complement">complement</option><option value="triad">triad</option><option value="random-walk">random-walk</option>
        </select>
      </label>
      <NumberControl
        label="Contrast"
        min={0}
        max={1}
        step={0.01}
        value={params.contrast}
        onChange={(value) => setParams((p) => ({ ...p, contrast: value }))}
      />
      <NumberControl
        label="Primitive ribbons"
        min={0}
        max={5}
        step={0.1}
        value={params.primitiveMix.ribbons}
        onChange={(value) => setParams((p) => ({ ...p, primitiveMix: { ...p.primitiveMix, ribbons: value } }))}
      />
      <NumberControl
        label="Primitive steps"
        min={0}
        max={5}
        step={0.1}
        value={params.primitiveMix.steps}
        onChange={(value) => setParams((p) => ({ ...p, primitiveMix: { ...p.primitiveMix, steps: value } }))}
      />
      <NumberControl
        label="Primitive field lines"
        min={0}
        max={5}
        step={0.1}
        value={params.primitiveMix.fieldLines}
        onChange={(value) => setParams((p) => ({ ...p, primitiveMix: { ...p.primitiveMix, fieldLines: value } }))}
      />
      <label>ASCII cols <input type="number" value={params.ascii.cols} onChange={(e) => setParams((p) => ({ ...p, ascii: { ...p.ascii, cols: Number(e.target.value) } }))} /></label>
      <label>ASCII rows <input type="number" value={params.ascii.rows} onChange={(e) => setParams((p) => ({ ...p, ascii: { ...p.ascii, rows: Number(e.target.value) } }))} /></label>
      <label>ANSI <input type="checkbox" checked={params.ascii.ansiEnabled} onChange={(e) => setParams((p) => ({ ...p, ascii: { ...p.ascii, ansiEnabled: e.target.checked } }))} /></label>
      <label>Post enabled <input type="checkbox" checked={params.post.postEnabled} onChange={(e) => setParams((p) => ({ ...p, post: { ...p.post, postEnabled: e.target.checked } }))} /></label>
      <label>ASCII sample post <input type="checkbox" checked={params.ascii.asciiSamplePost} onChange={(e) => setParams((p) => ({ ...p, ascii: { ...p.ascii, asciiSamplePost: e.target.checked } }))} /></label>
      <label>PNG export post <input type="checkbox" checked={params.pngExportPost} onChange={(e) => setParams((p) => ({ ...p, pngExportPost: e.target.checked }))} /></label>
      <div className="buttons">
        <button onClick={onExportPNG}>Export PNG</button>
        <button onClick={onCopyASCII}>Copy ASCII</button>
        <button onClick={onDownloadTXT}>Download TXT</button>
        <button onClick={onSaveParams}>Save Params JSON</button>
        <label className="fileLoad">Load Params JSON<input type="file" accept="application/json" onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          file.text().then(onLoadParams);
        }} /></label>
      </div>
    </div>
  );
}
