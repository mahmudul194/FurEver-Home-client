'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { Search, SlidersHorizontal, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AllPetsPage() {
  const { user, wishlist, toggleWishlist, apiUrl } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [sort, setSort] = useState('newest');
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        let url = `${apiUrl}/api/pets?`;
        const params = [];

        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (species && species !== 'all') params.push(`species=${encodeURIComponent(species)}`);
        if (sort) params.push(`sort=${encodeURIComponent(sort)}`);

        url += params.join('&');

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setPets(data.data);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid excessive API requests
    const timeout = setTimeout(() => {
      fetchPets();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, species, sort, apiUrl]);

  const handleAction = (petId) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/pets/${petId}`);
    }
  };

  return (
    <div>
      {/* Header & Filter Bar */}
      <section className="pets-header-section">
        <div className="container">
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>
            Find Your Future Companion
          </h1>
          <p className="section-description" style={{ textAlign: 'left', marginBottom: '20px' }}>
            Browse through all available pets looking for a second chance. Use search, species filter, and price sort to find your match.
          </p>

          <div className="filter-bar">
            {/* Search Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="search-pets" style={{ display: 'none' }}>Search Pets</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="search-pets"
                  type="text"
                  placeholder="Search by name..."
                  className="form-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
            </div>

            {/* Species Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="filter-species">Species</label>
              <select
                id="filter-species"
                className="form-input"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option value="all">All Species</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="bird">Birds</option>
                <option value="rabbit">Rabbits</option>
                <option value="other">Other Animals</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="sort-pets">Sort By</label>
              <select
                id="sort-pets"
                className="form-input"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest Listed</option>
                <option value="feeAsc">Fee: Low to High</option>
                <option value="feeDesc">Fee: High to Low</option>
                <option value="oldest">Oldest Listed</option>
              </select>
            </div>

            {/* Results count info */}
            <div style={{ display: 'flex', alignItems: 'center', height: '45px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              <SlidersHorizontal size={16} style={{ marginRight: '8px' }} />
              {pets.length} companion{pets.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Pets Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <Loader message="Loading search results..." />
          ) : pets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No Companions Found</h3>
              <p className="section-description" style={{ maxWidth: '400px' }}>
                We couldn't find any pets matching your criteria. Try adjusting your keywords or clearing filters.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSpecies('all');
                  setSort('newest');
                }}
                className="btn btn-secondary"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="pets-grid">
              {pets.map((pet, idx) => (
                <motion.div
                  key={pet._id}
                  className="pet-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
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
                      <span className="pet-meta-tag">{pet.gender}</span>
                    </div>
                    <p className="pet-card-description">{pet.description}</p>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>📍</span>
                      <span>{pet.location}</span>
                    </div>
                  </div>
                  <div className="pet-card-footer" style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleAction(pet._id)}
                      className="btn btn-primary"
                      style={{ flexGrow: 1 }}
                    >
                      {user ? 'View Details' : 'Adopt Now'}
                    </button>
                    <button
                      onClick={() => toggleWishlist(pet._id)}
                      className="btn btn-secondary"
                      style={{ padding: '10px' }}
                      title={wishlist.includes(pet._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        size={18}
                        fill={wishlist.includes(pet._id) ? 'var(--accent)' : 'none'}
                        color={wishlist.includes(pet._id) ? 'var(--accent)' : 'currentColor'}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
