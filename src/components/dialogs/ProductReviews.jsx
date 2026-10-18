import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const date = value => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unavailable';

export default function ProductReviews({ modal }) {
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    api.productReviews(modal.product.id, page, controller.signal).then(result => {
      if (!controller.signal.aborted) setData(result);
    }).catch(error => { if (!controller.signal.aborted) setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [modal.product.id, page, retry]);
  return <div className="admin-product-reviews">
    <h2 id="modal-title">Ratings & reviews</h2><p>{modal.product.name}</p>
    {data && <div className="admin-review-summary"><strong>★ {data.summary.rating}/5</strong><span>{data.summary.total} customer {data.summary.total === 1 ? 'review' : 'reviews'}{!data.summary.total && ' · Default rating'}</span></div>}
    {loading && <p role="status">Loading reviews…</p>}
    {error && <p role="alert" className="form-error">{error} <button onClick={() => setRetry(value => value + 1)}>Try again</button></p>}
    {!loading && !error && data && <>
      {!data.reviews.length && <p>No reviews on this page.</p>}
      <div className="admin-review-list">{data.reviews.map(review => <article key={review._id}>
        <div className="admin-review-heading"><strong>{review.name || 'Customer'}</strong><span aria-label={`${review.rating} out of 5 stars`}>★ {review.rating}/5</span></div>
        {typeof review.size === 'string' || typeof review.color === 'string' ? <div className="admin-review-variant"><span>Size: {review.size || 'Standard'}</span><span>Color: {/^#[0-9a-f]{3,8}$/i.test(review.color || '') && <i style={{ backgroundColor: review.color }} aria-hidden="true" />}{review.color || 'Standard'}</span></div> : <small>Variant details unavailable for this earlier review.</small>}
        {review.comment ? <p className="admin-review-comment">{review.comment}</p> : <p>No written review.</p>}
        {review.order && <small className="admin-review-order">Order: #{review.order}</small>}
        <small>Rated on {date(review.createdAt)}</small>
        {new Date(review.updatedAt).getTime() > new Date(review.createdAt).getTime() && <small>Updated on {date(review.updatedAt)}</small>}
      </article>)}</div>
      {data.pagination.pages > 1 && <div className="admin-review-pagination"><button disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {data.pagination.pages}</span><button disabled={page >= data.pagination.pages} onClick={() => setPage(value => value + 1)}>Next</button></div>}
    </>}
  </div>;
}
