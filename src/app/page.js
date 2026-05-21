'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import { Heart, Search, Calendar, Award, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Removed hardcoded mock pets since the database is now seeded with real data.

export default function HomePage() {
  const { user, wishlist, toggleWishlist, apiUrl } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/pets?status=available`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setPets(data.data.slice(0, 6));
        } else {
          setPets([]);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, [apiUrl]);

  const handleViewDetails = (petId) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/pets/${petId}`);
    }
  };

  if (loading) {
    return <Loader message="Fetching featured companions..." />;
  }

  return (
    <div>
      {/* 1. Hero Banner Section */}
      <section className="hero container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge">
            <span>🐕</span> Finding Homes, Creating Families
          </div>
          <h1 className="hero-title">
            Adopt a Friend, <span>Save a Life</span>
          </h1>
          <p className="hero-description">
            Bring home love, laughter, and a lifetime of companionship. Explore thousands of lovable pets waiting in shelters to meet their forever families today.
          </p>
          <div className="hero-actions">
            <Link href="/pets" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Adopt Now <ArrowRight size={18} />
            </Link>
            <Link href="/pets" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Browse Species
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="hero-image-bg"></div>
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600"
            alt="Happy golden dog"
            className="hero-image"
          />
        </motion.div>
      </section>

      {/* 2. Featured Pets Section */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Meet Our Residents</span>
            <h2 className="section-title">Featured Pets For Adoption</h2>
            <p className="section-description">
              These adorable animals are vaccinated, friendly, and looking for a warm hearth to call home. Click view details to submit an adoption request.
            </p>
          </div>

          <div className="pets-grid">
            {pets.map((pet, idx) => (
              <motion.div
                key={pet._id}
                className="pet-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="pet-image-wrapper">
                  <img src={pet.image} alt={pet.name} className="pet-image" />
                  <span className="pet-badge-status available">{pet.status}</span>
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
                    <span className="pet-meta-tag">{pet.gender}</span>
                  </div>
                  <p className="pet-card-description">{pet.description}</p>
                </div>
                <div className="pet-card-footer" style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleViewDetails(pet._id)}
                    className="btn btn-outline"
                    style={{ flexGrow: 1 }}
                  >
                    View Details
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

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/pets" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              View All Available Pets
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Adopt Pets Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Make A Difference</span>
            <h2 className="section-title">Why Adopt Instead of Buying?</h2>
            <p className="section-description">
              Adopting from a shelter changes lives. It saves innocent animals, fights commercial breeding factories, and brings incredible happiness to your home.
            </p>
          </div>

          <div className="why-adopt-grid">
            <div className="why-adopt-card">
              <div className="why-adopt-icon">
                <Heart size={24} />
              </div>
              <h3 className="why-adopt-title">Save a Life</h3>
              <p className="why-adopt-desc">
                Over a million shelter animals are euthanized each year. By adopting, you give a beautiful soul a second chance at life and happiness.
              </p>
            </div>

            <div className="why-adopt-card">
              <div className="why-adopt-icon">
                <ShieldCheck size={24} />
              </div>
              <h3 className="why-adopt-title">Healthier Pets</h3>
              <p className="why-adopt-desc">
                Shelter pets are vaccinated, vet-checked, and behavioral-assessed. Mixed breeds are also generally less prone to hereditary health conditions.
              </p>
            </div>

            <div className="why-adopt-card">
              <div className="why-adopt-icon">
                <Award size={24} />
              </div>
              <h3 className="why-adopt-title">Combat Puppy Mills</h3>
              <p className="why-adopt-desc">
                Buying from stores often funds high-volume commercial puppy mills that treat animals poorly. Adoption stops this cruel commercial pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Success Stories Section */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Happy Tails</span>
            <h2 className="section-title">Success Stories</h2>
            <p className="section-description">
              Read how adoption has transformed both the lives of our shelter animals and the families who welcomed them home.
            </p>
          </div>

          <div className="stories-slider">
            <div className="story-card">
              <div className="story-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
                  alt="Dog with family"
                  className="story-img"
                />
              </div>
              <div className="story-content">
                <p className="story-quote">
                  "Adopting Buster was the best decision we ever made. He immediately brought so much vitality to our home and quickly became my children’s absolute best friend."
                </p>
                <h4 className="story-author">
                  The Henderson Family
                  <span>Adopted Buster (Golden Labrador)</span>
                </h4>
              </div>
            </div>

            <div className="story-card">
              <div className="story-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=200"
                  alt="Cat with owner"
                  className="story-img"
                />
              </div>
              <div className="story-content">
                <p className="story-quote">
                  "Cleo was initially super shy at the shelter, but with some patience, she opened up into the absolute sweetest, most affectionate cat. She sits on my lap while I work every single day."
                </p>
                <h4 className="story-author">
                  Sarah Jenkins
                  <span>Adopted Cleo (Siamese Cat)</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pet Care Tips Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Advice For Owners</span>
            <h2 className="section-title">Essential Pet Care Tips</h2>
            <p className="section-description">
              Bringing home a pet is an ongoing responsibility. Learn the basics to ensure your animal feels safe, loved, and remains in peak health.
            </p>
          </div>

          <div className="why-adopt-grid">
            <div className="why-adopt-card">
              <div className="why-adopt-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                <span>🍎</span>
              </div>
              <h3 className="why-adopt-title">Balanced Nutrition</h3>
              <p className="why-adopt-desc">
                Feed your pet high-quality food appropriate for their age, species, and activity level. Always keep clean, fresh drinking water accessible.
              </p>
            </div>

            <div className="why-adopt-card">
              <div className="why-adopt-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                <span>🏃</span>
              </div>
              <h3 className="why-adopt-title">Regular Exercise</h3>
              <p className="why-adopt-desc">
                Dogs require daily walks and play, while cats need interactive toy sessions. Physical activity keeps them fit, agile, and curbs anxiety.
              </p>
            </div>

            <div className="why-adopt-card">
              <div className="why-adopt-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                <span>🏥</span>
              </div>
              <h3 className="why-adopt-title">Veterinary Checkups</h3>
              <p className="why-adopt-desc">
                Schedule yearly wellness visits, keep up with rabies vaccinations, and maintain active flea/tick preventative treatments year-round.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 1: How the Adoption Process Works */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Simple Steps</span>
            <h2 className="section-title">The Adoption Process</h2>
            <p className="section-description">
              We make welcoming your new family member simple, safe, and transparent. Follow these simple steps.
            </p>
          </div>

          <div className="why-adopt-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '1.2rem', justifyContent: 'center' }}>1</div>
              <h4 style={{ fontWeight: '700' }}>Browse & Search</h4>
              <p className="footer-text">Find your matching companion using our filters.</p>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '1.2rem', justifyContent: 'center' }}>2</div>
              <h4 style={{ fontWeight: '700' }}>Submit Request</h4>
              <p className="footer-text">Log in and send an adoption application with message.</p>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '1.2rem', justifyContent: 'center' }}>3</div>
              <h4 style={{ fontWeight: '700' }}>Owner Review</h4>
              <p className="footer-text">The pet owner reviews your request and pickup date.</p>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '1.2rem', justifyContent: 'center' }}>4</div>
              <h4 style={{ fontWeight: '700' }}>Bring Pet Home</h4>
              <p className="footer-text">Once approved, meet the owner and take your pet home!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Support Our Shelter */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&q=80&w=500"
            alt="Children volunteering"
            className="hero-image"
            style={{ transform: 'rotate(0deg)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span className="section-subtitle">Get Involved</span>
            <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Join Our Volunteer Network</h2>
            <p className="section-description" style={{ textAlign: 'left' }}>
              Not ready to adopt but still want to help? We are always looking for volunteers, foster parents, and donations to support our operations and keep these wonderful animals healthy.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500' }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Foster a pet temporarily
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500' }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Help out at local adoption drives
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500' }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Donate pet food, toys, or medical funds
              </li>
            </ul>
            <div>
              <Link href="/about" className="btn btn-primary">
                Learn More About Volunteering
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
