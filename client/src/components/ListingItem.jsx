import React from 'react'
import { Link } from 'react-router-dom';

export default function ListingItem({listing}) {
  return (
    <div>{listing.name}</div>
  )
}
