// packages/api/.prettierrc.js
// Configuration Prettier spécifique au package NestJS,
// hérité de la racine, mais ici redéfini pour vos préférences.
module.exports = require('../../prettier.config.js');
module.exports = {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    trailingComma: 'es5',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'always',
    endOfLine: 'lf',
    // ⚙️ Déclaration du plugin pour organiser automatiquement les imports
    plugins: [require('prettier-plugin-organize-imports')],
};
// packages/api/.prettierrc.js
