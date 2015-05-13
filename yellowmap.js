// Library for yellow map

/* Extracts a yellow map ID from an objektnr_intern
   of an OpenImmo™ real estate */
function get_yellowmap_id(objektnr_intern) {
    items = str.split(".");
    ve = items[0];
    he = items[1];
    return strplz(ve) + "-" + strplz(he)
}


/* Generates a URL for a yellowmap
   customer and a real estate id */
function gen_yellowmap_url(customer, id) {
    base_url = "http://www.yellowmap.de/Partners/"
    tail = "/Map.aspx?MapPartnerIds="
    return base_url + customer + tail + id
}

var yellowmap_customers = {"993301": "BielefelderGW"};

