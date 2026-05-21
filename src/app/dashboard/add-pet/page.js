'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export default function AddPetPage() {
  const { user, apiUrl } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState('');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [vaccinationStatus, setVaccinationStatus] = useState('Fully Vaccinated');
  const [location, setLocation] = useState('');
  const [adoptionFee, setAdoptionFee] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check fee validation
    const feeNum = parseFloat(adoptionFee);
    if (isNaN(feeNum) || feeNum < 0) {
      showToast('Adoption fee must be a valid positive number', 'error');
      return;
    }

    if (!name || !breed || !age || !image || !location || !description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          species,
          breed,
          age,
          gender,
          image,
          healthStatus,
          vaccinationStatus,
          location,
          adoptionFee: feeNum,
          description,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        showToast('Pet listing created successfully!', 'success');
        router.push('/dashboard/my-listings');
      } else {
        showToast(data.message || 'Failed to add pet listing', 'error');
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      showToast('Server error while creating listing', 'error');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Add New Pet Listing</h2>
      </div>

      <div className="table-container" style={{ padding: '30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Pet Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-name">Pet Name *</label>
            <input
              id="add-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Max"
              required
            />
          </div>

          {/* Species */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-species">Species *</label>
            <select
              id="add-species"
              className="form-input"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Breed */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-breed">Breed *</label>
            <input
              id="add-breed"
              type="text"
              className="form-input"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Golden Retriever"
              required
            />
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-age">Age *</label>
            <input
              id="add-age"
              type="text"
              className="form-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 2 Years, 3 Months"
              required
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-gender">Gender *</label>
            <select
              id="add-gender"
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-image">Image URL *</label>
            <input
              id="add-image"
              type="url"
              className="form-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          {/* Health Status */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-health">Health Status *</label>
            <input
              id="add-health"
              type="text"
              className="form-input"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
              placeholder="e.g. Healthy / Under minor treatment"
              required
            />
          </div>

          {/* Vaccination Status */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-vaccination">Vaccination Status *</label>
            <select
              id="add-vaccination"
              className="form-input"
              value={vaccinationStatus}
              onChange={(e) => setVaccinationStatus(e.target.value)}
              required
            >
              <option value="Fully Vaccinated">Fully Vaccinated</option>
              <option value="Partially Vaccinated">Partially Vaccinated</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-location">Location *</label>
            <input
              id="add-location"
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Los Angeles, CA"
              required
            />
          </div>

          {/* Adoption Fee */}
          <div className="form-group">
            <label className="form-label" htmlFor="add-fee">Adoption Fee ($) *</label>
            <input
              id="add-fee"
              type="number"
              className="form-input"
              value={adoptionFee}
              onChange={(e) => setAdoptionFee(e.target.value)}
              placeholder="e.g. 100"
              min="0"
              required
            />
          </div>

          {/* Owner Email (Auto-filled, Read Only) */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="add-owner">Owner Email (Read Only)</label>
            <input
              id="add-owner"
              type="email"
              className="form-input"
              value={user.email}
              disabled
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="add-description">Description *</label>
            <textarea
              id="add-description"
              className="form-input"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something about the pet's behavior, history, temperament, and preferences..."
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => router.push('/dashboard/my-listings')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Listing...' : 'Create Pet Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
