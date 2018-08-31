module.exports = {
  "extends": "airbnb",
  "settings": {
    "import/resolver": {
      "webpack": {}
    },
    "react": {
      "version": "16.3.0"
    },
  },
  "env": {
    "browser": true,
    "node": true,
  },
  "rules": {
    "arrow-body-style": "off",
    "arrow-parens": "off",
    "class-methods-use-this": "off",
    "comma-dangle": [
      "error",
      {
        "arrays": "only-multiline",
        "objects": "only-multiline",
        "imports": "only-multiline",
        "exports": "only-multiline",
        "functions": "only-multiline"
      }
    ],
    "function-paren-newline": ["error", "consistent"],
    "import/extensions": ["warn", "never"],
    "import/no-extraneous-dependencies": ["error", {
      "peerDependencies": true
    }],
    "import/no-unresolved": ["error", { "ignore": ["react", "react-dom"] } ],
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["to"]
    }],
    "jsx-a11y/href-no-hash": "off", // deprecated rule
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/label-has-for": [ "error", {
      "required": {
        "some": [ "nesting", "id" ]
      },
      "allowChildren": false,
    }],
    "jsx-a11y/no-noninteractive-tabindex": ["error", {
      "tags": [],
      "roles": ["tabpanel", "dialog"],
    }],
    "jsx-a11y/no-autofocus": "off", /* this rule cites https://w3c.github.io/html/sec-forms.html#autofocusing-a-form-control-the-autofocus-attribute
                                      which mainly applies to non-SPA's. SPA's like FOLIO have good reason to manually control focus for
                                      users of Assistive Technology or those who just prefer to navigate using a keyboard alone -
                                      focus transitions serve as a primary indicator of a change in page context as new
                                      trees of components mount/dismount.
                                      */  
    "linebreak-style": "off",
    "max-len": "off",
    "no-console": "warn",
    "no-else-return": "off",
    "no-multi-spaces": ["error", {
      "ignoreEOLComments": true,
    }],
    "no-nested-ternary": "off",
    "no-param-reassign": ["error", {
      "props": false
    }],
    "no-plusplus": "off",
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    "no-underscore-dangle": "off",
    "no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_"
    }],
    "object-curly-newline": ["error", { "consistent": true }],
    "prefer-destructuring": "off",
    "prefer-template": "off",
    "quote-props": ["error", "consistent"],
    "react/forbid-prop-types": ["warn", {
      "forbid": ["any", "array"]
    }],
    "react/jsx-filename-extension": "off",
    "react/jsx-wrap-multilines": "off",
    "react/no-array-index-key": "off",
    "react/prefer-stateless-function": "off",
    "react/require-default-props": "off",
    "react/sort-comp": ["warn", {
      "order": [
        "static-methods",
        "lifecycle",
        "everything-else",
        "render"
      ]
    }],
  },
  overrides: [
    {
      files: ["**/test/**"],
      rules: {
        "no-console": "off",
        // lexically bound "this" prevents access to the Mocha test context.
        // See https://mochajs.org/#arrow-functions
        "prefer-arrow-callback": "off",
      }
    }
  ]
};
