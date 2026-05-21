'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Loader from '../../../components/Loader';
import { Eye, XOctagon, Calendar, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyRequestsPage() {
  const { user, apiUrl } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancel confirmation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancellingPetName, setCancellingPetName] = useState('');

  const fetchMyRequests = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/requests/my-requests`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user, apiUrl]);

  const openCancelModal = (requestId, petName) => {
    setCancellingId(requestId);
    setCancellingPetName(petName);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    setCancelModalOpen(false);
    try {
      const res = await fetch(`${apiUrl}/api/requests/${cancellingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Request cancelled successfully', 'success');
        fetchMyRequests();
      } else {
        showToast(data.message || 'Failed to cancel request', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error cancelling request', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading your adoption requests..." />;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>My Adoption Requests</h2>
      </div>

      {requests.length === 0 ? (
        <div className="table-container" style={{ padding: '60px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>📁</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '10px' }}>No Requests Sent</h3>
          <p className="section-description" style={{ maxWidth: '400px', margin: '10px auto' }}>
            You haven't applied to adopt any pets yet. Browse our available companions and submit a request to start your journey!
          </p>
          <Link href="/pets" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Explore Available Pets
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Request Date</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <motion.tr
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <td style={{ fontWeight: '700' }}>{req.petName}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      {new Date(req.pickupDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${req.status}`}>{req.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/pets/${req.petId}`}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', gap: '4px', alignItems: 'center' }}
                      >
                        <Eye size={14} /> Details
                      </Link>
                      {req.status === 'pending' && (
                        <button
                          onClick={() => openCancelModal(req._id, req.petName)}
                          className="btn btn-danger"
                          style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'flex', gap: '4px', alignItems: 'center' }}
                        >
                          <XOctagon size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Request Confirmation Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="modal-overlay" onClick={() => setCancelModalOpen(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ maxWidth: '400px' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Cancel Request</h3>
                <button className="btn-icon" onClick={() => setCancelModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', padding: '30px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <ShieldAlert size={48} style={{ color: 'var(--warning)' }} />
                <h4 style={{ fontWeight: '700' }}>Cancel adoption request for <em>{cancellingPetName}</em>?</h4>
                <p className="section-description">
                  This will permanently remove your pending adoption application. You can submit a new request later if the pet is still available.
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setCancelModalOpen(false)}>
                  Keep Request
                </button>
                <button className="btn btn-danger" onClick={handleCancelConfirm}>
                  Yes, Cancel It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
