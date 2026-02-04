const checkSystemResources = () => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
        status: 'active',
        uptime: `${Math.floor(uptime)}s`,
        memory: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
    };
};

module.exports = { checkSystemResources };