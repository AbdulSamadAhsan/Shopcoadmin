import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';
import { api } from '../services/api';

const localDate = value => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
const valuesFor = coupon => ({ code: coupon.code, type: coupon.type, value: coupon.value, minSubtotal: coupon.minSubtotal || 0, active: coupon.active, expiresAt: coupon.expiresAt || null });
function CouponForm({ coupon, onSave, onCancel }) {
  const [code, setCode] = useState(coupon?.code || '');
  const [type, setType] = useState(coupon?.type || 'percentage');
  const [value, setValue] = useState(coupon?.value ?? '');
  const [minimum, setMinimum] = useState(coupon?.minSubtotal || 0);
  const [expiry, setExpiry] = useState(localDate(coupon?.expiresAt));
  const [active, setActive] = useState(coupon?.active ?? true);
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await onSave(coupon?._id, { code: code.trim().toUpperCase(), type, value: Number(value), minSubtotal: Number(minimum), active, expiresAt: expiry ? new Date(expiry).toISOString() : null }); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <section className="card coupon-editor"><h2>{coupon ? 'Edit coupon' : 'Add coupon'}</h2>
    <form onSubmit={submit}><fieldset disabled={busy}>
      <label>Coupon code<input required minLength={3} maxLength={40} pattern="[A-Za-z0-9_\-]+" placeholder="e.g. SUMMER15" value={code} onChange={event => setCode(event.target.value.toUpperCase())} /></label>
      <div className="coupon-form-grid"><label>Discount type<select value={type} onChange={event => setType(event.target.value)}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed amount (USD)</option></select></label><label>{type === 'percentage' ? 'Discount (%)' : 'Discount (USD)'}<input required type="number" min="0.01" max={type === 'percentage' ? 100 : 1000000} step="0.01" value={value} onChange={event => setValue(event.target.value)} /></label></div>
      <div className="coupon-form-grid"><label>Minimum subtotal (USD)<input required type="number" min="0" max="1000000" step="0.01" value={minimum} onChange={event => setMinimum(event.target.value)} /></label><label>Expires at (optional)<input type="datetime-local" value={expiry} onChange={event => setExpiry(event.target.value)} /></label></div>
      <small>Expiry uses your local time. Discount applies to merchandise before tax and delivery and cannot exceed its subtotal.</small>
      <label className="coupon-active-control"><input type="checkbox" checked={active} onChange={event => setActive(event.target.checked)} />Active</label>
    </fieldset>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="coupon-actions"><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save coupon'}</button><button type="button" disabled={busy} onClick={onCancel}>Cancel</button></div>
    </form>
  </section>;
}
export default function CouponsPage({ notify }) {
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [page, setPage] = useState(1), [search, setSearch] = useState(''), [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState(null), [deleting, setDeleting] = useState(null), [busyId, setBusyId] = useState('');
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    const timer = setTimeout(() => api.coupons(page, search, controller.signal).then(result => { if (!controller.signal.aborted) setData(result); }).catch(error => { if (!controller.signal.aborted) setError(error.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }), 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [page, search, revision]);
  function refresh() { setRevision(value => value + 1); }
  async function save(id, values) { await api.saveCoupon(id, values); setEditor(null); setPage(1); refresh(); notify('Coupon saved'); }
  async function toggle(coupon) {
    setBusyId(coupon._id); setError('');
    try { await api.saveCoupon(coupon._id, { ...valuesFor(coupon), active: !coupon.active }); refresh(); notify(coupon.active ? 'Coupon disabled' : 'Coupon enabled'); }
    catch (error) { setError(error.message); } finally { setBusyId(''); }
  }
  async function remove(id) {
    setBusyId(id); setError('');
    try { await api.deleteCoupon(id); setDeleting(null); if (editor?._id === id) setEditor(null); setPage(1); refresh(); notify('Coupon deleted'); }
    catch (error) { setError(error.message); } finally { setBusyId(''); }
  }
  return <div className="coupons-page">
    <div className="coupon-toolbar"><label>Search coupons<input type="search" placeholder="Search by code" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} /></label><button className="primary" disabled={!!busyId} onClick={() => { setEditor({}); setDeleting(null); }}><Plus size={16} />Add coupon</button></div>
    {editor && <CouponForm key={editor._id || 'new'} coupon={editor._id ? editor : null} onSave={save} onCancel={() => setEditor(null)} />}
    {error && <div className="api-message" role="alert">{error}<button onClick={refresh}>Retry</button></div>}
    {loading && <p role="status">Loading coupons…</p>}
    {!loading && data && <>
      <p className="coupon-count">{data.pagination.total} {data.pagination.total === 1 ? 'coupon' : 'coupons'}</p>
      <div className="coupon-grid">{data.coupons.map(coupon => {
        const expired = coupon.expiresAt && new Date(coupon.expiresAt) <= new Date();
        const status = !coupon.active ? 'Inactive' : expired ? 'Expired' : 'Active';
        return <article className="card coupon-card" key={coupon._id}>
          <div className="coupon-card-heading"><Ticket size={20} /><h2>{coupon.code}</h2><span className={`coupon-status ${status.toLowerCase()}`}>{status}</span></div>
          <strong className="coupon-value">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`} off</strong>
          <p>Minimum subtotal: ${Number(coupon.minSubtotal || 0).toFixed(2)}</p><p>{coupon.expiresAt ? `Expires: ${new Date(coupon.expiresAt).toLocaleString()}` : 'No expiry date'}</p>
          <div className="coupon-actions"><button disabled={!!busyId} onClick={() => { setEditor(coupon); setDeleting(null); }}><Pencil size={14} />Edit</button><button disabled={!!busyId} onClick={() => toggle(coupon)}>{coupon.active ? 'Disable' : 'Enable'}</button><button disabled={!!busyId} aria-label={`Delete ${coupon.code}`} onClick={() => setDeleting(coupon._id)}><Trash2 size={14} />Delete</button></div>
          {deleting === coupon._id && <div className="coupon-delete-confirm"><p>Delete {coupon.code}? Customers will no longer be able to apply it. Existing orders keep their discount.</p><div className="coupon-actions"><button disabled={!!busyId} onClick={() => remove(coupon._id)}>Confirm delete</button><button disabled={!!busyId} onClick={() => setDeleting(null)}>Cancel</button></div></div>}
        </article>;
      })}</div>
      {!data.coupons.length && <div className="empty">{search ? 'No matching coupons.' : 'No coupons yet. Add your first coupon above.'}</div>}
      {data.pagination.pages > 1 && <div className="admin-review-pagination"><button disabled={page === 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {data.pagination.pages}</span><button disabled={page >= data.pagination.pages} onClick={() => setPage(value => value + 1)}>Next</button></div>}
    </>}
  </div>;
}
