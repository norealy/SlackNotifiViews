const ENV = require('../utils/Env');
const axios = require('axios');
const viewsDesign = require('../views/ViewsDesign');
const tokenBot = ENV.get("TOKEN_BOT")
const getNotis = async (req, res) => {
    try {
        const challenge = req.body.challenge;
        if (challenge) {
            return res.status(200).send(challenge);
        }

        // console.log(req.body)

        let payload = req.body.payload;
        let viewsAdd = Object.assign({}, viewsDesign.addEvent);

        if (typeof payload !== 'undefined') {
            payload = JSON.parse(payload);
        }

        if (!req.body.payload) {
            if (req.body.text.split(" ")[0] === "settings") {
                const data = {
                    "trigger_id": req.body.trigger_id,
                    "view": viewsDesign.addCalendarToChannel
                }
                const options = {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${tokenBot}` },
                    data: data,
                    url: `https://slack.com/api/views.open`
                };
                const result = await axios(options);
                return res.status(202).send(`Thank you call BOT-NOTI ! 
            If you want assistance please enter: /cal --help`);
            } else if (req.body.text.split(" ")[0] === "add-event") {
                viewsAdd.blocks.splice(5, 0, viewsDesign.timeEnd);
                viewsAdd.blocks.splice(5, 0, viewsDesign.timeStart);

                const data = {
                    "trigger_id": req.body.trigger_id,
                    "view": viewsAdd
                }
                const options = {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${tokenBot}` },
                    data: data,
                    url: `https://slack.com/api/views.open`
                };
                const result = await axios(options);

                return res.status(202).send(`Thank you call BOT-NOTI ! 
            If you want assistance please enter: /cal --help`);
            }
            else if (req.body.text.split(" ")[0] === "all") {

                const data = {
                    "channel": "C01LK9QRNE4",
                    "blocks": viewsDesign.listCalendar
                }
                const options = {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${tokenBot}` },
                    data: data,
                    url: `https://slack.com/api/chat.postMessage`
                };
                const result = await axios(options);

                return res.status(202).send(`Thank you call BOT-NOTI !
                        If you want assistance please enter:  /cal --help`);
            }
            else if (req.body.text.split(" ")[0] === "--help") {
                return res.status(202).send(`Thank you use BOT-NOTI ! 
            ----------------------------------------------------
            Settings calendar to Channel : /cal settings
            Add event calendar : /cal add-event
            List calendar  : /cal all
            If you want assistance please enter:  /cal --help`);

            }
        }
        else if (payload.type === 'block_actions') {
            let data,url;
            if (payload.actions[0].action_id === 'allday') {
                viewsAdd.blocks = payload.view.blocks;
                url = `https://slack.com/api/views.update`;
                if (payload.actions[0].selected_options.length > 0) {
                    console.log("all day true")
                    viewsAdd.blocks.splice(5, 2);

                    viewsAdd.blocks.splice(5, 0, viewsDesign.dateEnd);
                }
                else if (payload.actions[0].selected_options.length === 0) {
                    console.log("all day false")
                    viewsAdd.blocks.splice(5, 1);

                    viewsAdd.blocks.splice(5, 0, viewsDesign.timeEnd);
                    viewsAdd.blocks.splice(5, 0, viewsDesign.timeStart);
                }
                data = {
                    "view_id": payload["container"]["view_id"],
                    "view": viewsAdd
                }

            }
            else if (payload.actions[0].action_id === "buttonSubmit") {
                data = {
                    "trigger_id": req.body.trigger_id,
                    "channel": payload.channel.id,
                    "blocks": viewsDesign.listEvent
                }
                url = `https://slack.com/api/chat.postMessage`;
            }
            else if (payload.actions[0].action_id === "buttonDelete") {
                data = {
                    "trigger_id": payload.trigger_id,
                    "view": viewsDesign.deleteEvent
                }
                url = `https://slack.com/api/views.open`;
            }
            else if (payload.actions[0].action_id === "buttonUpdate") {
                data = {
                    "trigger_id": payload.trigger_id,
                    "view": viewsDesign.editEvent
                }
                url = `https://slack.com/api/views.open`;
            }
            else if (payload.actions[0].action_id === 'deleteOK') {
                console.log("ABC")
                console.log(payload)
                url = `https://slack.com/api/views.update`;
                data = {
                    "view_id": payload["container"]["view_id"],
                    "view": payload.view
                }
            }


            const options = {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${tokenBot}` },
                data: data,
                url: url
            };
            const result = await axios(options);
            // console.log(result.data.response_metadata)
            return res.status(202).send(`Thank you call BOT-NOTI !
            If you want assistance please enter:  /cal --help`);
        }
        else if (payload.type === 'view_submission') {
            console.log("view_submission close !")
            const data = {
                "trigger_id": req.trigger_id,
                "view": payload.view
            }
            const options = {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${tokenBot}` },
                data: data,
                url: `https://slack.com/api/views.push`
            };
            const result = await axios(options);

            return res.status(202).send({
                "response_action": "clear"
            });
        }
        else {

            return res.status(202).send(`Please  use syntax BOT-NOTI ! 
            ----------------------------------------------------
            Settings calendar to Channel : /cal settings
            Add event calendar : /cal add-event
            List calendar  : /cal all
            If you want assistance please enter:  /cal --help`);
        }
    } catch (error) {
        // console.log(error)
        return res.status(403).send("Error");
    }
}

module.exports = {
    getNotis
}
