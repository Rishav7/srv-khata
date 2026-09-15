import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { exportAllData, importExcel } from "../utils/excel";
import { useKhata } from "../store/KhataContext";
import Currency from "../components/common/Currency";
export default function ExcelImportExport() {
  const { replaceData, suppliers, transactions } = useKhata();
  const input = useRef(null);
  const [preview, setPreview] = useState(null);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const choose = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const result = await importExcel(file);
      const r = await result;
      setPending(r);
      setPreview({
        suppliers: r.data.suppliers.length,
        transactions: r.data.transactions.length,
        errors: r.errors,
      });
    } finally {
      setBusy(false);
    }
  };
  const confirm = () => {
    if (!pending) return;
    replaceData(pending.data);
    setPending(null);
  };
  return (
    <div>
      <div className="page-intro">
        <div>
          <p className="eyebrow">DATA MANAGEMENT</p>
          <h2>Excel Import / Export</h2>
          <p>Move your supplier ledger between Excel and the web app safely.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<FileDownloadRoundedIcon />}
          onClick={() => exportAllData({ suppliers, transactions })}
        >
          Export All Data
        </Button>
      </div>
      <div className="excel-grid">
        <section className="panel import-card">
          <div className="panel__header">
            <div>
              <h2>Import Excel</h2>
              <p>Import your existing supplier workbook.</p>
            </div>
          </div>
          <div
            className="dropzone"
            onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              choose(e.dataTransfer.files[0]);
            }}
          >
            <UploadFileRoundedIcon />
            <strong>
              {busy ? "Reading workbook..." : "Drop your Excel file here"}
            </strong>
            <span>or click to choose an .xlsx file</span>
            <input
              ref={input}
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => choose(e.target.files?.[0])}
            />
          </div>
          <div className="mapping">
            <h3>Expected workbook mapping</h3>
            <div>
              <span>Suppliers</span>
              <p>
                Supplier ID · Supplier Name · Contact Person · Phone Number ·
                Opening Balance
              </p>
            </div>
            <div>
              <span>Transactions</span>
              <p>
                Date · Supplier · Bill / Ref No. · Description · Purchase / Due
                · Payment · Payment Mode · Remarks
              </p>
            </div>
          </div>
        </section>
        <section className="panel export-card">
          <div className="panel__header">
            <div>
              <h2>Export & Backup</h2>
              <p>Keep a portable copy of your ledger.</p>
            </div>
          </div>
          <div className="export-stat">
            <span>Current Suppliers</span>
            <strong>{suppliers.length}</strong>
          </div>
          <div className="export-stat">
            <span>Current Transactions</span>
            <strong>{transactions.length}</strong>
          </div>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={() => exportAllData({ suppliers, transactions })}
          >
            Download Complete Workbook
          </Button>
          <p className="helper-note">
            The export contains Suppliers, Transactions and Dashboard summary
            sheets.
          </p>
        </section>
      </div>
      {preview && (
        <section className="panel import-preview">
          <div className="panel__header">
            <div>
              <h2>Import Preview</h2>
              <p>Review the workbook before replacing your current data.</p>
            </div>
            {preview.errors.length ? (
              <span className="preview-error">
                <ErrorOutlineRoundedIcon /> {preview.errors.length} issues
              </span>
            ) : (
              <span className="preview-success">
                <CheckCircleRoundedIcon /> Ready to import
              </span>
            )}
          </div>
          <div className="preview-stats">
            <div>
              <span>Suppliers found</span>
              <strong>{preview.suppliers}</strong>
            </div>
            <div>
              <span>Transactions found</span>
              <strong>{preview.transactions}</strong>
            </div>
            <div>
              <span>Invalid / unmatched rows</span>
              <strong>{preview.errors.length}</strong>
            </div>
          </div>
          {preview.errors.length > 0 && (
            <div className="error-list">
              {preview.errors.slice(0, 8).map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}
          <div className="button-row">
            <Button
              onClick={() => {
                setPreview(null);
                setPending(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={confirm}
              disabled={preview.errors.length > 0}
            >
              Import Data
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
