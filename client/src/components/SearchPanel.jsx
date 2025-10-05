import React, { useState } from 'react';
import { Navigation, X } from 'lucide-react';

const SearchPanel = () => {
  console.log('SearchPanel is rendering...');
  const [isMinimized, setIsMinimized] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  if (isMinimized) {
    return (
      <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999 }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid #e5e7eb',
            transition: 'box-shadow 0.2s'
          }}
          onClick={() => setIsMinimized(false)}
          onMouseOver={(e) => e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'}
          onMouseOut={(e) => e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Directions</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 9999 }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb',
        width: '384px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>Directions</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              padding: '4px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          </button>
        </div>

        {/* Search Inputs */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Origin Input */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = '#9ca3af'}
            onMouseOut={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%', marginBottom: '4px' }}></div>
                <div style={{ width: '2px', height: '24px', backgroundColor: '#d1d5db' }}></div>
              </div>
              <input
                type="text"
                placeholder="Choose starting point, or click on the map"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  fontSize: '14px',
                  color: '#374151'
                }}
              />
              {origin && (
                <button
                  onClick={() => setOrigin('')}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                </button>
              )}
            </div>
          </div>

          {/* Destination Input */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = '#9ca3af'}
            onMouseOut={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <svg style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Choose destination, or click on the map"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  fontSize: '14px',
                  color: '#374151'
                }}
              />
              {destination && (
                <button
                  onClick={() => setDestination('')}
                  style={{
                    padding: '4px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '8px' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              <Navigation style={{ width: '16px', height: '16px' }} />
              Get Directions
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
