// instead of duplicating all the default values in each environment's dynamic data handler, centralise them here as they are the same in all environments
/* * This function applies default dynamic feed values to the provided feed object.
 * @param {Object} feed - The dynamic feed object to populate with default values.
 */
export const applyDevDefaults = (feed) => {
    // basic meta / identifiers
    feed._id = 0;
    feed.preview = "";
    feed.id = 121;
    feed.uid = 121;
    feed.reporting_label =
        "300x600_Royal_Navy_Attract_Engineers_Professional_Benefits_Development";
    feed.default = true;
    feed.active = true;
    feed.hero = true;

    // date range
    feed.start_date = {};
    feed.start_date.RawValue = "01/01/2018";
    feed.start_date.UtcValue = 1514793600000;
    feed.end_date = {};
    feed.end_date.RawValue = "12/31/2030";
    feed.end_date.UtcValue = 1924934400000;

    // exit url (keep your original click-through)
    feed.exit_url = {};
    feed.exit_url.Url = "https://www.royalnavy.mod.uk";

    // misc Studio targeting fields
    feed.custom_value = "";
    feed.line_item = "";
    feed.placement_id = 0;
    feed.placement = 0;
    feed.placement_match = "";
    feed.audience_id = "";
    feed.audience_strategy = "";
    feed.targeting_strategy = "";
    feed.geo_location = "";
    feed.weather_trigger = "";

    // brand info
    feed.brand = "Royal Navy";
    feed.strand = "Engineers";
    feed.product = "Careers";
    feed.message = "Travel";
    feed.extra_css =
        ".template-attract.global .global__visual-grid {\n    --gridColor: rgba(255, 255, 255, 0.2) !important;\n}";

    // template / playback config (keep your dwell + loop values)

    // Templates:
    // attract-royal-navy-submariners
    // attract-royal-navy-engineers
    // attract-royal-navy-officers
    // attract-royal-navy-ratings
    // attract-royal-marines
    // convert-royal-marines
    feed.global_config_template = "attract-royal-marines";
    feed.frameOrder = "1,2,3,4";
    feed.global_config_frameDwellTime = 2;
    feed.global_config_loopCount = 1;

    // global visuals (use your local / placeholder assets where appropriate)
    feed.global_bg = {};
    feed.global_bg.Type = "file";
    feed.global_bg.Url = "empty.png";

    feed.global_image = {};
    feed.global_image.Type = "file";
    feed.global_image.Url = "empty.png";

    feed.global_cta = "";

    // Frame 1
    feed.f1_copy1 = "Jobs that pay me to skill up";
    feed.f1_cta = "";
    feed.f1_image = {};
    feed.f1_image.Type = "file";
    feed.f1_image.Url = "empty.png";

    // Frame 2
    feed.f2_copy1 = "FUTURE SHAPER";
    feed.f2_cta = "Apply now";
    feed.f2_image = {};
    feed.f2_image.Type = "file";
    feed.f2_image.Url = "./assets/images/placeholder_f2.png";

    // Frame 3
    feed.f3_copy1 = "EDGE GAINER";
    feed.f3_cta = "Apply now";
    feed.f3_image = {};
    feed.f3_image.Type = "file";
    feed.f3_image.Url = "./assets/images/placeholder_f3.png";

    // Frame 4
    feed.f4_copy1 = "BECOME A SPECIALIST";
    feed.f4_cta = "Apply now";
    feed.f4_image = {};
    feed.f4_image.Type = "file";
    feed.f4_image.Url = "./assets/images/placeholder_f4.png";

    // Frame 5
    feed.f5_copy1 = "";
    feed.f5_cta = "";
    feed.f5_image = {};
    feed.f5_image.Type = "file";
    feed.f5_image.Url = "empty.png";
};
