const fs = require("fs");   //! import biblioteki do obsługi plików

const getDate = () => {     //!funkcja zwracająca datę jako string w pożądanym formacie
    let d = new Date();
    let curr_date = d.getDate();
    let curr_month = d.getMonth();
    let curr_year = d.getFullYear();
    let curr_hour = d.getHours();
    let curr_minute = d.getMinutes();
    let curr_second = d.getSeconds();
    return String(
        curr_year +
            "y-" +
            curr_month +
            "m-" +
            curr_date +
            "d-" +
            curr_hour +
            "h-" +
            curr_minute +
            "m-" +
            curr_second +
            "s"
    );
};

const saveErrorLog = (moduleName, errorLog) => {
    fs.writeFile(   //!zapis do pliku
        "./errorLogs/" + getDate() + "-" + moduleName + ".log", //!nazwa pliku z datą i godziną błędu
        errorLog,
        function (err) {
            if (err) return console.log(err);
            console.log("saved");
        }
    );
};

module.exports.saveErrorLog = saveErrorLog;
