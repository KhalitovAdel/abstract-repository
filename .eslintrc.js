module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        es6: true,
    },
    ignorePatterns: ['./dist', './node_modules'],
    parserOptions: {
        ecmaVersion: 8,
    },
    plugins: [
        '@typescript-eslint',
        'simple-import-sort',
        'unused-imports',
        'prettier',
    ],
    extends: ['prettier'],
    rules: {
        'unused-imports/no-unused-imports': 2,
        'prettier/prettier': 'error',
        'lines-between-class-members': [
            2,
            'always',
            { exceptAfterSingleLine: true },
        ],
        'padding-line-between-statements': [
            2,
            { blankLine: 'always', prev: 'function', next: '*' },
            { blankLine: 'always', prev: '*', next: 'function' },
            { blankLine: 'always', prev: 'export', next: '*' },
            { blankLine: 'always', prev: '*', next: 'export' },
            { blankLine: 'always', prev: 'multiline-const', next: '*' },
            { blankLine: 'always', prev: '*', next: 'return' },
        ],
        'simple-import-sort/imports': 'error',
        'import/prefer-default-export': 0,
    },
};
