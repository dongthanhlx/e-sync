let xfbml_parsed = false;

async function delay(ms = 1000) {
    return new Promise(resolve => {setTimeout(resolve, ms)});
}

export async function show_customer_chat(should_show_dialog = false) {
    let mission_completed = false;
    for (let i = 0; i < 100 && !mission_completed; i += 1) {
        console.log('Retry show plugin: ', i);
        if (window.FB && window.FB.CustomerChat) {
            if (!xfbml_parsed) {
                window.FB.XFBML.parse();
                xfbml_parsed = true;
                if (should_show_dialog) {
                    window.FB.CustomerChat.showDialog();
                }
            } else {
                window.FB.CustomerChat.show(should_show_dialog);
            }
            mission_completed = true;
        } else {
            await delay(100);
        }
    }
    return;
}

export async function hide_customer_chat() {
    let mission_completed = false;
    for (let i = 0; i < 100 && !mission_completed; i += 1) {
        if (window.FB && window.FB.CustomerChat) {
            window.FB.CustomerChat.hide();
            mission_completed = true;
        } else {
            await delay(100);
        }
    }
    return;
}
