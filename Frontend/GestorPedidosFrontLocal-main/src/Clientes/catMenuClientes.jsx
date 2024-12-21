import React, { useEffect, useState } from 'react';
import API_URL from '../config.js';

const CatMenuClientes = ({ onCategoryClick }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/producto/listar_categorias/`);
        const data = await response.json();
        setCategorias(data.categorias);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          padding: '20px',
        }}
      >
        {categorias.map((categoria) => (
          <div
            key={categoria.id_categoria}
            onClick={() => onCategoryClick(categoria)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease',
              border: `2px solid ${categoria.muestracliente ? '#A80000' : '#CCCCCC'}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              style={{
                height: '150px',
                backgroundImage: `url(data:image/jpeg;base64,${categoria.imagencategoria})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div
              style={{
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#A80000',
              }}
            >
              {categoria.catnombre}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CatMenuClientes;
