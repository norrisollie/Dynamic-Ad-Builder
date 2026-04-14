// CommonJS version (works unless your package.json has "type": "module")
// this
const path = require("path");
const { Namer } = require("@parcel/plugin");

module.exports = new Namer({
    name({ bundle }) {
        const main = bundle.getMainEntry();
        const file = main
            ? main.filePath
            : `bundle-${bundle.id}.${bundle.type}`;
        const parsed = path.parse(file);

        // Return plain name without hash
        return `${parsed.name}.${bundle.type}`;
    },
});
