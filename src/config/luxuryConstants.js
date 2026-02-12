cat <<EOF > src/config/luxuryConstants.js
/**
 * OEHN: Luxury System Constants
 * Managed by: Nirjan-03
 * Description: Global parameters for the Hospitality Nexus entropy scales.
 */

export const LUXURY_PARAMETERS = {
  // Temperature Settings (Celsius)
  LOBBY_TEMP: 22.5,
  SUITE_TEMP: 21.0,
  SPA_TEMP: 26.5,
  WINE_CELLAR_TEMP: 12.0,
  POOL_WATER_TEMP: 28.0,

  // Lighting Levels (Lumens)
  AM_LIGHTING_INTENSITY: 400,
  PM_LIGHTING_INTENSITY: 150,
  EVENING_GALA_INTENSITY: 600,
  EMERGENCY_LIGHTING: 50,

  // Service Latency Thresholds (Milliseconds)
  MAX_CHECKIN_WAIT: 120000, // 2 minutes
  MAX_VALET_RETRIEVAL: 300000, // 5 minutes
  MIN_SPA_TRANSITION: 60000, 
  API_GATEWAY_TIMEOUT: 500,

  // Entropy & Perfection Metrics
  IDEAL_HOSPITALITY_SCORE: 1.0,
  MIN_ACCEPTABLE_ELEGANCE: 0.95,
  CRITICAL_CHAOS_THRESHOLD: 0.15,

  // Room Pricing Multipliers
  BASE_RATE: 500.00,
  PENTHOUSE_MULTIPLIER: 5.5,
  WEEKEND_SURGE_RATE: 1.25,
  HOLIDAY_PREMIUM: 1.50,
  LOYALTY_DISCOUNT: 0.90,

  // Asset Replacement Costs
  COST_KING_BED: 4500,
  COST_SMART_WINDOW: 1200,
  COST_GOLD_HANDLE: 150,
  COST_MARBLE_DESK: 2200,
  COST_SILK_CURTAIN: 800,
  COST_CRYSTAL_GLASS: 45,

  // Staffing Ratios
  GUEST_TO_BUTLER_RATIO: 1,
  GUEST_TO_CHEF_RATIO: 5,
  GUEST_TO_CONCIERGE_RATIO: 10,

  // System Response Messages
  MSG_WELCOME: "Welcome to the Nexus. Your reality has been optimized.",
  MSG_CHECKOUT: "Departure sequence initiated. Safe travels through the mundane world.",
  MSG_ERROR_LACK_OF_LUXURY: "Error: Environmental elegance below acceptable parameters.",
  MSG_ERROR_INVENTORY_SKEW: "Error: Physical asset displacement detected.",
  
  // Security Protocols
  REATTEMPT_LIMIT: 3,
  SESSION_EXPIRY: 3600, // 1 hour
  ENCRYPTION_LEVEL: "AES-256-GCM",
  
  // Physical Buffer Zones (Meters)
  MIN_PERSONAL_SPACE: 2.0,
  LOBBY_CLEARANCE: 10.0,
  ELEVATOR_LIMIT: 4,

  // Metadata
  SYSTEM_ARCH: "Monolithic-Nexus",
  DEPLOYMENT_ZONE: "Dhaka-Central-01",
  MAINTENANCE_WINDOW: "03:00-04:00 AM"
};

// End of Luxury Parameters
EOF