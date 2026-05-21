'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/Loader';
import { Heart, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, apiUrl, user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistPets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/pets`);
        const data = await res.json();
        if (data.success) {
          // Filter pets that are in the user's wishlist
          const filtered = data.data.filter((pet) => wishlist.includes(pet._id));
          setPets(filtered);
        }
      } catch (err) {
        console.error('Error loading wishlist pets:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlistPets();
    }
  }, [wishlist, user, apiUrl]);

  if (loading) {
    return <Loader message="Loading your saved companions..." />;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>My Saved Pets</h2>
      </div>

      {pets.length === 0 ? (
        <div className="table-container" style={{ padding: '60px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>❤️</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '10px' }}>Your Wishlist is Empty</h3>
          <p className="section-description" style={{ maxWidth: '400px', margin: '10px auto' }}>
            Save pets you love by clicking the heart button on their profile cards or details pages.
          </p>
          <Link href="/pets" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Find Pets to Save
          </Link>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <motion.div
              key={pet._id}
              className="pet-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pet-image-wrapper">
                <img src={pet.image} alt={pet.name} className="pet-image" />
                <span className={`pet-badge-status ${pet.status}`}>{pet.status}</span>
                <span className="pet-badge-species">{pet.species}</span>
              </div>
              <div className="pet-card-content">
                <div className="pet-card-title-row">
                  <h3 className="pet-card-title">{pet.name}</h3>
                  <span className="pet-card-fee">${pet.adoptionFee}</span>
                </div>
                <div className="pet-card-meta">
                  <span className="pet-meta-tag">{pet.breed}</span>
                  <span className="pet-meta-tag">{pet.age}</span>
                </div>
                <p className="pet-card-description">{pet.description}</p>
              </div>
              <div className="pet-card-footer" style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/pets/${pet._id}`} className="btn btn-primary" style={{ flexGrow: 1, display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <Eye size={16} /> View Details
                </Link>
                <button
                  onClick={() => toggleWishlist(pet._id)}
                  className="btn btn-danger"
                  style={{ padding: '10px' }}
                  title="Remove from wishlist"
                >
                  <Heart size={18} fill="currentColor" color="white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
