import axios from "axios";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/pokemon-card.css";

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemonData, setSelectedPokemonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=10")
      .then((response) => {
        setPokemons(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePokemonClick = async (pokemon) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      setSelectedPokemonData(response.data);
      setShowCard(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
        alt="API do Pokemon"
        className="center-image mt-4"
      />
      {showCard ? (
        <PokemonCard
          pokemonData={selectedPokemonData}
          onClose={() => {
            setShowCard(false);
            handleClearSearch();
          }}
        />
      ) : (
        <div>
          <div className="mb-4 text-end mt-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar pokémon..."
              className="form-control"
            />
            {searchTerm && (
              <button className="btn btn-outline-secondary ms-2" onClick={handleClearSearch}>
                Limpar
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Altura</th>
                  <th>Peso</th>
                  <th>Experiência Base</th>
                </tr>
              </thead>
              <tbody>
                {filteredPokemons.map((pokemon) => (
                  <tr
                    key={pokemon.name}
                    onClick={() => handlePokemonClick(pokemon)}
                  >
                    <td>{pokemon.name}</td>
                    <td>
                      {selectedPokemonData?.name === pokemon.name
                        ? selectedPokemonData.height
                        : ""}
                    </td>
                    <td>
                      {selectedPokemonData?.name === pokemon.name
                        ? selectedPokemonData.weight
                        : ""}
                    </td>
                    <td>
                      {selectedPokemonData?.name === pokemon.name
                        ? selectedPokemonData.base_experience
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


const PokemonCard = ({ pokemonData, onClose }) => {
  return (
    <div className="col-md-4 offset-md-4">
      <div className="card">
        <div className="card-body">
          <button
            type="button"
            className="btn-close float-end"
            aria-label="Close"
            onClick={onClose}
          ></button>
          <h5 className="card-title">{pokemonData.name}</h5>
          <img
            className="card-img-top"
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
          />
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Altura:</strong> {pokemonData.height}
            </li>
            <li className="list-group-item">
              <strong>Peso:</strong> {pokemonData.weight}
            </li>
            <li className="list-group-item">
              <strong>Experiência Base:</strong> {pokemonData.base_experience}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonList;
