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

export function Controls({ params, setParams, onRegenerate, onExportPNG, onCopyASCII, onDownloadTXT, onSaveParams, onLoadParams }: Props) {
  return (
    <div className="controls">
      <h2>Procacscii</h2>
      <label>Seed <input type="number" value={params.seed} onChange={(e) => setParams((p) => ({ ...p, seed: Number(e.target.value) }))} /></label>
      <button onClick={onRegenerate}>Randomize / Regenerate</button>
      <label>Mode
        <select value={params.renderMode} onChange={(e) => setParams((p) => ({ ...p, renderMode: e.target.value as Params['renderMode'] }))}>
          <option>Solid</option><option>ASCII</option>
        </select>
      </label>
      <label>Hue mode
        <select value={params.hueMode} onChange={(e) => setParams((p) => ({ ...p, hueMode: e.target.value as Params['hueMode'] }))}>
          <option value="analogous">analogous</option><option value="complement">complement</option><option value="triad">triad</option><option value="random-walk">random-walk</option>
        </select>
      </label>
      <label>Contrast <input type="range" min="0" max="1" step="0.01" value={params.contrast} onChange={(e) => setParams((p) => ({ ...p, contrast: Number(e.target.value) }))} /></label>
      <label>Primitive ribbons <input type="range" min="0" max="1" step="1" value={params.primitiveMix.ribbons} onChange={(e) => setParams((p) => ({ ...p, primitiveMix: { ...p.primitiveMix, ribbons: Number(e.target.value) } }))} /></label>
      <label>Primitive steps <input type="range" min="0" max="1" step="1" value={params.primitiveMix.steps} onChange={(e) => setParams((p) => ({ ...p, primitiveMix: { ...p.primitiveMix, steps: Number(e.target.value) } }))} /></label>
      <label>Primitive field lines <input type="range" min="0" max="1" step="1" value={params.primitiveMix.fieldLines} onChange={(e) => setParams((p) => ({ ...p, primitiveMix: { ...p.primitiveMix, fieldLines: Number(e.target.value) } }))} /></label>
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
