import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GameForme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [donneeDuJeu, setdonneeDuJeu] = useState({
    title: '',
    description: '',
    price: '',
    genre: '',
    img: ''
  });

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetch(`http://localhost:3001/games/${id}`)
        .then(res => res.json())
        .then(data => {
          setdonneeDuJeu({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            genre: data.genre || '',
            img: data.img || ''
          });
        })
        .catch(err => console.error('Erreur chargement jeu:', err));
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!donneeDuJeu.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (donneeDuJeu.title.length > 100) {
      newErrors.title = 'Le titre ne doit pas dépasser 100 caractères';
    }

    if (donneeDuJeu.description.length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
    }

    const priceNum = parseFloat(donneeDuJeu.price);
    if (isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }

    if (!donneeDuJeu.genre) {
      newErrors.genre = 'Le genre est obligatoire';
    }

    if (donneeDuJeu.img && !donneeDuJeu.img.match(/^https?:\/\//)) {
      newErrors.img = 'L\'URL doit commencer par http:// ou https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    const lEnvoi = {
      title: donneeDuJeu.title.trim(),
      description: donneeDuJeu.description.trim(),
      price: parseFloat(donneeDuJeu.price) || 0,
      genre: donneeDuJeu.genre || 'Action',
      img: donneeDuJeu.img.trim() || 'https://via.placeholder.com/300x225'
    };

    const url = isEditMode
      ? `http://localhost:3001/games/${id}`
      : 'http://localhost:3001/games';

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lEnvoi)
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          const result = response.json();
          navigate(`/game-detail/${isEditMode ? id : result.id}`);
        }, 1500);
      } else {
        setErrors({ submit: 'Erreur serveur lors de l\'enregistrement' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ submit: 'Erreur de connexion au serveur' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setdonneeDuJeu({
      ...donneeDuJeu,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        {isEditMode ? 'Modifier le jeu' : 'Ajouter un nouveau jeu'}
      </h1>

      {submitSuccess && (
        <div className="alert alert-success" role="alert">
          ✅ {isEditMode ? 'Jeu modifié avec succès !' : 'Jeu ajouté avec succès !'} Redirection...
        </div>
      )}

      {errors.submit && (
        <div className="alert alert-danger" role="alert">
          ❌ {errors.submit}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-bold">
                    Nom du Jeu *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={donneeDuJeu.title}
                    onChange={handleChange}
                    placeholder="Ex: The Legend of Zelda: Breath of the Wild"
                    maxLength="100"
                    required
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                  <div className="form-text">
                    {donneeDuJeu.title.length}/100 caractères • Champ obligatoire
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">
                    Description
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={donneeDuJeu.description}
                    onChange={handleChange}
                    placeholder="Décrivez le gameplay, l'histoire, les features..."
                    maxLength="500"
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                  <div className="form-text">
                    {donneeDuJeu.description.length}/500 caractères
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label fw-bold">
                      Prix ($) *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        id="price"
                        name="price"
                        step="0.01"
                        min="0"
                        max="999.99"
                        value={donneeDuJeu.price}
                        onChange={handleChange}
                        placeholder="59.99"
                        required
                      />
                    </div>
                    {errors.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                    <div className="form-text">Prix en dollars • Champ obligatoire</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="genre" className="form-label fw-bold">
                      Genre *
                    </label>
                    <select
                      className={`form-select ${errors.genre ? 'is-invalid' : ''}`}
                      id="genre"
                      name="genre"
                      value={donneeDuJeu.genre}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionner un genre</option>
                      <option value="Action">Action</option>
                      <option value="Aventure">Aventure</option>
                      <option value="RPG">RPG</option>
                      <option value="Stratégie">Stratégie</option>
                      <option value="FPS">FPS</option>
                      <option value="Sport">Sport</option>
                      <option value="Simulation">Simulation</option>
                      <option value="Multijoueur">Multijoueur</option>
                      <option value="Monde ouvert">Monde ouvert</option>
                      <option value="Horreur">Horreur</option>
                    </select>
                    {errors.genre && (
                      <div className="invalid-feedback">{errors.genre}</div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="img" className="form-label fw-bold">
                    URL de l'Image
                  </label>
                  <input
                    type="url"
                    className={`form-control ${errors.img ? 'is-invalid' : ''}`}
                    id="img"
                    name="img"
                    value={donneeDuJeu.img}
                    onChange={handleChange}
                    placeholder="https://exemple.com/image.jpg"
                    pattern="https?://.*"
                  />
                  {errors.img && (
                    <div className="invalid-feedback">{errors.img}</div>
                  )}
                  <div className="form-text">
                    Doit commencer par http:// ou https://
                  </div>

                  {donneeDuJeu.img && !errors.img && (
                    <div className="mt-3">
                      <label className="form-label fw-bold">Aperçu :</label>
                      <div className="border rounded p-2 text-center">
                        <img
                          src={donneeDuJeu.img}
                          alt="Aperçu"
                          className="img-fluid rounded"
                          style={{maxHeight: '150px'}}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x225?text=Image+non+disponible';
                            setErrors({...errors, img: 'URL d\'image invalide'});
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/')}
                  >
                    ← Annuler
                  </button>

                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-danger me-2"
                      onClick={() => {
                        setdonneeDuJeu({
                          title: '',
                          description: '',
                          price: '',
                          genre: '',
                          img: ''
                        });
                        setErrors({});
                      }}
                    >
                      Effacer
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={submitSuccess}
                    >
                      {submitSuccess ? '✅ Succès' : (isEditMode ? 'Mettre à jour' : 'Ajouter le jeu')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameForme;
