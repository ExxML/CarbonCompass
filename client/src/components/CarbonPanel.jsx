import React from 'react';
import { Leaf, TrendingDown, Car, TreePine } from 'lucide-react';
import carbonIcon from '../assets/carbon.png';

const CarbonPanel = ({ isDarkMode = false }) => {
  // Mock carbon savings data - you can replace this with actual calculation data
  const carbonData = {
    totalSaved: 2.4, // kg CO2 saved
    equivalentTrees: 3, // equivalent trees planted
    percentReduction: 18, // percentage reduction
    lastTripSavings: 0.8, // kg CO2 saved from last trip
  };

  return (
    <div style={{ position: 'fixed', bottom: '16px', left: '16px', zIndex: 9999 }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          width: '280px',
          padding: '16px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <img
            src={carbonIcon}
            alt="Carbon"
            style={{
              width: '40px',
              height: '40px',
              filter:
                'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)',
            }}
          />
          <span
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: isDarkMode ? '#f9fafb' : '#111827',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Carbon Impact
          </span>
        </div>

        {/* Main Carbon Savings */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#059669',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {carbonData.totalSaved}
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#059669',
                fontFamily: 'Roboto, sans-serif',
                marginLeft: '4px',
              }}
            >
              kg
            </span>
            <div
              style={{
                fontSize: '14px',
                color: isDarkMode ? '#d1d5db' : '#6b7280',
                fontFamily: 'Roboto, sans-serif',
                marginTop: '4px',
              }}
            >
              CO₂ Saved Today
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              background: 'rgba(5, 150, 105, 0.1)',
              borderRadius: '50%',
              border: '2px solid rgba(5, 150, 105, 0.2)',
            }}
          >
            <Leaf style={{ width: '28px', height: '28px', color: '#059669' }} />
          </div>
        </div>

        {/* Carbon Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          {/* Trees Equivalent */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <TreePine style={{ width: '16px', height: '16px', color: '#059669' }} />
            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Trees
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                ≈ {carbonData.equivalentTrees}
              </div>
            </div>
          </div>

          {/* Reduction Percentage */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <TrendingDown style={{ width: '16px', height: '16px', color: '#dc2626' }} />
            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Reduction
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {carbonData.percentReduction}%
              </div>
            </div>
          </div>
        </div>

        {/* Last Trip Impact */}
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(5, 150, 105, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(5, 150, 105, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <Car style={{ width: '16px', height: '16px', color: '#059669' }} />
            <span
              style={{
                fontSize: '12px',
                color: isDarkMode ? '#10b981' : '#047857',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: '500',
              }}
            >
              Last Route Impact
            </span>
          </div>
          <div
            style={{
              fontSize: '14px',
              color: isDarkMode ? '#10b981' : '#047857',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Saved <strong>{carbonData.lastTripSavings} kg CO₂</strong> vs. driving alone
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonPanel;
