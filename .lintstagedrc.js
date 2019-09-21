module.exports = {
    "*": () => {
        return [
            "npm run format",
            "npm run build:src",
            "git add dist/ src/ test/ *.json",
        ];
    },
};
