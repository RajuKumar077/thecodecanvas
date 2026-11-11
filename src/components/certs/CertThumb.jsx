import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

/** First-page preview of a certificate PDF (lazy chunk; rendered only when on screen). */
export default function CertThumb({ file, width, onReady, onFail }) {
  return (
    <Document file={file} loading={null} error={null} onLoadError={onFail} onSourceError={onFail}>
      <Page
        pageNumber={1}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={null}
        onRenderSuccess={onReady}
        onRenderError={onFail}
      />
    </Document>
  );
}
