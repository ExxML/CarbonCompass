/**
 * Refactored Carbon Panel Component
 * Following SOLID principles with inline styles matching SearchPanel
 */

import React, { useState } from 'react';
import { Leaf, TrendingDown, Car, TreePine, X } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

const CarbonPanel = ({ isDarkMode = false }) => {
  const { isMobile, getPanelWidth } = useResponsive();
  const [isMinimized, setIsMinimized] = useState(false);

  const carbonData = {
    totalSaved: 2.4,
    equivalentTrees: 3,
    percentReduction: 18,
    lastTripSavings: 0.8,
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? '8px' : '16px',
          left: isMobile ? '8px' : '16px',
          zIndex: 9999,
        }}
      >
        <div
          onClick={() => setIsMinimized(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
            <Leaf style={{ width: '20px', height: '20px', color: '#10b981' }} />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#374151',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {carbonData.totalSaved}kg CO₂
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '8px' : '16px',
        left: isMobile ? '8px' : '16px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: isMobile ? '100%' : `${getPanelWidth(384)}px`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf style={{ width: '20px', height: '20px', color: '#10b981' }} />
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
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              padding: '4px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X
              style={{ width: '16px', height: '16px', color: isDarkMode ? '#d1d5db' : '#6b7280' }}
            />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              justifyContent: 'space-between',
            }}
          >
            {/* Total Saved - Left Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingRight: isMobile ? '0' : '10px',
                borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: isMobile ? '100%' : '85px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  fontFamily: 'Roboto, sans-serif',
                  lineHeight: '1',
                }}
              >
                {carbonData.totalSaved}
                <span style={{ fontSize: '16px', marginLeft: '2px' }}>kg</span>
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  fontFamily: 'Roboto, sans-serif',
                  marginTop: '4px',
                }}
              >
                CO₂ Saved
              </div>
            </div>

            {/* Metrics - Right Section (Horizontal Pills) */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flex: '1',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Reduction */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  minWidth: '0',
                  flex: '1',
                }}
              >
                <TrendingDown
                  style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }}
                />
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f9fafb' : '#111827',
                      fontFamily: 'Roboto, sans-serif',
                      lineHeight: '1.2',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {carbonData.percentReduction}%
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Reduce
                  </span>
                </div>
              </div>

              {/* Trees */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(22, 163, 74, 0.15)',
                  border: '1px solid rgba(22, 163, 74, 0.3)',
                  minWidth: '0',
                  flex: '1',
                }}
              >
                <TreePine
                  style={{ width: '16px', height: '16px', color: '#16a34a', flexShrink: 0 }}
                />
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f9fafb' : '#111827',
                      fontFamily: 'Roboto, sans-serif',
                      lineHeight: '1.2',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {carbonData.equivalentTrees}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Trees
                  </span>
                </div>
              </div>

              {/* Last Trip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  minWidth: '0',
                  flex: '1',
                }}
              >
                <Car style={{ width: '16px', height: '16px', color: '#2563eb', flexShrink: 0 }} />
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f9fafb' : '#111827',
                      fontFamily: 'Roboto, sans-serif',
                      lineHeight: '1.2',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {carbonData.lastTripSavings}kg
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontFamily: 'Roboto, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Trip
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '10px 0 8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />

          {/* Info Text */}
          <div
            style={{
              fontSize: '10px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            By choosing eco-friendly transport, you&apos;re making a difference! 🌱
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonPanel;
