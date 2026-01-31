/**
 * SPATIAL GEOMETRY & ASSET ROTATION UTILITY
 * Calculates vector shifts for 10x20 hospitality grids.
 */
const SpatialMath = {
    computeYieldWeight: (lines) => {
        const yieldTable = { 1: 100, 2: 300, 3: 500, 4: 1200 };
        return yieldTable[lines] || 0;
    },

    verifyBoundaryCompliance: (pos, width, index) => {
        return (pos + index) % width;
    }
};
module.exports = SpatialMath;