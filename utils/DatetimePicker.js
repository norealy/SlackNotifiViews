const arrayDateTime = x();

function x() {
    try {
        let arrayDT = [];
        let i = 0;
        while (i < 24) {
            let j = 0
            for (j = 0; j < 46; j++) {
                
                let datetimePicker = {
                    "text": {
                        "type": "plain_text",
                        "text": "",
                        "emoji": true
                    },
                    "value": ""
                }
                let textH = "";
                let textM = "";
                
                if(j < 10){
                    textM = `0${j}`;
                }else{
                    textM = `${j}`;
                }
                if (i < 10) {
                    textH = `0${i}:`+textM + "AM";
                }
                else if (i < 12) {
                    textH = `${i}:`+textM + "AM";
                }
                else {
                    textH = `${i}:`+textM + "PM";
                }
                datetimePicker.text.text = textH;
                datetimePicker.value = `${i}${j}`;
                arrayDT.push(datetimePicker);
                j+=14;
            }
            i++;
        }
        return arrayDT;
    } catch (error) {
        return error;
    }
}

module.exports = {
    arrayDateTime
}