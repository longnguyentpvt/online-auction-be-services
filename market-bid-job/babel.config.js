module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { node: "current" } }
    ],
    [
      "@babel/preset-typescript",
      { allowDeclareFields: true }
    ]
  ],
  plugins: [
    [
      "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          "apis": "./src/apis",
          "config": "./src/config",
          "controllers": "./src/controllers",
          "data": "./src/data",
          "db": "./src/db",
          "services": "./src/services",
          "types": "./src/types",
          "utils": "./src/utils"
        }
      }
    ]
  ]
};
