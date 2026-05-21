'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Loader from '../../../components/Loader';
import { Heart, Calendar, MapPin, Sparkles, Stethoscope, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PetDetailsPage() {
  const { id } = useParams();
  const { user, loading: authLoading, wishlist, toggleWishlist, apiUrl } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [pet, setPet] = useState(null);
  const [petLoading, setPetLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  // Private route check
  useEffect(() => {
    if (!authLoading && !user) {
      showToast('Please log in to view pet details', 'info');
      router.push('/login');
    }
  }, [user, authLoading, router, showToast]);

  // Fetch pet details
  useEffect(() => {
    if (!user || !id) return;

    const fetchPetDetails = async () => {
      setPetLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/pets/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setPet(data.data);

          // Check if this user already has a pending request for this pet
          const requestsRes = await fetch(`${apiUrl}/api/requests/my-requests`, {
            credentials: 'include',
          });
          const requestsData = await requestsRes.json();
          if (requestsData.success) {
            const requested = requestsData.data.some(
              (req) => req.petId === id && req.status === 'pending'
            );
            setHasRequested(requested);
          }
        } else {
          showToast(data.message || 'Failed to load pet details', 'error');
          router.push('/pets');
        }
      } catch (err) {
        console.error(err);
        showToast('Error loading details', 'error');
        router.push('/pets');
      } finally {
        setPetLoading(false);
      }
    };

    fetchPetDetails();
  }, [id, user, apiUrl, router, showToast]);

  const handleAdoptSubmit = async (e) => {
    e.preventDefault();

    if (!pickupDate || !message) {
      showToast('Please specify a pickup date and message', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: pet._id,
          pickupDate,
          message,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        showToast('Adoption request submitted successfully!', 'success');
        setHasRequested(true);
        router.push('/dashboard/my-requests');
      } else {
        showToast(data.message || 'Failed to submit request', 'error');
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      showToast('Server error while submitting request', 'error');
    }
  };

  if (authLoading || !user) {
    return <Loader message="Verifying session..." />;
  }

  if (petLoading) {
    return <Loader message="Gathering companion details..." />;
  }

  if (!pet) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Companion not found</h2>
      </div>
    );
  }

  const isOwner = pet.ownerEmail === user.email;
  const isAdopted = pet.status === 'adopted';

  return (
    <div className="container">
      <div className="details-layout">
        {/* Main Details Panel */}
        <motion.div
          className="details-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image */}
          <div className="details-image-container">
            <img src={pet.image} alt={pet.name} className="details-image" />
          </div>

          {/* Info Details */}
          <div className="details-info-card">
            <div className="details-header">
              <div>
                <h1 className="details-name">{pet.name}</h1>
                <p className="details-breed">{pet.breed}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className={`status-badge ${isAdopted ? 'rejected' : 'approved'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                  {pet.status}
                </span>
                <button
                  onClick={() => toggleWishlist(pet._id)}
                  className="btn btn-secondary"
                  style={{ padding: '12px' }}
                  title="Add to Wishlist"
                >
                  <Heart
                    size={22}
                    fill={wishlist.includes(pet._id) ? 'var(--accent)' : 'none'}
                    color={wishlist.includes(pet._id) ? 'var(--accent)' : 'currentColor'}
                  />
                </button>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="details-grid-specs">
              <div className="spec-item">
                <span className="spec-label">Age</span>
                <p className="spec-value">{pet.age}</p>
              </div>
              <div className="spec-item">
                <span className="spec-label">Gender</span>
                <p className="spec-value">{pet.gender}</p>
              </div>
              <div className="spec-item">
                <span className="spec-label">Species</span>
                <p className="spec-value" style={{ textTransform: 'capitalize' }}>{pet.species}</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>About {pet.name}</h3>
              <p className="details-description">{pet.description}</p>
            </div>

            {/* Sub-spec list */}
            <div className="details-specs-list">
              <div className="spec-list-item">
                <span className="spec-list-label">
                  <Stethoscope size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--success)' }} />
                  Health Status
                </span>
                <span className="spec-list-value">{pet.healthStatus}</span>
              </div>
              <div className="spec-list-item">
                <span className="spec-list-label">
                  <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
                  Vaccination Status
                </span>
                <span className="spec-list-value">{pet.vaccinationStatus}</span>
              </div>
              <div className="spec-list-item">
                <span className="spec-list-label">
                  <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--accent)' }} />
                  Location
                </span>
                <span className="spec-list-value">{pet.location}</span>
              </div>
              <div className="spec-list-item">
                <span className="spec-list-label">
                  <span style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--success)', fontWeight: '700' }}>৳</span>
                  Adoption Fee
                </span>
                <span className="spec-list-value" style={{ fontWeight: '700', color: 'var(--primary)' }}>৳{pet.adoptionFee}</span>
              </div>
              <div className="spec-list-item" style={{ borderBottom: 'none' }}>
                <span className="spec-list-label">✉️ Owner Contact</span>
                <span className="spec-list-value" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{pet.ownerEmail}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Side Adoption Panel */}
        <motion.div
          className="side-adoption-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="adoption-form-card">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Adopt {pet.name}</h3>
            <p className="section-description" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              Fill in the form to schedule a pickup date and submit your request to the pet owner.
            </p>

            {isOwner ? (
              <div className="why-adopt-card" style={{ borderLeft: '4px solid var(--warning)', padding: '16px' }}>
                <ShieldAlert size={20} style={{ color: 'var(--warning)' }} />
                <h4 style={{ fontWeight: '700' }}>Listing Owner</h4>
                <p className="footer-text" style={{ fontSize: '0.85rem' }}>
                  You listed this pet. Owners are not allowed to submit adoption requests for their own listings. Manage requests from the Dashboard.
                </p>
              </div>
            ) : isAdopted ? (
              <div className="why-adopt-card" style={{ borderLeft: '4px solid var(--text-muted)', padding: '16px' }}>
                <ShieldAlert size={20} style={{ color: 'var(--text-muted)' }} />
                <h4 style={{ fontWeight: '700' }}>Already Adopted</h4>
                <p className="footer-text" style={{ fontSize: '0.85rem' }}>
                  This pet has already found its forever home. No further adoption requests can be made.
                </p>
              </div>
            ) : hasRequested ? (
              <div className="why-adopt-card" style={{ borderLeft: '4px solid var(--warning)', padding: '16px' }}>
                <Calendar size={20} style={{ color: 'var(--warning)' }} />
                <h4 style={{ fontWeight: '700' }}>Request Submitted</h4>
                <p className="footer-text" style={{ fontSize: '0.85rem' }}>
                  You have a pending adoption request for {pet.name}. Go to My Requests to manage your applications.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdoptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-pet-name">Pet Name</label>
                  <input
                    id="form-pet-name"
                    type="text"
                    className="form-input"
                    value={pet.name}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-user-name">Your Name</label>
                  <input
                    id="form-user-name"
                    type="text"
                    className="form-input"
                    value={user.name}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-user-email">Your Email</label>
                  <input
                    id="form-user-email"
                    type="email"
                    className="form-input"
                    value={user.email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-pickup-date">Pickup Date *</label>
                  <input
                    id="form-pickup-date"
                    type="date"
                    className="form-input"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="form-message">Message for Owner *</label>
                  <textarea
                    id="form-message"
                    className="form-input"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the owner why you are a good match for adopting this pet..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ width: '100%', padding: '12px', marginTop: '12px' }}
                >
                  {submitting ? 'Submitting Application...' : 'Adopt Now'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
