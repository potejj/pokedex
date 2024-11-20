import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
const App = () => {
  return (
    <Router>
      <div className="pokedex-container">
      <p className="lawsuitendo">lawsuitendo</p>
        <div className="pokedex-screen">
          <Routes>
            <Route path="/" element={<Pokedex />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};


const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20000');
        setPokemonList(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };
    fetchPokemon();
  }, []);

  if (loading) return <div className="loading">Loading Pokédex...</div>;

  return (
    <div className="pokemon-grid">
      {pokemonList.map((pokemon, index) => (
        <Link key={index} to={`/pokemon/${index + 1}`} className="pokemon-card-link">
          <PokemonCard name={pokemon.name} url={pokemon.url} />
        </Link>
      ))}
    </div>
  );
};

const PokemonCard = ({ name, url }) => {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(url);
        setPokemonData(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };
    fetchDetails();
  }, [url]);

  if (!pokemonData) return <div>Loading {name}...</div>;

  return (
    <div className="pokemon-card">
      <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <img
        src={pokemonData.sprites.front_default}
        alt={name}
      />
    </div>
  );
};

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemonData(response.data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!pokemonData) return <div className="loading">Loading details...</div>;

  return (
    <div className="pokemon-details">
      <h1>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h1>
      <img
        src={pokemonData.sprites.other['official-artwork'].front_default}
        alt={pokemonData.name}
      />
      <p><strong>Type:</strong> {pokemonData.types.map(type => type.type.name).join(', ')}</p>
      <p><strong>Height:</strong> {pokemonData.height}</p>
      <p><strong>Weight:</strong> {pokemonData.weight}</p>
      <Link to="/" className="back-button">Back to Pokédex</Link>
    </div>
  );
};

export default App;

