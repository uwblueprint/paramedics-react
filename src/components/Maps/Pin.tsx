import React from 'react';

const Pin = ({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) => {
  return <div>{label}</div>;
};

export default Pin;
