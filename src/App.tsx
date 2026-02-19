import { useMemo, useState } from 'react';
import { defaultParams, type Params } from './core/params';
import { ThreeScene } from './render/three/ThreeScene';
import { runPostLayers } from './render/post/layers';
import { canvasToAscii } from './render/ascii/ascii';
import { Controls } from './ui/Controls';
import { randomizeParams } from './core/randomize';

export default function App() {
  const [params, setParams] = useState<Params>(defaultParams);
  const [baseCanvas, setBaseCanvas] = useState<HTMLCanvasElement | null>(null);

  const postCanvas = useMemo(() => (baseCanvas ? runPostLayers(baseCanvas, params) : null), [baseCanvas, params]);
  const ascii = useMemo(() => {
    const source = params.ascii.asciiSamplePost ? postCanvas : baseCanvas;
    return source ? canvasToAscii(source, params.ascii) : '';
  }, [params, baseCanvas, postCanvas]);

  const exportCanvas = params.pngExportPost ? postCanvas : baseCanvas;

  return (
    <div className="app">
      <Controls
        params={params}
        setParams={setParams}
        onRegenerate={() => setParams((p) => randomizeParams(p))}
        onExportPNG={() => {
          if (!exportCanvas) return;
          const a = document.createElement('a');
          a.download = `procacscii-${params.seed}.png`;
          a.href = exportCanvas.toDataURL('image/png');
          a.click();
        }}
        onCopyASCII={() => navigator.clipboard.writeText(ascii)}
        onDownloadTXT={() => {
          const a = document.createElement('a');
          a.download = `procacscii-${params.seed}.txt`;
          a.href = URL.createObjectURL(new Blob([ascii], { type: 'text/plain;charset=utf-8' }));
          a.click();
        }}
        onSaveParams={() => {
          const a = document.createElement('a');
          a.download = `procacscii-${params.seed}.json`;
          a.href = URL.createObjectURL(new Blob([JSON.stringify(params, null, 2)], { type: 'application/json' }));
          a.click();
        }}
        onLoadParams={(text) => {
          try {
            const parsed = JSON.parse(text) as Params;
            setParams(parsed);
          } catch {
            console.error('Invalid params JSON');
          }
        }}
      />
      <div className="viewport">
        <ThreeScene params={params} onBaseCanvas={setBaseCanvas} />
        {params.renderMode === 'ASCII Overlay' && <pre className="ascii">{ascii}</pre>}
      </div>
    </div>
  );
}
