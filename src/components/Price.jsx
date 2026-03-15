import React, { useState, useEffect } from 'react';

const Price = ({ price }) => {
  const [userLocation, setUserLocation] = useState('US');
  const [convertedPrice, setConvertedPrice] = useState(price);
  const [currency, setCurrency] = useState('$');
  const [loading, setLoading] = useState(true);

  const exchangeRates = {
    US: { rate: 1, symbol: '$', code: 'USD' },
    MA: { rate: 10.5, symbol: 'DH', code: 'MAD' },
    FR: { rate: 0.95, symbol: '€', code: 'EUR' },
    GB: { rate: 0.82, symbol: '£', code: 'GBP' },
    CA: { rate: 1.35, symbol: 'C$', code: 'CAD' },
    JP: { rate: 150.5, symbol: '¥', code: 'JPY' },
    CN: { rate: 7.2, symbol: '¥', code: 'CNY' },
  };

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
                );
                const data = await response.json();
                const countryCode = data.countryCode || 'US';
                setUserLocation(countryCode);
                
                const rate = exchangeRates[countryCode] || exchangeRates.US;
                setConvertedPrice(price * rate.rate);
                setCurrency(rate.symbol);
              } catch (error) {
                console.error('Erreur géolocalisation:', error);
                fallbackToIP();
              }
              setLoading(false);
            },
            (error) => {
              console.error('Erreur permission:', error);
              fallbackToIP();
            }
          );
        } else {
          fallbackToIP();
        }
      } catch (error) {
        console.error('Erreur détection:', error);
        fallbackToIP();
      }
    };
    const fallbackToIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code || 'US';
        setUserLocation(countryCode);
        
        const rate = exchangeRates[countryCode] || exchangeRates.US;
        setConvertedPrice(price * rate.rate);
        setCurrency(rate.symbol);
      } catch (error) {
        console.error('Erreur IP:', error);
        setUserLocation('US');
        setConvertedPrice(price);
        setCurrency('$');
      }
      setLoading(false);
    };

    detectLocation();
  }, [price]);

  if (loading) {
    return <span className="badge bg-secondary">Chargement...</span>;
  }

  return (
    <span className="price-display" title={`Prix en ${currency}`}>
      {currency}{convertedPrice.toFixed(2)}
    </span>
  );
};

export default Price;