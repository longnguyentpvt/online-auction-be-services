module.exports = {
  "parser" : "@typescript-eslint/parser",
  "env" : {
    "browser" : true,
    "es6" : true,
    "node" : true
  },
  "extends" : [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "globals" : {
    "Atomics" : false,
    "SharedArrayBuffer" : false,
    "JSX" : false,
    "Record" : false
  },
  "parserOptions" : {
    "ecmaVersion" : 2020,
    "sourceType" : "module"
  },
  "rules" : {
    "quotes" : [
      "error",
      "double"
    ],
    "comma-dangle" : [
      "error",
      "never"
    ],
    "key-spacing" : [
      "error",
      {
        "beforeColon" : true
      }
    ],
    "semi" : "error",
    "@typescript-eslint/no-unused-vars" : ["error"],
    "@typescript-eslint/no-explicit-any" : ["error"],
    "@typescript-eslint/explicit-module-boundary-types" : ["error"],
    "@typescript-eslint/explicit-function-return-type" : ["error"],
    "@typescript-eslint/typedef" : [
      "error",
      {
        "parameter" : false,
        "arrowParameter" : true
      }
    ],
    "no-extra-boolean-cast" : 0,
    "no-trailing-spaces" : 0,
    "object-curly-spacing" : [
      "error",
      "always"
    ],
    "newline-per-chained-call" : [
      "error",
      {
        "ignoreChainWithDepth" : 2
      }
    ],
    "indent" : [
      "error",
      2,
      {
        "SwitchCase" : 1
      }
    ],
    "one-var-declaration-per-line" : [
      "error",
      "initializations"
    ],
    "object-curly-newline" : [
      "error",
      {
        "multiline" : true,
        "minProperties" : 2
      }
    ],
    "object-property-newline" : "error",
    "array-element-newline" : [
      "error",
      "always"
    ],
    "camelcase" : "error",
    "jsx-quotes" : [
      "error",
      "prefer-double"
    ],
    "no-multiple-empty-lines" : "error",
    "no-multi-spaces" : "error",
    "brace-style" : "error",
    "space-before-blocks" : "error",
    "arrow-spacing" : [
      "error",
      {
        "before" : true,
        "after" : true
      }
    ],
    "comma-spacing" : [
      2,
      {
        "before" : false,
        "after" : true
      }
    ],
    "function-paren-newline" : [
      "error",
      "multiline"
    ]
  }
};
