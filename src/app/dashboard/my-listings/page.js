'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Loader from '../../../components/Loader';
import { Calendar, Trash2, Edit, Eye, MessageSquare, X, ShieldAlert, Award, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyListingsPage() {
  const { user, apiUrl } = useAuth();
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petRequests, setPetRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState(null);

  // Fetch listings owned by user
  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/pets`);
      const data = await res.json();
      if (data.success) {
        // Filter pets owned by the logged-in user
        const myListings = data.data.filter((p) => p.ownerEmail === user.email);
        setPets(myListings);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user, apiUrl]);

  // Open Requests Modal and fetch requests
  const handleOpenRequests = async (pet) => {
    setSelectedPet(pet);
    setRequestsModalOpen(true);
    setRequestsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/requests/pet-requests/${pet._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setPetRequests(data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load adoption requests', 'error');
    } finally {
      setRequestsLoading(false);
    }
  };

  // Manage adoption request status
  const handleRequestStatus = async (requestId, status) => {
    try {
      const res = await fetch(`${apiUrl}/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request ${status} successfully!`, 'success');
        // Refresh modal requests
        handleOpenRequests(selectedPet);
        // Refresh listings page to update pet status
        fetchMyListings();
      } else {
        showToast(data.message || 'Action failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update request status', 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (pet) => {
    setEditingPet({ ...pet });
    setEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/pets/${editingPet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPet),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pet updated successfully!', 'success');
        setEditModalOpen(false);
        fetchMyListings();
      } else {
        showToast(data.message || 'Failed to update pet', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating pet listing', 'error');
    }
  };

  // Open Delete Confirmation
  const handleOpenDelete = (petId) => {
    setDeletingPetId(petId);
    setDeleteModalOpen(true);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/pets/${deletingPetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Listing deleted successfully!', 'success');
        setDeleteModalOpen(false);
        fetchMyListings();
      } else {
        showToast(data.message || 'Failed to delete listing', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting listing', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading your listings..." />;
  }

  // Calculate statistics
  const totalListings = pets.length;
  const availableListings = pets.filter((p) => p.status === 'available').length;
  const adoptedListings = pets.filter((p) => p.status === 'adopted').length;

  return (
    <div>
      <div className="dashboard-header">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>My Pet Listings</h2>
        <Link href="/dashboard/add-pet" className="btn btn-primary">
          Add New Pet
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📂</div>
          <div className="stat-info">
            <span className="stat-label">Total Listings</span>
            <span className="stat-value">{totalListings}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon available">🐾</div>
          <div className="stat-info">
            <span className="stat-label">Available</span>
            <span className="stat-value">{availableListings}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon adopted">🎉</div>
          <div className="stat-info">
            <span className="stat-label">Adopted</span>
            <span className="stat-value">{adoptedListings}</span>
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      {pets.length === 0 ? (
        <div className="table-container" style={{ padding: '60px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>📭</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '10px' }}>No Listings Found</h3>
          <p className="section-description" style={{ maxWidth: '400px', margin: '10px auto' }}>
            You haven't listed any pets for adoption yet. Share a pet to help them find a loving family!
          </p>
          <Link href="/dashboard/add-pet" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <div className="pet-image-wrapper">
                <img src={pet.image} alt={pet.name} className="pet-image" />
                <span className={`pet-badge-status ${pet.status}`}>{pet.status}</span>
                <span className="pet-badge-species">{pet.species}</span>
              </div>
              <div className="pet-card-content">
                <div className="pet-card-title-row">
                  <h3 className="pet-card-title">{pet.name}</h3>
                  <span className="pet-card-fee">৳{pet.adoptionFee}</span>
                </div>
                <div className="pet-card-meta">
                  <span className="pet-meta-tag">{pet.breed}</span>
                  <span className="pet-meta-tag">{pet.age}</span>
                </div>
                <p className="pet-card-description">{pet.description}</p>
              </div>
              <div className="pet-card-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '16px' }}>
                <button
                  onClick={() => handleOpenRequests(pet)}
                  className="btn btn-outline"
                  style={{ gridColumn: 'span 2' }}
                >
                  <MessageSquare size={16} /> Requests
                </button>
                <button onClick={() => handleOpenEdit(pet)} className="btn btn-secondary" style={{ padding: '8px' }}>
                  <Edit size={16} /> Edit
                </button>
                <Link href={`/pets/${pet._id}`} className="btn btn-secondary" style={{ padding: '8px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <Eye size={16} /> View
                </Link>
                <button
                  onClick={() => handleOpenDelete(pet._id)}
                  className="btn btn-danger"
                  style={{ gridColumn: 'span 2', padding: '8px' }}
                >
                  <Trash2 size={16} /> Delete Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Adoption Requests Modal */}
      <AnimatePresence>
        {requestsModalOpen && selectedPet && (
          <div className="modal-overlay" onClick={() => setRequestsModalOpen(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Adoption Requests for {selectedPet.name}</h3>
                <button className="btn-icon" onClick={() => setRequestsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                {requestsLoading ? (
                  <Loader message="Fetching requests..." />
                ) : petRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p className="section-description">No adoption requests received for this pet yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {petRequests.map((req) => (
                      <div key={req._id} className="why-adopt-card" style={{ borderLeft: `4px solid var(--${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'error'})`, padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <h4 style={{ fontWeight: '700' }}>{req.requesterName}</h4>
                            <p className="footer-text" style={{ fontSize: '0.85rem' }}>✉️ {req.requesterEmail}</p>
                            <p className="footer-text" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                              📅 Pickup: <strong>{new Date(req.pickupDate).toLocaleDateString()}</strong>
                            </p>
                          </div>
                          <span className={`status-badge ${req.status}`}>{req.status}</span>
                        </div>
                        <p style={{ marginTop: '10px', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                          💬 "{req.message}"
                        </p>

                        {/* Actions for Pending Requests */}
                        {req.status === 'pending' && selectedPet.status === 'available' && (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button
                              onClick={() => handleRequestStatus(req._id, 'rejected')}
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleRequestStatus(req._id, 'approved')}
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            >
                              Approve Adoption
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setRequestsModalOpen(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Edit Listing Modal */}
      <AnimatePresence>
        {editModalOpen && editingPet && (
          <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: '650px' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Edit {editingPet.name} Listing</h3>
                <button className="btn-icon" onClick={() => setEditModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-name">Pet Name *</label>
                    <input
                      id="edit-name"
                      type="text"
                      className="form-input"
                      value={editingPet.name}
                      onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-species">Species *</label>
                    <select
                      id="edit-species"
                      className="form-input"
                      value={editingPet.species}
                      onChange={(e) => setEditingPet({ ...editingPet, species: e.target.value })}
                      required
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-breed">Breed *</label>
                    <input
                      id="edit-breed"
                      type="text"
                      className="form-input"
                      value={editingPet.breed}
                      onChange={(e) => setEditingPet({ ...editingPet, breed: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-age">Age *</label>
                    <input
                      id="edit-age"
                      type="text"
                      className="form-input"
                      value={editingPet.age}
                      onChange={(e) => setEditingPet({ ...editingPet, age: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-gender">Gender *</label>
                    <select
                      id="edit-gender"
                      className="form-input"
                      value={editingPet.gender}
                      onChange={(e) => setEditingPet({ ...editingPet, gender: e.target.value })}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-image">Image URL *</label>
                    <input
                      id="edit-image"
                      type="url"
                      className="form-input"
                      value={editingPet.image}
                      onChange={(e) => setEditingPet({ ...editingPet, image: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-health">Health Status *</label>
                    <input
                      id="edit-health"
                      type="text"
                      className="form-input"
                      value={editingPet.healthStatus}
                      onChange={(e) => setEditingPet({ ...editingPet, healthStatus: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-vaccination">Vaccination Status *</label>
                    <select
                      id="edit-vaccination"
                      className="form-input"
                      value={editingPet.vaccinationStatus}
                      onChange={(e) => setEditingPet({ ...editingPet, vaccinationStatus: e.target.value })}
                      required
                    >
                      <option value="Fully Vaccinated">Fully Vaccinated</option>
                      <option value="Partially Vaccinated">Partially Vaccinated</option>
                      <option value="Not Vaccinated">Not Vaccinated</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-location">Location *</label>
                    <input
                      id="edit-location"
                      type="text"
                      className="form-input"
                      value={editingPet.location}
                      onChange={(e) => setEditingPet({ ...editingPet, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-fee">Adoption Fee (৳) *</label>
                    <input
                      id="edit-fee"
                      type="number"
                      className="form-input"
                      value={editingPet.adoptionFee}
                      onChange={(e) => setEditingPet({ ...editingPet, adoptionFee: parseFloat(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" htmlFor="edit-description">Description *</label>
                    <textarea
                      id="edit-description"
                      className="form-input"
                      rows="4"
                      value={editingPet.description}
                      onChange={(e) => setEditingPet({ ...editingPet, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ maxWidth: '400px' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Confirm Deletion</h3>
                <button className="btn-icon" onClick={() => setDeleteModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', padding: '30px' }}>
                <ShieldAlert size={48} style={{ color: 'var(--error)', margin: '0 auto' }} />
                <h4 style={{ fontWeight: '700' }}>Delete Listing?</h4>
                <p className="section-description">
                  Are you sure you want to permanently delete this listing? This action cannot be undone and will delete all associated adoption requests.
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Yes, Delete Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
