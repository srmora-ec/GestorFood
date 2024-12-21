// PayPal.js

import React, { useContext,useRef, useEffect } from 'react';
import { CartContext } from '../context/CarritoContext';
import { notification } from 'antd';



const PayPal2 = ({ onSuccess, amount }) => {
  const [cart, setCart] = useContext(CartContext);

 
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AY_g64Csg6RjTCN5__-9jz9nMDeHdyhtkKOFIs_05dz6xfmBHuEGM2Vb54n81yZJkXTeEIGROUue1XEW';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              handlePaymentSuccess(details);
            });
          },
          onError: function (err) {
            console.error('Error during PayPal transaction:', err);
          },
        }).render('#paypal-button-container');
      }
    }
  }, [amount]);

  const handlePaymentSuccess = (details) => {
    console.log('Payment completed successfully:', details);
    setCart([]);
    onSuccess(); 

    notification.success({
      message: '¡El pago se ha completado con éxito!',
    });

  };

  return (
    <>
      <div id="paypal-button-container"></div>
    </>
  );
};

export default PayPal2;
