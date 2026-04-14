# 970x250 Template & Feed Notes

This file documents the template keys that 970x250 can use and how the feed rows should be structured, using the existing ad feed as the reference.

## Template keys

These are the values used for `feed.global_config_template` in the live feed (and for local preview in `applyDevDefaults.js`):

- **Reserves**
    - `reserves` (base reserves template: `_template-reserves.scss`)

- **Attract**
    - `attract-royal-navy-ratings`
    - `attract-royal-navy-submariners`
    - `attract-royal-navy-engineers`
    - `attract-royal-navy-officers`
    - `attract-royal-marines`

- **Convert**
    - `convert-royal-navy-ratings`
    - `convert-royal-navy-submariners`
    - `convert-royal-navy-engineers`
    - `convert-royal-navy-officers`
    - `convert-royal-marines`

## How creatives should be set up in the feed

The 970x250 size follows the same feed patterns as the other sizes in the reference sheet (300x250, 160x600, 300x600, 320x250, 320x50, 728x90). Only the asset paths change to use `970x250_…`.

### Shared columns

- `creative_dimensions` – e.g. `970x250`.
- `reporting_label` – human-readable name, usually `<size>_Royal_Navy_<Attract|Convert>_…`.
- `brand` / `strand` / `product` / `message` – follow the naming in the sheet (e.g. `Ratings / Attract / Personal Benefits / Travel`).
- `global_config_template` – one of the template keys listed above.
- `frameOrder`
    - `1` for single-frame executions (all Convert and Reserves executions in the sheet).
    - `1,2,3,4` for multi-frame Attract executions (Ratings / Submariners / Engineers / Officers / Royal Marines).
- `global_config_frameDwellTime` – `2` in the sheet.
- `global_config_loopCount` – `1` for Attract rows, `2` for the single-frame Reserves and Convert executions.
- `global_bg` – `empty.png` (background is handled in creative).
- `global_image` / `global_logo` – see patterns below; usually `empty.png` unless specifically called out in the feed.
- `global_cta` – often empty; for most executions the CTA is per-frame (see below).

### Reserves executions (template `reserves`)

Reference rows: IDs 23–70 in the sheet (Professional Development / Growth / Travel / Make a Difference / Social; Attract and Convert).

- Single-frame vs extra message frame
    - `frameOrder = 1`.
    - The template still visually supports more than one frame but the feed only uses `f1` and `f2`.
- Brand line (frame 1)
    - `f1_copy1` – always the same brand line:
        - `<bold>ROYAL NAVY RESERVES</bold><BR><medium>NEW MEMBERS WELCOME</medium>`.
    - `f1_image.Url` – `empty.png`.
    - `f1_cta` – empty.
- Message frame (frame 2)
    - `f2_copy1` – the campaign message, e.g.:
        - `IMAGINE A CLUB THAT PAYS YOU TO LEARN NEW SKILLS` (Professional Development).
        - `IMAGINE A CLUB THAT IMPROVES<BR>YOUR CV NOT JUST YOUR PB` (Professional Growth).
        - `IMAGINE A CLUB THAT<BR>PAYS FOR YOU TO TRAVEL` (Personal Travel).
        - etc., following the feed.
    - `f2_image.Url` – `empty.png` (the hero image is supplied via `global_image` for Reserves attract and via `f1_image` for Reserves convert; follow the size-specific rows in the sheet).
    - `f2_cta` – empty (Reserves executions in the sheet do not use a per-frame CTA).
- Optional CSS overrides
    - The `extra_css` column is used for per-size tweaks, e.g. changing `.frame.template-reserves .frame__copy-container { font-size: …; }` as in the feed.

### Attract executions (Ratings / Submariners / Engineers / Officers / Royal Marines)

Reference rows: all `Attract_*` blocks in the sheet, e.g. IDs 71–280.

- Template
    - `global_config_template` – one of:
        - `attract-royal-navy-ratings`
        - `attract-royal-navy-submariners`
        - `attract-royal-navy-engineers`
        - `attract-royal-navy-officers`
        - `attract-royal-marines`.
    - `frameOrder = 1,2,3,4`.
- Frame usage
    - `f1_copy1` – search-style setup line, e.g.:
        - `Jobs that travel` / `Jobs that take me further` / `Jobs with the best crew` / `Jobs for people like me` / `Jobs for life` / `Jobs with no limits` / etc.
    - `f1_image.Url` – usually `empty.png`.
    - `f1_cta` – empty.
    - `f2_copy1`, `f3_copy1`, `f4_copy1` – the bold headline words, with `<BR>` where needed, e.g. `ADVENTURE<BR>SEEKER`, `MOVE<BR>MAKER`, `FUTURE<BR>SHAPER`, `LEVEL<BR>CLIMBER`, etc.
    - `f2_image.Url`, `f3_image.Url`, `f4_image.Url` – size-specific image paths (e.g. `2025/attract/970x250_ratings_attract_travel_image_f2.jpeg`).
    - `f2_cta`, `f3_cta`, `f4_cta` – always `Apply now` in the sheet.

    #### Sticky reference: Attract Engineers – Professional Benefits / Development
    - `reporting_label` – `970x250_Royal_Navy_Attract_Engineers_Professional_Benefits_Development`.
    - `global_config_template` – `attract-royal-marines`.
    - `frameOrder = 1,2,3,4` and `global_config_loopCount = 1` (Attract loop setting).
    - `extra_css` – `.template-attract.global .global__visual-grid {\n    --gridColor: rgba(255, 255, 255, 0.2) !important;\n}` to match the sheet’s grid hue.
    - Frame 1 copy – `Jobs that pay me to skill up` with `f1_image.Url = empty.png` and no CTA.
    - Frame 2 copy – `FUTURE SHAPER` + CTA `Apply now` + image `2025/attract/970x250_engineers_attract_development_image_f2.jpeg`.
    - Frame 3 copy – `EDGE GAINER` + CTA `Apply now` + image `2025/attract/970x250_engineers_attract_development_image_f3.jpeg`.
    - Frame 4 copy – `BECOME A SPECIALIST` + CTA `Apply now` + image `2025/attract/970x250_engineers_attract_development_image_f4.jpeg`.
    - CTA copy is consistent with the rest of the attract rows; no `global_cta` is defined here.
    - Local preview – [src/scripts/environments/applyDevDefaults.js](src/scripts/environments/applyDevDefaults.js) seeds this row, so keep it synchronized with the feed entry above.

### Convert executions (Ratings / Submariners / Engineers / Officers / Royal Marines)

Reference rows: all `Convert_*` blocks in the sheet, e.g. IDs 281–370.

- Template
    - `global_config_template` – one of the `convert-…` keys listed above.
    - `frameOrder = 1` (single-frame executions).
- Frame usage
    - `f1_copy1` – main multi-line convert message with `<BR>`, e.g.:
        - Ratings pay: `KICKSTART<BR>YOUR CAREER<BR>EARN UP TO 60K+`.
        - Royal Marines pay: `ENGAGE YOUR<BR>CAREER<BR>EARN UP TO 64K+`.
        - Engineers pay: `ENGINEER<BR>YOUR CAREER<BR>EARN UP TO 64K+`.
        - Officers pay: `LEAD<BR>YOUR CAREER<BR>EARN £34K+ FROM DAY ONE`.
        - and similar for Savings / Social / Roles variants.
    - `f1_image.Url` – the hero image for the size, e.g. `2025/convert/970x250_ratings_convert_pay_image.jpeg`.
    - `f1_cta` – `Apply now`.
    - `f2_*`, `f3_*`, `f4_*`, `f5_*` – empty in the sheet for all Convert rows.
- Optional CSS overrides
    - Some Submariners / Officers rows use `extra_css` to tweak `.frame__copy-line:nth-child(3)` font-size or `.global__cta` positioning.
