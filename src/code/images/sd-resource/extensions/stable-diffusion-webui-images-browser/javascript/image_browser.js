let image_browser_state = "free"
let image_browser_webui_ready = false
let image_browser_started = false
let image_browser_console_log = ""
let image_browser_debug = false
let image_browser_img_show_in_progress = false

function image_browser_delay(ms){return new Promise(resolve => setTimeout(resolve, ms))}

onUiLoaded(image_browser_start_it_up)

async function image_browser_wait_for_webui() { 
    if (image_browser_debug) console.log("image_browser_wait_for_webui:start")
    await image_browser_delay(500)
    sd_model = gradioApp().getElementById("setting_sd_model_checkpoint")
    if (!sd_model.querySelector(".eta-bar")) {
        image_browser_webui_ready = true
        image_browser_start()
    } else {
        // Set timeout for MutationObserver
        const startTime = Date.now()
        // 40 seconds in milliseconds
        const timeout = 40000
        const webuiObserver = new MutationObserver(function(mutationsList) {
            if (image_browser_debug) console.log("webuiObserver:start")
            let found = false
            outerLoop: for (let i = 0; i < mutationsList.length; i++) {
                let mutation = mutationsList[i];
                if (mutation.type === "childList") {
                    for (let j = 0; j < mutation.removedNodes.length; j++) {
                        let node = mutation.removedNodes[j];
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("eta-bar")) {
                            found = true
                            break outerLoop;
                        }
                    }
                }
            }
            if (found || (Date.now() - startTime > timeout)) {
                image_browser_webui_ready = true
                webuiObserver.disconnect()
                if (image_browser_debug) console.log("webuiObserver:end")
                image_browser_start()
            }
        })
        webuiObserver.observe(gradioApp(), { childList:true, subtree:true })
    }
    if (image_browser_debug) console.log("image_browser_wait_for_webui:end")
}

async function image_browser_start_it_up() {
    if (image_browser_debug) console.log("image_browser_start_it_up:start")
    container = gradioApp().getElementById("image_browser_tabs_container")
    let controls = container.querySelectorAll('[id*="_control_"]')
    controls.forEach(function(control) {
        control.style.pointerEvents = "none"
        control.style.cursor = "not-allowed"
        control.style.opacity = "0.65"
    })
    let warnings = container.querySelectorAll('[id*="_warning_box"]')
    warnings.forEach(function(warning) {
        warning.innerHTML = '<p style="font-weight: bold;">Waiting for webui...'
    })

    image_browser_wait_for_webui()
    if (image_browser_debug) console.log("image_browser_start_it_up:end")
}

async function image_browser_lock(reason) {
    if (image_browser_debug) console.log("image_browser_lock:start")
    // Wait until lock removed
    let i = 0
    while (image_browser_state != "free") {
        await image_browser_delay(200)
        i = i + 1
        if (i === 150) {
            throw new Error("Still locked after 30 seconds. Please Reload UI.")
        }
    }
    // Lock
    image_browser_state = reason
    if (image_browser_debug) console.log("image_browser_lock:end")
}

async function image_browser_unlock() {
    if (image_browser_debug) console.log("image_browser_unlock:start")
    image_browser_state = "free"
    if (image_browser_debug) console.log("image_browser_unlock:end")
}

const image_browser_click_image = async function() {
    if (image_browser_debug) console.log("image_browser_click_image:start")
    await image_browser_lock("image_browser_click_image")
    const tab_base_tag = image_browser_current_tab()
    const container = gradioApp().getElementById(tab_base_tag + "_image_browser_container")
    let child = this
    let index = 0
    while((child = child.previousSibling) != null) {
        index = index + 1
    }
    const set_btn = container.querySelector(".image_browser_set_index")
    let curr_idx
    try {
        curr_idx = set_btn.getAttribute("img_index")
    } catch (e) {
        curr_idx = -1
    }
    if (curr_idx != index) {
        set_btn.setAttribute("img_index", index)
    }
    await image_browser_unlock()
    set_btn.click()
    if (image_browser_debug) console.log("image_browser_click_image:end")
}

async function image_browser_get_current_img(tab_base_tag, img_index, page_index, filenames, turn_page_switch, image_gallery) {
    if (image_browser_debug) console.log("image_browser_get_current_img:start")
    await image_browser_lock("image_browser_get_current_img")
    img_index = gradioApp().getElementById(tab_base_tag + '_image_browser_set_index').getAttribute("img_index")
    await image_browser_unlock()
    if (image_browser_debug) console.log("image_browser_get_current_img:end")
    return [
        tab_base_tag,
        img_index,
        page_index,
		filenames,
        turn_page_switch,
        image_gallery
    ]
}

async function image_browser_refresh_current_page_preview() { 
    if (image_browser_debug) console.log("image_browser_refresh_current_page_preview:start")
    await image_browser_delay(200)
    const preview_div = gradioApp().querySelector('.preview')
    if (preview_div === null) {
        if (image_browser_debug) console.log("image_browser_refresh_current_page_preview:end")
        return
    }
    const tab_base_tag = image_browser_current_tab()
    const gallery = gradioApp().querySelector(`#${tab_base_tag}_image_browser`)
    const set_btn = gallery.querySelector(".image_browser_set_index")
    const curr_idx = parseInt(set_btn.getAttribute("img_index"))
    // no loading animation, so click immediately
    const gallery_items = gallery.querySelectorAll(".thumbnail-item")
    const curr_image = gallery_items[curr_idx]
    curr_image.click()
    if (image_browser_debug) console.log("image_browser_refresh_current_page_preview:end")
}

async function image_browser_turnpage(tab_base_tag) {
    if (image_browser_debug) console.log("image_browser_turnpage:start")
    while (!image_browser_started) {
        await image_browser_delay(200)
    }
    const gallery = gradioApp().querySelector(`#${tab_base_tag}_image_browser`)
    let clear
    try {
        clear = gallery.querySelector("button[aria-label='Clear']")
        if (clear) {
            clear.click()
        }
    } catch (e) {
        console.error(e)
    }
    if (image_browser_debug) console.log("image_browser_turnpage:end")
}

async function image_browser_select_image(tab_base_tag, img_index, select_image) {
    if (image_browser_debug) console.log("image_browser_select_image:start")
    if (select_image) {
        await image_browser_lock("image_browser_select_image")
        const del_img_btn = gradioApp().getElementById(tab_base_tag + "_image_browser_del_img_btn")
        // Prevent delete button spam
        del_img_btn.style.pointerEvents = "none"
        del_img_btn.style.cursor = "not-allowed"
        del_img_btn.style.opacity = "0.65"        

        const gallery = gradioApp().getElementById(tab_base_tag + "_image_browser_gallery")
        const gallery_items = gallery.querySelectorAll(".thumbnail-item")
        if (img_index >= gallery_items.length || gallery_items.length == 0) {
            const refreshBtn = gradioApp().getElementById(tab_base_tag + "_image_browser_renew_page")
            refreshBtn.dispatchEvent(new Event("click"))
        } else {
            const curr_image = gallery_items[img_index]
            curr_image.click()
        }
        await image_browser_unlock()
    }
    if (image_browser_debug) console.log("image_browser_select_image:end")
}

async function image_browser_gototab(tabname) {
    if (image_browser_debug) console.log("image_browser_gototab:start")
    await image_browser_lock("image_browser_gototab")

    tabNav = gradioApp().querySelector(".tab-nav")
    const tabNavChildren = tabNav.children
    let tabNavButtonNum
    if (typeof tabname === "number") {
        let buttonCnt = 0
        for (let i = 0; i < tabNavChildren.length; i++) {
            if (tabNavChildren[i].tagName === "BUTTON") {
                if (buttonCnt === tabname) {
                    tabNavButtonNum = i
                    break
                }
                buttonCnt++
            }
        }
    } else {
        for (let i = 0; i < tabNavChildren.length; i++) {
            if (tabNavChildren[i].tagName === "BUTTON" && tabNavChildren[i].textContent.trim() === tabname) {
                tabNavButtonNum = i
                break
            }
        }
    }
    let tabNavButton = tabNavChildren[tabNavButtonNum]
    tabNavButton.click()

    // Wait for click-action to complete
    const startTime = Date.now()
    // 60 seconds in milliseconds
    const timeout = 60000
    
    await image_browser_delay(100)
    while (!tabNavButton.classList.contains("selected")) {
        tabNavButton = tabNavChildren[tabNavButtonNum]
        if (Date.now() - startTime > timeout) {
            throw new Error("image_browser_gototab: 60 seconds have passed")
        }
        await image_browser_delay(200)
    }

    await image_browser_unlock()
    if (image_browser_debug) console.log("image_browser_gototab:end")
}

async function image_browser_get_image_for_ext(tab_base_tag, image_index) {
    if (image_browser_debug) console.log("image_browser_get_image_for_ext:start")
    const image_browser_image = gradioApp().querySelectorAll(`#${tab_base_tag}_image_browser_gallery .thumbnail-item`)[image_index]

	const canvas = document.createElement("canvas")
	const image = document.createElement("img")
	image.src = image_browser_image.querySelector("img").src

	await image.decode()

	canvas.width = image.width
	canvas.height = image.height

	canvas.getContext("2d").drawImage(image, 0, 0)

    if (image_browser_debug) console.log("image_browser_get_image_for_ext:end")
	return canvas.toDataURL()
}

function image_browser_openoutpaint_send(tab_base_tag, image_index, image_browser_prompt, image_browser_neg_prompt, name = "WebUI Resource") {
    if (image_browser_debug) console.log("image_browser_openoutpaint_send:start")
    image_browser_get_image_for_ext(tab_base_tag, image_index)
		.then((dataURL) => {
			// Send to openOutpaint
			openoutpaint_send_image(dataURL, name)

			// Send prompt to openOutpaint
			const tab = get_uiCurrentTabContent().id

			const prompt = image_browser_prompt
            const negPrompt = image_browser_neg_prompt
            openoutpaint.frame.contentWindow.postMessage({
                key: openoutpaint.key,
                type: "openoutpaint/set-prompt",
                prompt,
                negPrompt,
            })

			// Change Tab
            image_browser_gototab("openOutpaint")
		})
    if (image_browser_debug) console.log("image_browser_openoutpaint_send:end")
}

async function image_browser_controlnet_send(toTabNum, tab_base_tag, image_index, controlnetNum, controlnetType) {
    if (image_browser_debug) console.log("image_browser_controlnet_send:start")
    // Logic originally based on github.com/fkunn1326/openpose-editor
    const dataURL = await image_browser_get_image_for_ext(tab_base_tag, image_index)
    const blob = await (await fetch(dataURL)).blob()
    const dt = new DataTransfer()
    dt.items.add(new File([blob], "ImageBrowser.png", { type: blob.type }))
    const list = dt.files

    await image_browser_gototab(toTabNum)
    const current_tabid = image_browser_webui_current_tab()
    const current_tab = current_tabid.replace("tab_", "")
    const tab_controlnet = gradioApp().getElementById(current_tab + "_controlnet")
    let accordion = tab_controlnet.querySelector("#controlnet > .label-wrap > .icon")
    if (accordion.style.transform.includes("rotate(90deg)")) {
        accordion.click()
        // Wait for click-action to complete
        const startTime = Date.now()
        // 60 seconds in milliseconds
        const timeout = 60000
    
        await image_browser_delay(100)
        while (accordion.style.transform.includes("rotate(90deg)")) {
            accordion = tab_controlnet.querySelector("#controlnet > .label-wrap > .icon")
            if (Date.now() - startTime > timeout) {
                throw new Error("image_browser_controlnet_send/accordion: 60 seconds have passed")
            }
            await image_browser_delay(200)
        }
    }    

    let inputImage
    let inputContainer
    if (controlnetType == "single") {
        inputImage = gradioApp().getElementById(current_tab + "_controlnet_ControlNet_input_image")
    } else {
        const tabs = gradioApp().getElementById(current_tab + "_controlnet_tabs")
        const tab_num = (parseInt(controlnetNum) + 1).toString()
        tab_button = tabs.querySelector(".tab-nav > button:nth-child(" + tab_num + ")")
        tab_button.click()
        // Wait for click-action to complete
        const startTime = Date.now()
        // 60 seconds in milliseconds
        const timeout = 60000
    
        await image_browser_delay(100)
        while (!tab_button.classList.contains("selected")) {
            tab_button = tabs.querySelector(".tab-nav > button:nth-child(" + tab_num + ")")
            if (Date.now() - startTime > timeout) {
                throw new Error("image_browser_controlnet_send/tabs: 60 seconds have passed")
            }
            await image_browser_delay(200)
        }
        inputImage = gradioApp().getElementById(current_tab + "_controlnet_ControlNet-" + controlnetNum.toString() + "_input_image")
    }
    try {
        inputContainer = inputImage.querySelector('div[data-testid="image"]')
    } catch (e) {}

    const input = inputContainer.querySelector("input[type='file']")

    let clear
    try {
        clear = inputContainer.querySelector("button[aria-label='Remove Image']")
        if (clear) {
            clear.click()
        }
    } catch (e) {
        console.error(e)
    }

    try {
        // Wait for click-action to complete
        const startTime = Date.now()
        // 60 seconds in milliseconds
        const timeout = 60000
        while (clear) {
            clear = inputContainer.querySelector("button[aria-label='Remove Image']")
            if (Date.now() - startTime > timeout) {
                throw new Error("image_browser_controlnet_send/clear: 60 seconds have passed")
            }
            await image_browser_delay(200)
        }
    } catch (e) {
        console.error(e)
    }

    input.value = ""
    input.files = list
    const event = new Event("change", { "bubbles": true, "composed": true })
    input.dispatchEvent(event)
    if (image_browser_debug) console.log("image_browser_controlnet_send:end")
}

function image_browser_controlnet_send_txt2img(tab_base_tag, image_index, controlnetNum, controlnetType) {
    image_browser_controlnet_send(0, tab_base_tag, image_index, controlnetNum, controlnetType)
}
  
function image_browser_controlnet_send_img2img(tab_base_tag, image_index, controlnetNum, controlnetType) {
    image_browser_controlnet_send(1, tab_base_tag, image_index, controlnetNum, controlnetType)
}

function image_browser_class_add(tab_base_tag) {
    gradioApp().getElementById(tab_base_tag + '_image_browser').classList.add("image_browser_container")
    gradioApp().getElementById(tab_base_tag + '_image_browser_set_index').classList.add("image_browser_set_index")
    gradioApp().getElementById(tab_base_tag + '_image_browser_del_img_btn').classList.add("image_browser_del_img_btn")
    gradioApp().getElementById(tab_base_tag + '_image_browser_gallery').classList.add("image_browser_gallery")
}

function btnClickHandler(tab_base_tag, btn) {
    if (image_browser_debug) console.log("btnClickHandler:start")
    const tabs_box = gradioApp().getElementById("image_browser_tabs_container")
    if (!tabs_box.classList.contains(tab_base_tag)) {
        gradioApp().getElementById(tab_base_tag + "_image_browser_renew_page").click()
        tabs_box.classList.add(tab_base_tag)
    }
    if (image_browser_debug) console.log("btnClickHandler:end")
}

function image_browser_init() {
    if (image_browser_debug) console.log("image_browser_init:start")
    const tab_base_tags = gradioApp().getElementById("image_browser_tab_base_tags_list")
    if (tab_base_tags) {
        const image_browser_tab_base_tags_list = tab_base_tags.querySelector("textarea").value.split(",")
        image_browser_tab_base_tags_list.forEach(function(tab_base_tag) {
            image_browser_class_add(tab_base_tag)
        })
        
        const tab_btns = gradioApp().getElementById("image_browser_tabs_container").querySelector("div").querySelectorAll("button")
        tab_btns.forEach(function(btn, i) {
            const tab_base_tag = image_browser_tab_base_tags_list[i]
            btn.setAttribute("tab_base_tag", tab_base_tag)
            btn.removeEventListener('click', () => btnClickHandler(tab_base_tag, btn))
            btn.addEventListener('click', () => btnClickHandler(tab_base_tag, btn))
        })
        //preload
        if (gradioApp().getElementById("image_browser_preload").querySelector("input").checked) {
            setTimeout(function(){tab_btns[0].click()}, 100)
       }
    }
    image_browser_keydown()

    const image_browser_swipe = gradioApp().getElementById("image_browser_swipe").getElementsByTagName("input")[0]
    if (image_browser_swipe.checked) {
        image_browser_touch()
    }
    if (image_browser_debug) console.log("image_browser_init:end")
}

async function image_browser_wait_for_gallery_btn(tab_base_tag){ 
    if (image_browser_debug) console.log("image_browser_wait_for_gallery_btn:start")
    await image_browser_delay(100)
    while (!gradioApp().getElementById(image_browser_current_tab() + "_image_browser_gallery").getElementsByClassName("thumbnail-item")) {
        await image_browser_delay(200)
    }
    if (image_browser_debug) console.log("image_browser_wait_for_gallery_btn:end")
}

function image_browser_hijack_console_log() {
    (function () {
        const oldLog = console.log
        console.log = function (message) {
            const formattedTime = new Date().toISOString().slice(0, -5).replace(/[TZ]/g, ' ').trim().replace(/\s+/g, '-').replace(/:/g, '-')
            image_browser_console_log = image_browser_console_log + formattedTime + " " + "image_browser.js: " + message + "\n"
            oldLog.apply(console, arguments)
        }
    })()
    image_browser_debug = true
}

function get_js_logs() {
    log_to_py = image_browser_console_log
    image_browser_console_log = ""
    return log_to_py
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function image_browser_start() {
    if (image_browser_debug) console.log("image_browser_start:start")
    image_browser_init()
    const mutationObserver = new MutationObserver(function(mutationsList) {
        const tab_base_tags = gradioApp().getElementById("image_browser_tab_base_tags_list")
        if (tab_base_tags) {
            const image_browser_tab_base_tags_list = tab_base_tags.querySelector("textarea").value.split(",")
            image_browser_tab_base_tags_list.forEach(function(tab_base_tag) {
                image_browser_class_add(tab_base_tag)
                const tab_gallery_items = gradioApp().querySelectorAll('#' + tab_base_tag + '_image_browser .thumbnail-item')

                const image_browser_img_info_json = gradioApp().getElementById(tab_base_tag + "_image_browser_img_info").querySelector('[data-testid="textbox"]').value
                const image_browser_img_info = JSON.parse(image_browser_img_info_json)
                const filenames = Object.keys(image_browser_img_info)

                tab_gallery_items.forEach(function(gallery_item, i) {
                    gallery_item.removeEventListener('click', image_browser_click_image, true)
                    gallery_item.addEventListener('click', image_browser_click_image, true)

                    const filename = filenames[i]
                    try {
                        let x = image_browser_img_info[filename].x
                        let y = image_browser_img_info[filename].y
                        if (isNumeric(x) && isNumeric(y)) {
                            gallery_item.title = x + "x" + y
                        }
                    } catch (e) {}

                    document.onkeyup = async function(e) {
                        if (!image_browser_active()) {
                            if (image_browser_debug) console.log("image_browser_start:end")
                            return
                        }
                        const current_tab = image_browser_current_tab()
                        image_browser_wait_for_gallery_btn(current_tab).then(() => {
                            let gallery_btn
                            gallery_btn = gradioApp().getElementById(current_tab + "_image_browser_gallery").querySelector(".thumbnail-item .selected")
                            gallery_btn = gallery_btn && gallery_btn.length > 0 ? gallery_btn[0] : null
                            if (gallery_btn) {
                                image_browser_click_image.call(gallery_btn)
                            }
                        })
                    }
                })

                const cls_btn = gradioApp().getElementById(tab_base_tag + '_image_browser_gallery').querySelector("svg")
                if (cls_btn) {
                    cls_btn.removeEventListener('click', () => image_browser_renew_page(tab_base_tag), false)
                    cls_btn.addEventListener('click', () => image_browser_renew_page(tab_base_tag), false)
                }
            })
            const debug_level_option = gradioApp().getElementById("image_browser_debug_level_option").querySelector("textarea").value
            if ((debug_level_option == 'javascript' || debug_level_option == 'capture') && !image_browser_debug) {
                image_browser_hijack_console_log()
            }
        }
    })
    mutationObserver.observe(gradioApp(), { childList:true, subtree:true })
    image_browser_started = true
    image_browser_activate_controls()
    if (image_browser_debug) console.log("image_browser_start:end")
}

async function image_browser_activate_controls() {
    if (image_browser_debug) console.log("image_browser_activate_controls:start")
    await image_browser_delay(500)
    container = gradioApp().getElementById("image_browser_tabs_container")
    let controls = container.querySelectorAll('[id*="_control_"]')
    controls.forEach(function(control) {
        control.style.pointerEvents = "auto"
        control.style.cursor = "default"
        control.style.opacity = "1"
    })
    let warnings = container.querySelectorAll('[id*="_warning_box"]')
    warnings.forEach(function(warning) {
        warning.innerHTML = "<p>&nbsp"
    })
    if (image_browser_debug) console.log("image_browser_activate_controls:end")
}

function image_browser_img_show_progress_update(tab_base_tag) {
    if (image_browser_debug) console.log("image_browser_img_show_progress_update:start")
    image_browser_img_show_in_progress = false
    // Prevent delete button spam
    const del_img_btn = gradioApp().getElementById(tab_base_tag + "_image_browser_del_img_btn")
    del_img_btn.style.pointerEvents = "auto"
    del_img_btn.style.cursor = "default"
    del_img_btn.style.opacity = "1"
    if (image_browser_debug) console.log("image_browser_img_show_progress_update:end")
}

function image_browser_renew_page(tab_base_tag) {
    if (image_browser_debug) console.log("image_browser_renew_page:start")
    gradioApp().getElementById(tab_base_tag + '_image_browser_renew_page').click()
    if (image_browser_debug) console.log("image_browser_renew_page:end")
}

function image_browser_current_tab() {
    if (image_browser_debug) console.log("image_browser_current_tab:start")
    const tabs = gradioApp().getElementById("image_browser_tabs_container").querySelectorAll('[id$="_image_browser_container"]')
    const tab_base_tags = gradioApp().getElementById("image_browser_tab_base_tags_list")
    const image_browser_tab_base_tags_list = tab_base_tags.querySelector("textarea").value.split(",").sort((a, b) => b.length - a.length)
    for (const element of tabs) {
      if (element.style.display === "block") {
        const id = element.id
        const tab_base_tag = image_browser_tab_base_tags_list.find(element => id.startsWith(element)) || null
        if (image_browser_debug) console.log("image_browser_current_tab:end")
        return tab_base_tag
      }
    }
    if (image_browser_debug) console.log("image_browser_current_tab:end")
}

function image_browser_webui_current_tab() {
    if (image_browser_debug) console.log("image_browser_webui_current_tab:start")
    const tabs = gradioApp().querySelectorAll("#tabs > [id^='tab_']")
    let id
    for (const element of tabs) {
      if (element.style.display === "block") {
        id = element.id
        break
      }
    }
    if (image_browser_debug) console.log("image_browser_webui_current_tab:end")
    return id
}

function image_browser_active() {
    if (image_browser_debug) console.log("image_browser_active:start")
    const ext_active = gradioApp().getElementById("tab_image_browser")
    if (image_browser_debug) console.log("image_browser_active:end")
    return ext_active && ext_active.style.display !== "none"
}

async function image_browser_delete_key(tab_base_tag) {
    const deleteBtn = gradioApp().getElementById(tab_base_tag + "_image_browser_del_img_btn")

    // Wait for img_show to end and deleteBtn to be active again
    const startTime = Date.now()
    // 60 seconds in milliseconds
    const timeout = 60000
    
    await image_browser_delay(100)
    while (image_browser_img_show_in_progress || deleteBtn.style.pointerEvents == "none") {
        if (Date.now() - startTime > timeout) {
            throw new Error("image_browser_delete_key: 60 seconds have passed / " + image_browser_img_show_in_progress + " / " + deleteBtn.style.pointerEvents)
        }
        await image_browser_delay(200)
    }

    deleteBtn.dispatchEvent(new Event("click"))
}

function image_browser_keydown() {
    if (image_browser_debug) console.log("image_browser_keydown:start")
    gradioApp().addEventListener("keydown", function(event) {
        // If we are not on the Image Browser Extension, dont listen for keypresses
        if (!image_browser_active()) {
            if (image_browser_debug) console.log("image_browser_keydown:end")
            return
        }

        // If the user is typing in an input field, dont listen for keypresses
        let target
        if (!event.composed) { // We shouldn't get here as the Shadow DOM is always active, but just in case
            target = event.target
        } else {
            target = event.composedPath()[0]
        }
        if (!target || target.nodeName === "INPUT" || target.nodeName === "TEXTAREA") {
            if (image_browser_debug) console.log("image_browser_keydown:end")
            return
        }

        const tab_base_tag = image_browser_current_tab()

        // Listens for keypresses 0-5 and updates the corresponding ranking (0 is the last option, None)
        if (event.code >= "Digit0" && event.code <= "Digit5") {
            const selectedValue = event.code.charAt(event.code.length - 1)
            const radioInputs = gradioApp().getElementById(tab_base_tag + "_control_image_browser_ranking").getElementsByTagName("input")
            for (const input of radioInputs) {
                if (input.value === selectedValue || (selectedValue === '0' && input === radioInputs[radioInputs.length - 1])) {
                    input.checked = true
                    input.dispatchEvent(new Event("change"))
                    break
                }
            }
        }

        const mod_keys = gradioApp().querySelector(`#${tab_base_tag}_image_browser_mod_keys textarea`).value
        let modifiers_pressed = false
        if (mod_keys.indexOf("C") !== -1 && mod_keys.indexOf("S") !== -1) {
            if (event.ctrlKey && event.shiftKey) {
                modifiers_pressed = true
            }
        } else if (mod_keys.indexOf("S") !== -1) {
            if (!event.ctrlKey && event.shiftKey) {
                modifiers_pressed = true
            }
        } else {
            if (event.ctrlKey && !event.shiftKey) {
                modifiers_pressed = true
            }
        }

        let modifiers_none = false
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
            modifiers_none = true
        }

        if (event.code == "KeyF" && modifiers_none) {
            if (tab_base_tag == "image_browser_tab_favorites") {
                if (image_browser_debug) console.log("image_browser_keydown:end")
                return
            }
            const favoriteBtn = gradioApp().getElementById(tab_base_tag + "_image_browser_favorites_btn")
            favoriteBtn.dispatchEvent(new Event("click"))
        }

        if (event.code == "KeyR" && modifiers_none) {
            const refreshBtn = gradioApp().getElementById(tab_base_tag + "_image_browser_renew_page")
            refreshBtn.dispatchEvent(new Event("click"))
        }

        if (event.code == "Delete" && modifiers_none) {
            image_browser_delete_key(tab_base_tag)
        }

        if (event.code == "ArrowLeft" && modifiers_pressed) {
            const prevBtn = gradioApp().getElementById(tab_base_tag + "_control_image_browser_prev_page")
            prevBtn.dispatchEvent(new Event("click"))
        }

        if (event.code == "ArrowLeft" && modifiers_none) {
            image_browser_img_show_in_progress = true
            const tab_base_tag = image_browser_current_tab()
            const set_btn = gradioApp().querySelector(`#${tab_base_tag}_image_browser .image_browser_set_index`)
            const curr_idx = parseInt(set_btn.getAttribute("img_index"))
            set_btn.setAttribute("img_index", curr_idx - 1)
            image_browser_refresh_current_page_preview()
        }
        
        if (event.code == "ArrowRight" && modifiers_pressed) {
            const nextBtn = gradioApp().getElementById(tab_base_tag + "_control_image_browser_next_page")
            nextBtn.dispatchEvent(new Event("click"))
        }

        if (event.code == "ArrowRight" && modifiers_none) {
            image_browser_img_show_in_progress = true
            const tab_base_tag = image_browser_current_tab()
            const set_btn = gradioApp().querySelector(`#${tab_base_tag}_image_browser .image_browser_set_index`)
            const curr_idx = parseInt(set_btn.getAttribute("img_index"))
            set_btn.setAttribute("img_index", curr_idx + 1)
            image_browser_refresh_current_page_preview()
        }
    })
    if (image_browser_debug) console.log("image_browser_keydown:end")
}

function image_browser_touch() {
    if (image_browser_debug) console.log("image_browser_touch:start")
    let touchStartX = 0
    let touchEndX = 0
    gradioApp().addEventListener("touchstart", function(event) {
        if (!image_browser_active()) {
            if (image_browser_debug) console.log("image_browser_touch:end")
            return
        }
        touchStartX = event.touches[0].clientX;
    })
    gradioApp().addEventListener("touchend", function(event) {
        if (!image_browser_active()) {
            if (image_browser_debug) console.log("image_browser_touch:end")
            return
        }
        touchEndX = event.changedTouches[0].clientX
        const touchDiffX = touchStartX - touchEndX
        if (touchDiffX > 50) {
            const tab_base_tag = image_browser_current_tab()
            const set_btn = gradioApp().querySelector(`#${tab_base_tag}_image_browser .image_browser_set_index`)
            const curr_idx = parseInt(set_btn.getAttribute("img_index"))
            if (curr_idx >= 1) {
                set_btn.setAttribute("img_index", curr_idx - 1)
                image_browser_refresh_current_page_preview()
            }
        } else if (touchDiffX < -50) {
            const tab_base_tag = image_browser_current_tab()
            const gallery = gradioApp().querySelector(`#${tab_base_tag}_image_browser`)
            const gallery_items = gallery.querySelectorAll(".thumbnail-item")
            const thumbnails = gallery_items.length / 2
            const set_btn = gradioApp().querySelector(`#${tab_base_tag}_image_browser .image_browser_set_index`)
            const curr_idx = parseInt(set_btn.getAttribute("img_index"))
            if (curr_idx + 1 < thumbnails) {
                set_btn.setAttribute("img_index", curr_idx + 1)
                image_browser_refresh_current_page_preview()
            }
        }
    })
    if (image_browser_debug) console.log("image_browser_touch:end")
}
