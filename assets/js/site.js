const googles_css_popularity_url = "https://chromestatus.com/data/csspopularity";
const serenitys_css_properties_url = "https://raw.githubusercontent.com/SerenityOS/serenity/master/Userland/Libraries/LibWeb/CSS/Properties.json";
const w3c_css_properties_url = "assets/all-properties.en.json";

list_element = document.getElementById("list");
stat_element = document.getElementById("stat");
loading_element = document.getElementById("loading-message");

build_page();

async function get_data() {
    let googles_css_popularity_promise = fetch(googles_css_popularity_url)
        .then(response => response.json());
    let serenitys_css_properties_promise = fetch(serenitys_css_properties_url)
        .then(response => response.json());
    let w3c_css_properties_promise = fetch(w3c_css_properties_url)
        .then(response => response.json());

    const resolved_data = await Promise.allSettled([googles_css_popularity_promise, serenitys_css_properties_promise, w3c_css_properties_promise]);

    const googles_resolved_data = resolved_data[0].value;
    const serenitys_resolved_data = resolved_data[1].value;
    const w3c_resolved_data = resolved_data[2].value;

    return [googles_resolved_data, serenitys_resolved_data, w3c_resolved_data];
}

async function build_page() {
    const data = await get_data();
    const google_data = data[0];
    const serenity_data_object = data[1];
    const w3c_data_object = data[2];
    let spec_data = new Map();

    for (var i = 0; i < w3c_data_object.length; i++) {
        const entry = w3c_data_object[i];
        const property_name = entry.property;
        if (!spec_data.has(property_name)) {
            spec_data.set(property_name, [entry]);
        } else {
            spec_data.get(property_name).push(entry);
        }
    }

    let serenity_data = [];
    for (var entry in serenity_data_object) {
        serenity_data.push(entry);
    }

    let correlated_data = google_data.filter(element =>
        !element.property_name.startsWith("webkit-") && !element.property_name.startsWith("alias-")
    ).map(element => {
        element.serenity_supports = serenity_data.includes(element.property_name);
        if (spec_data.has(element.property_name))
            element.specs = spec_data.get(element.property_name);
        return element;
    });

    correlated_data.forEach(element => {
        list_element.append(generate_list_entry(element));
    });

    number_of_properties_over_five_percent = correlated_data.filter(data => data.day_percentage >= 0.05);
    number_of_supported_properties_over_five_percent = number_of_properties_over_five_percent.filter(data => data.serenity_supports).length;

    stat_element.innerText = number_of_supported_properties_over_five_percent + " / " + number_of_properties_over_five_percent.length + " (" + correlated_data.length + ")";

    loading_element.classList.add("hidden");
}

function generate_list_entry(data) {
    let entry = document.createElement("li");
    if (data.serenity_supports)
        entry.classList.add("serenity");

    let property = document.createElement("span");
    property.textContent = data.property_name;
    property.classList.add("property");
    entry.append(property);

    let bar_value = document.createElement("span");
    bar_value.classList.add("percent_value");
    bar_value.innerText = (data.day_percentage * 100).toFixed(2) + "%";
    entry.append(bar_value);

    if (data.hasOwnProperty("specs")) {
        let spec_links = document.createElement("ol");
        spec_links.classList.add("spec-links");
        for (var i = 0; i < data.specs.length; i++) {
            const spec = data.specs[i];
            let link = document.createElement("a");
            link.href = spec.url;
            link.innerText = spec.status;
            link.title = spec.title;
            link.target = "_blank";

            let li = document.createElement("li");
            li.classList.add("spec-" + spec.status);
            li.append(link);
            spec_links.append(li);
        }
        entry.append(spec_links);
    }

    return entry;
}
