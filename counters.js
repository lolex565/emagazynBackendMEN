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
        
    //const archiveCounter = new Counter({

    //});
    //const libraryCounter = new Counter({

    // });
};
//TODO zrobić countery dla archiwum i biblioteki

module.exports = {exist:exist, initialize:initialize};
