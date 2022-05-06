const airbnbRules = {
  'no-useless-return': 'off',
  'no-unsafe-finally': 'off',
  'no-fallthrough': 'off',
  'import/prefer-default-export': 'off',
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-void': 'off',
  'comma-dangle': 'off',
  'import/no-extraneous-dependencies': 'off',
  'import/extensions': 'off',
};

const reactRules = {
  'react/jsx-props-no-spreading': [
    'error',
    {
      html: 'ignore',
      custom: 'ignore',
      explicitSpread: 'ignore',
      exceptions: [''],
    },
  ],
  'react/destructuring-assignment': 'off',
  'react/no-unused-prop-types': 'off',
  'react/prop-types': 'off',
  'react/jsx-uses-react': 'off', // only if using React version 17+
  'react/react-in-jsx-scope': 'off', // only if using React version 17+
  'react-hooks/rules-of-hooks': 'error', // if using hooks
  'react-hooks/exhaustive-deps': 'warn', // if using hooks
  'react/require-default-props': 'off',
  'react/default-props-match-prop-types': 'off',
  'react/jsx-no-bind': 'off',
};

const typescriptRules = {
  '@typescript-eslint/ban-ts-comment':
    process.env.NODE_ENV === 'production' ? 'warn' : 'off',
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    // project: joinPath(process.cwd(), 'tsconfig.json'),
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    ...airbnbRules,
    ...reactRules,
    ...typescriptRules,
  },
};
