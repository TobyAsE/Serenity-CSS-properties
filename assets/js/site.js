const googles_css_popularity_url = "https://chromestatus.com/data/csspopularity";
const serenitys_css_properties_url = "https://raw.githubusercontent.com/SerenityOS/serenity/master/Userland/Libraries/LibWeb/CSS/Properties.json";

list_element = document.getElementById("list");
stat_element = document.getElementById("stat");

build_page();

async function get_data() {
    let googles_css_popularity_promise = fetch(googles_css_popularity_url)
        .then(response => response.json());
    let serenitys_css_properties_promise = fetch(serenitys_css_properties_url)
        .then(response => response.json());

    const resolved_data = await Promise.allSettled([googles_css_popularity_promise, serenitys_css_properties_promise]);

    const googles_resolved_data = resolved_data[0].value;
    const serenitys_resolved_data = resolved_data[1].value;

    return [googles_resolved_data, serenitys_resolved_data];
}

async function build_page() {
    const data = await get_data();
    const google_data = data[0];
    const serenity_data_object = data[1];
    let serenity_data = [];

    for (var entry in serenity_data_object) {
        serenity_data.push(entry);
    }

    let correlated_data = google_data.map(element => {
        element.serenity_supports = serenity_data.includes(element.property_name);
        return element;
    });

    correlated_data.forEach(element => {
        list_element.append(generate_list_entry(element));
    });

    number_of_properties_over_five_percent = correlated_data.filter(data => data.day_percentage >= 0.05);
    number_of_supported_properties_over_five_percent = number_of_properties_over_five_percent.filter(data => data.serenity_supports).length;

    stat_element.innerText = number_of_supported_properties_over_five_percent + " / " + number_of_properties_over_five_percent.length + " (" + correlated_data.length + ")";

}

function generate_list_entry(data) {
    entry = document.createElement("li");
    if (data.serenity_supports)
        entry.classList.add("serenity");

    property = document.createElement("span");
    property.textContent = data.property_name;
    property.classList.add("property");
    entry.append(property);

    bar = document.createElement("progress");
    bar.max = 1;
    bar.value = data.day_percentage;
    entry.append(bar);

    bar_value = document.createElement("span");
    bar_value.classList.add("percent_value");
    bar_value.innerText = (data.day_percentage * 100).toFixed(2) + "%";

    entry.append(bar_value);
    return entry;
}
