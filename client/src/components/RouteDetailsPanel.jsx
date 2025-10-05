import React from 'react';
import { X, Play } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

const RouteDetailsPanel = ({ isDarkMode = false, selectedRoute, routeData, onClose, onStartTracking }) => {
  const { getPanelWidth, getResponsivePosition, isMobile } = useResponsive();

  // If no route is selected or no data, don't render
  if (!selectedRoute || !routeData) {
    return null;
  }

  const route = routeData.routes?.[0];
  if (!route) {
    return null;
  }

  const modeConfig = {
    driving: { icon: '🚗', name: 'Driving', color: '#dc2626' },
    transit: { icon: '🚌', name: 'Transit', color: '#2563eb' },
    bicycling: { icon: '🚴', name: 'Biking', color: '#16a34a' },
    walking: { icon: '🚶', name: 'Walking', color: '#7c3aed' },
  };

  const config = modeConfig[selectedRoute] || { icon: '🗺️', name: selectedRoute, color: '#6b7280' };

  // Calculate position to be right beside the search panel
  const getAdjacentPosition = () => {
    const padding = isMobile ? 8 : 16;
    const searchPanelWidth = getPanelWidth(384); // SearchPanel width
    const gap = 12; // Gap between panels
    
    if (isMobile) {
      // On mobile, stack vertically below search panel
      return {
        top: 'auto',
        bottom: padding,
        left: padding,
        right: 'auto',
      };
    } else {
      // On desktop, position right beside search panel
      return {
        top: padding,
        left: padding + searchPanelWidth + gap,
        right: 'auto',
        bottom: 'auto',
      };
    }
  };

  return (
    <div style={{ position: 'fixed', ...getAdjacentPosition(), zIndex: 9998 }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: `${getPanelWidth(350)}px`,
          maxHeight: '70vh',
          overflowY: 'auto',
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
            <span style={{ fontSize: '18px' }}>{config.icon}</span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: isDarkMode ? '#f9fafb' : '#111827',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {config.name} Route Details
            </span>
          </div>
          <button
            onClick={onClose}
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

        {/* Route Details Content */}
        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: `1px solid ${config.color}`,
            margin: '16px',
            color: isDarkMode ? '#f9fafb' : '#111827',
            fontFamily: 'Roboto, sans-serif',
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {selectedRoute === 'transit' && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                }}
              >
                🚌 Transit Route Details
              </div>
              {route.steps?.map((step, stepIndex) => {
                const isTransit = step.travel_mode === 'TRANSIT';
                const isWalking = step.travel_mode === 'WALKING';

                if (isTransit && step.transit_details) {
                  const td = step.transit_details;
                  if (!td?.transit_line || !td?.departure_stop || !td?.arrival_stop) {
                    return null;
                  }

                  return (
                    <div
                      key={stepIndex}
                      style={{
                        marginBottom: '16px',
                        position: 'relative',
                        paddingLeft: '24px',
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '4px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: td.transit_line?.color || '#2563eb',
                          border: '2px solid white',
                        }}
                      />

                      {/* Departure time and stop */}
                      <div style={{ marginBottom: '8px' }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: isDarkMode ? '#f9fafb' : '#111827',
                            marginBottom: '2px',
                          }}
                        >
                          {td.departure_time || 'N/A'}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: isDarkMode ? '#d1d5db' : '#6b7280',
                          }}
                        >
                          {td.departure_stop?.name || 'Unknown Stop'}
                        </div>
                      </div>

                      {/* Transit line badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          background: td.transit_line?.color || '#2563eb',
                          borderRadius: '12px',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: 'white',
                          }}
                        >
                          {td.transit_line?.vehicle || 'Transit'} {td.transit_line?.name || '?'}
                        </div>
                      </div>

                      {/* Duration and stops info */}
                      <div
                        style={{
                          fontSize: '10px',
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          marginBottom: '8px',
                        }}
                      >
                        {step.duration?.text || 'N/A'}
                        {td.num_stops ? ` (${td.num_stops} stops)` : ''}
                      </div>

                      {/* Arrival time and stop */}
                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: isDarkMode ? '#f9fafb' : '#111827',
                            marginBottom: '2px',
                          }}
                        >
                          {td.arrival_time || 'N/A'}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: isDarkMode ? '#d1d5db' : '#6b7280',
                          }}
                        >
                          {td.arrival_stop?.name || 'Unknown Stop'}
                        </div>
                      </div>

                      {/* Vertical line connecting to next step */}
                      {stepIndex < route.steps.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '3px',
                            top: '12px',
                            bottom: '-16px',
                            width: '2px',
                            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          }}
                        />
                      )}
                    </div>
                  );
                }

                if (isWalking) {
                  return (
                    <div
                      key={stepIndex}
                      style={{
                        marginBottom: '16px',
                        position: 'relative',
                        paddingLeft: '24px',
                      }}
                    >
                      {/* Walking dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '4px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#7c3aed',
                          border: '2px solid white',
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>🚶 Walk</span>
                        <span
                          style={{
                            fontSize: '10px',
                            color: isDarkMode ? '#9ca3af' : '#6b7280',
                          }}
                        >
                          {step.duration?.text || 'N/A'} · {step.distance?.text || 'N/A'}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '10px',
                          color: isDarkMode ? '#d1d5db' : '#6b7280',
                        }}
                      >
                        {step.instructions?.replace(/<[^>]*>/g, '') || 'Continue walking'}
                      </div>

                      {/* Vertical line connecting to next step */}
                      {stepIndex < route.steps.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '3px',
                            top: '12px',
                            bottom: '-16px',
                            width: '2px',
                            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          }}
                        />
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}

          {selectedRoute === 'driving' && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                }}
              >
                🚗 Driving Directions
              </div>
              {route.steps?.map((step, stepIndex) => {
                const instructions = step.instructions?.replace(/<[^>]*>/g, '') || 'Continue';
                const distance = step.distance?.text || '';
                const duration = step.duration?.text || '';

                // Extract turn information from instructions
                const getTurnIcon = (instruction) => {
                  if (instruction.toLowerCase().includes('left')) return '⬅️';
                  if (instruction.toLowerCase().includes('right')) return '➡️';
                  if (instruction.toLowerCase().includes('straight')) return '⬆️';
                  if (instruction.toLowerCase().includes('u-turn')) return '🔄';
                  if (instruction.toLowerCase().includes('merge')) return '↗️';
                  if (instruction.toLowerCase().includes('exit')) return '🛣️';
                  return '🚗';
                };

                const getHighwayInfo = (instruction) => {
                  if (
                    instruction.toLowerCase().includes('hwy') ||
                    instruction.toLowerCase().includes('highway')
                  ) {
                    const match = instruction.match(/Hwy\s+(\d+)|Highway\s+(\d+)/i);
                    return match ? `Highway ${match[1] || match[2]}` : 'Highway';
                  }
                  return null;
                };

                const highwayInfo = getHighwayInfo(instructions);

                return (
                  <div
                    key={stepIndex}
                    style={{
                      marginBottom: '16px',
                      position: 'relative',
                      paddingLeft: '24px',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#dc2626',
                        border: '2px solid white',
                      }}
                    />

                    {/* Turn icon and distance */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{getTurnIcon(instructions)}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {distance} • {duration}
                      </span>
                    </div>

                    {/* Main instruction */}
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: isDarkMode ? '#f9fafb' : '#111827',
                        marginBottom: '2px',
                        lineHeight: '1.3',
                      }}
                    >
                      {instructions}
                    </div>

                    {/* Highway badge */}
                    {highwayInfo && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 6px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          marginTop: '2px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#3b82f6',
                            fontWeight: '500',
                          }}
                        >
                          🛣️ {highwayInfo}
                        </span>
                      </div>
                    )}

                    {/* Vertical line connecting to next step */}
                    {stepIndex < route.steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '3px',
                          top: '12px',
                          bottom: '-16px',
                          width: '2px',
                          background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {selectedRoute === 'walking' && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                }}
              >
                🚶 Walking Directions
              </div>
              {route.steps?.map((step, stepIndex) => {
                const instructions =
                  step.instructions?.replace(/<[^>]*>/g, '') || 'Continue walking';
                const distance = step.distance?.text || '';
                const duration = step.duration?.text || '';

                // Categorize walking segments
                const getWalkingContext = (instruction) => {
                  if (instruction.toLowerCase().includes('cross'))
                    return { icon: '🚦', type: 'Crosswalk' };
                  if (instruction.toLowerCase().includes('sidewalk'))
                    return { icon: '🛣️', type: 'Sidewalk' };
                  if (instruction.toLowerCase().includes('stair'))
                    return { icon: '🪜', type: 'Stairs' };
                  if (
                    instruction.toLowerCase().includes('path') ||
                    instruction.toLowerCase().includes('trail')
                  )
                    return { icon: '🌳', type: 'Path' };
                  return { icon: '🚶', type: 'Walk' };
                };

                const context = getWalkingContext(instructions);

                return (
                  <div
                    key={stepIndex}
                    style={{
                      marginBottom: '16px',
                      position: 'relative',
                      paddingLeft: '24px',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#7c3aed',
                        border: '2px solid white',
                      }}
                    />

                    {/* Context icon and distance */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>{context.icon}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {distance} • {duration}
                      </span>
                      <span
                        style={{
                          fontSize: '9px',
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '1px 4px',
                          borderRadius: '4px',
                        }}
                      >
                        {context.type}
                      </span>
                    </div>

                    {/* Main instruction */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: isDarkMode ? '#d1d5db' : '#6b7280',
                        lineHeight: '1.3',
                      }}
                    >
                      {instructions}
                    </div>

                    {/* Vertical line connecting to next step */}
                    {stepIndex < route.steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '3px',
                          top: '12px',
                          bottom: '-16px',
                          width: '2px',
                          background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {selectedRoute === 'bicycling' && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                }}
              >
                🚴 Biking Directions
              </div>
              {route.steps?.map((step, stepIndex) => {
                const instructions = step.instructions?.replace(/<[^>]*>/g, '') || 'Continue biking';
                const distance = step.distance?.text || '';
                const duration = step.duration?.text || '';

                // Categorize bike segments
                const getBikeContext = (instruction) => {
                  if (
                    instruction.toLowerCase().includes('bike lane') ||
                    instruction.toLowerCase().includes('cycle')
                  )
                    return { icon: '🚴', type: 'Bike Lane', color: '#10b981' };
                  if (
                    instruction.toLowerCase().includes('path') ||
                    instruction.toLowerCase().includes('trail')
                  )
                    return { icon: '🌳', type: 'Bike Path', color: '#059669' };
                  if (
                    instruction.toLowerCase().includes('road') &&
                    !instruction.toLowerCase().includes('bike')
                  )
                    return { icon: '🚗', type: 'Shared Road', color: '#f59e0b' };
                  if (instruction.toLowerCase().includes('sidewalk'))
                    return { icon: '🛣️', type: 'Sidewalk', color: '#6b7280' };
                  return { icon: '🚴', type: 'Bike Route', color: '#16a34a' };
                };

                const context = getBikeContext(instructions);

                return (
                  <div
                    key={stepIndex}
                    style={{
                      marginBottom: '16px',
                      position: 'relative',
                      paddingLeft: '24px',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: context.color,
                        border: '2px solid white',
                      }}
                    />

                    {/* Context icon and distance */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>{context.icon}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {distance} • {duration}
                      </span>
                      <span
                        style={{
                          fontSize: '9px',
                          color: context.color,
                          background: `${context.color}20`,
                          padding: '1px 4px',
                          borderRadius: '4px',
                          border: `1px solid ${context.color}40`,
                        }}
                      >
                        {context.type}
                      </span>
                    </div>

                    {/* Main instruction */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: isDarkMode ? '#d1d5db' : '#6b7280',
                        lineHeight: '1.3',
                      }}
                    >
                      {instructions}
                    </div>

                    {/* Vertical line connecting to next step */}
                    {stepIndex < route.steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '3px',
                          top: '12px',
                          bottom: '-16px',
                          width: '2px',
                          background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Start Trip Tracking Button */}
        {onStartTracking && (
          <div style={{ paddingTop: '8px', paddingBottom: '16px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => onStartTracking(routeData)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.8)',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.8)';
              }}
            >
              <Play
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'white',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                Start Trip Tracking
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetailsPanel;
