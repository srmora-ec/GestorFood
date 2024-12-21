import React, { useState, useEffect } from "react";
import  Item  from "./item2";
import API_URL from '../config';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API_URL +'/producto/listar/')
      .then(response => response.json())
      .then(data => setProducts(data.productos))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="items-list">
      {products.map(product => (
        <Item key={product.id_producto} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
