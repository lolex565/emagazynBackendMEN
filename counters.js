const Counter = require('./models/counter.model');

const exist = async (callback) => {
    const countersExist = await Counter.countDocuments({});
    if (countersExist != 0) {
        callback(true);
    } else {
        callback(false);
    };
};

const initialize = async () => {
    const storeCounter = new Counter({
        module: "store",
        count: 0,
    });
    
    storeCounter.save();
    
    const libraryCounter = new Counter({
        module: "library",
        count: 0,
    });
    
    libraryCounter.save();

    const archiveCounter = new Counter({
        module: "archive",
        count: 0,
    });
    
    archiveCounter.save();
    
};


module.exports = {exist:exist, initialize:initialize};
